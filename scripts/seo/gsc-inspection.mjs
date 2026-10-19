#!/usr/bin/env node
/**
 * gsc-inspection.mjs
 *
 * Suivi d'indexation de lea-numerique.fr avec l'API Search Console « URL Inspection ».
 * Lecture seule : le script consulte l'état d'indexation, il ne demande jamais
 * l'indexation (l'API ne le permet pas pour des pages classiques ; la demande se fait
 * à la main dans l'outil d'inspection d'URL, voir docs/seo/suivi-indexation.md).
 *
 * Node 22 (20 minimum), aucune dépendance : fetch et crypto natifs.
 *
 * Ce que fait le script
 *   1. lit la clé du compte de service (fichier JSON passé avec --key) ;
 *   2. signe un JWT RS256 et l'échange contre un jeton OAuth (scope webmasters.readonly) ;
 *   3. appelle urlInspection.index.inspect pour chaque URL (par défaut, celles du sitemap) ;
 *   4. affiche un tableau Markdown (URL, verdict, coverageState, lastCrawlTime,
 *      googleCanonical) à coller dans docs/seo/suivi-indexation.md.
 *
 * MISE EN PLACE (une seule fois, environ 20 minutes)
 *   1. Ouvrir https://console.cloud.google.com avec le compte Google de l'entreprise
 *      et créer un projet, par exemple « lea-numerique-seo ».
 *   2. API et services > Bibliothèque : activer « Google Search Console API ».
 *   3. IAM et administration > Comptes de service > Créer un compte de service,
 *      par exemple « gsc-inspection ». Aucun rôle n'est nécessaire dans le projet.
 *   4. Ouvrir le compte de service > onglet Clés > Ajouter une clé > Créer une clé > JSON.
 *      Le fichier téléchargé est un secret : le ranger HORS du dépôt, par exemple
 *        mkdir -p ~/.config/lea-numerique && mv ~/Téléchargements/<fichier>.json \
 *          ~/.config/lea-numerique/gsc-inspection.json && chmod 600 ~/.config/lea-numerique/gsc-inspection.json
 *      Si la création de clé est refusée, une règle d'organisation Google Cloud
 *      (iam.managed.disableServiceAccountKeyCreation, active par défaut sur les
 *      organisations créées depuis le 3 mai 2024) la bloque : un administrateur de
 *      l'organisation doit l'assouplir pour ce projet.
 *   5. Search Console > Paramètres > Utilisateurs et autorisations > Ajouter un utilisateur :
 *      saisir l'adresse du compte de service (xxx@<projet>.iam.gserviceaccount.com)
 *      avec l'autorisation la plus basse (accès limité). Si l'API répond 403 alors que
 *      --site est correct, passer cet utilisateur en accès complet.
 *   6. Vérifier le type de propriété dans Search Console (sélecteur en haut à gauche) :
 *      propriété de domaine  -> --site sc-domain:lea-numerique.fr (valeur par défaut)
 *      préfixe d'URL         -> --site https://lea-numerique.fr/
 *
 * UTILISATION
 *   node scripts/seo/gsc-inspection.mjs --key ~/.config/lea-numerique/gsc-inspection.json
 *   node scripts/seo/gsc-inspection.mjs --key <cle.json> --urls /services,/solutions
 *   node scripts/seo/gsc-inspection.mjs --key <cle.json> --site https://lea-numerique.fr/
 *   node scripts/seo/gsc-inspection.mjs --dry-run --urls /services
 *   node scripts/seo/gsc-inspection.mjs --key <cle.json> > inspection-J7.md
 *
 * Aucun secret dans le dépôt : la clé est passée en argument et reste hors du dépôt.
 * Quota de l'API : 2 000 inspections par jour et 600 par minute pour une même propriété.
 */

import { readFile, stat } from "node:fs/promises";
import { createPrivateKey, createPublicKey, sign, verify } from "node:crypto";
import { parseArgs } from "node:util";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const TOKEN_URL = "https://oauth2.googleapis.com/token";
export const INSPECT_URL = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";
export const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
export const DEFAULT_SITE = "sc-domain:lea-numerique.fr";
const DAILY_QUOTA = 2000;
const FETCH_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 2;

const HELP = `Inspection d'URL Search Console (lecture seule)

Usage : node scripts/seo/gsc-inspection.mjs --key <cle.json> [options]

Options
  --key <chemin>      Fichier JSON du compte de service (obligatoire, sauf avec --dry-run).
                      Ce fichier est un secret : il doit rester hors du dépôt.
  --site <propriété>  Propriété Search Console : sc-domain:lea-numerique.fr (défaut)
                      ou https://lea-numerique.fr/ (préfixe d'URL, avec le / final).
  --urls <a,b,c>      URL à inspecter, séparées par des virgules. Les chemins (/services)
                      sont complétés avec le domaine. Par défaut : les URL du sitemap.
  --sitemap <source>  Sitemap à lire si --urls est absent : URL ou fichier local.
                      Défaut : https://<domaine>/sitemap.xml
  --lang <code>       Langue des messages renvoyés par l'API (défaut : fr-FR).
  --dry-run           Affiche les requêtes sans les envoyer. Avec --key, le JWT est signé
                      et sa signature vérifiée localement, sans appel réseau à Google.
  -h, --help          Affiche cette aide.

Le tableau Markdown est écrit sur la sortie standard, la progression sur la sortie d'erreur :
  node scripts/seo/gsc-inspection.mjs --key ~/.config/lea-numerique/gsc-inspection.json > inspection.md`;

class CliError extends Error {
  constructor(message, exitCode = 1) {
    super(message);
    this.exitCode = exitCode;
  }
}

const log = (message) => process.stderr.write(`${message}\n`);
const out = (text = "") => process.stdout.write(`${text}\n`);

// ---------------------------------------------------------------------------
// JWT RS256 (RFC 7515 / 7519) pour le flux « compte de service » de Google
// ---------------------------------------------------------------------------

export function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

/**
 * Construit et signe l'assertion JWT demandée par https://oauth2.googleapis.com/token.
 * En-tête : alg RS256, typ JWT, kid (identifiant de la clé, facultatif).
 * Revendications : iss (adresse du compte de service), scope, aud (point de terminaison
 * du jeton), iat et exp (durée de vie maximale : 1 heure).
 */
export function buildJwt(serviceAccount, { now = Math.floor(Date.now() / 1000), scope = SCOPE } = {}) {
  const privateKey = createPrivateKey(serviceAccount.private_key);
  if (privateKey.asymmetricKeyType !== "rsa") {
    throw new CliError("La clé privée du compte de service doit être une clé RSA.");
  }
  const header = { alg: "RS256", typ: "JWT" };
  if (serviceAccount.private_key_id) header.kid = serviceAccount.private_key_id;
  const claims = {
    iss: serviceAccount.client_email,
    scope,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };
  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`;
  // RSASSA-PKCS1-v1_5 avec SHA-256 : c'est l'algorithme RS256.
  const signature = sign("sha256", Buffer.from(signingInput), privateKey);
  return { jwt: `${signingInput}.${signature.toString("base64url")}`, header, claims };
}

/** Vérifie la signature d'un JWT RS256 avec la clé publique dérivée de la clé privée. */
export function verifyJwtSignature(jwt, privateKeyPem) {
  const [encodedHeader, encodedClaims, encodedSignature] = jwt.split(".");
  if (!encodedHeader || !encodedClaims || !encodedSignature) return false;
  const publicKey = createPublicKey(createPrivateKey(privateKeyPem));
  return verify(
    "sha256",
    Buffer.from(`${encodedHeader}.${encodedClaims}`),
    publicKey,
    Buffer.from(encodedSignature, "base64url"),
  );
}

// ---------------------------------------------------------------------------
// Lecture et contrôle des entrées
// ---------------------------------------------------------------------------

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

export async function loadServiceAccount(keyPath) {
  const resolved = path.resolve(keyPath.replace(/^~(?=$|\/)/, process.env.HOME ?? "~"));
  let raw;
  try {
    raw = await readFile(resolved, "utf8");
  } catch (error) {
    throw new CliError(`Impossible de lire le fichier de clé ${resolved} (${error.code ?? error.message}).`);
  }

  // Garde-fous : la clé ne doit pas se trouver dans le dépôt ni être lisible par tous.
  if (resolved === repoRoot || resolved.startsWith(repoRoot + path.sep)) {
    log(`ATTENTION : le fichier de clé est dans le dépôt (${resolved}).`);
    log("Déplacez-le hors du dépôt (par exemple ~/.config/lea-numerique/) et ne le commitez jamais.");
  }
  if (process.platform !== "win32") {
    try {
      const { mode } = await stat(resolved);
      if (mode & 0o077) {
        log(`Conseil : restreignez les droits du fichier de clé avec  chmod 600 "${resolved}"`);
      }
    } catch {
      // Sans incidence sur la suite.
    }
  }

  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new CliError(`Le fichier ${resolved} n'est pas un JSON valide.`);
  }
  if (json.type !== "service_account") {
    throw new CliError(`Le fichier ${resolved} n'est pas une clé de compte de service (champ "type" attendu : "service_account").`);
  }
  for (const field of ["client_email", "private_key"]) {
    if (typeof json[field] !== "string" || !json[field]) {
      throw new CliError(`Champ "${field}" manquant dans ${resolved}.`);
    }
  }
  return json;
}

/** Normalise --site et renvoie la propriété, l'origine et une fonction d'appartenance. */
export function resolveSite(value) {
  const site = String(value ?? "").trim();
  if (site.startsWith("sc-domain:")) {
    const domain = site.slice("sc-domain:".length).trim().toLowerCase();
    if (!domain || /[/:\s]/.test(domain)) {
      throw new CliError(`Propriété de domaine invalide : "${site}". Exemple : sc-domain:lea-numerique.fr`);
    }
    return {
      siteUrl: `sc-domain:${domain}`,
      origin: `https://${domain}`,
      contains: (url) => {
        const host = new URL(url).hostname.toLowerCase();
        return host === domain || host.endsWith(`.${domain}`);
      },
    };
  }
  let parsed;
  try {
    parsed = new URL(site);
  } catch {
    throw new CliError(
      `Propriété invalide : "${site}". Indiquez sc-domain:lea-numerique.fr (propriété de domaine) ou https://lea-numerique.fr/ (préfixe d'URL).`,
    );
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new CliError(`Propriété invalide : "${site}" (http:// ou https:// attendu).`);
  }
  parsed.search = "";
  parsed.hash = "";
  let prefix = parsed.href;
  if (!prefix.endsWith("/")) {
    prefix += "/";
    log(`Note : une propriété « préfixe d'URL » se termine par un /, utilisation de ${prefix}`);
  }
  return { siteUrl: prefix, origin: parsed.origin, contains: (url) => url.startsWith(prefix) };
}

/** Transforme la liste --urls (chemins ou URL absolues) en URL absolues sans doublon. */
export function resolveUrls(values, origin) {
  const urls = [];
  for (const value of values) {
    for (const item of value.split(",")) {
      const trimmed = item.trim();
      if (!trimmed) continue;
      let absolute;
      try {
        absolute = new URL(trimmed, `${origin}/`).href;
      } catch {
        throw new CliError(`URL invalide dans --urls : "${trimmed}".`);
      }
      if (!urls.includes(absolute)) urls.push(absolute);
    }
  }
  return urls;
}

const XML_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

/** Extrait les balises <loc> d'un sitemap (ou d'un index de sitemaps). */
export function parseSitemap(xml) {
  const locs = [...xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?\s*([^<\]]+?)\s*(?:\]\]>)?\s*<\/loc>/gi)].map((match) =>
    match[1].replace(/&(amp|lt|gt|quot|apos);/g, (_, entity) => XML_ENTITIES[entity]),
  );
  return { isIndex: /<sitemapindex[\s>]/i.test(xml), locs };
}

async function readSource(source) {
  if (/^https?:\/\//i.test(source)) {
    const response = await fetchWithRetry(source, { headers: { Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8" } });
    if (!response.ok) throw new CliError(`Sitemap inaccessible : ${source} (HTTP ${response.status}). Utilisez --urls.`);
    return response.text();
  }
  try {
    return await readFile(path.resolve(source), "utf8");
  } catch (error) {
    throw new CliError(`Impossible de lire le sitemap ${source} (${error.code ?? error.message}).`);
  }
}

/** Forme normalisée d'une URL (https://lea-numerique.fr devient https://lea-numerique.fr/). */
function normalizeUrl(value) {
  try {
    return new URL(value).href;
  } catch {
    log(`URL ignorée (invalide) dans le sitemap : ${value}`);
    return null;
  }
}

export async function urlsFromSitemap(source) {
  const { isIndex, locs } = parseSitemap(await readSource(source));
  // Index de sitemaps : on lit chaque sitemap enfant (un seul niveau).
  const pages = isIndex ? [] : locs;
  if (isIndex) {
    for (const child of locs.slice(0, 20)) pages.push(...parseSitemap(await readSource(child)).locs);
  }
  const urls = [];
  for (const url of pages.map(normalizeUrl)) {
    if (url && !urls.includes(url)) urls.push(url);
  }
  return urls;
}

// ---------------------------------------------------------------------------
// Appels HTTP
// ---------------------------------------------------------------------------

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** fetch avec délai maximal et nouvelles tentatives sur 429 et 5xx (Retry-After respecté). */
export async function fetchWithRetry(url, init = {}) {
  for (let attempt = 0; ; attempt += 1) {
    let response;
    try {
      response = await fetch(url, { ...init, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    } catch (error) {
      if (attempt >= MAX_RETRIES) throw new CliError(`Échec réseau vers ${new URL(url).host} : ${error.message}`);
      await sleep(1000 * 2 ** attempt);
      continue;
    }
    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt >= MAX_RETRIES) return response;
    const retryAfter = Number(response.headers.get("retry-after"));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter, 60) * 1000 : 2000 * 2 ** attempt;
    log(`HTTP ${response.status} : nouvelle tentative dans ${Math.round(waitMs / 1000)} s`);
    await sleep(waitMs);
  }
}

export async function getAccessToken(serviceAccount) {
  const { jwt } = buildJwt(serviceAccount);
  const response = await fetchWithRetry(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }).toString(),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || typeof data.access_token !== "string") {
    const detail = data.error_description || data.error || response.statusText || "réponse inattendue";
    let hint = "";
    if (/signature/i.test(detail)) hint = " La clé a peut-être été supprimée ou régénérée : téléchargez une nouvelle clé JSON.";
    if (/iat|exp|timeframe/i.test(detail)) hint = " Vérifiez l'heure de votre ordinateur (synchronisation automatique).";
    throw new CliError(`Échec de l'obtention du jeton OAuth (HTTP ${response.status}) : ${detail}.${hint}`, 2);
  }
  return data.access_token;
}

function hintForStatus(status) {
  switch (status) {
    case 400:
      return "requête refusée : l'URL doit appartenir à la propriété indiquée par --site";
    case 401:
      return "jeton refusé : relancez le script";
    case 403:
      return "accès refusé : compte de service absent des utilisateurs Search Console, mauvais type de propriété (--site) ou API Search Console non activée dans le projet Google Cloud";
    case 429:
      return "quota atteint (2 000 inspections par jour et 600 par minute pour la propriété) : réessayez plus tard";
    default:
      return status >= 500 ? "erreur temporaire côté Google : réessayez plus tard" : "";
  }
}

export async function inspectUrl({ url, siteUrl, token, languageCode }) {
  const response = await fetchWithRetry(INSPECT_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inspectionUrl: url, siteUrl, languageCode }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      url,
      error: { status: response.status, message: data?.error?.message || response.statusText || "", hint: hintForStatus(response.status) },
    };
  }
  return { url, result: data.inspectionResult ?? {} };
}

// ---------------------------------------------------------------------------
// Mise en forme Markdown
// ---------------------------------------------------------------------------

const VERDICT_LABELS = {
  PASS: "PASS (sur Google)",
  NEUTRAL: "NEUTRAL (exclue)",
  FAIL: "FAIL (erreur)",
  PARTIAL: "PARTIAL",
  VERDICT_UNSPECIFIED: "VERDICT_UNSPECIFIED (inconnu)",
};

const parisFormatter = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  dateStyle: "short",
  timeStyle: "short",
});

export function formatParisDate(value) {
  if (!value) return "jamais";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : parisFormatter.format(date);
}

const cell = (value) => String(value ?? "").replace(/\|/g, "\\|").replace(/\s*\n\s*/g, " ").trim();

export function formatRow({ url, result, error }) {
  if (error) {
    const detail = [error.message, error.hint].filter(Boolean).join(" ; ");
    return `| ${cell(url)} | ERREUR ${error.status ?? ""} | ${cell(detail)} | | |`;
  }
  const status = result?.indexStatusResult ?? {};
  const verdict = VERDICT_LABELS[status.verdict] ?? status.verdict ?? "";
  let canonical = "(aucune)";
  if (status.googleCanonical) canonical = status.googleCanonical === url ? "identique" : status.googleCanonical;
  return `| ${cell(url)} | ${cell(verdict)} | ${cell(status.coverageState ?? "")} | ${cell(formatParisDate(status.lastCrawlTime))} | ${cell(canonical)} |`;
}

export function renderMarkdown({ rows, siteUrl, date = new Date() }) {
  const lines = [
    `Inspection du ${parisFormatter.format(date)} (heure de Paris), propriété \`${siteUrl}\`, ${rows.length} URL.`,
    "",
    "| URL | Verdict | coverageState | Dernière exploration (Paris) | Canonique retenue par Google |",
    "|---|---|---|---|---|",
    ...rows.map(formatRow),
  ];
  const counts = {};
  for (const row of rows) {
    const key = row.error ? "ERREUR" : row.result?.indexStatusResult?.verdict ?? "inconnu";
    counts[key] = (counts[key] ?? 0) + 1;
  }
  lines.push("", `Synthèse : ${Object.entries(counts).map(([key, n]) => `${key} ${n}`).join(", ")}.`);
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Programme principal
// ---------------------------------------------------------------------------

function printDryRun({ serviceAccount, urls, siteUrl, languageCode, keyPath }) {
  out("[dry-run] Aucune requête n'est envoyée.");
  out("");
  out("1. Jeton OAuth");
  out(`POST ${TOKEN_URL}`);
  out("Content-Type: application/x-www-form-urlencoded");
  if (serviceAccount) {
    const { jwt, header, claims } = buildJwt(serviceAccount);
    const valid = verifyJwtSignature(jwt, serviceAccount.private_key);
    out(`grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=<JWT RS256, ${jwt.length} caractères, non affiché>`);
    out(`  en-tête JWT    : ${JSON.stringify(header)}`);
    out(`  revendications : ${JSON.stringify(claims)}`);
    out(
      valid
        ? "  signature      : vérifiée localement avec la clé publique dérivée de la clé privée (RS256)"
        : "  signature      : ÉCHEC de la vérification locale",
    );
    if (!valid) throw new CliError(`La signature du JWT ne se vérifie pas avec la clé ${keyPath}.`);
  } else {
    out("grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=<JWT signé avec la clé passée par --key>");
    out("  (--key absent : JWT non construit)");
  }
  out("");
  out(`2. Inspection de ${urls.length} URL`);
  out(`POST ${INSPECT_URL}`);
  out("Authorization: Bearer <jeton obtenu à l'étape 1>");
  out("Content-Type: application/json");
  for (const url of urls) out(JSON.stringify({ inspectionUrl: url, siteUrl, languageCode }));
}

export async function main(argv = process.argv.slice(2)) {
  const major = Number(process.versions.node.split(".")[0]);
  if (major < 20) throw new CliError(`Node ${process.versions.node} détecté : Node 20 minimum (Node 22 recommandé).`);

  let values;
  try {
    ({ values } = parseArgs({
      args: argv,
      options: {
        key: { type: "string" },
        site: { type: "string", default: DEFAULT_SITE },
        urls: { type: "string", multiple: true },
        sitemap: { type: "string" },
        lang: { type: "string", default: "fr-FR" },
        "dry-run": { type: "boolean", default: false },
        help: { type: "boolean", short: "h", default: false },
      },
      strict: true,
      allowPositionals: false,
    }));
  } catch (error) {
    throw new CliError(`${error.message}\n\n${HELP}`);
  }
  if (values.help) {
    out(HELP);
    return 0;
  }

  const dryRun = values["dry-run"];
  if (!values.key && !dryRun) throw new CliError(`--key est obligatoire (sauf avec --dry-run).\n\n${HELP}`);

  const { siteUrl, origin, contains } = resolveSite(values.site);
  const serviceAccount = values.key ? await loadServiceAccount(values.key) : null;

  let urls;
  if (values.urls?.length) {
    urls = resolveUrls(values.urls, origin);
  } else {
    const source = values.sitemap ?? `${origin}/sitemap.xml`;
    urls = await urlsFromSitemap(source);
    log(`Sitemap lu : ${source} (${urls.length} URL)`);
  }
  if (!urls.length) throw new CliError("Aucune URL à inspecter.");

  const outside = urls.filter((url) => !contains(url));
  if (outside.length) {
    throw new CliError(`Ces URL n'appartiennent pas à la propriété ${siteUrl} :\n  ${outside.join("\n  ")}`);
  }
  if (urls.length > DAILY_QUOTA) {
    throw new CliError(`${urls.length} URL : au-delà du quota de ${DAILY_QUOTA} inspections par jour pour une propriété.`);
  }

  if (dryRun) {
    printDryRun({ serviceAccount, urls, siteUrl, languageCode: values.lang, keyPath: values.key });
    return 0;
  }

  const token = await getAccessToken(serviceAccount);
  const rows = [];
  for (const [index, url] of urls.entries()) {
    log(`Inspection ${index + 1}/${urls.length} : ${url}`);
    rows.push(await inspectUrl({ url, siteUrl, token, languageCode: values.lang }));
  }
  out(renderMarkdown({ rows, siteUrl }));

  const failures = rows.filter((row) => row.error);
  if (failures.length) {
    log(`${failures.length} URL en erreur (voir la colonne Verdict).`);
    return 2;
  }
  return 0;
}

const isMain = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  // Sortie coupée par un tube (par exemple « | head ») : on s'arrête sans pile d'erreur.
  process.stdout.on("error", (error) => {
    if (error.code === "EPIPE") process.exit(0);
    throw error;
  });
  main().then(
    (code) => {
      process.exitCode = code;
    },
    (error) => {
      log(error instanceof CliError ? error.message : `Erreur inattendue : ${error.stack ?? error}`);
      process.exitCode = error instanceof CliError ? error.exitCode : 1;
    },
  );
}
