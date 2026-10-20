#!/usr/bin/env node
// Audit SEO technique d'un site, sans dépendance (Node 22 ou plus, fetch natif).
//
// Usage :
//   node scripts/seo/audit-local.mjs http://localhost:3101 [--json out.json] [options]
//
// Options :
//   --json <fichier>        écrit toutes les données collectées dans un fichier JSON
//   --extra <chemins>       URLs supplémentaires à tester, séparées par des virgules (option répétable)
//   --no-default-extra      ne teste pas la liste par défaut (anciennes URLs, futures pages solutions)
//   --site <origine>        domaine de production (défaut : origine déclarée dans robots.txt ou le sitemap)
//   --ua <googlebot|chrome|chaîne>  user-agent du crawl (défaut : googlebot = Googlebot smartphone)
//   --no-compare            pas de second passage avec l'autre user-agent
//   --max-pages <n>         nombre maximal d'URLs testées (défaut : 300)
//   --strict                code de sortie 1 si au moins une alerte de gravité « Erreur » est levée
//
// Fonctionnement :
// - le crawl part de l'accueil, des URLs du sitemap (et des sitemaps déclarés dans robots.txt)
//   et des URLs supplémentaires, puis suit les liens internes des pages HTML en 200 ;
// - fetch ne suit jamais les redirections (redirect: "manual") : chaque saut est enregistré ;
// - les URLs absolues du domaine de production (et de sa variante www) sont ramenées sur
//   l'origine auditée, ce qui permet d'auditer un build local avant sa mise en ligne ;
// - seul le HTML initial est analysé (aucun JavaScript n'est exécuté) ;
// - un chemin contenant « inexistant » sert de test : un 404 y est attendu ;
// - le rapport Markdown est écrit sur stdout. Les tirets demi-cadratins et cadratins trouvés
//   dans les pages y sont affichés [U+2013] et [U+2014] pour rester visibles.

import { writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";

const UA_PRESETS = {
  googlebot:
    "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  chrome:
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
};

const DEFAULT_EXTRA = [
  "/pages/services",
  "/collections/frontpage",
  "/products/snom-d150",
  "/pages/partenaires",
  "/solutions/telephonie-ip",
  "/solutions/operateur-telecom",
  "/solutions/reseaux-wifi",
  "/solutions/materiel-informatique",
  "/solutions/cybersecurite",
  "/solutions/alarme-videosurveillance",
  "/solutions/inexistant",
];

const DEFAULT_SITE = "https://lea-numerique.fr";

// Tournures à éviter (règles de rédaction du projet)
const PHRASES = [
  "dans un monde de plus en plus connecté",
  "à l'ère du numérique",
  "de nos jours",
  "véritable",
  "incontournable",
  "booster",
  "révolutionner",
  "au cœur de",
  "au coeur de",
  "n'hésitez pas",
  "que vous soyez",
  "en somme",
  "grâce à notre expertise",
];

const ORG_TYPES = new Set([
  "Organization",
  "Corporation",
  "LocalBusiness",
  "ProfessionalService",
  "ComputerStore",
  "ElectronicsStore",
  "Store",
  "HomeAndConstructionBusiness",
  "Electrician",
  "OnlineBusiness",
]);
const LOCAL_TYPES = new Set([...ORG_TYPES].filter((t) => !["Organization", "Corporation", "OnlineBusiness"].includes(t)));

// ---------------------------------------------------------------------------
// Utilitaires

function die(msg, code = 2) {
  process.stderr.write(`Erreur : ${msg}\n`);
  process.exit(code);
}

function printHelp() {
  process.stdout.write(
    [
      "Usage : node scripts/seo/audit-local.mjs <origine> [--json out.json] [options]",
      "",
      "  --json <fichier>        export JSON complet",
      "  --extra <chemins>       URLs supplémentaires (séparées par des virgules, option répétable)",
      "  --no-default-extra      ignore la liste d'URLs supplémentaires par défaut",
      "  --site <origine>        domaine de production (défaut : déduit de robots.txt ou du sitemap)",
      "  --ua <googlebot|chrome|chaîne>  user-agent du crawl (défaut : googlebot)",
      "  --no-compare            pas de comparaison avec un second user-agent",
      "  --max-pages <n>         plafond d'URLs testées (défaut : 300)",
      "  --strict                code de sortie 1 en cas d'erreur détectée",
      "",
    ].join("\n"),
  );
}

function parseArgs(argv) {
  const opts = { base: null, json: null, extra: [], defaultExtra: true, site: null, ua: "googlebot", compare: true, maxPages: 300, strict: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      const v = argv[++i];
      if (v === undefined) die(`valeur manquante pour ${a}`);
      return v;
    };
    if (a === "--json") opts.json = next();
    else if (a === "--extra") opts.extra.push(...next().split(",").map((s) => s.trim()).filter(Boolean));
    else if (a === "--no-default-extra") opts.defaultExtra = false;
    else if (a === "--site") opts.site = next();
    else if (a === "--ua") opts.ua = next();
    else if (a === "--no-compare") opts.compare = false;
    else if (a === "--max-pages") opts.maxPages = Number(next()) || 300;
    else if (a === "--strict") opts.strict = true;
    else if (a === "--help" || a === "-h") {
      printHelp();
      process.exit(0);
    } else if (a.startsWith("--")) die(`option inconnue : ${a}`);
    else if (!opts.base) opts.base = a;
    else die(`argument en trop : ${a}`);
  }
  if (!opts.base) {
    printHelp();
    process.exit(2);
  }
  return opts;
}

const NAMED_ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0", laquo: "«", raquo: "»",
  eacute: "é", egrave: "è", ecirc: "ê", agrave: "à", acirc: "â", ccedil: "ç", ocirc: "ô",
  ucirc: "û", icirc: "î", iuml: "ï", euml: "ë", ugrave: "ù", oelig: "œ", Eacute: "É",
  rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", hellip: "…", ndash: "\u2013", mdash: "\u2014",
  copy: "©", reg: "®", trade: "™", euro: "€", middot: "·", bull: "•", times: "×",
};

function decodeEntities(s) {
  if (!s || s.indexOf("&") === -1) return s;
  return s.replace(/&(#[xX][0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g, (m, e) => {
    if (e[0] === "#") {
      const cp = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(cp) && cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : m;
    }
    return NAMED_ENTITIES[e] ?? NAMED_ENTITIES[e.toLowerCase()] ?? m;
  });
}

function clean(s) {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .replace(/ ([,.)\]])/g, "$1")
    .replace(/([([]) /g, "$1")
    .trim();
}

function words(s) {
  return String(s ?? "")
    .split(/\s+/)
    .filter((t) => /[\p{L}\p{N}]/u.test(t));
}

function ko(n) {
  return `${(n / 1024).toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ko`;
}

function snippet(text, index, len, radius = 35) {
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + len + radius);
  return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
}

function uniq(arr) {
  return [...new Set(arr)];
}

// ---------------------------------------------------------------------------
// Analyse HTML minimale (suffisante pour le HTML bien formé produit par React)

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const RAWTEXT = new Set(["script", "style", "xmp", "iframe", "noembed", "noframes"]);
const RCDATA = new Set(["title", "textarea"]);
const SKIP_TEXT = new Set(["script", "style", "noscript", "template", "svg"]);

function parseHTML(html) {
  const lower = html.toLowerCase();
  const root = { type: 1, tag: "#document", attrs: {}, children: [], parent: null };
  let cur = root;
  const n = html.length;
  let i = 0;
  const pushText = (s) => {
    if (s) cur.children.push({ type: 3, text: decodeEntities(s), parent: cur });
  };
  while (i < n) {
    const lt = html.indexOf("<", i);
    if (lt === -1) {
      pushText(html.slice(i));
      break;
    }
    if (lt > i) pushText(html.slice(i, lt));
    if (html.startsWith("<!--", lt)) {
      const end = html.indexOf("-->", lt + 4);
      i = end === -1 ? n : end + 3;
      continue;
    }
    const c1 = html[lt + 1];
    if (c1 === "!" || c1 === "?") {
      const end = html.indexOf(">", lt);
      i = end === -1 ? n : end + 1;
      continue;
    }
    if (c1 === "/") {
      const end = html.indexOf(">", lt);
      const name = lower.slice(lt + 2, end === -1 ? n : end).trim();
      let node = cur;
      while (node !== root && node.tag !== name) node = node.parent;
      if (node !== root) cur = node.parent;
      i = end === -1 ? n : end + 1;
      continue;
    }
    const m = /^[a-zA-Z][a-zA-Z0-9:._-]*/.exec(html.slice(lt + 1, lt + 80));
    if (!m) {
      pushText("<");
      i = lt + 1;
      continue;
    }
    const name = m[0].toLowerCase();
    let j = lt + 1 + m[0].length;
    const attrs = {};
    let selfClose = false;
    while (j < n) {
      while (j < n && /\s/.test(html[j])) j++;
      if (j >= n) break;
      if (html[j] === ">") {
        j++;
        break;
      }
      if (html[j] === "/") {
        if (html[j + 1] === ">") {
          selfClose = true;
          j += 2;
          break;
        }
        j++;
        continue;
      }
      let k = j;
      while (k < n && !/[\s=>]/.test(html[k]) && !(html[k] === "/" && html[k + 1] === ">")) k++;
      const an = lower.slice(j, k);
      j = k;
      while (j < n && /\s/.test(html[j])) j++;
      let av = "";
      if (html[j] === "=") {
        j++;
        while (j < n && /\s/.test(html[j])) j++;
        const q = html[j];
        if (q === '"' || q === "'") {
          const e = html.indexOf(q, j + 1);
          av = html.slice(j + 1, e === -1 ? n : e);
          j = e === -1 ? n : e + 1;
        } else {
          let e = j;
          while (e < n && !/[\s>]/.test(html[e])) e++;
          av = html.slice(j, e);
          j = e;
        }
      }
      if (an && !(an in attrs)) attrs[an] = decodeEntities(av);
    }
    const el = { type: 1, tag: name, attrs, children: [], parent: cur };
    cur.children.push(el);
    if (!selfClose && (RAWTEXT.has(name) || RCDATA.has(name))) {
      const close = lower.indexOf(`</${name}`, j);
      const content = html.slice(j, close === -1 ? n : close);
      if (content) el.children.push({ type: 3, text: RCDATA.has(name) ? decodeEntities(content) : content, parent: el });
      const end = close === -1 ? -1 : html.indexOf(">", close);
      i = end === -1 ? n : end + 1;
      continue;
    }
    if (!VOID.has(name) && !selfClose) cur = el;
    i = j;
  }
  return root;
}

function* walk(node) {
  for (const c of node.children || []) {
    yield c;
    if (c.type === 1) yield* walk(c);
  }
}

function findAll(root, pred) {
  const out = [];
  for (const nd of walk(root)) if (nd.type === 1 && pred(nd)) out.push(nd);
  return out;
}

function findFirst(root, pred) {
  for (const nd of walk(root)) if (nd.type === 1 && pred(nd)) return nd;
  return null;
}

function hasAncestor(nd, tag) {
  for (let p = nd.parent; p; p = p.parent) if (p.tag === tag) return true;
  return false;
}

// Texte visible : un séparateur est inséré à chaque frontière d'élément (rendu proche de
// innerText pour des blocs) ; raw = true reproduit textContent (aucun séparateur).
function textOf(node, raw = false) {
  let out = "";
  const sep = raw ? "" : " ";
  const rec = (nd) => {
    for (const c of nd.children) {
      if (c.type === 3) out += c.text;
      else if (!SKIP_TEXT.has(c.tag) && !("hidden" in c.attrs)) {
        if (c.tag === "br") {
          out += sep;
          continue;
        }
        out += sep;
        rec(c);
        out += sep;
      }
    }
  };
  rec(node);
  return out;
}

function zoneOf(nd) {
  const tags = [];
  for (let p = nd.parent; p; p = p.parent) tags.push(p.tag);
  if (tags.includes("main")) return "contenu";
  if (tags.includes("header")) return "header";
  if (tags.includes("footer")) return "footer";
  if (tags.includes("nav")) return "nav";
  return "autre";
}

function relHas(nd, value) {
  return String(nd.attrs.rel || "").toLowerCase().split(/\s+/).includes(value);
}

function imgSrc(img) {
  const src = img.attrs.src || img.attrs["data-src"] || "";
  if (src.includes("/_next/image")) {
    try {
      return new URL(src, "http://x").searchParams.get("url") || src;
    } catch {
      return src;
    }
  }
  return src;
}

// ---------------------------------------------------------------------------
// JSON-LD

function ldTypes(o) {
  return [].concat(o?.["@type"] ?? []).map((t) => String(t).replace(/^https?:\/\/schema\.org\//, ""));
}

function ldRoots(data) {
  const roots = [];
  const push = (o) => {
    if (Array.isArray(o)) o.forEach(push);
    else if (o && typeof o === "object") {
      if (Array.isArray(o["@graph"])) o["@graph"].forEach(push);
      else roots.push(o);
    }
  };
  push(data);
  return roots;
}

function ldWalk(o, fn, path = "") {
  if (Array.isArray(o)) {
    o.forEach((x, i) => ldWalk(x, fn, `${path}[${i}]`));
    return;
  }
  if (!o || typeof o !== "object") return;
  fn(o, path);
  for (const [k, v] of Object.entries(o)) if (v && typeof v === "object") ldWalk(v, fn, path ? `${path}.${k}` : k);
}

function checkLdEntity(e) {
  const types = ldTypes(e);
  const missing = [];
  const present = [];
  const isOrg = types.some((t) => ORG_TYPES.has(t));
  const isLocal = types.some((t) => LOCAL_TYPES.has(t));
  const has = (k) => e[k] !== undefined && e[k] !== null && !(Array.isArray(e[k]) && e[k].length === 0) && e[k] !== "";
  if (isOrg) {
    const fields = ["name", "url", "logo", "telephone", "email", "address", "areaServed", "sameAs"];
    if (isLocal) fields.push("openingHoursSpecification", "image", "geo");
    for (const f of fields) (has(f) ? present : missing).push(f);
    const addr = e.address;
    if (addr && typeof addr === "object") {
      for (const f of ["streetAddress", "postalCode", "addressLocality", "addressCountry"]) if (!addr[f]) missing.push(`address.${f}`);
    }
  }
  if (types.includes("BreadcrumbList")) {
    const items = [].concat(e.itemListElement || []);
    if (!items.length) missing.push("itemListElement");
    items.forEach((it, i) => {
      if (it.position === undefined) missing.push(`itemListElement[${i}].position`);
      if (!it.name && !it.item?.name) missing.push(`itemListElement[${i}].name`);
    });
  }
  if (types.includes("FAQPage")) {
    const qs = [].concat(e.mainEntity || []);
    if (!qs.length) missing.push("mainEntity");
    qs.forEach((q, i) => {
      if (!q.acceptedAnswer?.text) missing.push(`mainEntity[${i}].acceptedAnswer.text`);
    });
  }
  return { types, present, missing };
}

// ---------------------------------------------------------------------------
// NAP (téléphone, adresse, e-mail, horaires)

const RE_PHONE = /(?:\+33\s?\(0\)\s?|\+33\s?|0033\s?|(?<![\d+])0)[1-9](?:[\s.-]?\d{2}){4}(?!\d)/g;
const RE_EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const RE_STREET = /\b\d{1,4}(?:\s?(?:bis|ter))?,?\s+(?:rue|place|avenue|boulevard|allée|chemin|impasse|quai|route|square|cours|esplanade|promenade|faubourg)\s+[^,\d\n]{2,50}?(?=\s*,|\s+\d{5}|\s+à\s|\s*\.|\s*$)/giu;
const RE_CITY = /\b(\d{5})\s+([\p{Lu}][\p{L}'’-]+)/gu;
const RE_HOURS = /(?:du\s+)?lun(?:di|\.)?\s*(?:au|à|[-\u2013\u2014]|\s)\s*ven(?:dredi|\.)?[^0-9]{0,15}\d{1,2}\s?h\s?\d{0,2}\s*(?:à|[-\u2013\u2014])\s*\d{1,2}\s?h\s?\d{0,2}/giu;

function normPhone(s) {
  let d = String(s).replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  if (d.startsWith("0033")) d = d.slice(2);
  if (d.startsWith("330") && d.length === 12) d = `33${d.slice(3)}`;
  if (d.startsWith("0") && d.length === 10) d = `33${d.slice(1)}`;
  return `+${d}`;
}

function normText(s) {
  return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[\s,]+/g, " ").trim();
}

function normHoursText(s) {
  const t = s.toLowerCase();
  const days = /lun/.test(t) && /ven/.test(t) ? "lun-ven" : "?";
  const times = [...t.matchAll(/(\d{1,2})\s?h\s?(\d{2})?/g)].map((m) => `${m[1].padStart(2, "0")}:${m[2] || "00"}`);
  return `${days} ${times.join("-")}`;
}

function normHoursLd(h) {
  const days = [].concat(h.dayOfWeek || []).map((d) => String(d).replace(/^https?:\/\/schema\.org\//, ""));
  const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const d = days.length === 5 && week.every((x) => days.includes(x)) ? "lun-ven" : days.join(",");
  return `${d} ${String(h.opens || "?").slice(0, 5)}-${String(h.closes || "?").slice(0, 5)}`;
}

function extractNap(text) {
  const out = { phones: [], emails: [], streets: [], cities: [], hours: [] };
  for (const m of text.matchAll(RE_PHONE)) out.phones.push(clean(m[0]));
  for (const m of text.matchAll(RE_EMAIL)) out.emails.push(m[0]);
  for (const m of text.matchAll(RE_STREET)) out.streets.push(clean(m[0]));
  for (const m of text.matchAll(RE_CITY)) out.cities.push(`${m[1]} ${m[2]}`);
  for (const m of text.matchAll(RE_HOURS)) out.hours.push(clean(m[0]));
  return out;
}

// ---------------------------------------------------------------------------
// Analyse d'une page

function analyzePage(html, pageUrl, ctx) {
  const doc = parseHTML(html);
  const pageKey = ctx.keyOf(pageUrl);
  const htmlEl = findFirst(doc, (nd) => nd.tag === "html");
  const head = findFirst(doc, (nd) => nd.tag === "head");
  const body = findFirst(doc, (nd) => nd.tag === "body") || doc;
  const inHead = (nd) => {
    for (let p = nd.parent; p; p = p.parent) if (p === head) return true;
    return false;
  };

  const titles = findAll(doc, (nd) => nd.tag === "title" && !hasAncestor(nd, "svg"));
  const title = titles[0] ? clean(textOf(titles[0])) : null;
  const metas = findAll(doc, (nd) => nd.tag === "meta");
  const metaBy = (attr, val) => metas.filter((m) => String(m.attrs[attr] || "").toLowerCase() === val);
  const descs = metaBy("name", "description");
  const description = descs[0] ? clean(descs[0].attrs.content || "") : null;
  const robotsMeta = metaBy("name", "robots").map((m) => m.attrs.content || "");
  const googlebotMeta = metaBy("name", "googlebot").map((m) => m.attrs.content || "");
  const linkEls = findAll(doc, (nd) => nd.tag === "link");
  const canonicals = linkEls.filter((l) => relHas(l, "canonical")).map((l) => l.attrs.href || "");
  const og = {};
  for (const m of metas) {
    const p = m.attrs.property || m.attrs.name || "";
    if (/^(og|twitter):/i.test(p) && !(p in og)) og[p] = m.attrs.content || "";
  }
  const outsideHead = [];
  if (titles[0] && !inHead(titles[0])) outsideHead.push("title");
  if (descs[0] && !inHead(descs[0])) outsideHead.push("meta description");
  const canonEl = linkEls.find((l) => relHas(l, "canonical"));
  if (canonEl && !inHead(canonEl)) outsideHead.push("canonical");
  const robotsEl = metaBy("name", "robots")[0];
  if (robotsEl && !inHead(robotsEl)) outsideHead.push("meta robots");

  // Titres
  const headingEls = findAll(body, (nd) => /^h[1-6]$/.test(nd.tag));
  const outline = headingEls
    .filter((h) => Number(h.tag[1]) <= 3)
    .map((h) => {
      const spaced = clean(textOf(h));
      const rawWords = new Set(words(clean(textOf(h, true))));
      const spacedWords = new Set(words(spaced));
      const glued = [...rawWords].filter((w) => !spacedWords.has(w));
      return { level: Number(h.tag[1]), text: spaced, glued, zone: zoneOf(h) };
    });
  const h1 = outline.filter((h) => h.level === 1);
  const hCounts = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
  for (const h of headingEls) hCounts[h.tag]++;

  // Contenu principal
  const mains = findAll(body, (nd) => nd.tag === "main");
  const mainEl = mains[0] || null;
  const mainText = mainEl ? clean(textOf(mainEl)) : "";
  const mainWords = words(mainText).length;
  // Texte rédigé : paragraphes <p> d'au moins 12 mots (les listes, badges et boutons en sont exclus)
  const proseParas = mainEl ? findAll(mainEl, (nd) => nd.tag === "p").map((nd) => words(clean(textOf(nd))).length).filter((w) => w >= 12) : [];
  const proseWords = proseParas.reduce((s, w) => s + w, 0);
  const bodyText = clean(textOf(body));
  const bodyWords = words(bodyText).length;
  const bailout = html.includes("BAILOUT_TO_CLIENT_SIDE_RENDERING");
  const contentInInitialHtml = Boolean(mainEl) && mainWords >= 50 && h1.length >= 1 && !bailout;

  // Liens
  const links = [];
  for (const a of findAll(body, (nd) => nd.tag === "a" && nd.attrs.href !== undefined)) {
    const href = String(a.attrs.href).trim();
    let text = clean(textOf(a));
    let textSource = "texte";
    if (!text) {
      const alt = findAll(a, (nd) => nd.tag === "img")
        .map((im) => im.attrs.alt || "")
        .filter(Boolean)
        .join(" ");
      if (alt) {
        text = clean(alt);
        textSource = "alt";
      } else if (a.attrs["aria-label"]) {
        text = clean(a.attrs["aria-label"]);
        textSource = "aria-label";
      } else if (a.attrs.title) {
        text = clean(a.attrs.title);
        textSource = "title";
      } else textSource = "aucune";
    }
    const link = { href, kind: "autre", key: null, hash: null, text, textSource, zone: zoneOf(a), rel: a.attrs.rel || null, absoluteToSite: false };
    if (!href) link.kind = "vide";
    else if (href.startsWith("#")) {
      link.kind = "interne";
      link.key = pageKey;
      link.hash = safeDecode(href.slice(1));
    } else {
      let u = null;
      try {
        u = new URL(href, pageUrl);
      } catch {
        link.kind = "invalide";
      }
      if (u) {
        if (u.protocol === "tel:") link.kind = "tel";
        else if (u.protocol === "mailto:") link.kind = "mailto";
        else if (u.protocol === "javascript:") link.kind = "javascript";
        else if (u.protocol === "http:" || u.protocol === "https:") {
          const local = ctx.toLocal(u.href);
          if (local) {
            link.kind = "interne";
            link.key = ctx.keyOf(local);
            link.hash = u.hash ? safeDecode(u.hash.slice(1)) : null;
            link.absoluteToSite = /^https?:\/\//i.test(href) && new URL(href).host !== ctx.baseHost;
          } else link.kind = "externe";
        }
        if (link.kind !== "interne") link.target = u.href;
      }
    }
    links.push(link);
  }

  // Images
  const imgs = findAll(body, (nd) => nd.tag === "img");
  const images = {
    total: imgs.length,
    missingAlt: imgs.filter((im) => !("alt" in im.attrs)).map(imgSrc),
    emptyAlt: imgs.filter((im) => "alt" in im.attrs && !String(im.attrs.alt).trim()).map(imgSrc),
  };

  // JSON-LD
  const jsonld = findAll(doc, (nd) => nd.tag === "script" && String(nd.attrs.type || "").toLowerCase() === "application/ld+json").map((s) => {
    const raw = s.children.map((c) => c.text || "").join("");
    try {
      const data = JSON.parse(raw);
      const roots = ldRoots(data);
      const nested = [];
      for (const r of roots) for (const [k, v] of Object.entries(r)) if (v && typeof v === "object" && k !== "@context") ldWalk(v, (o) => nested.push(...ldTypes(o)));
      return {
        ok: true,
        context: data["@context"] ?? null,
        types: roots.flatMap(ldTypes),
        nestedTypes: uniq(nested),
        checks: roots.map(checkLdEntity).filter((c) => c.present.length || c.missing.length),
        data,
        inHead: inHead(s),
      };
    } catch (err) {
      return { ok: false, error: String(err.message), raw: raw.slice(0, 200), inHead: inHead(s) };
    }
  });

  // Ressources (poids)
  const scripts = findAll(doc, (nd) => nd.tag === "script" && nd.attrs.src).map((s) => s.attrs.src);
  const styles = linkEls.filter((l) => relHas(l, "stylesheet") && l.attrs.href).map((l) => l.attrs.href);

  // Identifiants (cibles de fragments)
  const ids = uniq([
    ...findAll(doc, (nd) => nd.attrs.id).map((nd) => nd.attrs.id),
    ...findAll(doc, (nd) => nd.tag === "a" && nd.attrs.name).map((nd) => nd.attrs.name),
  ]);

  // NAP visible
  const nap = extractNap(bodyText);
  nap.telLinks = links.filter((l) => l.kind === "tel").map((l) => l.href.replace(/^tel:/i, ""));
  nap.mailtoLinks = links.filter((l) => l.kind === "mailto").map((l) => l.href.replace(/^mailto:/i, "").split("?")[0]);
  nap.ld = { phones: [], emails: [], addresses: [], hours: [] };
  for (const j of jsonld)
    if (j.ok)
      ldWalk(j.data, (o, path) => {
        if (typeof o.telephone === "string") nap.ld.phones.push({ value: o.telephone, path: path || "racine" });
        if (typeof o.email === "string") nap.ld.emails.push({ value: o.email, path: path || "racine" });
        if (ldTypes(o).includes("PostalAddress")) nap.ld.addresses.push({ street: o.streetAddress || "", postalCode: o.postalCode || "", city: o.addressLocality || "", region: o.addressRegion || "", country: o.addressCountry || "", path });
        if (ldTypes(o).includes("OpeningHoursSpecification")) nap.ld.hours.push({ value: normHoursLd(o), path });
      });

  // Contrôles de rédaction : tirets longs et tournures à éviter
  const dashSources = [
    ["texte visible", bodyText],
    ["title", title || ""],
    ["meta description", description || ""],
    ...Object.entries(og).map(([k, v]) => [k, v]),
    ...findAll(body, (nd) => nd.attrs.alt || nd.attrs["aria-label"] || nd.attrs.title || nd.attrs.placeholder).flatMap((nd) =>
      ["alt", "aria-label", "title", "placeholder"].filter((k) => nd.attrs[k]).map((k) => [`attribut ${k}`, nd.attrs[k]]),
    ),
  ];
  const dashes = [];
  for (const [where, txt] of dashSources)
    for (const m of String(txt).matchAll(/[\u2013\u2014]/g)) dashes.push({ where, char: m[0] === "\u2013" ? "U+2013" : "U+2014", context: snippet(txt, m.index, 1) });
  const phraseText = `${title || ""} \n ${description || ""} \n ${mainText}`.replace(/[’‘]/g, "'");
  const phrases = [];
  for (const p of PHRASES) {
    const re = new RegExp(`(?<!\\p{L})${p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "giu");
    for (const m of phraseText.matchAll(re)) phrases.push({ phrase: p, context: snippet(phraseText, m.index, m[0].length) });
  }

  return {
    key: pageKey,
    lang: htmlEl?.attrs.lang ?? null,
    title,
    titleLength: title ? [...title].length : 0,
    titleCount: titles.length,
    description,
    descriptionLength: description ? [...description].length : 0,
    descriptionCount: descs.length,
    canonicals,
    robotsMeta,
    googlebotMeta,
    og,
    outsideHead,
    outline,
    hCounts,
    h1Count: h1.length,
    mainCount: mains.length,
    mainWords,
    proseWords,
    proseParagraphs: proseParas.length,
    bodyWords,
    mainSample: words(mainText).slice(0, 25).join(" "),
    bailout,
    contentInInitialHtml,
    links,
    images,
    jsonld,
    scripts,
    styles,
    ids,
    nap,
    dashes,
    phrases,
    htmlBytes: Buffer.byteLength(html),
  };
}

function safeDecode(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

// ---------------------------------------------------------------------------
// robots.txt et sitemap

function parseRobots(txt) {
  const groups = [];
  const sitemaps = [];
  let current = null;
  let lastWasAgent = false;
  for (const line of txt.split(/\r?\n/)) {
    const l = line.replace(/#.*/, "").trim();
    if (!l) continue;
    const idx = l.indexOf(":");
    if (idx === -1) continue;
    const k = l.slice(0, idx).trim().toLowerCase();
    const v = l.slice(idx + 1).trim();
    if (k === "user-agent") {
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(v);
      lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if (k === "sitemap") sitemaps.push(v);
      else if ((k === "allow" || k === "disallow") && current) current.rules.push({ type: k, path: v });
    }
  }
  return { groups, sitemaps };
}

function parseSitemap(xml) {
  const tag = (block, name) => {
    const m = new RegExp(`<${name}>([\\s\\S]*?)</${name}>`, "i").exec(block);
    return m ? decodeEntities(m[1].trim()) : null;
  };
  if (/<sitemapindex[\s>]/i.test(xml)) {
    return { index: true, children: [...xml.matchAll(/<sitemap>([\s\S]*?)<\/sitemap>/gi)].map((m) => tag(m[1], "loc")).filter(Boolean), urls: [] };
  }
  const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map((m) => ({
    loc: tag(m[1], "loc"),
    lastmod: tag(m[1], "lastmod"),
    priority: tag(m[1], "priority"),
    changefreq: tag(m[1], "changefreq"),
  }));
  return { index: false, children: [], urls };
}

// ---------------------------------------------------------------------------
// Markdown

function esc(v) {
  return String(v ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function mdTable(headers, rows) {
  if (!rows.length) return "_(aucun résultat)_\n";
  return `| ${headers.map(esc).join(" | ")} |\n| ${headers.map(() => "---").join(" | ")} |\n${rows.map((r) => `| ${r.map(esc).join(" | ")} |`).join("\n")}\n`;
}

function code(v) {
  const s = String(v ?? "");
  return s ? `\`${s.replace(/`/g, "'")}\`` : "";
}

// ---------------------------------------------------------------------------
// Programme principal

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  let baseUrl;
  try {
    baseUrl = new URL(opts.base);
  } catch {
    die(`origine invalide : ${opts.base}`);
  }
  const base = baseUrl.origin;
  const ua = UA_PRESETS[opts.ua] || opts.ua;
  const uaLabel = UA_PRESETS[opts.ua] ? opts.ua : "personnalisé";
  const altUa = ua === UA_PRESETS.googlebot ? UA_PRESETS.chrome : UA_PRESETS.googlebot;
  const altLabel = ua === UA_PRESETS.googlebot ? "chrome" : "googlebot";
  const startedAt = new Date();
  const alerts = [];
  const alert = (level, message, detail = "") => alerts.push({ level, message, detail });

  const cache = new Map();
  async function get(url, { agent = ua, headers = {}, useCache = true } = {}) {
    const ck = `${agent}\n${url}\n${JSON.stringify(headers)}`;
    if (useCache && cache.has(ck)) return cache.get(ck);
    const t0 = performance.now();
    let res;
    try {
      const r = await fetch(url, {
        redirect: "manual",
        headers: { "user-agent": agent, accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "accept-language": "fr-FR,fr;q=0.9", ...headers },
        signal: AbortSignal.timeout(30000),
      });
      const body = Buffer.from(await r.arrayBuffer());
      res = { url, status: r.status, headers: Object.fromEntries(r.headers), body, ms: Math.round(performance.now() - t0) };
    } catch (err) {
      res = { url, status: 0, headers: {}, body: Buffer.alloc(0), error: String(err.cause?.code || err.cause?.message || err.message), ms: Math.round(performance.now() - t0) };
    }
    if (useCache) cache.set(ck, res);
    return res;
  }

  const probe = await get(`${base}/`);
  if (probe.status === 0) die(`impossible de joindre ${base} (${probe.error})`);

  // robots.txt
  const robotsRes = await get(`${base}/robots.txt`);
  const robotsTxt = robotsRes.status === 200 ? robotsRes.body.toString("utf8") : "";
  const robots = parseRobots(robotsTxt);

  // Domaine de production
  let siteOrigin = opts.site ? new URL(opts.site).origin : null;
  const firstForeign = (list) => list.map((u) => { try { return new URL(u).origin; } catch { return null; } }).find((o) => o && o !== base);
  if (!siteOrigin) siteOrigin = firstForeign(robots.sitemaps) || null;

  // Sitemaps
  const sitemapSources = [];
  const sitemapEntries = [];
  const sitemapQueue = [`${base}/sitemap.xml`];
  const sitemapSeen = new Set();
  const tmpLocal = (u) => {
    try {
      const x = new URL(u);
      return `${base}${x.pathname}${x.search}`;
    } catch {
      return null;
    }
  };
  for (const s of robots.sitemaps) {
    const l = tmpLocal(s);
    if (l) sitemapQueue.push(l);
  }
  while (sitemapQueue.length && sitemapSeen.size < 20) {
    const smUrl = sitemapQueue.shift();
    if (sitemapSeen.has(smUrl)) continue;
    sitemapSeen.add(smUrl);
    const r = await get(smUrl, { headers: { accept: "application/xml,text/xml;q=0.9,*/*;q=0.8" } });
    const info = { url: smUrl.replace(base, ""), status: r.status, contentType: r.headers["content-type"] || null, count: 0, index: false };
    sitemapSources.push(info);
    if (r.status !== 200) continue;
    const sm = parseSitemap(r.body.toString("utf8"));
    info.index = sm.index;
    for (const c of sm.children) {
      const l = tmpLocal(c);
      if (l) sitemapQueue.push(l);
    }
    for (const u of sm.urls) {
      if (!u.loc) continue;
      sitemapEntries.push({ ...u, sitemap: info.url });
      info.count++;
    }
  }
  if (!siteOrigin) siteOrigin = firstForeign(sitemapEntries.map((e) => e.loc)) || DEFAULT_SITE;
  const siteHost = new URL(siteOrigin).host.toLowerCase();
  const bareHost = siteHost.replace(/^www\./, "");
  const internalHosts = new Set([baseUrl.host.toLowerCase(), bareHost, `www.${bareHost}`]);
  const keyOf = (u) => {
    const x = new URL(u);
    return `${x.pathname}${x.search}`;
  };
  const toLocal = (href) => {
    let u;
    try {
      u = new URL(href);
    } catch {
      return null;
    }
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (!internalHosts.has(u.host.toLowerCase())) return null;
    return `${base}${u.pathname}${u.search}`;
  };
  const ctx = { toLocal, keyOf, baseHost: baseUrl.host };
  for (const e of sitemapEntries) {
    const l = toLocal(e.loc);
    e.key = l ? keyOf(l) : null;
  }

  // Chaîne de redirections (sans suivi automatique)
  async function chainOf(key) {
    const hops = [];
    let k = key;
    const visited = new Set();
    let loop = false;
    let external = null;
    for (let i = 0; i <= 10; i++) {
      const r = await get(`${base}${k}`);
      const hop = {
        key: k,
        status: r.status,
        location: r.headers.location ?? null,
        xRobotsTag: r.headers["x-robots-tag"] ?? null,
        contentType: r.headers["content-type"] ?? null,
        cacheControl: r.headers["cache-control"] ?? null,
        contentEncoding: r.headers["content-encoding"] ?? null,
        error: r.error ?? null,
        ms: r.ms,
      };
      hops.push(hop);
      visited.add(k);
      if (r.status >= 300 && r.status < 400 && r.headers.location) {
        const abs = new URL(r.headers.location, `${base}${k}`).href;
        const local = toLocal(abs);
        if (!local) {
          external = abs;
          break;
        }
        const nk = keyOf(local);
        if (visited.has(nk)) {
          loop = true;
          break;
        }
        k = nk;
        continue;
      }
      break;
    }
    const last = hops.at(-1);
    return {
      hops,
      loop,
      external,
      redirects: hops.filter((h) => h.status >= 300 && h.status < 400 && h.location).length,
      finalKey: external || loop ? null : last.key,
      finalStatus: external ? "externe" : loop ? "boucle" : last.status,
    };
  }

  const isHtml = (ct) => /text\/html|application\/xhtml/i.test(ct || "");
  const entries = new Map();
  const pages = new Map();
  const errorPages = new Map();
  const queue = [];
  let truncated = false;
  const enqueue = (key, source) => {
    const e = entries.get(key);
    if (e) {
      e.sources.add(source);
      return;
    }
    if (entries.size >= opts.maxPages) {
      truncated = true;
      return;
    }
    entries.set(key, { key, sources: new Set([source]), chain: null });
    queue.push(key);
  };

  const extras = uniq([...(opts.defaultExtra ? DEFAULT_EXTRA : []), ...opts.extra]).map((x) => {
    if (/^https?:\/\//i.test(x)) {
      const l = toLocal(x);
      return l ? keyOf(l) : null;
    }
    return x.startsWith("/") ? x : `/${x}`;
  }).filter(Boolean);

  enqueue("/", "accueil");
  for (const s of sitemapEntries) if (s.key) enqueue(s.key, "sitemap");
  for (const x of extras) enqueue(x, "supplémentaire");

  while (queue.length) {
    const key = queue.shift();
    const e = entries.get(key);
    e.chain = await chainOf(key);
    for (const h of e.chain.hops.slice(1)) enqueue(h.key, "cible de redirection");
    const last = e.chain.hops.at(-1);
    if (e.chain.finalKey && !pages.has(last.key) && !errorPages.has(last.key)) {
      const r = await get(`${base}${last.key}`);
      if (isHtml(r.headers["content-type"])) {
        const a = analyzePage(r.body.toString("utf8"), `${base}${last.key}`, ctx);
        if (r.status === 200) {
          pages.set(last.key, a);
          for (const l of a.links) if (l.kind === "interne" && l.key) enqueue(l.key, "lien");
        } else if (r.status >= 400) errorPages.set(last.key, { status: r.status, title: a.title, robots: a.robotsMeta.join(", "), xRobotsTag: r.headers["x-robots-tag"] ?? null });
      }
    }
  }
  if (truncated) alert("Attention", `Crawl tronqué à ${opts.maxPages} URLs (option --max-pages).`);

  const finalOf = (key) => entries.get(key)?.chain?.finalKey ?? null;
  const sitemapFinalKeys = new Set(sitemapEntries.map((s) => (s.key ? finalOf(s.key) : null)).filter(Boolean));
  const homeKey = finalOf("/") || "/";

  // Indexabilité
  const indexability = (key) => {
    const p = pages.get(key);
    const e = entries.get(key);
    if (!p || !e) return { indexable: false, reason: "pas une page HTML en 200" };
    const xrt = e.chain.hops.at(-1).xRobotsTag || "";
    const metas = [...p.robotsMeta, ...p.googlebotMeta].join(", ");
    if (/noindex|none/i.test(xrt)) return { indexable: false, reason: `X-Robots-Tag : ${xrt}` };
    if (/noindex|none/i.test(metas)) return { indexable: false, reason: `meta robots : ${metas}` };
    return { indexable: true, reason: "" };
  };
  const canonicalStatus = (key) => {
    const p = pages.get(key);
    if (!p) return "";
    if (!p.canonicals.length) return "absente";
    if (p.canonicals.length > 1) return "multiple";
    const c = p.canonicals[0];
    if (!/^https?:\/\//i.test(c)) return "relative";
    const l = toLocal(c);
    if (!l) return "autre domaine";
    return keyOf(l) === key ? "auto-référente" : `vers ${keyOf(l)}`;
  };

  // ---------------------------------------------------------------------------
  // Graphe des liens internes

  const inbound = new Map();
  const edges = [];
  const fragmentLinks = new Map();
  for (const [src, p] of pages) {
    for (const l of p.links) {
      if (l.kind !== "interne" || !l.key) continue;
      const tFinal = finalOf(l.key);
      const samePage = (tFinal || l.key) === src;
      if (l.hash !== null && l.hash !== undefined) {
        const fk = `${l.key}#${l.hash}`;
        const f = fragmentLinks.get(fk) || { href: fk, targetKey: tFinal, id: l.hash, sources: new Set(), texts: new Set(), samePage: false };
        f.sources.add(src);
        if (l.text) f.texts.add(l.text);
        if (samePage) f.samePage = true;
        fragmentLinks.set(fk, f);
      }
      edges.push({ src, href: l.href, key: l.key, final: tFinal, zone: l.zone, text: l.text, samePage });
      if (samePage || !tFinal) continue;
      const ib = inbound.get(tFinal) || { nav: new Set(), content: new Set(), count: 0, anchors: new Set() };
      if (l.zone === "contenu") ib.content.add(src);
      else ib.nav.add(src);
      ib.count++;
      if (l.text) ib.anchors.add(l.text);
      inbound.set(tFinal, ib);
    }
  }

  // Profondeur de clic depuis l'accueil
  const depth = new Map([[homeKey, 0]]);
  const bfs = [homeKey];
  while (bfs.length) {
    const k = bfs.shift();
    for (const ed of edges) {
      if (ed.src !== k || !ed.final || depth.has(ed.final)) continue;
      depth.set(ed.final, depth.get(k) + 1);
      if (pages.has(ed.final)) bfs.push(ed.final);
    }
  }

  // Liens cassés et liens vers des redirections
  const broken = new Map();
  const toRedirect = new Map();
  for (const ed of edges) {
    const e = entries.get(ed.key);
    if (!e?.chain) continue;
    const fs = e.chain.finalStatus;
    if (fs !== 200) {
      const b = broken.get(ed.key) || { key: ed.key, status: fs, sources: new Set(), texts: new Set() };
      b.sources.add(ed.src);
      if (ed.text) b.texts.add(ed.text);
      broken.set(ed.key, b);
    } else if (e.chain.redirects > 0) {
      const t = toRedirect.get(ed.key) || { key: ed.key, final: e.chain.finalKey, statuses: e.chain.hops.slice(0, -1).map((h) => h.status).join(" > "), sources: new Set() };
      t.sources.add(ed.src);
      toRedirect.set(ed.key, t);
    }
  }

  // ---------------------------------------------------------------------------
  // Variantes d'URL et hôte www (filet de sécurité applicatif)

  const variants = [];
  const sample = sitemapEntries.map((s) => s.key).find((k) => k && k !== "/" && !k.endsWith("/"));
  if (sample) {
    for (const [label, path] of [
      ["barre oblique finale", `${sample}/`],
      ["paramètre de suivi", `${sample}${sample.includes("?") ? "&" : "?"}utm_source=audit`],
    ]) {
      const ch = await chainOf(path);
      const fk = ch.finalKey;
      let canonical = "";
      if (fk && ch.finalStatus === 200) {
        const r = await get(`${base}${fk}`);
        if (isHtml(r.headers["content-type"])) canonical = analyzePage(r.body.toString("utf8"), `${base}${fk}`, ctx).canonicals.join(", ");
      }
      variants.push({ label, path, statuses: ch.hops.map((h) => h.status).join(" > "), location: ch.hops[0].location, finalStatus: ch.finalStatus, canonical });
    }
  }
  const wwwChecks = [];
  if (!siteHost.startsWith("www.")) {
    for (const path of uniq(["/", sample].filter(Boolean))) {
      const r = await get(`${base}${path}`, { headers: { "x-forwarded-host": `www.${bareHost}` }, useCache: false });
      let target = null;
      if (r.headers.location) {
        const l = toLocal(new URL(r.headers.location, `${base}${path}`).href);
        if (l) target = await chainOf(keyOf(l));
      }
      wwwChecks.push({ path, status: r.status, location: r.headers.location ?? null, then: target ? target.hops.map((h) => h.status).join(" > ") : null, extraHops: target ? target.redirects : null });
    }
  }

  // ---------------------------------------------------------------------------
  // Comparaison avec un second user-agent

  const comparisons = [];
  if (opts.compare) {
    for (const [key, p] of pages) {
      const r = await get(`${base}${key}`, { agent: altUa });
      const diffs = [];
      if (r.status !== 200) diffs.push(`statut ${r.status}`);
      let q = null;
      if (r.status === 200 && isHtml(r.headers["content-type"])) {
        q = analyzePage(r.body.toString("utf8"), `${base}${key}`, ctx);
        const cmp = (label, a, b) => {
          if (JSON.stringify(a) !== JSON.stringify(b)) diffs.push(`${label} : ${JSON.stringify(a)} / ${JSON.stringify(b)}`);
        };
        cmp("title", p.title, q.title);
        cmp("description", p.description, q.description);
        cmp("canonical", p.canonicals, q.canonicals);
        cmp("robots", p.robotsMeta, q.robotsMeta);
        cmp("H1", p.outline.filter((h) => h.level === 1).map((h) => h.text), q.outline.filter((h) => h.level === 1).map((h) => h.text));
        cmp("mots <main>", p.mainWords, q.mainWords);
        cmp("JSON-LD", p.jsonld.map((j) => j.types), q.jsonld.map((j) => j.types));
        cmp("liens internes", p.links.filter((l) => l.kind === "interne").length, q.links.filter((l) => l.kind === "interne").length);
        cmp("métadonnées hors <head>", p.outsideHead, q.outsideHead);
      }
      comparisons.push({ key, identicalHtml: q ? r.body.equals((await get(`${base}${key}`)).body) : false, htmlBytesMain: p.htmlBytes, htmlBytesAlt: r.body.length, diffs });
      if (diffs.length) alert("Attention", `Réponse différente selon le user-agent sur ${key}`, diffs.join(" ; "));
    }
  }

  // ---------------------------------------------------------------------------
  // Poids des pages (HTML initial, JS et CSS référencés)

  const assetCache = new Map();
  async function assetSize(src, pageKey) {
    let abs;
    try {
      abs = new URL(src, `${base}${pageKey}`).href;
    } catch {
      return null;
    }
    const local = toLocal(abs);
    if (!local) return null;
    if (assetCache.has(local)) return assetCache.get(local);
    const r = await get(local, { headers: { accept: "*/*" } });
    const v = r.status === 200 ? { raw: r.body.length, gz: gzipSync(r.body).length } : { raw: 0, gz: 0, status: r.status };
    assetCache.set(local, v);
    return v;
  }
  const weights = [];
  for (const [key, p] of pages) {
    const r = await get(`${base}${key}`);
    const js = { n: 0, raw: 0, gz: 0 };
    const css = { n: 0, raw: 0, gz: 0 };
    for (const s of uniq(p.scripts)) {
      const v = await assetSize(s, key);
      if (v) {
        js.n++;
        js.raw += v.raw;
        js.gz += v.gz;
      }
    }
    for (const s of uniq(p.styles)) {
      const v = await assetSize(s, key);
      if (v) {
        css.n++;
        css.raw += v.raw;
        css.gz += v.gz;
      }
    }
    weights.push({ key, htmlRaw: r.body.length, htmlGz: gzipSync(r.body).length, servedEncoding: r.headers["content-encoding"] || "aucun", js, css });
  }

  // ---------------------------------------------------------------------------
  // Alertes

  if (robotsRes.status !== 200) alert("Attention", `robots.txt répond ${robotsRes.status}`);
  for (const g of robots.groups) {
    const concerned = g.agents.some((a) => a === "*" || /googlebot/i.test(a));
    if (concerned && g.rules.some((r) => r.type === "disallow" && r.path === "/")) alert("Erreur", `robots.txt bloque tout le site pour ${g.agents.join(", ")}`);
  }
  if (!robots.sitemaps.length) alert("Info", "robots.txt ne déclare aucun sitemap");
  for (const s of sitemapSources) if (s.status !== 200) alert("Erreur", `Sitemap ${s.url} répond ${s.status}`);
  if (!sitemapEntries.length) alert("Erreur", "Aucune URL trouvée dans le sitemap");
  const locCount = new Map();
  for (const s of sitemapEntries) locCount.set(s.loc, (locCount.get(s.loc) || 0) + 1);
  for (const [loc, c] of locCount) if (c > 1) alert("Attention", `URL en double dans le sitemap : ${loc} (${c} fois)`);
  const lastmods = uniq(sitemapEntries.map((s) => s.lastmod).filter(Boolean));
  if (sitemapEntries.length > 1 && lastmods.length === 1) alert("Info", `Toutes les dates lastmod du sitemap sont identiques (${lastmods[0]})`);
  if (sitemapEntries.some((s) => !s.lastmod)) alert("Info", "Certaines URLs du sitemap n'ont pas de lastmod");
  for (const s of sitemapEntries) {
    let u = null;
    try {
      u = new URL(s.loc);
    } catch {
      alert("Erreur", `URL invalide dans le sitemap : ${s.loc}`);
      continue;
    }
    if (u.origin !== siteOrigin) alert("Attention", `URL du sitemap hors du domaine de production : ${s.loc}`);
    const e = s.key ? entries.get(s.key) : null;
    if (!e?.chain) continue;
    if (e.chain.finalStatus !== 200) alert("Erreur", `URL du sitemap en erreur : ${s.key} (${e.chain.finalStatus})`);
    else if (e.chain.redirects) alert("Attention", `URL du sitemap en redirection : ${s.key} vers ${e.chain.finalKey}`);
    else {
      const ix = indexability(s.key);
      if (!ix.indexable) alert("Erreur", `URL du sitemap non indexable : ${s.key}`, ix.reason);
      const cs = canonicalStatus(s.key);
      if (cs !== "auto-référente") alert("Attention", `Canonical ${cs} sur ${s.key} (URL du sitemap)`);
    }
  }
  for (const [key, e] of entries) {
    const ch = e.chain;
    if (!ch) continue;
    if (ch.loop) alert("Erreur", `Boucle de redirection à partir de ${key}`);
    if (ch.redirects > 1 && !ch.loop) alert("Attention", `Chaîne de ${ch.redirects} redirections à partir de ${key}`, ch.hops.map((h) => `${h.status} ${h.key}`).join(" > "));
    for (const h of ch.hops) {
      if (h.status === 302 || h.status === 307) alert("Attention", `Redirection temporaire ${h.status} sur ${h.key}`, `vers ${h.location}`);
      if (h.status === 0) alert("Erreur", `Requête en échec sur ${h.key}`, h.error || "");
      if (h.status >= 500) alert("Erreur", `Erreur serveur ${h.status} sur ${h.key}`);
    }
    if (e.sources.has("supplémentaire")) {
      const expect404 = /inexistant/i.test(key);
      if (expect404) {
        if (ch.finalStatus === 200) alert("Erreur", `Soft 404 : ${key} répond 200 alors qu'un 404 est attendu`);
      } else if (typeof ch.finalStatus === "number" && ch.finalStatus >= 400) alert("Attention", `URL supplémentaire en ${ch.finalStatus} : ${key}`, ch.redirects ? "" : "aucune redirection");
    }
  }
  const titleMap = new Map();
  const descMap = new Map();
  for (const [key, p] of pages) {
    const ix = indexability(key);
    const xrt = entries.get(key)?.chain?.hops.at(-1).xRobotsTag;
    if (xrt) alert(/noindex/i.test(xrt) ? "Erreur" : "Info", `En-tête X-Robots-Tag sur ${key}`, xrt);
    if (!p.lang) alert("Attention", `Attribut lang absent sur ${key}`);
    if (!p.title) alert("Erreur", `Title absent sur ${key}`);
    else {
      if (p.titleLength < 30 || p.titleLength > 60) alert("Info", `Title de ${p.titleLength} caractères sur ${key} (repère : 30 à 60)`, p.title);
      if (ix.indexable) titleMap.set(p.title, [...(titleMap.get(p.title) || []), key]);
    }
    if (p.titleCount > 1) alert("Attention", `${p.titleCount} balises title sur ${key}`);
    if (!p.description) alert("Attention", `Meta description absente sur ${key}`);
    else {
      if (p.descriptionLength < 70 || p.descriptionLength > 160) alert("Info", `Meta description de ${p.descriptionLength} caractères sur ${key} (repère : 70 à 160)`);
      if (ix.indexable) descMap.set(p.description, [...(descMap.get(p.description) || []), key]);
    }
    const cs = canonicalStatus(key);
    if (!sitemapFinalKeys.has(key) && ix.indexable && cs !== "auto-référente") alert("Attention", `Canonical ${cs} sur ${key}`);
    if (p.outsideHead.length) alert("Attention", `Métadonnées hors du <head> sur ${key}`, p.outsideHead.join(", "));
    if (p.h1Count === 0) alert("Attention", `Aucun H1 sur ${key}`);
    if (p.h1Count > 1) alert("Attention", `${p.h1Count} H1 sur ${key}`);
    for (const h of p.outline) if (h.glued.length) alert("Info", `H${h.level} de ${key} : mots collés dans le textContent brut`, h.glued.join(", "));
    if (!p.contentInInitialHtml) alert("Erreur", `Contenu principal absent ou trop maigre dans le HTML initial de ${key}`, `mots <main> : ${p.mainWords}, H1 : ${p.h1Count}, rendu client forcé : ${p.bailout ? "oui" : "non"}`);
    if (p.mainCount !== 1) alert("Attention", `${p.mainCount} éléments <main> sur ${key}`);
    if (p.mainWords < 300) alert("Info", `Contenu léger sur ${key} : ${p.mainWords} mots dans <main>`);
    if (p.images.missingAlt.length) alert("Attention", `${p.images.missingAlt.length} image(s) sans attribut alt sur ${key}`, p.images.missingAlt.join(", "));
    for (const j of p.jsonld) if (!j.ok) alert("Erreur", `JSON-LD invalide sur ${key}`, j.error);
    if (!p.jsonld.length) alert("Info", `Aucun JSON-LD sur ${key}`);
    const noText = p.links.filter((l) => (l.kind === "interne" || l.kind === "externe") && l.textSource === "aucune");
    if (noText.length) alert("Attention", `${noText.length} lien(s) sans texte d'ancre sur ${key}`, uniq(noText.map((l) => l.href)).join(", "));
    const nofollow = p.links.filter((l) => l.kind === "interne" && /nofollow/i.test(l.rel || ""));
    if (nofollow.length) alert("Attention", `${nofollow.length} lien(s) interne(s) en nofollow sur ${key}`);
    const abs = p.links.filter((l) => l.absoluteToSite);
    if (abs.length) alert("Info", `${abs.length} lien(s) interne(s) écrits en absolu vers le domaine de production sur ${key}`);
    if (p.dashes.length) alert("Info", `${p.dashes.length} tiret(s) demi-cadratin ou cadratin sur ${key}`, uniq(p.dashes.map((d) => d.where)).join(", "));
    if (p.phrases.length) alert("Info", `${p.phrases.length} tournure(s) à éviter sur ${key}`, uniq(p.phrases.map((x) => x.phrase)).join(", "));
  }
  for (const [t, keys] of titleMap) if (keys.length > 1) alert("Attention", `Title identique sur ${keys.length} pages`, `${t} (${keys.join(", ")})`);
  for (const keys of descMap.values()) if (keys.length > 1) alert("Attention", `Meta description identique sur ${keys.length} pages`, keys.join(", "));
  for (const b of broken.values()) alert("Erreur", `Lien interne cassé vers ${b.key} (${b.status})`, `depuis ${[...b.sources].join(", ")}`);
  for (const t of toRedirect.values()) alert("Attention", `Lien interne vers une URL en redirection : ${t.key} vers ${t.final}`, `depuis ${[...t.sources].join(", ")}`);
  const fragments = [...fragmentLinks.values()].map((f) => {
    const target = f.targetKey ? pages.get(f.targetKey) : null;
    return { ...f, exists: target ? target.ids.includes(f.id) || f.id === "" || f.id.toLowerCase() === "top" : null };
  });
  for (const f of fragments) if (f.exists === false) alert("Attention", `Fragment introuvable : ${f.href}`, `aucun id="${f.id}" sur ${f.targetKey}`);
  const crossFragments = fragments.filter((f) => [...f.sources].some((s) => s !== f.targetKey));
  if (crossFragments.length) alert("Info", `${crossFragments.length} cible(s) de lien interne avec fragment (#...)`, "les fragments ne créent pas d'URL distincte pour Google");
  const orphans = [...sitemapFinalKeys].filter((k) => k !== homeKey && !(inbound.get(k)?.nav.size || inbound.get(k)?.content.size));
  for (const k of orphans) alert("Attention", `Page orpheline (dans le sitemap, jamais liée) : ${k}`);
  const navOnly = [...pages.keys()].filter((k) => k !== homeKey && inbound.get(k)?.nav.size && !inbound.get(k)?.content.size);
  for (const k of navOnly) alert("Info", `Page liée uniquement depuis le header ou le footer : ${k}`);
  for (const k of pages.keys()) {
    const d = depth.get(k);
    if (d === undefined && indexability(k).indexable && !orphans.includes(k)) alert("Attention", `Page non atteignable depuis l'accueil : ${k}`);
    else if (d > 3) alert("Attention", `Profondeur de clic ${d} pour ${k}`);
  }
  const notInSitemap = [...pages.keys()].filter((k) => indexability(k).indexable && !sitemapFinalKeys.has(k));
  for (const k of notInSitemap) alert("Info", `Page indexable absente du sitemap : ${k}`);
  for (const w of wwwChecks) {
    if (w.status === 302 || w.status === 307) alert("Attention", `Hôte www : redirection temporaire ${w.status} sur ${w.path}`);
    if (w.status === 308) alert("Info", `Hôte www : redirection 308 sur ${w.path}`, "permanente comme un 301 pour Google");
    if (w.status === 200) alert("Info", `Hôte www : aucune redirection applicative sur ${w.path}`, "la redirection doit alors être faite par le serveur web");
    if (w.extraHops) alert("Attention", `Hôte www : chaîne de redirections sur ${w.path}`);
  }

  // NAP consolidé
  const napAll = { phones: new Map(), emails: new Map(), streets: new Map(), cities: new Map(), hours: new Map() };
  const addNap = (map, norm, display, where) => {
    const g = map.get(norm) || new Map();
    const s = g.get(display) || new Set();
    s.add(where);
    g.set(display, s);
    map.set(norm, g);
  };
  for (const [key, p] of pages) {
    for (const v of p.nap.phones) addNap(napAll.phones, normPhone(v), v, `${key} (texte)`);
    for (const v of p.nap.telLinks) addNap(napAll.phones, normPhone(v), `tel:${v}`, `${key} (lien tel:)`);
    for (const v of p.nap.ld.phones) addNap(napAll.phones, normPhone(v.value), `JSON-LD : ${v.value}`, `${key} (${v.path})`);
    for (const v of p.nap.emails) addNap(napAll.emails, v.toLowerCase(), v, `${key} (texte)`);
    for (const v of p.nap.mailtoLinks) addNap(napAll.emails, v.toLowerCase(), `mailto:${v}`, `${key} (lien mailto:)`);
    for (const v of p.nap.ld.emails) addNap(napAll.emails, v.value.toLowerCase(), `JSON-LD : ${v.value}`, `${key} (${v.path})`);
    for (const v of p.nap.streets) addNap(napAll.streets, normText(v), v, `${key} (texte)`);
    for (const v of p.nap.cities) addNap(napAll.cities, normText(v), v, `${key} (texte)`);
    for (const a of p.nap.ld.addresses) {
      if (a.street) addNap(napAll.streets, normText(a.street), `JSON-LD : ${a.street}`, `${key} (${a.path})`);
      if (a.postalCode || a.city) addNap(napAll.cities, normText(`${a.postalCode} ${a.city}`), `JSON-LD : ${a.postalCode} ${a.city}`, `${key} (${a.path})`);
    }
    for (const v of p.nap.hours) addNap(napAll.hours, normHoursText(v), v, `${key} (texte)`);
    for (const v of p.nap.ld.hours) addNap(napAll.hours, v.value, `JSON-LD : ${v.path}`, key);
  }
  for (const [label, map] of [["numéros de téléphone", napAll.phones], ["adresses e-mail", napAll.emails], ["adresses (rue)", napAll.streets], ["codes postaux et villes", napAll.cities], ["horaires", napAll.hours]]) {
    if (map.size > 1) alert("Attention", `NAP : ${map.size} valeurs différentes pour les ${label}`, [...map.keys()].join(" / "));
    for (const [norm, g] of map) {
      const displays = [...g.keys()].filter((d) => !/^(tel:|mailto:|JSON-LD)/.test(d));
      if (displays.length > 1) alert("Info", `NAP : ${displays.length} formats d'affichage pour ${norm}`, displays.join(" / "));
    }
  }

  // ---------------------------------------------------------------------------
  // Rapport Markdown

  const order = { Erreur: 0, Attention: 1, Info: 2 };
  alerts.sort((a, b) => order[a.level] - order[b.level]);
  const counts = { Erreur: 0, Attention: 0, Info: 0 };
  for (const a of alerts) counts[a.level]++;
  const L = [];
  const p = (s = "") => L.push(s);
  const dateFr = startedAt.toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

  p(`# Audit SEO technique de ${base}`);
  p();
  p(`- Date : ${dateFr} (heure de Paris)`);
  p(`- Origine auditée : ${base}`);
  p(`- Domaine de production (URLs absolues ramenées sur l'origine auditée) : ${siteOrigin}`);
  p(`- User-agent du crawl : ${uaLabel} (${code(ua)})`);
  p(`- URLs testées : ${entries.size}, dont ${pages.size} pages HTML en 200`);
  p(`- Alertes : ${counts.Erreur} erreur(s), ${counts.Attention} point(s) d'attention, ${counts.Info} information(s)`);
  p("- Méthode : fetch sans suivi automatique des redirections, analyse du HTML initial (aucun JavaScript exécuté). Mots : suites de caractères séparées par des espaces contenant au moins une lettre ou un chiffre.");
  p();
  p("## Résumé des alertes");
  p();
  p(mdTable(["Gravité", "Alerte", "Détail"], alerts.map((a) => [a.level, a.message, a.detail])));

  p("## 1. robots.txt");
  p();
  p(`- Statut : ${robotsRes.status}, Content-Type : ${code(robotsRes.headers["content-type"] || "")}`);
  p(`- Sitemaps déclarés : ${robots.sitemaps.length ? robots.sitemaps.map(code).join(", ") : "aucun"}`);
  for (const g of robots.groups) p(`- Groupe ${g.agents.map(code).join(", ")} : ${g.rules.map((r) => `${r.type} ${code(r.path) || "(vide)"}`).join(", ") || "aucune règle"}`);
  p();
  p("```text");
  p(robotsTxt.trim() || "(vide)");
  p("```");
  p();

  p("## 2. Sitemap");
  p();
  p(mdTable(["Fichier", "Statut", "Content-Type", "Type", "URLs"], sitemapSources.map((s) => [s.url, s.status, s.contentType, s.index ? "index" : "urlset", s.count])));
  p(
    mdTable(
      ["URL (loc)", "lastmod", "priority", "Statut final", "Sauts", "Indexable", "Canonical", "Profondeur", "Pages qui la lient"],
      sitemapEntries.map((s) => {
        const e = s.key ? entries.get(s.key) : null;
        const fk = e?.chain?.finalKey;
        const ix = fk ? indexability(fk) : { indexable: false, reason: "" };
        const ib = fk ? inbound.get(fk) : null;
        return [s.loc, s.lastmod || "", s.priority || "", e?.chain?.finalStatus ?? "", e?.chain?.redirects ?? "", ix.indexable ? "oui" : `non ${ix.reason}`, fk ? canonicalStatus(fk) : "", fk && depth.has(fk) ? depth.get(fk) : "non atteignable", ib ? new Set([...ib.nav, ...ib.content]).size : 0];
      }),
    ),
  );

  p("## 3. Codes HTTP et en-têtes");
  p();
  p("Chaque URL est demandée sans suivre les redirections. « Sauts » = nombre de redirections avant la réponse finale.");
  p();
  p(
    mdTable(
      ["URL", "Origine de l'URL", "Statut", "Location", "Sauts", "Statut final", "URL finale", "X-Robots-Tag", "Content-Type", "Cache-Control"],
      [...entries.values()]
        .filter((e) => e.chain)
        .map((e) => {
          const h0 = e.chain.hops[0];
          const last = e.chain.hops.at(-1);
          return [e.key, [...e.sources].join(", "), h0.status || h0.error, h0.location || "", e.chain.redirects, e.chain.finalStatus, e.chain.finalKey || e.chain.external || "", last.xRobotsTag || "aucun", last.contentType || "", last.cacheControl || ""];
        }),
    ),
  );
  if (errorPages.size) {
    p("Pages d'erreur rencontrées :");
    p();
    p(mdTable(["URL", "Statut", "Title", "Meta robots", "X-Robots-Tag"], [...errorPages].map(([k, v]) => [k, v.status, v.title, v.robots, v.xRobotsTag || "aucun"])));
  }

  p("## 4. Variantes d'URL et hôte www");
  p();
  p(mdTable(["Variante", "URL testée", "Statuts successifs", "Location", "Statut final", "Canonical de la page finale"], variants.map((v) => [v.label, v.path, v.statuses, v.location || "", v.finalStatus, v.canonical])));
  p(`Hôte www simulé par l'en-tête ${code(`X-Forwarded-Host: www.${bareHost}`)} (filet de sécurité applicatif ; http vers https et la redirection du serveur web ne sont pas testables en local) :`);
  p();
  p(mdTable(["Chemin", "Statut", "Location", "Statuts après la redirection"], wwwChecks.map((w) => [w.path, w.status, w.location || "", w.then || ""])));

  p("## 5. Pages HTML en 200 : synthèse");
  p();
  p(
    mdTable(
      ["Page", "Title (car.)", "Description (car.)", "Canonical", "Robots", "H1", "Mots <main>", "Mots rédigés", "Contenu dans le HTML initial", "JSON-LD"],
      [...pages].map(([k, pg]) => {
        const ix = indexability(k);
        return [k, pg.titleLength, pg.descriptionLength, canonicalStatus(k), ix.indexable ? pg.robotsMeta.join(", ") || "aucune balise" : `NON INDEXABLE (${ix.reason})`, pg.h1Count, pg.mainWords, pg.proseWords, pg.contentInInitialHtml ? "oui" : "NON", pg.jsonld.map((j) => (j.ok ? j.types.join(" + ") : "ERREUR")).join(" ; ") || "aucun"];
      }),
    ),
  );

  p("## 6. Détail par page");
  p();
  for (const [k, pg] of pages) {
    p(`### ${k}`);
    p();
    p(`- Title (${pg.titleLength} car.) : ${pg.title ?? "ABSENT"}`);
    p(`- Meta description (${pg.descriptionLength} car.) : ${pg.description ?? "ABSENTE"}`);
    p(`- Canonical : ${pg.canonicals.map(code).join(", ") || "absente"} (${canonicalStatus(k)})`);
    p(`- Meta robots : ${pg.robotsMeta.map(code).join(", ") || "aucune"} ; googlebot : ${pg.googlebotMeta.map(code).join(", ") || "aucune"} ; X-Robots-Tag : ${entries.get(k)?.chain?.hops.at(-1).xRobotsTag || "aucun"}`);
    p(`- lang : ${code(pg.lang) || "absent"} ; og:url : ${code(pg.og["og:url"]) || "absent"} ; og:image : ${code(pg.og["og:image"]) || "absent"}`);
    if (pg.outsideHead.length) p(`- Métadonnées hors du <head> : ${pg.outsideHead.join(", ")}`);
    p(`- Titres : ${Object.entries(pg.hCounts).filter(([, v]) => v).map(([t, v]) => `${v} ${t.toUpperCase()}`).join(", ") || "aucun"}`);
    p(`- Mots dans <main> : ${pg.mainWords} (page entière, header et footer compris : ${pg.bodyWords}) ; texte rédigé : ${pg.proseWords} mots en ${pg.proseParagraphs} paragraphe(s) d'au moins 12 mots`);
    p(`- Contenu dans le HTML initial : ${pg.contentInInitialHtml ? "oui" : "NON"} (rendu client forcé détecté : ${pg.bailout ? "oui" : "non"}) ; début du texte : « ${pg.mainSample} … »`);
    p(`- Images : ${pg.images.total}, sans attribut alt : ${pg.images.missingAlt.length}${pg.images.missingAlt.length ? ` (${pg.images.missingAlt.join(", ")})` : ""}, alt vide (décoratives) : ${pg.images.emptyAlt.length}`);
    for (const j of pg.jsonld) {
      if (!j.ok) p(`- JSON-LD : ERREUR de syntaxe (${j.error})`);
      else {
        p(`- JSON-LD : ${j.types.join(", ")} ; types imbriqués : ${j.nestedTypes.join(", ") || "aucun"} ; dans le <head> : ${j.inHead ? "oui" : "non (body)"}`);
        for (const c of j.checks) p(`  - ${c.types.join("/")} : champs présents ${c.present.join(", ") || "aucun"} ; absents ${c.missing.join(", ") || "aucun"}`);
      }
    }
    p();
    p("Plan des titres (H1 à H3) :");
    p();
    let indent = -1;
    for (const h of pg.outline) {
      indent = Math.min(h.level - 1, indent + 1);
      p(`${"  ".repeat(indent)}- H${h.level} : ${h.text}${h.zone !== "contenu" ? ` _(zone ${h.zone})_` : ""}${h.glued.length ? ` _(textContent brut : ${h.glued.join(", ")})_` : ""}`);
    }
    if (!pg.outline.length) p("_(aucun titre)_");
    p();
    const grouped = new Map();
    for (const l of pg.links.filter((x) => x.kind === "interne")) {
      const target = `${l.key}${l.hash !== null && l.hash !== undefined ? `#${l.hash}` : ""}`;
      const gk = `${target}\n${l.text}\n${l.zone}`;
      const g = grouped.get(gk) || { target, text: l.text, source: l.textSource, zone: l.zone, n: 0, status: entries.get(l.key)?.chain?.finalStatus ?? "" };
      g.n++;
      grouped.set(gk, g);
    }
    p("Liens internes sortants :");
    p();
    p(mdTable(["Cible", "Ancre", "Source de l'ancre", "Zone", "Nb", "Statut cible"], [...grouped.values()].map((g) => [g.target, g.text, g.source, g.zone, g.n, g.status])));
    const other = pg.links.filter((x) => x.kind !== "interne");
    if (other.length) {
      p(`Autres liens : ${Object.entries(other.reduce((acc, l) => ((acc[l.kind] = (acc[l.kind] || 0) + 1), acc), {})).map(([kk, v]) => `${kk} ${v}`).join(", ")} (${uniq(other.map((l) => l.href)).map(code).join(", ")})`);
      p();
    }
  }

  p("## 7. Liens internes : synthèse");
  p();
  p("### Liens cassés");
  p();
  p(mdTable(["Cible", "Statut", "Pages sources", "Ancres"], [...broken.values()].map((b) => [b.key, b.status, [...b.sources].join(", "), [...b.texts].join(" / ")])));
  p("### Liens vers des URLs en redirection");
  p();
  p(mdTable(["Cible", "Statuts", "URL finale", "Pages sources"], [...toRedirect.values()].map((t) => [t.key, t.statuses, t.final, [...t.sources].join(", ")])));
  p("### Liens à fragment (#...)");
  p();
  p(mdTable(["Lien", "Page cible", "id présent", "Pages sources", "Ancres"], fragments.map((f) => [f.href, f.targetKey || "", f.exists === null ? "page non analysée" : f.exists ? "oui" : "NON", `${f.sources.size} : ${[...f.sources].join(", ")}`, [...f.texts].join(" / ")])));
  p("### Liens entrants internes par page");
  p();
  p("Pages sources distinctes, liens d'une page vers elle-même exclus. « Navigation » = liens du header, du footer ou d'une zone hors <main>.");
  p();
  p(
    mdTable(
      ["Page", "Profondeur", "Pages sources (navigation)", "Pages sources (contenu)", "Liens (total)", "Ancres reçues", "Dans le sitemap"],
      [...pages.keys()].map((k) => {
        const ib = inbound.get(k);
        return [k, depth.has(k) ? depth.get(k) : "non atteignable", ib ? ib.nav.size : 0, ib ? ib.content.size : 0, ib ? ib.count : 0, ib ? [...ib.anchors].join(" / ") : "", sitemapFinalKeys.has(k) ? "oui" : "non"];
      }),
    ),
  );
  p("### Pages orphelines (dans le sitemap, jamais liées)");
  p();
  p(orphans.length ? orphans.map((k) => `- ${k}`).join("\n") : "_(aucune)_");
  p();
  p("### Pages liées uniquement par la navigation (header, footer)");
  p();
  p(navOnly.length ? navOnly.map((k) => `- ${k}`).join("\n") : "_(aucune)_");
  p();
  p("### Pages indexables absentes du sitemap");
  p();
  p(notInSitemap.length ? notInSitemap.map((k) => `- ${k}`).join("\n") : "_(aucune)_");
  p();

  p(`## 8. Comparaison des user-agents ${uaLabel} et ${altLabel} (HTML initial)`);
  p();
  if (!opts.compare) p("_(désactivée)_");
  else p(mdTable(["Page", "HTML identique à l'octet", "Taille (crawl)", "Taille (second UA)", "Différences SEO"], comparisons.map((c) => [c.key, c.identicalHtml ? "oui" : "non", ko(c.htmlBytesMain), ko(c.htmlBytesAlt), c.diffs.join(" ; ") || "aucune"])));
  p();

  p("## 9. Poids des pages (HTML initial, JS et CSS référencés)");
  p();
  p("Tailles gzip calculées localement (niveau par défaut) ; « Encodage servi » est la compression réellement appliquée par le serveur audité.");
  p();
  p(mdTable(["Page", "HTML brut", "HTML gzip", "Encodage servi", "JS (fichiers)", "JS brut", "JS gzip", "CSS brut", "CSS gzip"], weights.map((w) => [w.key, ko(w.htmlRaw), ko(w.htmlGz), w.servedEncoding, w.js.n, ko(w.js.raw), ko(w.js.gz), ko(w.css.raw), ko(w.css.gz)])));

  p("## 10. NAP visible et données structurées");
  p();
  for (const [label, map] of [["Téléphone (normalisé +33)", napAll.phones], ["E-mail", napAll.emails], ["Adresse (rue)", napAll.streets], ["Code postal et ville", napAll.cities], ["Horaires (normalisés)", napAll.hours]]) {
    p(`### ${label}`);
    p();
    const rows = [];
    for (const [norm, g] of map) for (const [display, where] of g) rows.push([norm, display, [...where].join(", ")]);
    p(mdTable(["Valeur normalisée", "Forme trouvée", "Où"], rows));
  }

  p("## 11. Contrôles de rédaction");
  p();
  p("### Tirets demi-cadratins et cadratins");
  p();
  const dashRows = [];
  for (const [k, pg] of pages) {
    const seen = new Set();
    for (const d of pg.dashes) {
      const id = `${d.where}\n${d.context}`;
      if (seen.has(id)) continue;
      seen.add(id);
      dashRows.push([k, d.where, d.char, d.context]);
    }
  }
  p(mdTable(["Page", "Emplacement", "Caractère", "Contexte"], dashRows));
  p("### Tournures à éviter");
  p();
  p(mdTable(["Page", "Tournure", "Contexte"], [...pages].flatMap(([k, pg]) => pg.phrases.map((x) => [k, x.phrase, x.context]))));

  const md = L.join("\n").replace(/\u2013/g, "[U+2013]").replace(/\u2014/g, "[U+2014]");
  process.stdout.write(`${md}\n`);

  if (opts.json) {
    const out = {
      generatedAt: startedAt.toISOString(),
      base,
      siteOrigin,
      userAgent: ua,
      robots: { status: robotsRes.status, text: robotsTxt, ...robots },
      sitemaps: sitemapSources,
      sitemapEntries,
      entries: [...entries.values()].map((e) => ({ key: e.key, sources: [...e.sources], chain: e.chain })),
      pages: Object.fromEntries([...pages].map(([k, pg]) => [k, { ...pg, depth: depth.get(k) ?? null, inbound: inbound.has(k) ? { nav: [...inbound.get(k).nav], content: [...inbound.get(k).content], count: inbound.get(k).count, anchors: [...inbound.get(k).anchors] } : null, indexability: indexability(k), canonicalStatus: canonicalStatus(k) }])),
      errorPages: Object.fromEntries(errorPages),
      broken: [...broken.values()].map((b) => ({ ...b, sources: [...b.sources], texts: [...b.texts] })),
      toRedirect: [...toRedirect.values()].map((t) => ({ ...t, sources: [...t.sources] })),
      fragments: fragments.map((f) => ({ ...f, sources: [...f.sources], texts: [...f.texts] })),
      orphans,
      navOnly,
      notInSitemap,
      variants,
      wwwChecks,
      comparisons,
      weights,
      nap: Object.fromEntries(Object.entries(napAll).map(([k, m]) => [k, Object.fromEntries([...m].map(([norm, g]) => [norm, Object.fromEntries([...g].map(([d, w]) => [d, [...w]]))]))])),
      alerts,
    };
    await writeFile(opts.json, `${JSON.stringify(out, null, 2)}\n`);
  }

  if (opts.strict && counts.Erreur > 0) process.exit(1);
}

main().catch((err) => {
  process.stderr.write(`${err.stack || err}\n`);
  process.exit(2);
});
