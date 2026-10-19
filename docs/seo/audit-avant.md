# Audit de référence avant refonte (phase 0)

- Date : 19/10/2026
- Version auditée : branche `main` au commit `c43b8b1` (code actuellement en production), servie en local par `next start` sur le port 3101.
- Périmètre : lecture seule, aucun fichier du site n'a été modifié.
- Outil livré avec cet audit : `scripts/seo/audit-local.mjs` (Node 22, sans dépendance), à relancer tel quel sur la nouvelle version du site pour comparer avant et après.

Dans ce document, [U+2013] désigne un tiret demi-cadratin et [U+2014] un tiret cadratin trouvés dans le code ou dans les pages : ces caractères ne sont pas reproduits. Les références « annexe §N » renvoient aux sections de la sortie complète du script (A.9).

## Méthode et limites

- Build : `npm ci --no-audit --no-fund` puis `npm run build`. Le premier build échoue dans le bac à sable : `next/font/google` télécharge la police Poppins depuis `fonts.googleapis.com`, bloqué par le proxy (403). Pour builder sans toucher au code, la variable `NEXT_FONT_GOOGLE_MOCKED_RESPONSES` (prise en charge par Next.js et Turbopack) pointe vers une réponse simulée qui reproduit la feuille de style de Google Fonts (4 graisses x 3 sous-ensembles). Les fichiers woff2 viennent du paquet npm `@fontsource/poppins` 5.3.0, tiré de Google Fonts, et sont servis par un petit serveur local (127.0.0.1:3190). Le HTML produit a la même structure qu'en production, seuls les noms des fichiers générés (polices, feuille de style) peuvent changer. En production, le serveur télécharge les vraies polices pendant son `npm run build`.
- Crawl et balises : `scripts/seo/audit-local.mjs` avec l'user-agent Googlebot smartphone. Les redirections ne sont jamais suivies par `fetch` (`redirect: "manual"`), chaque saut est enregistré. Le script a aussi été vérifié sur un faux site local contenant des défauts volontaires (chaîne de redirections, boucle, 302, lien cassé, `X-Robots-Tag: noindex`, JSON-LD invalide, fragment inexistant, page orpheline) : tous sont détectés.
- Rendu : Chromium 141 (Playwright 1.56.1, installé hors du dépôt dans `/home/claude/wt/audit-outils`), user-agent Googlebot smartphone, fenêtre 412 x 732. Le HTML initial est lu avec JavaScript désactivé, la page rendue avec JavaScript activé.
- Lighthouse 13.5.0, profil mobile par défaut (émulation 412 x 823, throttling simulé : RTT 150 ms, 1,6 Mbit/s, processeur ralenti 4 fois), 3 passages par page, médiane retenue sur la performance.
- Limites : ces mesures sont locales. Il n'y a ni Apache, ni TLS, ni latence ou compression réseau réelles ; les redirections http vers https et www vers le domaine nu, les en-têtes ajoutés par Apache, les scores Lighthouse et les Core Web Vitals réels ne peuvent être vérifiés qu'en production. Le test des résultats enrichis, le validateur Schema.org et la Search Console ne sont pas joignables depuis le bac à sable.

## Tableau des constats

| # | Point | Constat | Preuve | Verdict |
|---|---|---|---|---|
| C1 | Build et mode de rendu | Next.js 16.1.6 (Turbopack). 14 routes, toutes statiques (prérendues au build), aucune route dynamique. | A.1 | OK |
| C2 | Codes HTTP des pages | Les 7 pages du sitemap répondent 200 directement, sans redirection. | A.2, annexe §3 | OK |
| C3 | En-tête X-Robots-Tag | Absent sur toutes les URLs servies par Next.js. Apache pourrait en ajouter un : à vérifier en production. | A.2, annexe §3 | OK (en local) |
| C4 | Meta robots | `index, follow` sur les 7 pages, et pour Googlebot `index, follow, max-image-preview:large, max-snippet:-1`. | annexe §6 | OK |
| C5 | Anciennes URLs Shopify | `/pages/services`, `/collections/frontpage`, `/products/snom-d150`, `/pages/partenaires` : 404 directe (page « Page introuvable » en noindex), aucune redirection. | A.2, annexe §3 | À corriger (phase 1) |
| C6 | Page 404 | Vrai code 404, `Cache-Control: private, no-cache, no-store`, deux balises robots (`noindex` ajoutée par Next.js et `noindex, follow` de la page). Pas de soft 404 : `/solutions/inexistant` répond 404. | A.2 | OK |
| C7 | Futures URLs solutions | `/solutions/telephonie-ip`, `/solutions/reseaux-wifi`, `/solutions/materiel-informatique`, `/solutions/cybersecurite` répondent 404 (pages pas encore créées). | annexe §3 | Info |
| C8 | Barre oblique finale, paramètres | `/solutions/` : 308 vers `/solutions` en un saut. `/solutions?utm_source=audit` : 200 avec une canonical sans paramètre. | A.2, annexe §4 | OK |
| C9 | Filet de sécurité www (`next.config.ts`) | Avec `X-Forwarded-Host: www.lea-numerique.fr`, Next.js répond 308 (option `permanent: true`) vers `https://lea-numerique.fr/...` en un saut. Google traite 308 comme 301, mais le brief impose `statusCode: 301`. La redirection principale, faite par Apache, n'est pas testable en local. | A.2, annexe §4 | À corriger (faible) |
| C10 | Cache et compression | HTML prérendu servi avec `Cache-Control: s-maxage=31536000` (valeur par défaut de Next.js, sans `max-age`). Next.js compresse en gzip quand le client l'accepte. Le comportement réel dépend d'Apache et de l'absence de cache partagé devant le site. | A.2, annexe §9 | Info |
| C11 | robots.txt | `User-Agent: *`, `Allow: /`, `Sitemap: https://lea-numerique.fr/sitemap.xml`. Aucun blocage. | annexe §1 | OK |
| C12 | sitemap.xml | 7 URLs, toutes en 200, indexables, avec une canonical auto-référente. Aucune ancienne URL, aucune URL en redirection. | annexe §2 | OK |
| C13 | Dates lastmod | Même date (2026-10-08) pour les 7 URLs, codée en dur dans `src/app/sitemap.ts`. Balise `priority` présente (ignorée par Google). | annexe §2 | À corriger (phase 2.5) |
| C14 | Pages légales | `/mentions-legales` et `/politique-confidentialite` sont indexables, présentes dans le sitemap et liées uniquement depuis le footer. | annexe §7 | Info (décision de la phase 2.6) |
| C15 | Title | Uniques sur les 7 pages, de 32 à 59 caractères. | annexe §5 | OK |
| C16 | Meta description | Uniques, de 141 à 154 caractères. | annexe §5 | OK |
| C17 | Canonical | Absolue et auto-référente sur les 7 pages. Celle de l'accueil, `https://lea-numerique.fr` sans barre finale, est équivalente à la racine du sitemap. | annexe §6 | OK |
| C18 | lang et Open Graph | `lang="fr"`, `og:url` identique à la canonical, `og:image` 1200 x 630 servie en 200. | annexe §6 | OK |
| C19 | Titres H1 | Un seul H1 par page. Le texte brut (`textContent`) de 5 H1 et 3 H2 colle deux mots, par exemple « AngersTéléphonie » ou « ITà », parce que deux `span` ou un `<br>` se suivent sans espace. L'affichage navigateur (`innerText`) est correct. | A.3, annexe §6 | Info |
| C20 | Contenu dans le HTML initial | Sur les 7 pages, 100 % du texte de `<main>` obtenu après exécution du JavaScript est déjà présent dans le HTML servi à Googlebot smartphone. Title, description, canonical, robots, H1, liens et JSON-LD sont identiques avant et après rendu ; le HTML est identique à l'octet pour Googlebot et pour Chrome mobile ; aucune erreur console ni requête externe. | A.3, annexe §8 | OK |
| C21 | Sections masquées à l'accueil | `useScrollReveal` passe à `opacity: 0` les sections situées sous la fenêtre au chargement et attend un défilement. Le hero mesure `min-h-screen` (100vh) : dans une fenêtre agrandie à la hauteur de la page et sans défilement (situation proche du rendu de Googlebot), le hero s'agrandit aussi et 6 des 8 sections de l'accueil restent invisibles. Leur texte reste dans le DOM. | A.4 | À corriger (risque) |
| C22 | Volume de texte | Mots dans `<main>` (dont texte rédigé, en paragraphes d'au moins 12 mots) : accueil 970 (551), `/solutions` 488 (312), `/services` 345 (108), `/a-propos` 232 (126), `/contact` 189 (39). `/services` est surtout fait de listes ; le plan vise 500 à 800 mots utiles. | annexe §5 et §6 | À corriger (phases 2.2 et 2.3) |
| C23 | Architecture de `/solutions` | Les 4 domaines (téléphonie, réseaux, informatique, cybersécurité) partagent une seule URL, en sections ancrées (`id="telephonie"`, `id="reseaux"`, `id="informatique"`, `id="cybersecurite"`). | annexe §6 | À corriger (phase 2.1) |
| C24 | Liens cassés et redirections internes | 0 lien interne cassé, 0 lien vers une URL en redirection, 0 lien vers les anciennes URLs (crawl et recherche dans le code source). | annexe §7 | OK |
| C25 | Liens à fragment | 8 cibles : `/solutions#telephonie`, `#reseaux`, `#informatique`, `#cybersecurite` et `/services#conseil`, `#installation`, `#maintenance`, `#securite`. Elles figurent dans le footer des 7 pages et dans le contenu de l'accueil, de `/services` et de `/a-propos` ; tous les id existent. Les 4 fragments de `/solutions` doivent sortir du maillage (brief) ; ceux de `/services` sont conservés par l'architecture cible. | annexe §7 | À corriger (phase 2.4) |
| C26 | Profondeur et orphelines | Toutes les pages sont à 1 clic de l'accueil. Aucune page orpheline, aucune page indexable absente du sitemap. | annexe §7 | OK |
| C27 | Liens entrants contextuels | Pages sources avec un lien dans `<main>` : `/contact` 4, `/solutions` 3, `/services` 3, `/a-propos` 1 (l'accueil seulement), pages légales 0. Le plan vise au moins 3 liens depuis des pages différentes pour chaque page importante. | annexe §7 | À corriger (`/a-propos`, phase 2.4) |
| C28 | Navigation mobile | Le menu mobile n'est créé qu'à l'ouverture, mais la navigation du header (masquée en CSS sous 768 px) et le footer sont dans le HTML : Googlebot smartphone voit tous les liens. | A.3 | OK |
| C29 | Images | Aucune image sans attribut alt. Alt vide uniquement pour la mascotte décorative et les doublons du défilé de logos partenaires (masqués aux lecteurs d'écran). | annexe §6 | OK |
| C30 | Lighthouse mobile (local) | Médianes performance / accessibilité / bonnes pratiques / SEO : accueil 89 / 96 / 100 / 100, `/solutions` 98 / 96 / 100 / 100, `/services` 98 / 96 / 100 / 100. Accueil : LCP 2,9 s, TBT 310 ms. | A.5 | Info (mesure locale) |
| C31 | Contraste des couleurs | Seul audit d'accessibilité en échec, sur les 3 pages : texte blanc sur `#7C6EFA` (3,84:1), textes `text-white/40` (3,81:1), numéros `text-white/20` et `text-white/15` (1,79:1 et 1,5:1), entre autres. | A.5 | À corriger (accessibilité) |
| C32 | Poids du JavaScript | 9 à 10 fichiers JS par page, de 567 à 591 ko bruts (173 à 181 ko en gzip). 6 sections de l'accueil sont des composants client uniquement pour l'animation d'apparition. | annexe §9 | Info |
| C33 | NAP : valeurs | Une seule valeur de téléphone, d'e-mail, d'adresse et d'horaires sur tout le site comme dans le JSON-LD. | A.6, annexe §10 | OK |
| C34 | NAP : formats et code | Valeurs codées en dur hors de `src/lib/site.ts` dans 12 fichiers (11 du site et le gabarit EmailJS de réponse automatique). Formats divergents : ville en majuscules (« 49100 ANGERS ») dans les mentions légales, horaires écrits de 3 façons dont 2 avec tiret demi-cadratin. | A.6 | À corriger |
| C35 | JSON-LD : syntaxe et cohérence | Un bloc par page, identique sur les 7 pages, placé dans `<body>` ; JSON valide ; `@graph` ProfessionalService et WebSite reliés par `@id`. Téléphone, e-mail, adresse et horaires identiques au contenu visible. | A.7 | OK |
| C36 | JSON-LD : manques (phase 3) | Pas d'`openingHoursSpecification` sur l'entreprise (horaires seulement dans `contactPoint.hoursAvailable`), pas de `sameAs`, pas de `geo`, `areaServed` sans Pays de la Loire, pas de BreadcrumbList ni de FAQPage (7 questions affichées à l'accueil). `logo` pointe vers la mascotte ; le `logo.png` proposé par le plan (600 x 71) est sous le minimum de 112 px demandé par Google. | A.7 | À corriger (phase 3) |
| C37 | Mentions légales | Ni SIREN ou RCS, ni capital, ni numéro de TVA, ni directeur de la publication ; hébergeur « disponible sur demande ». | `src/app/mentions-legales/page.tsx` | À corriger (données du propriétaire, phase 4) |
| C38 | Règles de rédaction | Tirets demi-cadratins ou cadratins visibles : alt du logo (7 pages), horaires (accueil, contact), « professions libérales [U+2014] nos solutions » (accueil), « tests [U+2014] vous n'avez qu'à utiliser » (`/services`). Aussi dans le nom du manifeste et dans l'alt exporté par `opengraph-image.tsx`. Tournure « Que vous souhaitiez moderniser [...] » dans le bloc contact de l'accueil. | annexe §11, A.6 | À corriger (réécriture) |
| C39 | Outillage du dépôt | `npm run lint` appelle `next lint`, supprimé de Next.js 16 ; `npx eslint` plante (`eslint.config.mjs` incompatible avec eslint-config-next 16). Code mort : `Team.tsx`, `Timeline.tsx` et la dépendance `react-vertical-timeline-component`. Chaque `next build` réécrit `next-env.d.ts`. | A.1 | Info |
| C40 | Validations externes | Test des résultats enrichis, validateur Schema.org, Search Console et Lighthouse sur le vrai domaine : à faire en production. | | Info |

## Preuves

### A.1 Build

Sortie de `npm run build` (avec la réponse simulée de Google Fonts) :

```text
▲ Next.js 16.1.6 (Turbopack)

  Creating an optimized production build ...
✓ Compiled successfully in 6.6s
  Running TypeScript ...
  Collecting page data using 1 worker ...
✓ Generating static pages using 1 worker (16/16) in 874.8ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /a-propos
├ ○ /apple-icon.png
├ ○ /contact
├ ○ /icon.png
├ ○ /manifest.webmanifest
├ ○ /mentions-legales
├ ○ /opengraph-image
├ ○ /politique-confidentialite
├ ○ /robots.txt
├ ○ /services
├ ○ /sitemap.xml
└ ○ /solutions

○  (Static)  prerendered as static content
```

Sans la réponse simulée, le build s'arrête sur `Failed to fetch 'Poppins' from Google Fonts` (`fonts.googleapis.com` refusé par le proxy). Next.js 16 n'affiche plus de colonne de tailles : les tailles mesurées par le script sont ci-dessous (annexe §9).

| Page | HTML brut | HTML gzip | JS (fichiers) | JS brut | JS gzip | CSS brut | CSS gzip |
|---|---|---|---|---|---|---|---|
| / | 124,0 ko | 18,4 ko | 10 | 590,9 ko | 180,6 ko | 60,3 ko | 10,4 ko |
| /solutions | 87,1 ko | 13,4 ko | 9 | 566,8 ko | 173,3 ko | 60,3 ko | 10,4 ko |
| /services | 119,4 ko | 15,7 ko | 9 | 566,8 ko | 173,3 ko | 60,3 ko | 10,4 ko |
| /contact | 55,5 ko | 9,7 ko | 10 | 575,2 ko | 176,6 ko | 60,3 ko | 10,4 ko |
| /a-propos | 64,7 ko | 11,6 ko | 9 | 566,8 ko | 173,3 ko | 60,3 ko | 10,4 ko |
| /mentions-legales | 34,7 ko | 7,0 ko | 9 | 566,8 ko | 173,3 ko | 60,3 ko | 10,4 ko |
| /politique-confidentialite | 35,7 ko | 7,1 ko | 9 | 566,8 ko | 173,3 ko | 60,3 ko | 10,4 ko |

Outillage : `npm run lint` répond « Invalid project directory provided, no such directory: .../lint » (la commande `next lint` n'existe plus) et `npx eslint` s'arrête sur « TypeError: Converting circular structure to JSON » dans `@eslint/eslintrc`. Le build remplace dans `next-env.d.ts` la ligne `import "./.next/dev/types/routes.d.ts";` par `import "./.next/types/routes.d.ts";` : ce fichier a été restauré avant le commit.

### A.2 Codes HTTP et en-têtes

En-têtes bruts (lignes `Date`, `Connection`, `Keep-Alive`, `ETag` et `x-next-cache-tags` retirées) :

```text
$ curl -sS -o /dev/null -D - http://localhost:3101/
HTTP/1.1 200 OK
Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding
x-nextjs-cache: HIT
x-nextjs-prerender: 1
x-nextjs-prerender: 1
x-nextjs-stale-time: 300
Cache-Control: s-maxage=31536000
Content-Type: text/html; charset=utf-8
Content-Length: 126983

$ curl -sS -o /dev/null -D - http://localhost:3101/services
HTTP/1.1 200 OK
Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding
x-nextjs-cache: HIT
x-nextjs-prerender: 1
x-nextjs-prerender: 1
x-nextjs-stale-time: 300
Cache-Control: s-maxage=31536000
Content-Type: text/html; charset=utf-8
Content-Length: 122286

$ curl -sS -o /dev/null -D - http://localhost:3101/pages/services
HTTP/1.1 404 Not Found
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding
x-nextjs-cache: HIT
x-nextjs-prerender: 1
x-nextjs-prerender: 1
x-nextjs-stale-time: 300
Content-Type: text/html; charset=utf-8
Content-Length: 33028

$ curl -sS -o /dev/null -D - http://localhost:3101/solutions/
HTTP/1.1 308 Permanent Redirect
location: /solutions
Refresh: 0;url=/solutions
Transfer-Encoding: chunked

$ curl -sS -o /dev/null -D - -H "X-Forwarded-Host: www.lea-numerique.fr" http://localhost:3101/services
HTTP/1.1 308 Permanent Redirect
location: https://lea-numerique.fr/services
Refresh: 0;url=https://lea-numerique.fr/services
Transfer-Encoding: chunked
```

Synthèse par URL (annexe §3 pour le détail) :

| URL | Statut | Location | Sauts | X-Robots-Tag | Cache-Control |
|---|---|---|---|---|---|
| /, /solutions, /services, /contact, /a-propos, /mentions-legales, /politique-confidentialite | 200 | aucune | 0 | aucun | s-maxage=31536000 |
| /pages/services, /collections/frontpage, /products/snom-d150, /pages/partenaires | 404 | aucune | 0 | aucun | private, no-cache, no-store, max-age=0, must-revalidate |
| /solutions/telephonie-ip, /solutions/reseaux-wifi, /solutions/materiel-informatique, /solutions/cybersecurite, /solutions/inexistant | 404 | aucune | 0 | aucun | private, no-cache, no-store, max-age=0, must-revalidate |
| /solutions/ | 308 | /solutions | 1 | aucun | |
| / et /solutions avec `X-Forwarded-Host: www.lea-numerique.fr` | 308 | https://lea-numerique.fr et https://lea-numerique.fr/solutions | 1 | aucun | |

La page 404 contient `<meta name="robots" content="noindex"/>` puis `<meta name="robots" content="noindex, follow"/>`, et le title « Page introuvable | Léa Numérique ».

### A.3 HTML initial et rendu Googlebot

Chromium, user-agent Googlebot smartphone, fenêtre 412 x 732. « HTML initial » = page chargée avec JavaScript désactivé ; « rendu » = page chargée avec JavaScript, après inactivité du réseau.

| Page | Mots `<main>` HTML initial | Mots `<main>` après rendu | Part du texte rendu déjà dans le HTML initial | Title, description, canonical, robots, H1 identiques | Liens (initial / rendu) | JSON-LD (initial / rendu) | Erreurs console | Requêtes externes |
|---|---|---|---|---|---|---|---|---|
| / | 970 | 970 | 100 % | oui | 43 / 43 | 1 / 1 | 0 | aucune |
| /solutions | 488 | 488 | 100 % | oui | 33 / 33 | 1 / 1 | 0 | aucune |
| /services | 345 | 345 | 100 % | oui | 33 / 33 | 1 / 1 | 0 | aucune |
| /contact | 189 | 189 | 100 % | oui | 26 / 26 | 1 / 1 | 0 | aucune |
| /a-propos | 236 | 236 | 100 % | oui | 31 / 31 | 1 / 1 | 0 | aucune |
| /mentions-legales | 125 | 125 | 100 % | oui | 24 / 24 | 1 / 1 | 0 | aucune |
| /politique-confidentialite | 158 | 158 | 100 % | oui | 26 / 26 | 1 / 1 | 0 | aucune |

Le script d'audit, sans navigateur, confirme : HTML identique à l'octet pour les user-agents Googlebot et Chrome mobile, aucun marqueur de rendu client forcé (`BAILOUT_TO_CLIENT_SIDE_RENDERING`), métadonnées toutes dans le `<head>` (annexe §5 et §8). L'écart de 4 mots sur `/a-propos` (232 pour le script et pour `innerText`, 236 ici) vient des numéros « 01 » à « 04 » des cartes de valeurs : React les produit en deux nœuds texte (« 0 » et « 1 »), que cette mesure compte comme deux mots.

Titres H1, affichage et texte brut :

| Page | `innerText` (affichage) | `textContent` (texte brut) |
|---|---|---|
| / | Votre partenaire IT à Angers Téléphonie IP, réseau, informatique et cybersécurité | Votre partenaire IT à AngersTéléphonie IP, réseau, informatique et cybersécurité |
| /solutions | Nos solutions IT à Angers et en Anjou | Nos solutions ITà Angers et en Anjou |
| /services | Nos services IT à Angers et en Anjou | Nos services ITà Angers et en Anjou |
| /contact | Parlons de votre projet IT à Angers | Parlons de votreprojet IT à Angers |
| /a-propos | Une agence IT de proximité à Angers | Une agence ITde proximité à Angers |

Même phénomène sur 3 H2 : « Comment se déroulevotre projet IT ? » (`/services`), « Ce qui se passeaprès votre message » (`/contact`), « Quatre valeurs,une seule mission » (`/a-propos`).

### A.4 Sections masquées à l'accueil

`src/hooks/useScrollReveal.ts` (utilisé par About, ServiceCards, Features, Process, Clients et ContactCTA) ne masque pas un bloc déjà visible au chargement, mais passe les autres à `opacity: 0` et ne les révèle qu'à leur entrée dans la fenêtre. `src/components/sections/Hero.tsx` porte la classe `min-h-screen`. Googlebot ne fait pas défiler la page ; pour déclencher le contenu chargé au défilement, son moteur de rendu utilise une fenêtre très haute (comportement décrit par Google, dont les dimensions exactes ne sont pas publiées). Simulation dans Chromium (position du haut de chaque section en px, opacité calculée) :

```text
Fenêtre 412 x 732 puis agrandie à 412 x 12691 (hauteur de la page), sans défilement :
  hero                                   top 0      opacity 1
  Un intégrateur IT angevin...           top 12723  opacity 0
  Téléphonie, réseau, informatique...    top 13860  opacity 0
  Pourquoi choisir un prestataire...     top 16382  opacity 0
  Votre projet IT en 4 étapes            top 18151  opacity 0
  Collectivités, santé, PME...           top 19417  opacity 0
  Votre prestataire IT à Angers...       top 20275  opacity 1   (ServiceArea, sans animation)
  Un projet IT en Anjou ? Parlons-en.    top 22210  opacity 0

Fenêtre 412 x 12000 dès le chargement : même résultat (le hero mesure 12000 px).
Utilisateur qui fait défiler une fenêtre 412 x 732 : les sections passent à opacity 1 au fil du défilement.
```

Le hero occupe toute la hauteur de la fenêtre agrandie, si bien qu'aucune section animée n'entre jamais dans la fenêtre. Leur texte reste présent dans le DOM (C20), mais il est invisible dans ce rendu, et rien ne garantit que Google lui accorde le même poids qu'à un texte visible. À contrôler en production avec l'outil d'inspection d'URL de la Search Console (« Tester l'URL en direct », capture et HTML rendu : présence de `style="opacity: 0; ..."` sur les sections). Les autres pages n'utilisent pas ce hook.

### A.5 Lighthouse mobile

Lighthouse 13.5.0, Chromium 141.0.7390.37 sans interface (`--headless=new --no-sandbox`), profil mobile, throttling simulé. Ces mesures locales ne reflètent pas la production : pas d'Apache, pas de TLS, pas de latence ni de compression réseau réelles, serveur sur la même machine.

| Page | Performance (3 passages) | Performance (médiane) | Accessibilité | Bonnes pratiques | SEO | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|---|---|---|---|
| / | 89, 91, 84 | 89 | 96 | 100 | 100 | 1,0 s | 2,9 s | 310 ms | 0 | 1,3 s |
| /solutions | 99, 96, 98 | 98 | 96 | 100 | 100 | 0,8 s | 1,8 s | 130 ms | 0 | 0,8 s |
| /services | 91, 98, 98 | 98 | 96 | 100 | 100 | 0,9 s | 2,0 s | 130 ms | 0 | 0,9 s |

- Élément LCP : le paragraphe d'introduction du hero sur les 3 pages ; l'essentiel du délai vient du rendu (temps de réponse du serveur : 13 à 16 ms).
- Accueil : 10 tâches longues, dont une de 286 ms dans un fichier JavaScript du bundle ; travail du thread principal 2,4 s ; poids total de la page 320 Kio.
- SEO : tous les audits passent (is-crawlable, document-title, meta-description, http-status-code, link-text, crawlable-anchors, robots-txt, image-alt, hreflang, canonical).
- Bonnes pratiques : tous les audits passent (le contrôle HTTPS ne s'applique pas à localhost).
- Accessibilité : seul `color-contrast` échoue.

| Page | Élément | Couleurs | Ratio mesuré | Attendu |
|---|---|---|---|---|
| Les 3 | Boutons « Demander un devis gratuit », « Prendre contact » | blanc sur `#7C6EFA` | 3,84:1 | 4,5:1 |
| Les 3 | `text-white/40` (« Nos partenaires technologiques », copyright, liens légaux du footer, sous-titres des appels à l'action) | `#6E6E76` sur `#0D0D1A` | 3,81:1 | 4,5:1 |
| / | Surtitres de section `text-[#7C6EFA]` | `#7C6EFA` sur blanc | 3,84:1 | 4,5:1 |
| / | Lien téléphone du bloc adresse | `#7C6EFA` sur `#F5F4FF` | 3,52:1 | 4,5:1 |
| /solutions | Numéros « 01 / » à « 04 / » (`text-white/20`) | `#3D3D48` sur `#0D0D1A` | 1,79:1 | 4,5:1 |
| /solutions | Mention « Partenaires » (`text-white/25`) | `#494953` sur `#0D0D1A` | 2,16:1 | 4,5:1 |
| /services | Numéros 01 à 04 (`text-white/15`, 24 px gras) | `#31313C` sur `#0D0D1A` | 1,5:1 | 3:1 |
| /services | Accroches en italique (`text-[#7C6EFA]/80`) | `#665BCD` sur `#0D0D1A` | 3,61:1 | 4,5:1 |
| /services | Badge « Processus » | `#7C6EFA` sur `#1E1C3C` | 4,24:1 | 4,5:1 |

### A.6 Cohérence NAP dans le code

Les pages affichent partout les mêmes valeurs (annexe §10) : 02 19 23 06 91 (`tel:+33219230691`, `+33219230691` dans le JSON-LD), hello@lea-numerique.fr, 19 place du Président Kennedy, 49100 Angers, du lundi au vendredi de 9h à 17h30. Inventaire du code (numéros de ligne au commit `c43b8b1`) :

| Donnée | Source de référence (`src/lib/site.ts`) | Utilisée via `site` | Occurrences codées en dur | Écarts |
|---|---|---|---|---|
| Téléphone | `phone: "+33219230691"` et `phoneDisplay: "02 19 23 06 91"` (l. 9 et 10) | Footer, contact (cartes et introduction), ServiceArea (FAQ et bloc adresse), mentions légales, JSON-LD | `Header.tsx` l. 64 et 114 (`tel:+33219230691`), l. 67 et 118 (texte) ; `ContactCTA.tsx` l. 40 (`tel:`) ; `contact/page.tsx` l. 10 (meta description) ; `opengraph-image.tsx` l. 33 (texte de l'image) ; `emailjs-autoreply-template.html` l. 69 | Même valeur partout, risque de divergence à la prochaine modification |
| E-mail | `email: "hello@lea-numerique.fr"` (l. 11) | Footer, contact, mentions légales, JSON-LD | `services/page.tsx` l. 249 et 252 ; `a-propos/page.tsx` l. 150 et 153 ; `politique-confidentialite/page.tsx` l. 61, 64, 85 et 88 ; `ContactCTA.tsx` l. 55 et 56 ; `ContactForm.tsx` l. 130 (message d'erreur) ; `emailjs-autoreply-template.html` l. 69 | Même valeur partout |
| Adresse | `street`, `postalCode`, `city`, `region`, `department`, `country` (l. 12 à 19) | Footer, contact, ServiceArea, JSON-LD | `mentions-legales/page.tsx` l. 23 (« 19 place du Président Kennedy, 49100 ANGERS ») et l. 7 (meta description) ; `emailjs-autoreply-template.html` l. 70 (« Angers, France ») | Ville en majuscules dans les mentions légales ; champ `department` inutilisé |
| Horaires | `hours.days` « Lun [U+2013] Ven », `open` « 09:00 », `close` « 17:30 », `display` « Lun [U+2013] Ven, 9h [U+2013] 17h30 » (l. 20) | Carte Téléphone de `/contact` (`display`), JSON-LD (`open`, `close`) | `contact/page.tsx` l. 39 (« Lun [U+2013] Ven, 9h [U+2013] 17h30 », copie de `display`) ; `ContactCTA.tsx` l. 61 (« Lun[U+2013]Ven, 9h[U+2013]17h30 ») ; `ServiceArea.tsx` l. 19 (« du lundi au vendredi, de 9h à 17h30 ») ; jours « Monday » à « Friday » écrits dans `JsonLd.tsx` l. 64 | 3 formats, dont 2 avec tiret demi-cadratin (interdit par le brief) ; `hours.days` inutilisé |
| Zone d'intervention | `serviceArea: "Angers, Maine-et-Loire et France entière"` (l. 21) | Carte Zone de `/contact` | `ContactCTA.tsx` l. 67 (même texte) ; `ServiceArea.tsx` l. 5 à 10 (liste avec Pays de la Loire) ; `JsonLd.tsx` l. 38 à 42 (`areaServed` sans Pays de la Loire) | Pays de la Loire absent du JSON-LD |

Les occurrences de « 9h » ou « Lun » trouvées dans `emailjs-template.html` et `emailjs-autoreply-template.html` sont des données d'image en base64, sans rapport avec les horaires.

### A.7 Données structurées

Un seul bloc `<script type="application/ld+json">`, émis par `src/components/seo/JsonLd.tsx` dans le layout, au début du `<body>`, identique sur les 7 pages. `JSON.parse` réussit. Contenu servi :

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://lea-numerique.fr/#organization",
      "name": "Léa Numérique",
      "alternateName": ["Lea Numerique", "LeaNumerique"],
      "description": "Intégrateur IT à Angers : téléphonie IP, réseaux, informatique et cybersécurité pour entreprises, collectivités et santé en Maine-et-Loire. Devis gratuit.",
      "url": "https://lea-numerique.fr",
      "logo": "https://lea-numerique.fr/images/mascotte.png",
      "image": "https://lea-numerique.fr/opengraph-image",
      "telephone": "+33219230691",
      "email": "hello@lea-numerique.fr",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "19 place du Président Kennedy",
        "postalCode": "49100",
        "addressLocality": "Angers",
        "addressRegion": "Pays de la Loire",
        "addressCountry": "FR"
      },
      "areaServed": [
        { "@type": "City", "name": "Angers" },
        { "@type": "AdministrativeArea", "name": "Maine-et-Loire" },
        { "@type": "Country", "name": "France" }
      ],
      "knowsAbout": ["Téléphonie IP", "Standard téléphonique IPBX", "Réseaux informatiques", "Wi-Fi professionnel", "Câblage réseau", "Matériel informatique professionnel", "Maintenance informatique", "Cybersécurité", "Pare-feu", "Vidéosurveillance"],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+33219230691",
        "email": "hello@lea-numerique.fr",
        "areaServed": "FR",
        "availableLanguage": "French",
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "17:30"
        }
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://lea-numerique.fr/#website",
      "url": "https://lea-numerique.fr",
      "name": "Léa Numérique",
      "alternateName": ["Lea Numerique", "LeaNumerique"],
      "inLanguage": "fr-FR",
      "publisher": { "@id": "https://lea-numerique.fr/#organization" }
    }
  ]
}
```

Types trouvés : ProfessionalService et WebSite au premier niveau ; PostalAddress, City, AdministrativeArea, Country, ContactPoint et OpeningHoursSpecification imbriqués. Tous existent dans le vocabulaire Schema.org et chaque propriété est utilisée sur un type qui l'accepte.

| Propriété | Valeur servie | Contenu visible | Verdict |
|---|---|---|---|
| `name` | Léa Numérique | Logo, footer, mentions légales | OK |
| `telephone` | +33219230691 (entreprise et contactPoint) | 02 19 23 06 91 | OK |
| `email` | hello@lea-numerique.fr | Identique | OK |
| `address` | 19 place du Président Kennedy, 49100 Angers, Pays de la Loire, FR | Identique (« ANGERS » dans les mentions légales) | OK |
| Horaires | `contactPoint.hoursAvailable` : du lundi au vendredi, 09:00 à 17:30 | Identique | OK sur la valeur, emplacement à compléter (ci-dessous) |
| `areaServed` | Angers, Maine-et-Loire, France | Liste de l'accueil : Angers et son agglomération, Maine-et-Loire (49), Pays de la Loire, France entière | Info : Pays de la Loire absent |
| `logo` | `/images/mascotte.png` (418 x 489) | Mascotte affichée dans le hero | À faire valider |
| `image` | `/opengraph-image` (1200 x 630, servie en 200) | | OK |
| `description` | Identique à la meta description de l'accueil | | OK |

Écarts avec la phase 3 du plan :

- `openingHoursSpecification` absent de l'entité ProfessionalService : c'est la propriété que Google lit pour les horaires d'un établissement local ; les horaires ne figurent aujourd'hui que dans `contactPoint.hoursAvailable`.
- `sameAs` absent : `site.sameAs` est un tableau vide, en attente de la fiche Google Business Profile et de la page LinkedIn.
- `geo` absent : facultatif, coordonnées à faire fournir ou valider par le propriétaire (ne pas les déduire).
- `logo` : le modèle du plan cite `https://lea-numerique.fr/images/logo.png`, mais ce fichier est un logotype de 600 x 71 px en couleur claire sur fond transparent, sous le minimum de 112 x 112 px fixé par Google et peu lisible sur fond blanc. La mascotte actuelle (418 x 489) et `src/app/icon.png` (512 x 512) respectent la taille minimale. Choix à valider par le propriétaire.
- BreadcrumbList : aucune page profonde aujourd'hui, à ajouter sur les futures pages `/solutions/*`.
- FAQPage : absent alors que l'accueil affiche 7 questions avec réponses ; facultatif (pas d'extrait enrichi attendu pour ce type de site, comme le note le plan).
- Validation officielle (test des résultats enrichis, validator.schema.org) à faire en production.

### A.8 Reproduire l'audit

Les outils hors dépôt sont dans `/home/claude/wt/audit-outils` : `font-server.mjs` et `google-fonts-mock.js` (build sans accès à Google Fonts), `compare-rendu.mjs` (HTML initial et rendu Googlebot), Playwright et Lighthouse.

```text
# 1. Serveur local des polices (à laisser tourner pendant le build)
node /home/claude/wt/audit-outils/font-server.mjs

# 2. Build et démarrage, depuis la racine du dépôt
NEXT_FONT_GOOGLE_MOCKED_RESPONSES=/home/claude/wt/audit-outils/google-fonts-mock.js npm run build
git checkout -- next-env.d.ts
npx next start -p 3101

# 3. Audit sans dépendance (rapport Markdown sur stdout, données complètes en JSON)
node scripts/seo/audit-local.mjs http://localhost:3101 --json audit.json > audit.md

# 4. HTML initial et rendu Googlebot
node /home/claude/wt/audit-outils/compare-rendu.mjs http://localhost:3101

# 5. Lighthouse mobile (depuis /home/claude/wt/audit-outils, où Lighthouse est installé)
CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npx lighthouse http://localhost:3101/ --chrome-flags="--headless=new --no-sandbox" --only-categories=performance,seo,accessibility,best-practices --output=json --output-path=lh.json
```

Options utiles du script : `--extra /chemin1,/chemin2` (URLs supplémentaires), `--no-default-extra`, `--site https://lea-numerique.fr`, `--ua chrome`, `--no-compare`, `--strict` (code de sortie 1 en cas d'erreur). Sur la version actuelle, `--strict` renvoie 0 : aucune alerte de gravité « Erreur ».

### A.9 Sortie complète du script (référence avant)

<details>
<summary>Sortie de <code>node scripts/seo/audit-local.mjs http://localhost:3101</code> (19/10/2026)</summary>

````markdown
# Audit SEO technique de http://localhost:3101

- Date : 19/10/2026 12:54:40 (heure de Paris)
- Origine auditée : http://localhost:3101
- Domaine de production (URLs absolues ramenées sur l'origine auditée) : https://lea-numerique.fr
- User-agent du crawl : googlebot (`Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)`)
- URLs testées : 16, dont 7 pages HTML en 200
- Alertes : 0 erreur(s), 8 point(s) d'attention, 27 information(s)
- Méthode : fetch sans suivi automatique des redirections, analyse du HTML initial (aucun JavaScript exécuté). Mots : suites de caractères séparées par des espaces contenant au moins une lettre ou un chiffre.

## Résumé des alertes

| Gravité | Alerte | Détail |
| --- | --- | --- |
| Attention | URL supplémentaire en 404 : /pages/services | aucune redirection |
| Attention | URL supplémentaire en 404 : /collections/frontpage | aucune redirection |
| Attention | URL supplémentaire en 404 : /products/snom-d150 | aucune redirection |
| Attention | URL supplémentaire en 404 : /pages/partenaires | aucune redirection |
| Attention | URL supplémentaire en 404 : /solutions/telephonie-ip | aucune redirection |
| Attention | URL supplémentaire en 404 : /solutions/reseaux-wifi | aucune redirection |
| Attention | URL supplémentaire en 404 : /solutions/materiel-informatique | aucune redirection |
| Attention | URL supplémentaire en 404 : /solutions/cybersecurite | aucune redirection |
| Info | Toutes les dates lastmod du sitemap sont identiques (2026-10-08) |  |
| Info | H1 de / : mots collés dans le textContent brut | AngersTéléphonie |
| Info | 4 tiret(s) demi-cadratin ou cadratin sur / | texte visible, attribut alt |
| Info | H1 de /solutions : mots collés dans le textContent brut | ITà |
| Info | 1 tiret(s) demi-cadratin ou cadratin sur /solutions | attribut alt |
| Info | H1 de /services : mots collés dans le textContent brut | ITà |
| Info | H2 de /services : mots collés dans le textContent brut | déroulevotre |
| Info | 2 tiret(s) demi-cadratin ou cadratin sur /services | texte visible, attribut alt |
| Info | H1 de /contact : mots collés dans le textContent brut | votreprojet |
| Info | H2 de /contact : mots collés dans le textContent brut | passeaprès |
| Info | Contenu léger sur /contact : 189 mots dans <main> |  |
| Info | 5 tiret(s) demi-cadratin ou cadratin sur /contact | texte visible, attribut alt |
| Info | H1 de /a-propos : mots collés dans le textContent brut | ITde |
| Info | H2 de /a-propos : mots collés dans le textContent brut | valeurs,une |
| Info | Contenu léger sur /a-propos : 232 mots dans <main> |  |
| Info | 1 tiret(s) demi-cadratin ou cadratin sur /a-propos | attribut alt |
| Info | Contenu léger sur /mentions-legales : 125 mots dans <main> |  |
| Info | 1 tiret(s) demi-cadratin ou cadratin sur /mentions-legales | attribut alt |
| Info | Contenu léger sur /politique-confidentialite : 158 mots dans <main> |  |
| Info | 1 tiret(s) demi-cadratin ou cadratin sur /politique-confidentialite | attribut alt |
| Info | 8 cible(s) de lien interne avec fragment (#...) | les fragments ne créent pas d'URL distincte pour Google |
| Info | Page liée uniquement depuis le header ou le footer : /mentions-legales |  |
| Info | Page liée uniquement depuis le header ou le footer : /politique-confidentialite |  |
| Info | Hôte www : redirection 308 sur / | permanente comme un 301 pour Google |
| Info | Hôte www : redirection 308 sur /solutions | permanente comme un 301 pour Google |
| Info | NAP : 2 formats d'affichage pour 49100 angers | 49100 Angers / 49100 ANGERS |
| Info | NAP : 3 formats d'affichage pour lun-ven 09:00-17:30 | du lundi au vendredi, de 9h à 17h30 / Lun[U+2013]Ven, 9h[U+2013]17h30 / Lun [U+2013] Ven, 9h [U+2013] 17h30 |

## 1. robots.txt

- Statut : 200, Content-Type : `text/plain`
- Sitemaps déclarés : `https://lea-numerique.fr/sitemap.xml`
- Groupe `*` : allow `/`

```text
User-Agent: *
Allow: /

Sitemap: https://lea-numerique.fr/sitemap.xml
```

## 2. Sitemap

| Fichier | Statut | Content-Type | Type | URLs |
| --- | --- | --- | --- | --- |
| /sitemap.xml | 200 | application/xml | urlset | 7 |

| URL (loc) | lastmod | priority | Statut final | Sauts | Indexable | Canonical | Profondeur | Pages qui la lient |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| https://lea-numerique.fr/ | 2026-10-08 | 1 | 200 | 0 | oui | auto-référente | 0 | 6 |
| https://lea-numerique.fr/solutions | 2026-10-08 | 0.9 | 200 | 0 | oui | auto-référente | 1 | 6 |
| https://lea-numerique.fr/services | 2026-10-08 | 0.9 | 200 | 0 | oui | auto-référente | 1 | 6 |
| https://lea-numerique.fr/contact | 2026-10-08 | 0.8 | 200 | 0 | oui | auto-référente | 1 | 6 |
| https://lea-numerique.fr/a-propos | 2026-10-08 | 0.7 | 200 | 0 | oui | auto-référente | 1 | 6 |
| https://lea-numerique.fr/mentions-legales | 2026-10-08 | 0.2 | 200 | 0 | oui | auto-référente | 1 | 6 |
| https://lea-numerique.fr/politique-confidentialite | 2026-10-08 | 0.2 | 200 | 0 | oui | auto-référente | 1 | 6 |

## 3. Codes HTTP et en-têtes

Chaque URL est demandée sans suivre les redirections. « Sauts » = nombre de redirections avant la réponse finale.

| URL | Origine de l'URL | Statut | Location | Sauts | Statut final | URL finale | X-Robots-Tag | Content-Type | Cache-Control |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | accueil, sitemap, lien | 200 |  | 0 | 200 | / | aucun | text/html; charset=utf-8 | s-maxage=31536000 |
| /solutions | sitemap, lien | 200 |  | 0 | 200 | /solutions | aucun | text/html; charset=utf-8 | s-maxage=31536000 |
| /services | sitemap, lien | 200 |  | 0 | 200 | /services | aucun | text/html; charset=utf-8 | s-maxage=31536000 |
| /contact | sitemap, lien | 200 |  | 0 | 200 | /contact | aucun | text/html; charset=utf-8 | s-maxage=31536000 |
| /a-propos | sitemap, lien | 200 |  | 0 | 200 | /a-propos | aucun | text/html; charset=utf-8 | s-maxage=31536000 |
| /mentions-legales | sitemap, lien | 200 |  | 0 | 200 | /mentions-legales | aucun | text/html; charset=utf-8 | s-maxage=31536000 |
| /politique-confidentialite | sitemap, lien | 200 |  | 0 | 200 | /politique-confidentialite | aucun | text/html; charset=utf-8 | s-maxage=31536000 |
| /pages/services | supplémentaire | 404 |  | 0 | 404 | /pages/services | aucun | text/html; charset=utf-8 | private, no-cache, no-store, max-age=0, must-revalidate |
| /collections/frontpage | supplémentaire | 404 |  | 0 | 404 | /collections/frontpage | aucun | text/html; charset=utf-8 | private, no-cache, no-store, max-age=0, must-revalidate |
| /products/snom-d150 | supplémentaire | 404 |  | 0 | 404 | /products/snom-d150 | aucun | text/html; charset=utf-8 | private, no-cache, no-store, max-age=0, must-revalidate |
| /pages/partenaires | supplémentaire | 404 |  | 0 | 404 | /pages/partenaires | aucun | text/html; charset=utf-8 | private, no-cache, no-store, max-age=0, must-revalidate |
| /solutions/telephonie-ip | supplémentaire | 404 |  | 0 | 404 | /solutions/telephonie-ip | aucun | text/html; charset=utf-8 | private, no-cache, no-store, max-age=0, must-revalidate |
| /solutions/reseaux-wifi | supplémentaire | 404 |  | 0 | 404 | /solutions/reseaux-wifi | aucun | text/html; charset=utf-8 | private, no-cache, no-store, max-age=0, must-revalidate |
| /solutions/materiel-informatique | supplémentaire | 404 |  | 0 | 404 | /solutions/materiel-informatique | aucun | text/html; charset=utf-8 | private, no-cache, no-store, max-age=0, must-revalidate |
| /solutions/cybersecurite | supplémentaire | 404 |  | 0 | 404 | /solutions/cybersecurite | aucun | text/html; charset=utf-8 | private, no-cache, no-store, max-age=0, must-revalidate |
| /solutions/inexistant | supplémentaire | 404 |  | 0 | 404 | /solutions/inexistant | aucun | text/html; charset=utf-8 | private, no-cache, no-store, max-age=0, must-revalidate |

Pages d'erreur rencontrées :

| URL | Statut | Title | Meta robots | X-Robots-Tag |
| --- | --- | --- | --- | --- |
| /pages/services | 404 | Page introuvable \| Léa Numérique | noindex, noindex, follow | aucun |
| /collections/frontpage | 404 | Page introuvable \| Léa Numérique | noindex, noindex, follow | aucun |
| /products/snom-d150 | 404 | Page introuvable \| Léa Numérique | noindex, noindex, follow | aucun |
| /pages/partenaires | 404 | Page introuvable \| Léa Numérique | noindex, noindex, follow | aucun |
| /solutions/telephonie-ip | 404 | Page introuvable \| Léa Numérique | noindex, noindex, follow | aucun |
| /solutions/reseaux-wifi | 404 | Page introuvable \| Léa Numérique | noindex, noindex, follow | aucun |
| /solutions/materiel-informatique | 404 | Page introuvable \| Léa Numérique | noindex, noindex, follow | aucun |
| /solutions/cybersecurite | 404 | Page introuvable \| Léa Numérique | noindex, noindex, follow | aucun |
| /solutions/inexistant | 404 | Page introuvable \| Léa Numérique | noindex, noindex, follow | aucun |

## 4. Variantes d'URL et hôte www

| Variante | URL testée | Statuts successifs | Location | Statut final | Canonical de la page finale |
| --- | --- | --- | --- | --- | --- |
| barre oblique finale | /solutions/ | 308 > 200 | /solutions | 200 | https://lea-numerique.fr/solutions |
| paramètre de suivi | /solutions?utm_source=audit | 200 |  | 200 | https://lea-numerique.fr/solutions |

Hôte www simulé par l'en-tête `X-Forwarded-Host: www.lea-numerique.fr` (filet de sécurité applicatif ; http vers https et la redirection du serveur web ne sont pas testables en local) :

| Chemin | Statut | Location | Statuts après la redirection |
| --- | --- | --- | --- |
| / | 308 | https://lea-numerique.fr | 200 |
| /solutions | 308 | https://lea-numerique.fr/solutions | 200 |

## 5. Pages HTML en 200 : synthèse

| Page | Title (car.) | Description (car.) | Canonical | Robots | H1 | Mots <main> | Mots rédigés | Contenu dans le HTML initial | JSON-LD |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | 59 | 154 | auto-référente | index, follow | 1 | 970 | 551 | oui | ProfessionalService + WebSite |
| /solutions | 59 | 151 | auto-référente | index, follow | 1 | 488 | 312 | oui | ProfessionalService + WebSite |
| /services | 58 | 149 | auto-référente | index, follow | 1 | 345 | 108 | oui | ProfessionalService + WebSite |
| /contact | 51 | 143 | auto-référente | index, follow | 1 | 189 | 39 | oui | ProfessionalService + WebSite |
| /a-propos | 47 | 150 | auto-référente | index, follow | 1 | 232 | 126 | oui | ProfessionalService + WebSite |
| /mentions-legales | 32 | 141 | auto-référente | index, follow | 1 | 125 | 113 | oui | ProfessionalService + WebSite |
| /politique-confidentialite | 44 | 141 | auto-référente | index, follow | 1 | 158 | 100 | oui | ProfessionalService + WebSite |

## 6. Détail par page

### /

- Title (59 car.) : Prestataire informatique & télécom à Angers | Léa Numérique
- Meta description (154 car.) : Intégrateur IT à Angers : téléphonie IP, réseaux, informatique et cybersécurité pour entreprises, collectivités et santé en Maine-et-Loire. Devis gratuit.
- Canonical : `https://lea-numerique.fr` (auto-référente)
- Meta robots : `index, follow` ; googlebot : `index, follow, max-image-preview:large, max-snippet:-1` ; X-Robots-Tag : aucun
- lang : `fr` ; og:url : `https://lea-numerique.fr` ; og:image : `https://lea-numerique.fr/opengraph-image`
- Titres : 1 H1, 8 H2, 21 H3
- Mots dans <main> : 970 (page entière, header et footer compris : 1045) ; texte rédigé : 551 mots en 20 paragraphe(s) d'au moins 12 mots
- Contenu dans le HTML initial : oui (rendu client forcé détecté : non) ; début du texte : « Intégrateur IT en Maine-et-Loire (49) Votre partenaire IT à Angers Téléphonie IP, réseau, informatique et cybersécurité Basée à Angers, Léa Numérique conçoit, installe et maintient … »
- Images : 34, sans attribut alt : 0, alt vide (décoratives) : 14
- JSON-LD : ProfessionalService, WebSite ; types imbriqués : PostalAddress, City, AdministrativeArea, Country, ContactPoint, OpeningHoursSpecification ; dans le <head> : non (body)
  - ProfessionalService : champs présents name, url, logo, telephone, email, address, areaServed, image ; absents sameAs, openingHoursSpecification, geo

Plan des titres (H1 à H3) :

- H1 : Votre partenaire IT à Angers Téléphonie IP, réseau, informatique et cybersécurité _(textContent brut : AngersTéléphonie)_
  - H2 : Un intégrateur IT angevin, de l'audit à la maintenance
  - H2 : Téléphonie, réseau, informatique et cybersécurité pour les professionnels
    - H3 : Téléphonie IP d'entreprise
    - H3 : Réseaux et Wi-Fi professionnels
    - H3 : Matériel informatique professionnel
    - H3 : Cybersécurité et protection des données
  - H2 : Pourquoi choisir un prestataire IT de proximité ?
    - H3 : Support réactif
    - H3 : Sécurité de vos données
    - H3 : Infrastructure fiable
    - H3 : Performance IT
    - H3 : Partenaires certifiés
    - H3 : Maintenance préventive
  - H2 : Votre projet IT en 4 étapes
    - H3 : Analyse de vos besoins
    - H3 : Proposition sur mesure
    - H3 : Mise en œuvre
    - H3 : Suivi & maintenance
  - H2 : Collectivités, santé, PME : des solutions IT pour chaque secteur
  - H2 : Votre prestataire IT à Angers et en Maine-et-Loire
  - H2 : Questions fréquentes
    - H3 : Où intervenez-vous ?
    - H3 : Quelles solutions de téléphonie IP proposez-vous aux entreprises ?
    - H3 : Proposez-vous des contrats de maintenance informatique ?
    - H3 : Comment protéger une PME ou une collectivité contre les cyberattaques ?
    - H3 : Pouvez-vous reprendre ou faire évoluer notre installation existante ?
    - H3 : Travaillez-vous avec les collectivités et les établissements de santé ?
    - H3 : Le devis est-il gratuit ? Sous quel délai répondez-vous ?
  - H2 : Un projet IT en Anjou ? Parlons-en.

Liens internes sortants :

| Cible | Ancre | Source de l'ancre | Zone | Nb | Statut cible |
| --- | --- | --- | --- | --- | --- |
| / | Léa Numérique [U+2013] retour à l'accueil | alt | header | 1 | 200 |
| / | Accueil | texte | header | 1 | 200 |
| /solutions | Solutions | texte | header | 1 | 200 |
| /services | Services | texte | header | 1 | 200 |
| /a-propos | À propos | texte | header | 1 | 200 |
| /contact | Prendre contact | texte | header | 1 | 200 |
| /contact | Demander un devis gratuit | texte | contenu | 3 | 200 |
| /solutions | Découvrir nos solutions | texte | contenu | 1 | 200 |
| /a-propos | En savoir plus sur nous | texte | contenu | 1 | 200 |
| /solutions#telephonie | Découvrir la téléphonie IP | texte | contenu | 2 | 200 |
| /solutions#reseaux | Découvrir nos solutions réseau | texte | contenu | 1 | 200 |
| /solutions#informatique | Découvrir notre offre informatique | texte | contenu | 1 | 200 |
| /solutions#cybersecurite | Découvrir nos solutions de cybersécurité | texte | contenu | 1 | 200 |
| /services | Voir le détail de nos services | texte | contenu | 1 | 200 |
| /services#maintenance | Nos contrats de maintenance | texte | contenu | 1 | 200 |
| /services#securite | Nos services de sécurité informatique | texte | contenu | 1 | 200 |
| /services#conseil | Conseil et audit informatique | texte | contenu | 1 | 200 |
| /contact | Prendre contact | texte | contenu | 1 | 200 |
| / | Accueil | texte | footer | 1 | 200 |
| /solutions | Solutions | texte | footer | 1 | 200 |
| /services | Services | texte | footer | 1 | 200 |
| /a-propos | À propos | texte | footer | 1 | 200 |
| /contact | Contact | texte | footer | 1 | 200 |
| /solutions#telephonie | Téléphonie IP | texte | footer | 1 | 200 |
| /solutions#reseaux | Réseaux & Infrastructure | texte | footer | 1 | 200 |
| /solutions#informatique | Informatique | texte | footer | 1 | 200 |
| /solutions#cybersecurite | Cybersécurité | texte | footer | 1 | 200 |
| /services#conseil | Conseil | texte | footer | 1 | 200 |
| /services#installation | Installation | texte | footer | 1 | 200 |
| /services#maintenance | Maintenance | texte | footer | 1 | 200 |
| /services#securite | Sécurité | texte | footer | 1 | 200 |
| /mentions-legales | Mentions légales | texte | footer | 1 | 200 |
| /politique-confidentialite | Politique de confidentialité | texte | footer | 1 | 200 |

Autres liens : tel 5, mailto 2 (`tel:+33219230691`, `mailto:hello@lea-numerique.fr`)

### /solutions

- Title (59 car.) : Téléphonie IP, Wi-Fi & cybersécurité Angers | Léa Numérique
- Meta description (151 car.) : Standard téléphonique IP (3CX, Yeastar), Wi-Fi pro, postes HP/Lenovo/Dell et pare-feu Fortinet : nos solutions IT pour les pros d'Angers et de l'Anjou.
- Canonical : `https://lea-numerique.fr/solutions` (auto-référente)
- Meta robots : `index, follow` ; googlebot : `index, follow, max-image-preview:large, max-snippet:-1` ; X-Robots-Tag : aucun
- lang : `fr` ; og:url : `https://lea-numerique.fr/solutions` ; og:image : `https://lea-numerique.fr/opengraph-image`
- Titres : 1 H1, 5 H2
- Mots dans <main> : 488 (page entière, header et footer compris : 563) ; texte rédigé : 312 mots en 6 paragraphe(s) d'au moins 12 mots
- Contenu dans le HTML initial : oui (rendu client forcé détecté : non) ; début du texte : « Nos domaines d'expertise Nos solutions IT à Angers et en Anjou De la téléphonie IP à la cybersécurité, Léa Numérique équipe les entreprises, collectivités et … »
- Images : 6, sans attribut alt : 0, alt vide (décoratives) : 0
- JSON-LD : ProfessionalService, WebSite ; types imbriqués : PostalAddress, City, AdministrativeArea, Country, ContactPoint, OpeningHoursSpecification ; dans le <head> : non (body)
  - ProfessionalService : champs présents name, url, logo, telephone, email, address, areaServed, image ; absents sameAs, openingHoursSpecification, geo

Plan des titres (H1 à H3) :

- H1 : Nos solutions IT à Angers et en Anjou _(textContent brut : ITà)_
  - H2 : Téléphonie IP et standard d'entreprise
  - H2 : Réseaux, Wi-Fi et câblage professionnels
  - H2 : Matériel informatique professionnel
  - H2 : Cybersécurité, pare-feu et vidéosurveillance
  - H2 : Votre projet mérite la meilleure solution

Liens internes sortants :

| Cible | Ancre | Source de l'ancre | Zone | Nb | Statut cible |
| --- | --- | --- | --- | --- | --- |
| / | Léa Numérique [U+2013] retour à l'accueil | alt | header | 1 | 200 |
| / | Accueil | texte | header | 1 | 200 |
| /solutions | Solutions | texte | header | 1 | 200 |
| /services | Services | texte | header | 1 | 200 |
| /a-propos | À propos | texte | header | 1 | 200 |
| /contact | Prendre contact | texte | header | 1 | 200 |
| /services#installation | Installation et mise en service de votre téléphonie IP | texte | contenu | 1 | 200 |
| /contact | Demander un devis de téléphonie IP | texte | contenu | 1 | 200 |
| /services#installation | Câblage et déploiement réseau | texte | contenu | 1 | 200 |
| /contact | Demander un devis réseau | texte | contenu | 1 | 200 |
| /services#maintenance | Contrats de maintenance informatique | texte | contenu | 1 | 200 |
| /contact | Demander un devis informatique | texte | contenu | 1 | 200 |
| /services#securite | Audit et protection de votre système d'information | texte | contenu | 1 | 200 |
| /contact | Demander un devis cybersécurité | texte | contenu | 1 | 200 |
| /contact | Prendre contact | texte | contenu | 1 | 200 |
| / | Accueil | texte | footer | 1 | 200 |
| /solutions | Solutions | texte | footer | 1 | 200 |
| /services | Services | texte | footer | 1 | 200 |
| /a-propos | À propos | texte | footer | 1 | 200 |
| /contact | Contact | texte | footer | 1 | 200 |
| /solutions#telephonie | Téléphonie IP | texte | footer | 1 | 200 |
| /solutions#reseaux | Réseaux & Infrastructure | texte | footer | 1 | 200 |
| /solutions#informatique | Informatique | texte | footer | 1 | 200 |
| /solutions#cybersecurite | Cybersécurité | texte | footer | 1 | 200 |
| /services#conseil | Conseil | texte | footer | 1 | 200 |
| /services#installation | Installation | texte | footer | 1 | 200 |
| /services#maintenance | Maintenance | texte | footer | 1 | 200 |
| /services#securite | Sécurité | texte | footer | 1 | 200 |
| /mentions-legales | Mentions légales | texte | footer | 1 | 200 |
| /politique-confidentialite | Politique de confidentialité | texte | footer | 1 | 200 |

Autres liens : tel 2, mailto 1 (`tel:+33219230691`, `mailto:hello@lea-numerique.fr`)

### /services

- Title (58 car.) : Maintenance informatique entreprise Angers | Léa Numérique
- Meta description (149 car.) : Audit, installation, maintenance et sécurité de votre parc IT à Angers et en Maine-et-Loire : helpdesk dédié, télémaintenance, intervention sur site.
- Canonical : `https://lea-numerique.fr/services` (auto-référente)
- Meta robots : `index, follow` ; googlebot : `index, follow, max-image-preview:large, max-snippet:-1` ; X-Robots-Tag : aucun
- lang : `fr` ; og:url : `https://lea-numerique.fr/services` ; og:image : `https://lea-numerique.fr/opengraph-image`
- Titres : 1 H1, 6 H2
- Mots dans <main> : 345 (page entière, header et footer compris : 420) ; texte rédigé : 108 mots en 5 paragraphe(s) d'au moins 12 mots
- Contenu dans le HTML initial : oui (rendu client forcé détecté : non) ; début du texte : « Ce que nous faisons Nos services IT à Angers et en Anjou De l'audit initial à la maintenance quotidienne, Léa Numérique accompagne les organisations d'Angers … »
- Images : 6, sans attribut alt : 0, alt vide (décoratives) : 0
- JSON-LD : ProfessionalService, WebSite ; types imbriqués : PostalAddress, City, AdministrativeArea, Country, ContactPoint, OpeningHoursSpecification ; dans le <head> : non (body)
  - ProfessionalService : champs présents name, url, logo, telephone, email, address, areaServed, image ; absents sameAs, openingHoursSpecification, geo

Plan des titres (H1 à H3) :

- H1 : Nos services IT à Angers et en Anjou _(textContent brut : ITà)_
  - H2 : Conseil et audit informatique
  - H2 : Installation réseau, téléphonie et postes de travail
  - H2 : Maintenance informatique et support
  - H2 : Sécurité informatique et sauvegarde
  - H2 : Comment se déroule votre projet IT ? _(textContent brut : déroulevotre)_
  - H2 : Besoin d'un service sur mesure ?

Liens internes sortants :

| Cible | Ancre | Source de l'ancre | Zone | Nb | Statut cible |
| --- | --- | --- | --- | --- | --- |
| / | Léa Numérique [U+2013] retour à l'accueil | alt | header | 1 | 200 |
| / | Accueil | texte | header | 1 | 200 |
| /solutions | Solutions | texte | header | 1 | 200 |
| /services | Services | texte | header | 1 | 200 |
| /a-propos | À propos | texte | header | 1 | 200 |
| /contact | Prendre contact | texte | header | 1 | 200 |
| /solutions | Toutes nos solutions IT | texte | contenu | 1 | 200 |
| /solutions#telephonie | Téléphonie IP | texte | contenu | 1 | 200 |
| /solutions#reseaux | Réseaux et Wi-Fi | texte | contenu | 1 | 200 |
| /solutions#informatique | Postes de travail | texte | contenu | 1 | 200 |
| /solutions#informatique | Matériel informatique professionnel | texte | contenu | 1 | 200 |
| /contact | Demander un contrat de maintenance | texte | contenu | 1 | 200 |
| /solutions#cybersecurite | Nos solutions de cybersécurité | texte | contenu | 1 | 200 |
| /contact | Prendre contact | texte | contenu | 1 | 200 |
| / | Accueil | texte | footer | 1 | 200 |
| /solutions | Solutions | texte | footer | 1 | 200 |
| /services | Services | texte | footer | 1 | 200 |
| /a-propos | À propos | texte | footer | 1 | 200 |
| /contact | Contact | texte | footer | 1 | 200 |
| /solutions#telephonie | Téléphonie IP | texte | footer | 1 | 200 |
| /solutions#reseaux | Réseaux & Infrastructure | texte | footer | 1 | 200 |
| /solutions#informatique | Informatique | texte | footer | 1 | 200 |
| /solutions#cybersecurite | Cybersécurité | texte | footer | 1 | 200 |
| /services#conseil | Conseil | texte | footer | 1 | 200 |
| /services#installation | Installation | texte | footer | 1 | 200 |
| /services#maintenance | Maintenance | texte | footer | 1 | 200 |
| /services#securite | Sécurité | texte | footer | 1 | 200 |
| /mentions-legales | Mentions légales | texte | footer | 1 | 200 |
| /politique-confidentialite | Politique de confidentialité | texte | footer | 1 | 200 |

Autres liens : tel 2, mailto 2 (`tel:+33219230691`, `mailto:hello@lea-numerique.fr`)

### /contact

- Title (51 car.) : Contact & devis IT gratuit à Angers | Léa Numérique
- Meta description (143 car.) : Un projet de téléphonie, réseau ou informatique à Angers ? Appelez le 02 19 23 06 91 ou écrivez-nous : réponse sous 24h ouvrées, devis gratuit.
- Canonical : `https://lea-numerique.fr/contact` (auto-référente)
- Meta robots : `index, follow` ; googlebot : `index, follow, max-image-preview:large, max-snippet:-1` ; X-Robots-Tag : aucun
- lang : `fr` ; og:url : `https://lea-numerique.fr/contact` ; og:image : `https://lea-numerique.fr/opengraph-image`
- Titres : 1 H1, 2 H2
- Mots dans <main> : 189 (page entière, header et footer compris : 264) ; texte rédigé : 39 mots en 2 paragraphe(s) d'au moins 12 mots
- Contenu dans le HTML initial : oui (rendu client forcé détecté : non) ; début du texte : « Prenons contact Parlons de votre projet IT à Angers Remplissez le formulaire, appelez-nous au 02 19 23 06 91 ou écrivez-nous directement. Nous vous répondons … »
- Images : 2, sans attribut alt : 0, alt vide (décoratives) : 0
- JSON-LD : ProfessionalService, WebSite ; types imbriqués : PostalAddress, City, AdministrativeArea, Country, ContactPoint, OpeningHoursSpecification ; dans le <head> : non (body)
  - ProfessionalService : champs présents name, url, logo, telephone, email, address, areaServed, image ; absents sameAs, openingHoursSpecification, geo

Plan des titres (H1 à H3) :

- H1 : Parlons de votre projet IT à Angers _(textContent brut : votreprojet)_
  - H2 : Ce qui se passe après votre message _(textContent brut : passeaprès)_
  - H2 : Envoyer un message

Liens internes sortants :

| Cible | Ancre | Source de l'ancre | Zone | Nb | Statut cible |
| --- | --- | --- | --- | --- | --- |
| / | Léa Numérique [U+2013] retour à l'accueil | alt | header | 1 | 200 |
| / | Accueil | texte | header | 1 | 200 |
| /solutions | Solutions | texte | header | 1 | 200 |
| /services | Services | texte | header | 1 | 200 |
| /a-propos | À propos | texte | header | 1 | 200 |
| /contact | Prendre contact | texte | header | 1 | 200 |
| / | Accueil | texte | footer | 1 | 200 |
| /solutions | Solutions | texte | footer | 1 | 200 |
| /services | Services | texte | footer | 1 | 200 |
| /a-propos | À propos | texte | footer | 1 | 200 |
| /contact | Contact | texte | footer | 1 | 200 |
| /solutions#telephonie | Téléphonie IP | texte | footer | 1 | 200 |
| /solutions#reseaux | Réseaux & Infrastructure | texte | footer | 1 | 200 |
| /solutions#informatique | Informatique | texte | footer | 1 | 200 |
| /solutions#cybersecurite | Cybersécurité | texte | footer | 1 | 200 |
| /services#conseil | Conseil | texte | footer | 1 | 200 |
| /services#installation | Installation | texte | footer | 1 | 200 |
| /services#maintenance | Maintenance | texte | footer | 1 | 200 |
| /services#securite | Sécurité | texte | footer | 1 | 200 |
| /mentions-legales | Mentions légales | texte | footer | 1 | 200 |
| /politique-confidentialite | Politique de confidentialité | texte | footer | 1 | 200 |

Autres liens : tel 3, mailto 2 (`tel:+33219230691`, `mailto:hello@lea-numerique.fr`)

### /a-propos

- Title (47 car.) : Agence IT de proximité à Angers | Léa Numérique
- Meta description (150 car.) : Léa Numérique, intégrateur IT de proximité basé à Angers : téléphonie, réseau, informatique et cybersécurité pour entreprises, collectivités et santé.
- Canonical : `https://lea-numerique.fr/a-propos` (auto-référente)
- Meta robots : `index, follow` ; googlebot : `index, follow, max-image-preview:large, max-snippet:-1` ; X-Robots-Tag : aucun
- lang : `fr` ; og:url : `https://lea-numerique.fr/a-propos` ; og:image : `https://lea-numerique.fr/opengraph-image`
- Titres : 1 H1, 3 H2
- Mots dans <main> : 232 (page entière, header et footer compris : 307) ; texte rédigé : 126 mots en 5 paragraphe(s) d'au moins 12 mots
- Contenu dans le HTML initial : oui (rendu client forcé détecté : non) ; début du texte : « Notre histoire Une agence IT de proximité à Angers Depuis Angers, Léa Numérique accompagne entreprises, collectivités et établissements de santé dans leur transformation numérique depuis … »
- Images : 2, sans attribut alt : 0, alt vide (décoratives) : 0
- JSON-LD : ProfessionalService, WebSite ; types imbriqués : PostalAddress, City, AdministrativeArea, Country, ContactPoint, OpeningHoursSpecification ; dans le <head> : non (body)
  - ProfessionalService : champs présents name, url, logo, telephone, email, address, areaServed, image ; absents sameAs, openingHoursSpecification, geo

Plan des titres (H1 à H3) :

- H1 : Une agence IT de proximité à Angers _(textContent brut : ITde)_
  - H2 : Pourquoi Léa Numérique existe
  - H2 : Quatre valeurs, une seule mission _(textContent brut : valeurs,une)_
  - H2 : Travaillons ensemble

Liens internes sortants :

| Cible | Ancre | Source de l'ancre | Zone | Nb | Statut cible |
| --- | --- | --- | --- | --- | --- |
| / | Léa Numérique [U+2013] retour à l'accueil | alt | header | 1 | 200 |
| / | Accueil | texte | header | 1 | 200 |
| /solutions | Solutions | texte | header | 1 | 200 |
| /services | Services | texte | header | 1 | 200 |
| /a-propos | À propos | texte | header | 1 | 200 |
| /contact | Prendre contact | texte | header | 1 | 200 |
| /solutions#telephonie | téléphonie IP | texte | contenu | 1 | 200 |
| /solutions#reseaux | réseau | texte | contenu | 1 | 200 |
| /solutions#informatique | parc informatique | texte | contenu | 1 | 200 |
| /solutions#cybersecurite | cybersécurité | texte | contenu | 1 | 200 |
| /services#maintenance | maintenance | texte | contenu | 1 | 200 |
| /contact | Prendre contact | texte | contenu | 1 | 200 |
| / | Accueil | texte | footer | 1 | 200 |
| /solutions | Solutions | texte | footer | 1 | 200 |
| /services | Services | texte | footer | 1 | 200 |
| /a-propos | À propos | texte | footer | 1 | 200 |
| /contact | Contact | texte | footer | 1 | 200 |
| /solutions#telephonie | Téléphonie IP | texte | footer | 1 | 200 |
| /solutions#reseaux | Réseaux & Infrastructure | texte | footer | 1 | 200 |
| /solutions#informatique | Informatique | texte | footer | 1 | 200 |
| /solutions#cybersecurite | Cybersécurité | texte | footer | 1 | 200 |
| /services#conseil | Conseil | texte | footer | 1 | 200 |
| /services#installation | Installation | texte | footer | 1 | 200 |
| /services#maintenance | Maintenance | texte | footer | 1 | 200 |
| /services#securite | Sécurité | texte | footer | 1 | 200 |
| /mentions-legales | Mentions légales | texte | footer | 1 | 200 |
| /politique-confidentialite | Politique de confidentialité | texte | footer | 1 | 200 |

Autres liens : tel 2, mailto 2 (`tel:+33219230691`, `mailto:hello@lea-numerique.fr`)

### /mentions-legales

- Title (32 car.) : Mentions légales | Léa Numérique
- Meta description (141 car.) : Mentions légales de Léa Numérique, SAS basée 19 place du Président Kennedy à Angers : éditeur du site, hébergement, propriété intellectuelle.
- Canonical : `https://lea-numerique.fr/mentions-legales` (auto-référente)
- Meta robots : `index, follow` ; googlebot : `index, follow, max-image-preview:large, max-snippet:-1` ; X-Robots-Tag : aucun
- lang : `fr` ; og:url : `https://lea-numerique.fr/mentions-legales` ; og:image : `https://lea-numerique.fr/opengraph-image`
- Titres : 1 H1, 5 H2
- Mots dans <main> : 125 (page entière, header et footer compris : 200) ; texte rédigé : 113 mots en 5 paragraphe(s) d'au moins 12 mots
- Contenu dans le HTML initial : oui (rendu client forcé détecté : non) ; début du texte : « Mentions légales Éditeur du site Raison sociale Léa Numérique Forme juridique SAS Siège social 19 place du Président Kennedy, 49100 ANGERS Téléphone 02 19 23 … »
- Images : 2, sans attribut alt : 0, alt vide (décoratives) : 0
- JSON-LD : ProfessionalService, WebSite ; types imbriqués : PostalAddress, City, AdministrativeArea, Country, ContactPoint, OpeningHoursSpecification ; dans le <head> : non (body)
  - ProfessionalService : champs présents name, url, logo, telephone, email, address, areaServed, image ; absents sameAs, openingHoursSpecification, geo

Plan des titres (H1 à H3) :

- H1 : Mentions légales
  - H2 : Éditeur du site
  - H2 : Hébergement
  - H2 : Propriété intellectuelle
  - H2 : Limitation de responsabilité
  - H2 : Cookies

Liens internes sortants :

| Cible | Ancre | Source de l'ancre | Zone | Nb | Statut cible |
| --- | --- | --- | --- | --- | --- |
| / | Léa Numérique [U+2013] retour à l'accueil | alt | header | 1 | 200 |
| / | Accueil | texte | header | 1 | 200 |
| /solutions | Solutions | texte | header | 1 | 200 |
| /services | Services | texte | header | 1 | 200 |
| /a-propos | À propos | texte | header | 1 | 200 |
| /contact | Prendre contact | texte | header | 1 | 200 |
| / | Accueil | texte | footer | 1 | 200 |
| /solutions | Solutions | texte | footer | 1 | 200 |
| /services | Services | texte | footer | 1 | 200 |
| /a-propos | À propos | texte | footer | 1 | 200 |
| /contact | Contact | texte | footer | 1 | 200 |
| /solutions#telephonie | Téléphonie IP | texte | footer | 1 | 200 |
| /solutions#reseaux | Réseaux & Infrastructure | texte | footer | 1 | 200 |
| /solutions#informatique | Informatique | texte | footer | 1 | 200 |
| /solutions#cybersecurite | Cybersécurité | texte | footer | 1 | 200 |
| /services#conseil | Conseil | texte | footer | 1 | 200 |
| /services#installation | Installation | texte | footer | 1 | 200 |
| /services#maintenance | Maintenance | texte | footer | 1 | 200 |
| /services#securite | Sécurité | texte | footer | 1 | 200 |
| /mentions-legales | Mentions légales | texte | footer | 1 | 200 |
| /politique-confidentialite | Politique de confidentialité | texte | footer | 1 | 200 |

Autres liens : tel 2, mailto 1 (`tel:+33219230691`, `mailto:hello@lea-numerique.fr`)

### /politique-confidentialite

- Title (44 car.) : Politique de confidentialité | Léa Numérique
- Meta description (141 car.) : Comment Léa Numérique collecte, utilise et conserve les données transmises via son formulaire de contact, et comment exercer vos droits RGPD.
- Canonical : `https://lea-numerique.fr/politique-confidentialite` (auto-référente)
- Meta robots : `index, follow` ; googlebot : `index, follow, max-image-preview:large, max-snippet:-1` ; X-Robots-Tag : aucun
- lang : `fr` ; og:url : `https://lea-numerique.fr/politique-confidentialite` ; og:image : `https://lea-numerique.fr/opengraph-image`
- Titres : 1 H1, 6 H2
- Mots dans <main> : 158 (page entière, header et footer compris : 233) ; texte rédigé : 100 mots en 4 paragraphe(s) d'au moins 12 mots
- Contenu dans le HTML initial : oui (rendu client forcé détecté : non) ; début du texte : « Politique de confidentialité Collecte des données Léa Numérique collecte uniquement les données personnelles que vous nous transmettez via le formulaire de contact (nom, email, téléphone, … »
- Images : 2, sans attribut alt : 0, alt vide (décoratives) : 0
- JSON-LD : ProfessionalService, WebSite ; types imbriqués : PostalAddress, City, AdministrativeArea, Country, ContactPoint, OpeningHoursSpecification ; dans le <head> : non (body)
  - ProfessionalService : champs présents name, url, logo, telephone, email, address, areaServed, image ; absents sameAs, openingHoursSpecification, geo

Plan des titres (H1 à H3) :

- H1 : Politique de confidentialité
  - H2 : Collecte des données
  - H2 : Utilisation des données
  - H2 : Conservation des données
  - H2 : Vos droits
  - H2 : Partage des données
  - H2 : Contact DPO

Liens internes sortants :

| Cible | Ancre | Source de l'ancre | Zone | Nb | Statut cible |
| --- | --- | --- | --- | --- | --- |
| / | Léa Numérique [U+2013] retour à l'accueil | alt | header | 1 | 200 |
| / | Accueil | texte | header | 1 | 200 |
| /solutions | Solutions | texte | header | 1 | 200 |
| /services | Services | texte | header | 1 | 200 |
| /a-propos | À propos | texte | header | 1 | 200 |
| /contact | Prendre contact | texte | header | 1 | 200 |
| / | Accueil | texte | footer | 1 | 200 |
| /solutions | Solutions | texte | footer | 1 | 200 |
| /services | Services | texte | footer | 1 | 200 |
| /a-propos | À propos | texte | footer | 1 | 200 |
| /contact | Contact | texte | footer | 1 | 200 |
| /solutions#telephonie | Téléphonie IP | texte | footer | 1 | 200 |
| /solutions#reseaux | Réseaux & Infrastructure | texte | footer | 1 | 200 |
| /solutions#informatique | Informatique | texte | footer | 1 | 200 |
| /solutions#cybersecurite | Cybersécurité | texte | footer | 1 | 200 |
| /services#conseil | Conseil | texte | footer | 1 | 200 |
| /services#installation | Installation | texte | footer | 1 | 200 |
| /services#maintenance | Maintenance | texte | footer | 1 | 200 |
| /services#securite | Sécurité | texte | footer | 1 | 200 |
| /mentions-legales | Mentions légales | texte | footer | 1 | 200 |
| /politique-confidentialite | Politique de confidentialité | texte | footer | 1 | 200 |

Autres liens : tel 2, mailto 3 (`tel:+33219230691`, `mailto:hello@lea-numerique.fr`)

## 7. Liens internes : synthèse

### Liens cassés

_(aucun résultat)_

### Liens vers des URLs en redirection

_(aucun résultat)_

### Liens à fragment (#...)

| Lien | Page cible | id présent | Pages sources | Ancres |
| --- | --- | --- | --- | --- |
| /solutions#telephonie | /solutions | oui | 7 : /, /solutions, /services, /contact, /a-propos, /mentions-legales, /politique-confidentialite | Découvrir la téléphonie IP / Téléphonie IP / téléphonie IP |
| /solutions#reseaux | /solutions | oui | 7 : /, /solutions, /services, /contact, /a-propos, /mentions-legales, /politique-confidentialite | Découvrir nos solutions réseau / Réseaux & Infrastructure / Réseaux et Wi-Fi / réseau |
| /solutions#informatique | /solutions | oui | 7 : /, /solutions, /services, /contact, /a-propos, /mentions-legales, /politique-confidentialite | Découvrir notre offre informatique / Informatique / Postes de travail / Matériel informatique professionnel / parc informatique |
| /solutions#cybersecurite | /solutions | oui | 7 : /, /solutions, /services, /contact, /a-propos, /mentions-legales, /politique-confidentialite | Découvrir nos solutions de cybersécurité / Cybersécurité / Nos solutions de cybersécurité / cybersécurité |
| /services#maintenance | /services | oui | 7 : /, /solutions, /services, /contact, /a-propos, /mentions-legales, /politique-confidentialite | Nos contrats de maintenance / Maintenance / Contrats de maintenance informatique / maintenance |
| /services#securite | /services | oui | 7 : /, /solutions, /services, /contact, /a-propos, /mentions-legales, /politique-confidentialite | Nos services de sécurité informatique / Sécurité / Audit et protection de votre système d'information |
| /services#conseil | /services | oui | 7 : /, /solutions, /services, /contact, /a-propos, /mentions-legales, /politique-confidentialite | Conseil et audit informatique / Conseil |
| /services#installation | /services | oui | 7 : /, /solutions, /services, /contact, /a-propos, /mentions-legales, /politique-confidentialite | Installation / Installation et mise en service de votre téléphonie IP / Câblage et déploiement réseau |

### Liens entrants internes par page

Pages sources distinctes, liens d'une page vers elle-même exclus. « Navigation » = liens du header, du footer ou d'une zone hors <main>.

| Page | Profondeur | Pages sources (navigation) | Pages sources (contenu) | Liens (total) | Ancres reçues | Dans le sitemap |
| --- | --- | --- | --- | --- | --- | --- |
| / | 0 | 6 | 0 | 18 | Léa Numérique [U+2013] retour à l'accueil / Accueil | oui |
| /solutions | 1 | 6 | 3 | 52 | Solutions / Découvrir nos solutions / Découvrir la téléphonie IP / Découvrir nos solutions réseau / Découvrir notre offre informatique / Découvrir nos solutions de cybersécurité / Téléphonie IP / Réseaux & Infrastructure / Informatique / Cybersécurité / Toutes nos solutions IT / Réseaux et Wi-Fi / Postes de travail / Matériel informatique professionnel / Nos solutions de cybersécurité / téléphonie IP / réseau / parc informatique / cybersécurité | oui |
| /services | 1 | 6 | 3 | 45 | Services / Voir le détail de nos services / Nos contrats de maintenance / Nos services de sécurité informatique / Conseil et audit informatique / Conseil / Installation / Maintenance / Sécurité / Installation et mise en service de votre téléphonie IP / Câblage et déploiement réseau / Contrats de maintenance informatique / Audit et protection de votre système d'information / maintenance | oui |
| /contact | 1 | 6 | 4 | 24 | Prendre contact / Demander un devis gratuit / Contact / Demander un devis de téléphonie IP / Demander un devis réseau / Demander un devis informatique / Demander un devis cybersécurité / Demander un contrat de maintenance | oui |
| /a-propos | 1 | 6 | 1 | 13 | À propos / En savoir plus sur nous | oui |
| /mentions-legales | 1 | 6 | 0 | 6 | Mentions légales | oui |
| /politique-confidentialite | 1 | 6 | 0 | 6 | Politique de confidentialité | oui |

### Pages orphelines (dans le sitemap, jamais liées)

_(aucune)_

### Pages liées uniquement par la navigation (header, footer)

- /mentions-legales
- /politique-confidentialite

### Pages indexables absentes du sitemap

_(aucune)_

## 8. Comparaison des user-agents googlebot et chrome (HTML initial)

| Page | HTML identique à l'octet | Taille (crawl) | Taille (second UA) | Différences SEO |
| --- | --- | --- | --- | --- |
| / | oui | 124,0 ko | 124,0 ko | aucune |
| /solutions | oui | 87,1 ko | 87,1 ko | aucune |
| /services | oui | 119,4 ko | 119,4 ko | aucune |
| /contact | oui | 55,5 ko | 55,5 ko | aucune |
| /a-propos | oui | 64,7 ko | 64,7 ko | aucune |
| /mentions-legales | oui | 34,7 ko | 34,7 ko | aucune |
| /politique-confidentialite | oui | 35,7 ko | 35,7 ko | aucune |


## 9. Poids des pages (HTML initial, JS et CSS référencés)

Tailles gzip calculées localement (niveau par défaut) ; « Encodage servi » est la compression réellement appliquée par le serveur audité.

| Page | HTML brut | HTML gzip | Encodage servi | JS (fichiers) | JS brut | JS gzip | CSS brut | CSS gzip |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | 124,0 ko | 18,4 ko | gzip | 10 | 590,9 ko | 180,6 ko | 60,3 ko | 10,4 ko |
| /solutions | 87,1 ko | 13,4 ko | gzip | 9 | 566,8 ko | 173,3 ko | 60,3 ko | 10,4 ko |
| /services | 119,4 ko | 15,7 ko | gzip | 9 | 566,8 ko | 173,3 ko | 60,3 ko | 10,4 ko |
| /contact | 55,5 ko | 9,7 ko | gzip | 10 | 575,2 ko | 176,6 ko | 60,3 ko | 10,4 ko |
| /a-propos | 64,7 ko | 11,6 ko | gzip | 9 | 566,8 ko | 173,3 ko | 60,3 ko | 10,4 ko |
| /mentions-legales | 34,7 ko | 7,0 ko | gzip | 9 | 566,8 ko | 173,3 ko | 60,3 ko | 10,4 ko |
| /politique-confidentialite | 35,7 ko | 7,1 ko | gzip | 9 | 566,8 ko | 173,3 ko | 60,3 ko | 10,4 ko |

## 10. NAP visible et données structurées

### Téléphone (normalisé +33)

| Valeur normalisée | Forme trouvée | Où |
| --- | --- | --- |
| +33219230691 | 02 19 23 06 91 | / (texte), /solutions (texte), /services (texte), /contact (texte), /a-propos (texte), /mentions-legales (texte), /politique-confidentialite (texte) |
| +33219230691 | tel:+33219230691 | / (lien tel:), /solutions (lien tel:), /services (lien tel:), /contact (lien tel:), /a-propos (lien tel:), /mentions-legales (lien tel:), /politique-confidentialite (lien tel:) |
| +33219230691 | JSON-LD : +33219230691 | / (@graph[0]), / (@graph[0].contactPoint), /solutions (@graph[0]), /solutions (@graph[0].contactPoint), /services (@graph[0]), /services (@graph[0].contactPoint), /contact (@graph[0]), /contact (@graph[0].contactPoint), /a-propos (@graph[0]), /a-propos (@graph[0].contactPoint), /mentions-legales (@graph[0]), /mentions-legales (@graph[0].contactPoint), /politique-confidentialite (@graph[0]), /politique-confidentialite (@graph[0].contactPoint) |

### E-mail

| Valeur normalisée | Forme trouvée | Où |
| --- | --- | --- |
| hello@lea-numerique.fr | hello@lea-numerique.fr | / (texte), /solutions (texte), /services (texte), /contact (texte), /a-propos (texte), /mentions-legales (texte), /politique-confidentialite (texte) |
| hello@lea-numerique.fr | mailto:hello@lea-numerique.fr | / (lien mailto:), /solutions (lien mailto:), /services (lien mailto:), /contact (lien mailto:), /a-propos (lien mailto:), /mentions-legales (lien mailto:), /politique-confidentialite (lien mailto:) |
| hello@lea-numerique.fr | JSON-LD : hello@lea-numerique.fr | / (@graph[0]), / (@graph[0].contactPoint), /solutions (@graph[0]), /solutions (@graph[0].contactPoint), /services (@graph[0]), /services (@graph[0].contactPoint), /contact (@graph[0]), /contact (@graph[0].contactPoint), /a-propos (@graph[0]), /a-propos (@graph[0].contactPoint), /mentions-legales (@graph[0]), /mentions-legales (@graph[0].contactPoint), /politique-confidentialite (@graph[0]), /politique-confidentialite (@graph[0].contactPoint) |

### Adresse (rue)

| Valeur normalisée | Forme trouvée | Où |
| --- | --- | --- |
| 19 place du president kennedy | 19 place du Président Kennedy | / (texte), /solutions (texte), /services (texte), /contact (texte), /a-propos (texte), /mentions-legales (texte), /politique-confidentialite (texte) |
| 19 place du president kennedy | JSON-LD : 19 place du Président Kennedy | / (@graph[0].address), /solutions (@graph[0].address), /services (@graph[0].address), /contact (@graph[0].address), /a-propos (@graph[0].address), /mentions-legales (@graph[0].address), /politique-confidentialite (@graph[0].address) |

### Code postal et ville

| Valeur normalisée | Forme trouvée | Où |
| --- | --- | --- |
| 49100 angers | 49100 Angers | / (texte), /solutions (texte), /services (texte), /contact (texte), /a-propos (texte), /mentions-legales (texte), /politique-confidentialite (texte) |
| 49100 angers | JSON-LD : 49100 Angers | / (@graph[0].address), /solutions (@graph[0].address), /services (@graph[0].address), /contact (@graph[0].address), /a-propos (@graph[0].address), /mentions-legales (@graph[0].address), /politique-confidentialite (@graph[0].address) |
| 49100 angers | 49100 ANGERS | /mentions-legales (texte) |

### Horaires (normalisés)

| Valeur normalisée | Forme trouvée | Où |
| --- | --- | --- |
| lun-ven 09:00-17:30 | du lundi au vendredi, de 9h à 17h30 | / (texte) |
| lun-ven 09:00-17:30 | Lun[U+2013]Ven, 9h[U+2013]17h30 | / (texte) |
| lun-ven 09:00-17:30 | JSON-LD : @graph[0].contactPoint.hoursAvailable | /, /solutions, /services, /contact, /a-propos, /mentions-legales, /politique-confidentialite |
| lun-ven 09:00-17:30 | Lun [U+2013] Ven, 9h [U+2013] 17h30 | /contact (texte) |

## 11. Contrôles de rédaction

### Tirets demi-cadratins et cadratins

| Page | Emplacement | Caractère | Contexte |
| --- | --- | --- | --- |
| / | texte visible | U+2014 | …entreprises, professions libérales [U+2014] nos solutions s'adaptent à chaque … |
| / | texte visible | U+2013 | …@lea-numerique.fr Disponibilité Lun[U+2013]Ven, 9h[U+2013]17h30 Zone d'intervention A… |
| / | texte visible | U+2013 | …erique.fr Disponibilité Lun[U+2013]Ven, 9h[U+2013]17h30 Zone d'intervention Angers, M… |
| / | attribut alt | U+2013 | Léa Numérique [U+2013] retour à l'accueil |
| /solutions | attribut alt | U+2013 | Léa Numérique [U+2013] retour à l'accueil |
| /services | texte visible | U+2014 | … IT. Câblage, configuration, tests [U+2014] vous n'avez qu'à utiliser. Câblage… |
| /services | attribut alt | U+2013 | Léa Numérique [U+2013] retour à l'accueil |
| /contact | texte visible | U+2013 | …ment. Téléphone 02 19 23 06 91 Lun [U+2013] Ven, 9h [U+2013] 17h30 Email hello@lea-nu… |
| /contact | texte visible | U+2013 | …phone 02 19 23 06 91 Lun [U+2013] Ven, 9h [U+2013] 17h30 Email hello@lea-numerique.fr… |
| /contact | texte visible | U+2013 | …de Léa Numérique Disponibilité Lun [U+2013] Ven, 9h [U+2013] 17h30 Fermeture les week… |
| /contact | texte visible | U+2013 | …érique Disponibilité Lun [U+2013] Ven, 9h [U+2013] 17h30 Fermeture les week-ends Zone… |
| /contact | attribut alt | U+2013 | Léa Numérique [U+2013] retour à l'accueil |
| /a-propos | attribut alt | U+2013 | Léa Numérique [U+2013] retour à l'accueil |
| /mentions-legales | attribut alt | U+2013 | Léa Numérique [U+2013] retour à l'accueil |
| /politique-confidentialite | attribut alt | U+2013 | Léa Numérique [U+2013] retour à l'accueil |

### Tournures à éviter

_(aucun résultat)_
````

</details>

## Contrôles en production (lea-numerique.fr)

Contrôles faits le 19/10/2026 depuis l'extérieur : service public d'en-têtes HTTP de HackerTarget et lecture des pages en ligne. Le bac à sable de travail n'a pas d'accès direct au site, et le navigateur intégré a refusé de charger le domaine.

| URL testée | Résultat | Verdict |
|---|---|---|
| `http://lea-numerique.fr/` | `301 Moved Permanently` renvoyé par Apache 2.4.67 (Debian) vers `https://lea-numerique.fr/`, puis 200 : un seul saut | OK |
| `https://lea-numerique.fr/` | 200, page prérendue par Next.js (`x-nextjs-prerender`, `x-nextjs-cache: HIT`), compression gzip, `Cache-Control: s-maxage=31536000`, aucun `X-Robots-Tag` | OK |
| `https://lea-numerique.fr/pages/services` | 404 (page 404 de Next.js, `Cache-Control` en no-store) : confirme le rapport de la Search Console | À corriger (phase 1) |
| `https://lea-numerique.fr/robots.txt` | `User-Agent: *`, `Allow: /`, ligne `Sitemap` correcte | OK |
| `https://lea-numerique.fr/sitemap.xml` | 7 URLs, toutes au 2026-10-08, pages légales incluses | À faire évoluer (phase 2) |
| `https://lea-numerique.fr/services` (contenu) | Title, H1 et H2 identiques au code de `main` : la production est à jour | Info |
| `https://www.lea-numerique.fr/` | Aboutit sur le contenu du site, mais le code de la redirection (301 d'Apache ou 308 du filet de sécurité Next.js) n'a pas pu être relevé : quota du service d'en-têtes atteint | À vérifier |
| `Strict-Transport-Security` | En-tête absent sur la page d'accueil en HTTPS | Info (sécurité, sans effet direct sur le référencement) |

Vérification restante, à faire depuis un poste qui a accès au site :

```bash
curl -sI https://www.lea-numerique.fr/ | head -5
curl -sI http://www.lea-numerique.fr/ | head -5
```

Résultat attendu dans les deux cas : un seul `301` dont l'en-tête `Location` vaut `https://lea-numerique.fr/`. Si la réponse est un `308`, c'est le filet de sécurité de Next.js qui répond (la règle Apache manque) ; si `http://www` renvoie d'abord vers `https://www`, il y a une chaîne de deux redirections à corriger dans la configuration Apache.

## Liste priorisée des problèmes

Priorité 1 : effet direct sur l'indexation et le classement

1. Anciennes URLs Shopify en 404 sans redirection (C5) : poser les 4 redirections 301 de la phase 1, une fois le mapping validé par le propriétaire.
2. Architecture et maillage de `/solutions` (C23, C25) : créer les 4 pages `/solutions/*` et remplacer les liens `/solutions#...` du footer, de l'accueil, de `/services` et de `/a-propos` par des liens vers ces pages.
3. Contenu trop mince de `/services` (C22) : 108 mots de texte rédigé sur 345 ; le plan vise 500 à 800 mots utiles.
4. Sections de l'accueil invisibles dans un rendu sans défilement (C21) : afficher les sections par défaut et n'animer qu'au défilement réel, ou limiter la hauteur du hero, puis contrôler le HTML rendu dans la Search Console.
5. Mentions légales incomplètes (C37) : SIREN ou RCS, capital, TVA, directeur de la publication et hébergeur à fournir par le propriétaire.

Priorité 2 : cohérence et signaux

6. JSON-LD incomplet (C36) : `openingHoursSpecification` sur l'entreprise, `sameAs` dès que la fiche Google Business Profile et LinkedIn existent, Pays de la Loire dans `areaServed`, logo d'au moins 112 x 112 px lisible sur fond blanc, BreadcrumbList sur les nouvelles pages.
7. NAP codé en dur et formats divergents (C34) : faire passer toutes les occurrences par `src/lib/site.ts`, adopter un seul format d'horaires sans tiret demi-cadratin (« du lundi au vendredi, de 9h à 17h30 ») et écrire « Angers » plutôt que « ANGERS ».
8. Dates lastmod identiques (C13) : une date réelle par page.
9. Maillage vers `/a-propos` (C27) : au moins 3 liens contextuels depuis des pages différentes.
10. Filet de sécurité www en 308 (C9) : passer à `statusCode: 301` et vérifier en production que http et www aboutissent en un seul saut 301.

Priorité 3 : qualité, accessibilité, hygiène

11. Contrastes insuffisants (C31) : boutons, textes atténués et numéros décoratifs.
12. Coût du JavaScript à l'accueil (C30, C32) : TBT de 310 ms en local ; une animation en CSS éviterait de passer 6 sections en composants client.
13. Rédaction (C38, C19) : retirer les tirets demi-cadratins et cadratins (alt du logo, horaires, deux phrases), reprendre la tournure « Que vous souhaitiez [...] », ajouter l'espace manquant dans les titres concernés.
14. Pages légales (C14) : décider du passage en `noindex, follow` et du retrait du sitemap (phase 2.6).
15. Outillage (C39) : réparer `npm run lint` et `eslint.config.mjs`, supprimer le code mort, ne pas commiter `next-env.d.ts` réécrit par le build.
