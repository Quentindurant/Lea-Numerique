# Suivi de l'indexation après la refonte

Phase 6 du plan d'action. Ce document décrit quoi faire dans Search Console le jour de la mise en production de la refonte, comment lire les statuts d'indexation, et comment remplir les relevés à J0, J+7, J+14 et J+30. Il s'adresse au développeur du site.

Libellés et règles vérifiés dans l'aide Google le 19 octobre 2026 (sources en bas de page). Situation de départ : 11 URL connues de Google, 5 indexées, 4 anciennes URL Shopify en « Introuvable (404) », `/services` et `/mentions-legales` en « Détectée, actuellement non indexée ».

## En bref

| Quand | Action | Effort |
|---|---|---|
| J0, jour du déploiement | Contrôles en production, sitemap, une demande d'indexation pour chacune des 9 URL modifiées, annotation, premier relevé | 1 h |
| J0 ou J+1, une seule fois | « Valider la correction » sur le motif « Introuvable (404) », si les 4 redirections sont correctes | 5 min |
| J+7 | Relevé | 30 min |
| J+14 | Relevé, état de la validation des 404 | 30 min |
| J+30 | Relevé et bilan, premières requêtes hors marque | 1 h |

J0 est le jour où la branche de la refonte arrive sur `main` : le workflow GitHub Actions déploie alors automatiquement. Notez le commit déployé (ligne « Version déployée » du journal du workflow).

## 1. Avant de commencer

- **Droits** : il faut être propriétaire ou utilisateur avec accès complet de la propriété pour demander une indexation. L'aide Google demande les droits de propriétaire pour envoyer un sitemap.
- **Type de propriété** : regardez le sélecteur en haut à gauche de Search Console. Propriété de domaine (`sc-domain:lea-numerique.fr`) ou préfixe d'URL (`https://lea-numerique.fr/`). Le script de la section 7 en a besoin.
- **URL modifiées par la refonte** (une demande d'indexation chacune) : `/`, `/services`, `/solutions`, `/solutions/telephonie-ip`, `/solutions/operateur-telecom`, `/solutions/reseaux-wifi`, `/solutions/materiel-informatique`, `/solutions/cybersecurite`, `/solutions/alarme-videosurveillance`.

## 2. Procédure après le déploiement, dans l'ordre

### 2.1 Vérifier la production (15 minutes)

Depuis votre poste, dans un terminal bash (Linux, macOS, WSL ou Git Bash). Le site n'est pas joignable depuis les environnements d'agents.

**Anciennes URL** : chacune doit renvoyer un seul `301` vers une page qui répond `200`.

```bash
for u in /pages/services /collections/frontpage /products/snom-d150 /pages/partenaires; do
  curl -s -o /dev/null -w "$u -> %{http_code} vers %{redirect_url}\n" "https://lea-numerique.fr$u"
  curl -sL -o /dev/null -w "   %{num_redirects} redirection(s), final %{http_code} %{url_effective}\n" "https://lea-numerique.fr$u"
done
```

| Ancienne URL | Cible prévue au plan d'action (vérifier la cible réelle dans `next.config.ts`) | Résultat attendu |
|---|---|---|
| `/pages/services` | `/services` | `301`, puis 1 redirection, final `200` |
| `/collections/frontpage` | `/` | `301`, puis 1 redirection, final `200` |
| `/products/snom-d150` | `/solutions` (ou `/solutions/telephonie-ip` si la branche l'a choisi) | `301`, puis 1 redirection, final `200` |
| `/pages/partenaires` | `/a-propos` | `301`, puis 1 redirection, final `200` |

Un `308` signifie que la redirection a été déclarée avec `permanent: true` au lieu de `statusCode: 301` : Google la traite aussi comme permanente, mais le plan prévoit des 301.

**Hôtes** : `http://` et `www` doivent aboutir en une redirection sur `https://lea-numerique.fr/`.

```bash
for h in http://lea-numerique.fr/ https://www.lea-numerique.fr/ http://www.lea-numerique.fr/; do
  curl -sL -o /dev/null -w "$h : %{num_redirects} redirection(s), final %{http_code} %{url_effective}\n" "$h"
done
```

**Pages actuelles** : code `200`, canonique auto-référente, pas de `noindex` ni dans le HTML ni dans les en-têtes.

```bash
for p in / /solutions /solutions/telephonie-ip /solutions/operateur-telecom /solutions/reseaux-wifi /solutions/materiel-informatique /solutions/cybersecurite /solutions/alarme-videosurveillance /services /contact /a-propos; do
  code=$(curl -s -o /tmp/lea-page.html -w "%{http_code}" "https://lea-numerique.fr$p")
  canon=$(grep -oiE '<link[^>]+rel="canonical"[^>]*>' /tmp/lea-page.html | head -1)
  robots=$(grep -oiE '<meta[^>]+name="robots"[^>]*>' /tmp/lea-page.html | head -1)
  xrobots=$(curl -sI "https://lea-numerique.fr$p" | grep -i '^x-robots-tag' | tr -d '\r')
  echo "$p | $code | $canon | ${robots:-pas de meta robots} | ${xrobots:-pas d'en-tête X-Robots-Tag}"
done
```

Attendu pour chaque page : `200`, `<link rel="canonical" href="https://lea-numerique.fr/...">` qui pointe vers la page elle-même, `index, follow`, aucun en-tête `X-Robots-Tag`. Si la décision a été prise de passer `/mentions-legales` et `/politique-confidentialite` en `noindex, follow`, vérifiez-le aussi sur ces deux pages.

**Données structurées** (facultatif mais rapide) : passez l'accueil et une page solution dans le test des résultats enrichis, https://search.google.com/test/rich-results, et vérifiez que le nom, l'adresse et le téléphone sont ceux du site.

### 2.2 Sitemap

1. Contrôler le contenu :

   ```bash
   curl -s https://lea-numerique.fr/sitemap.xml | grep -oE '<loc>[^<]*</loc>|<lastmod>[^<]*</lastmod>'
   ```

   Attendu : les 6 pages solutions sont présentes, aucune ancienne URL, aucune URL qui redirige, des dates `lastmod` réelles (pas la même date partout).
2. Dans Search Console : Sitemaps > champ « Ajouter un sitemap » > `sitemap.xml` > « Envoyer ».
3. Vérifier, quelques heures ou jours plus tard, la colonne « État » : « Opération effectuée ». En cas d'« Impossible de récupérer le sitemap », Google réessaie quelques jours ; corrigez puis renvoyez.

Renvoyer le sitemap a du sens après une modification importante, ce qui est le cas ici. L'ancien « ping » de sitemap n'est plus pris en charge par Google : l'envoi se fait dans Search Console (et la ligne `Sitemap:` du robots.txt reste en place).

### 2.3 Inspection d'URL et une seule demande d'indexation par URL modifiée

Pour chacune des 9 URL, dans cet ordre : `/`, `/services`, `/solutions`, `/solutions/operateur-telecom`, `/solutions/telephonie-ip`, `/solutions/reseaux-wifi`, `/solutions/materiel-informatique`, `/solutions/cybersecurite`, `/solutions/alarme-videosurveillance`.

1. Coller l'URL complète (par exemple `https://lea-numerique.fr/solutions/telephonie-ip`) dans la barre d'inspection en haut de Search Console.
2. Lire l'état indexé : « Cette URL n'a pas été indexée par Google » est normal pour une page neuve ; « Cette URL est sur Google » signifie qu'elle peut apparaître dans les résultats.
3. Cliquer sur « Tester l'URL active ». Le test doit indiquer que l'URL est disponible pour Google (récupération réussie, indexation autorisée). Ouvrir la page testée et vérifier, dans le HTML, que le texte principal de la page est bien présent.
4. Cliquer une fois sur « Demander une indexation ». Si la page passe la vérification rapide, elle rejoint une file d'exploration prioritaire.
5. Noter la date de la demande dans la colonne « Remarques » du relevé J0.

Google limite le nombre de demandes par jour et par propriété sans publier le chiffre ; six demandes passent normalement dans la journée. Si un message indique que le quota est atteint, faites les URL restantes le lendemain, sans refaire celles déjà envoyées. Les pages non modifiées (`/contact`, `/a-propos`, accueil) n'ont pas besoin de demande : le sitemap suffit.

### 2.4 « Valider la correction » pour le motif « Introuvable (404) »

**Quand** : une seule fois, après que la section 2.1 a montré les 4 anciennes URL en `301` vers une page en `200`.

**Comment** : Indexation > Pages > tableau « Pourquoi les pages ne sont pas indexées » > ligne « Introuvable (404) ». Vérifier que la liste ne contient que les 4 anciennes URL (ou d'autres URL elles aussi redirigées), puis cliquer sur « Valider la correction ».

**Ce qui se passe ensuite** : la validation passe à « Commencé », Google explore à nouveau ces URL et envoie des e-mails de suivi. Comptez environ deux semaines, parfois beaucoup plus. Elle se termine en « Réussi », ou en « Échec » si une URL de la liste répond encore 404. Les URL redirigées passent ensuite dans « Page avec redirection » : c'est leur état normal et définitif, rien d'autre à faire.

**Ce qu'il ne faut pas faire** :
- ne pas lancer de validation si une URL de la liste n'a pas de page équivalente : une 404 est normale pour une page supprimée sans remplacement, et la validation échouerait ;
- ne pas relancer une validation tant que la précédente n'est pas terminée ;
- ne pas lancer de validation sur « Détectée, actuellement non indexée » : ce n'est pas une erreur à corriger mais une exploration reportée par Google, et la demande d'indexation de la section 2.3 est la bonne action.

Cette validation n'a aucun effet sur le classement : elle accélère seulement le nettoyage du rapport. Sans elle, Google repasse de toute façon sur les anciennes URL, de moins en moins souvent.

### 2.5 Annotation dans le rapport Performances

Performances > clic droit sur le graphique > ajouter une annotation (libellé anglais : « Add annotation »), datée du jour J0, 120 caractères au maximum, par exemple :

```text
Refonte SEO : 6 pages solutions dont opérateur télécom et alarme, /services réécrite, redirections 301 des anciennes URL (commit abc1234)
```

Les annotations sont visibles par tous les utilisateurs de la propriété ; propriétaires et utilisateurs avec accès complet peuvent en créer. Ajoutez-en une autre à la validation de la fiche Google et à chaque lien externe important.

### 2.6 Premier relevé (J0)

Lancez le script de la section 7, ou relevez à la main l'état de chaque URL dans l'outil d'inspection, et remplissez le tableau J0 de la section 5.

### 2.7 Ce qu'il ne faut pas faire

- Redemander l'indexation d'une URL déjà envoyée, ou tous les jours : les demandes répétées n'accélèrent pas l'exploration.
- Utiliser l'outil « Suppressions » sur les anciennes URL : il masque temporairement des URL dans les résultats et ne sert à rien pour des redirections.
- Laisser dans le sitemap des URL qui redirigent ou qui répondent 404.
- Changer à nouveau l'adresse des nouvelles pages : tout recommencerait.
- Utiliser l'API Indexing de Google ou un service payant qui promet une « indexation rapide » : l'API Indexing est réservée aux offres d'emploi et aux diffusions vidéo en direct.
- Tirer des conclusions avant J+30 : les positions bougent beaucoup pendant les premières semaines.

## 3. Ce que signifie chaque statut

Libellés du rapport Indexation > Pages et de l'outil d'inspection. Selon la langue demandée, l'API (section 7) peut renvoyer le motif en anglais : la deuxième colonne donne la correspondance.

| Statut dans Search Console | Valeur renvoyée par l'API (`verdict`, `coverageState`) | Ce que cela veut dire | Que faire | Délai réaliste |
|---|---|---|---|---|
| Cette URL est sur Google (page indexée) | `PASS`, « Submitted and indexed » ou « Indexed, not submitted in sitemap » | La page peut apparaître dans les résultats. | Rien. Suivre ses impressions. | |
| Détectée, actuellement non indexée | `NEUTRAL`, « Discovered - currently not indexed » | Google connaît l'URL mais a reporté l'exploration. | Maillage interne, sitemap, liens externes, une demande d'indexation. | Quelques jours à plusieurs semaines pour un site jeune. |
| Explorée, actuellement non indexée | `NEUTRAL`, « Crawled - currently not indexed » | Page explorée mais pas retenue pour l'instant. Google indique qu'il est inutile de redemander l'exploration. | Renforcer le contenu propre à la page et les liens internes, attendre. | Peut changer en quelques semaines. |
| Page avec redirection | `NEUTRAL`, « Page with redirect » | URL qui redirige vers une autre page (les anciennes URL Shopify). | Rien : état normal et définitif. | |
| Introuvable (404) | `NEUTRAL` ou `FAIL`, « Not found (404) » | L'URL renvoie 404. Googlebot la teste encore un moment, de moins en moins souvent. | Rediriger si une page équivalente existe, sinon laisser. | Disparaît progressivement. |
| Autre page avec balise canonique correcte | `NEUTRAL`, « Alternate page with proper canonical tag » | Variante d'une page qui désigne la bonne canonique, par exemple l'accueil avec les paramètres UTM de la fiche Google. | Rien. | |
| URL marquée « noindex » | `NEUTRAL`, « Excluded by ‘noindex’ tag » | Une directive `noindex` empêche l'indexation. | Rien si c'est voulu (mentions légales) ; sinon retirer la directive. | |
| Page en double : Google a choisi une autre URL canonique que l'utilisateur | `NEUTRAL`, « Duplicate, Google chose different canonical than user » | Google a retenu une autre canonique que celle déclarée. | Comparer `googleCanonical` et `userCanonical` ; vérifier www et sans www, et que deux pages ne se ressemblent pas trop. | |
| Erreur « soft 404 » | `FAIL` ou `NEUTRAL`, « Soft 404 » | Page qui répond 200 mais ressemble à une page d'erreur ou vide. | Vérifier le contenu rendu et les redirections vers des pages sans rapport. | |
| URL bloquée par le fichier robots.txt | « Blocked by robots.txt » | Le robots.txt interdit l'exploration. | Ne devrait pas arriver : le robots.txt du site autorise tout. | |
| URL inconnue de Google | `NEUTRAL`, « URL is unknown to Google » | Google n'a jamais vu l'URL. | Sitemap, liens internes, demande d'indexation. | Quelques jours après le sitemap. |

## 4. Délais réalistes

- **Sitemap** : lu en général dans les heures ou les jours qui suivent l'envoi.
- **Demande d'indexation** : Google indique un ou deux jours en général, parfois plus, sans garantie d'indexation.
- **Exploration en général** : « plusieurs jours, voire plusieurs semaines » selon Google.
- **Validation des 404** : environ deux semaines, parfois beaucoup plus.
- **Rapport Pages** : il se met à jour avec quelques jours de décalage sur l'outil d'inspection.
- **Classement** : les premières impressions sur des requêtes hors marque peuvent arriver en quelques semaines ; une position stable sur « informatique entreprise Angers » ou « téléphonie entreprise Angers » prend plusieurs mois et dépend aussi de la fiche Google et des liens externes.

## 5. Tableaux de suivi

Mode de remplissage :
- **Statut** et **dernière exploration** : tableau du script (section 7) ou outil d'inspection.
- **Impressions, clics, position moyenne** : Performances > Résultats de recherche, plage de dates personnalisée du J0 au jour du relevé, onglet « Pages ». Les données ont environ deux jours de retard.
- **Principales requêtes** : cliquer sur la page dans l'onglet « Pages », puis ouvrir l'onglet « Requêtes » ; noter les trois premières par impressions.

### J0 : relevé du JJ/MM/2026 (commit déployé : `.......`)

| URL | Statut d'indexation | Dernière exploration | Impressions | Clics | Position moyenne | Principales requêtes | Remarques |
|---|---|---|---|---|---|---|---|
| `/` | | | | | | | Indexation demandée le |
| `/solutions` | | | | | | | Indexation demandée le |
| `/solutions/telephonie-ip` | | | | | | | Indexation demandée le |
| `/solutions/operateur-telecom` | | | | | | | Indexation demandée le |
| `/solutions/reseaux-wifi` | | | | | | | Indexation demandée le |
| `/solutions/materiel-informatique` | | | | | | | Indexation demandée le |
| `/solutions/cybersecurite` | | | | | | | Indexation demandée le |
| `/solutions/alarme-videosurveillance` | | | | | | | Indexation demandée le |
| `/services` | | | | | | | Indexation demandée le |
| `/contact` | | | | | | | |
| `/a-propos` | | | | | | | |

### J+7 : relevé du JJ/MM/2026

| URL | Statut d'indexation | Dernière exploration | Impressions | Clics | Position moyenne | Principales requêtes | Remarques |
|---|---|---|---|---|---|---|---|
| `/` | | | | | | | |
| `/solutions` | | | | | | | |
| `/solutions/telephonie-ip` | | | | | | | |
| `/solutions/operateur-telecom` | | | | | | | |
| `/solutions/reseaux-wifi` | | | | | | | |
| `/solutions/materiel-informatique` | | | | | | | |
| `/solutions/cybersecurite` | | | | | | | |
| `/solutions/alarme-videosurveillance` | | | | | | | |
| `/services` | | | | | | | |
| `/contact` | | | | | | | |
| `/a-propos` | | | | | | | |

### J+14 : relevé du JJ/MM/2026

| URL | Statut d'indexation | Dernière exploration | Impressions | Clics | Position moyenne | Principales requêtes | Remarques |
|---|---|---|---|---|---|---|---|
| `/` | | | | | | | |
| `/solutions` | | | | | | | |
| `/solutions/telephonie-ip` | | | | | | | |
| `/solutions/operateur-telecom` | | | | | | | |
| `/solutions/reseaux-wifi` | | | | | | | |
| `/solutions/materiel-informatique` | | | | | | | |
| `/solutions/cybersecurite` | | | | | | | |
| `/solutions/alarme-videosurveillance` | | | | | | | |
| `/services` | | | | | | | |
| `/contact` | | | | | | | |
| `/a-propos` | | | | | | | |

### J+30 : relevé du JJ/MM/2026

| URL | Statut d'indexation | Dernière exploration | Impressions | Clics | Position moyenne | Principales requêtes | Remarques |
|---|---|---|---|---|---|---|---|
| `/` | | | | | | | |
| `/solutions` | | | | | | | |
| `/solutions/telephonie-ip` | | | | | | | |
| `/solutions/operateur-telecom` | | | | | | | |
| `/solutions/reseaux-wifi` | | | | | | | |
| `/solutions/materiel-informatique` | | | | | | | |
| `/solutions/cybersecurite` | | | | | | | |
| `/solutions/alarme-videosurveillance` | | | | | | | |
| `/services` | | | | | | | |
| `/contact` | | | | | | | |
| `/a-propos` | | | | | | | |

Si `/mentions-legales` et `/politique-confidentialite` restent indexables, ajoutez-les aux tableaux ; si elles passent en `noindex`, leur statut attendu est « URL marquée noindex ».

### Anciennes URL

| Ancienne URL | Code HTTP constaté (J0) | Statut Search Console J0 | Statut J+14 | Statut J+30 | Remarques |
|---|---|---|---|---|---|
| `/pages/services` | | | | | |
| `/collections/frontpage` | | | | | |
| `/products/snom-d150` | | | | | |
| `/pages/partenaires` | | | | | |

État de la validation « Introuvable (404) » : lancée le JJ/MM, statut à J+14 : ......, statut à J+30 : ......

### Synthèse

| Indicateur | J0 | J+7 | J+14 | J+30 |
|---|---|---|---|---|
| Pages indexées (rapport Pages) | | | | |
| Pages non indexées et motifs | | | | |
| Impressions totales depuis J0 | | | | |
| Clics totaux depuis J0 | | | | |
| Impressions hors marque | | | | |
| Clics hors marque | | | | |
| Nombre de requêtes hors marque distinctes | | | | |
| Fiche Google : vues, appels, clics vers le site (onglet Performances de la fiche) | | | | |
| Liens externes obtenus (voir `docs/seo/liens-externes.md`, section 8) | | | | |

Définition de « terminé » du plan d'action, à vérifier à J+30 : aucune 404 liée aux anciennes URL, `/services` et les nouvelles pages solutions indexées, sitemap sans URL en redirection ni en erreur, fiche Google validée, au moins trois liens externes, ce bilan livré avec les statuts et les premières requêtes.

## 6. Lire le rapport Performances pour repérer les premières requêtes hors marque

1. Performances > Résultats de recherche. Plage de dates personnalisée à partir de J0 ; activer les quatre courbes (clics, impressions, CTR, position moyenne).
2. **Exclure la marque** : ajouter un filtre sur « Requête », choisir l'option d'expression régulière personnalisée, puis la correspondance négative (ne correspond pas), avec :

   ```text
   l[ée]a[ .-]?num[ée]rique
   ```

   Cette expression écarte « léa numérique », « lea numerique », « leanumerique », « lea-numerique » et leurs variantes. Search Console utilise la syntaxe RE2 et les requêtes sont enregistrées en minuscules.
3. **Filtre automatique des requêtes de marque** : depuis fin 2025, Search Console propose un filtre qui sépare requêtes de marque et hors marque, réservé aux propriétés éligibles qui ont assez de requêtes. Il ne sera probablement pas disponible au début pour lea-numerique.fr ; l'expression régulière fait le même travail.
4. **Onglet « Requêtes »**, trié par impressions : ce sont les premières recherches pour lesquelles Google montre le site. Au début, attendez-vous à des positions éloignées (au-delà de 20) et à peu de clics ; les impressions arrivent avant les clics.
5. **Onglet « Pages »** : cliquer sur une page solution, puis revenir sur « Requêtes », pour voir sur quoi chaque page commence à être testée par Google.
6. **Ce qu'il faut repérer** :
   - requêtes qui contiennent un service et un lieu (« téléphonie ip angers », « câblage réseau maine et loire ») : ce sont les cibles locales ;
   - requêtes de marque de constructeurs (« yeastar », « fortinet », « ubiquiti ») associées à une page solution ;
   - requêtes en position 8 à 20 : la page est proche de la première page, un paragraphe plus précis ou un title plus clair peut suffire ;
   - requêtes avec beaucoup d'impressions et un CTR très faible : retravailler le title et la meta description de la page concernée ;
   - requêtes sans rapport avec l'offre (dépannage pour particuliers, emploi) : pas d'action, mais à noter.
7. **Exporter** les tableaux (bouton « Exporter ») à chaque relevé et garder les fichiers avec ce document.
8. À partir de J+30, utiliser la comparaison de dates (28 derniers jours et période précédente) pour mesurer l'évolution.

## 7. Le script `scripts/seo/gsc-inspection.mjs`

Le script interroge l'API Search Console URL Inspection en lecture seule et produit le tableau Markdown d'état d'indexation : URL, verdict, `coverageState`, dernière exploration (heure de Paris), canonique retenue par Google. Il ne demande jamais l'indexation : l'API ne le permet pas pour des pages classiques, la demande reste manuelle (section 2.3). Node 22 (20 minimum), sans dépendance.

### Mise en place (une fois, environ 20 minutes)

Les étapes détaillées sont en tête du fichier. En résumé :
1. Créer un projet Google Cloud avec le compte de l'entreprise et y activer « Google Search Console API ».
2. Créer un compte de service, puis une clé JSON. Si la création de clé est refusée, une règle d'organisation Google Cloud la bloque (active par défaut sur les organisations créées depuis mai 2024) : un administrateur doit l'assouplir pour ce projet.
3. Dans Search Console : Paramètres > Utilisateurs et autorisations > Ajouter un utilisateur, avec l'adresse du compte de service (`...@<projet>.iam.gserviceaccount.com`) et l'accès limité. Si l'API répond 403 alors que `--site` est correct, passer cet utilisateur en accès complet.

### Le fichier de clé est un secret

- Le ranger **hors du dépôt**, par exemple `~/.config/lea-numerique/gsc-inspection.json`, avec `chmod 600`.
- Ne jamais le commiter, ni le copier dans un ticket, un chat ou un e-mail. Le script affiche un avertissement si la clé se trouve dans le dépôt ou si le fichier est lisible par d'autres utilisateurs.
- En cas de fuite : Google Cloud > IAM et administration > Comptes de service > Clés > supprimer la clé, puis en créer une nouvelle. Le compte n'a qu'un accès en lecture, mais il donne accès aux données de la propriété.

### Utilisation

```bash
# Toutes les URL du sitemap, propriété de domaine (valeur par défaut)
node scripts/seo/gsc-inspection.mjs --key ~/.config/lea-numerique/gsc-inspection.json

# Propriété de type préfixe d'URL
node scripts/seo/gsc-inspection.mjs --key ~/.config/lea-numerique/gsc-inspection.json --site https://lea-numerique.fr/

# Quelques URL seulement (chemins ou URL complètes)
node scripts/seo/gsc-inspection.mjs --key ~/.config/lea-numerique/gsc-inspection.json --urls /services,/solutions

# Les anciennes URL, pour suivre leur passage en « Page avec redirection »
node scripts/seo/gsc-inspection.mjs --key ~/.config/lea-numerique/gsc-inspection.json \
  --urls /pages/services,/collections/frontpage,/products/snom-d150,/pages/partenaires

# Voir les requêtes sans rien envoyer (avec --key, le JWT est signé et vérifié localement)
node scripts/seo/gsc-inspection.mjs --dry-run --urls /services

# Enregistrer le tableau pour le coller dans ce document
node scripts/seo/gsc-inspection.mjs --key ~/.config/lea-numerique/gsc-inspection.json > inspection-J7.md
```

| Option | Rôle |
|---|---|
| `--key chemin.json` | Clé du compte de service. Obligatoire, sauf avec `--dry-run`. |
| `--site` | `sc-domain:lea-numerique.fr` (défaut) ou `https://lea-numerique.fr/`. |
| `--urls a,b,c` | URL à inspecter ; par défaut, celles de `https://lea-numerique.fr/sitemap.xml`. |
| `--sitemap` | Autre sitemap à lire (URL ou fichier local) quand `--urls` est absent. |
| `--lang` | Langue des messages de l'API, `fr-FR` par défaut. |
| `--dry-run` | Affiche la requête de jeton et les requêtes d'inspection sans les envoyer. |

Le tableau sort sur la sortie standard, la progression et les erreurs sur la sortie d'erreur. Code de sortie : 0 si tout est inspecté, 2 si une URL est en erreur ou si l'authentification échoue, 1 pour une erreur d'usage ou de réseau.

Exemple de sortie (valeurs fictives) :

```text
| URL | Verdict | coverageState | Dernière exploration (Paris) | Canonique retenue par Google |
|---|---|---|---|---|
| https://lea-numerique.fr/ | PASS (sur Google) | Submitted and indexed | 18/10/2026 11:12 | identique |
| https://lea-numerique.fr/services | NEUTRAL (exclue) | Discovered - currently not indexed | jamais | (aucune) |
| https://lea-numerique.fr/pages/services | NEUTRAL (exclue) | Page with redirect | 18/10/2026 00:15 | (aucune) |
```

`PASS` correspond à une page sur Google, `NEUTRAL` à une page exclue (non indexée, sans erreur), `FAIL` à une erreur. L'API donne l'état de la version indexée, comme l'outil d'inspection sans le test de l'URL active.

### En cas de problème

| Message | Cause probable | Solution |
|---|---|---|
| `ERREUR 403` | Compte de service absent des utilisateurs de la propriété, mauvais type de propriété, ou API non activée dans le projet | Vérifier les étapes de mise en place et la valeur de `--site` (le préfixe d'URL se termine par `/`). |
| Échec du jeton OAuth, « Invalid JWT Signature » | Clé supprimée ou régénérée | Télécharger une nouvelle clé JSON. |
| Échec du jeton OAuth, message sur `iat` ou `exp` | Horloge de l'ordinateur décalée | Activer la synchronisation automatique de l'heure. |
| `ERREUR 429` | Quota atteint : 2 000 inspections par jour et 600 par minute pour la propriété | Réessayer plus tard ; le script refait déjà deux tentatives. |
| « Ces URL n'appartiennent pas à la propriété » | URL avec `www` alors que la propriété est un préfixe sans `www`, ou autre domaine | Corriger `--urls` ou `--site`. |
| « URL is unknown to Google » | Google n'a pas encore vu l'URL | Normal pour une page neuve : sitemap et demande d'indexation. |

## Sources

Consultées le 19 octobre 2026.

- Google, Rapport sur l'indexation des pages (motifs, processus « Valider la correction », statuts de validation) : https://support.google.com/webmasters/answer/7440203?hl=fr
- Google, Outil d'inspection d'URL (« Tester l'URL active », « Demander une indexation », états) : https://support.google.com/webmasters/answer/9012289?hl=fr
- Google Search Central, Demander à Google d'explorer à nouveau vos URL (quota, demandes répétées, délais) : https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl?hl=fr
- Google, Rapport Sitemaps : https://support.google.com/webmasters/answer/7451001?hl=fr
- Google Search Central, fin du ping de sitemap (juin 2023) : https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping
- Google, Utilisateurs, propriétaires et autorisations de Search Console : https://support.google.com/webmasters/answer/7687615?hl=fr
- Google, Rapport sur les performances (définitions des métriques) : https://support.google.com/webmasters/answer/7576553?hl=fr
- Google Search Central, filtres par expression régulière dans Search Console : https://developers.google.com/search/blog/2021/06/regex-negative-match?hl=fr
- SEOcrawl, expressions régulières dans Search Console (RE2, casse) : https://seocrawl.ai/fr/blog/google-search-console-regex
- Google Search Central, filtre des requêtes de marque (novembre 2025) : https://developers.google.com/search/blog/2025/11/search-console-branded-filter ; extension aux propriétés éligibles (mars 2026) : https://blog.mean.ceo/?p=4894
- PPC Land, annotations personnalisées dans Search Console (17 novembre 2025) : https://ppc.land/google-search-console-adds-custom-annotations-for-performance-tracking/
- Google Search Central, API Indexing réservée aux offres d'emploi et aux diffusions en direct : https://developers.google.com/search/apis/indexing-api/v3/quickstart
- API Search Console, méthode urlInspection.index.inspect : https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect
- API Search Console, objet UrlInspectionResult (verdict, coverageState, lastCrawlTime, googleCanonical) : https://developers.google.com/webmaster-tools/v1/urlInspection.index/UrlInspectionResult
- API Search Console, quotas (2 000 par jour et 600 par minute par propriété) : https://developers.google.com/webmaster-tools/limits
- Google Identity, OAuth 2.0 pour les comptes de service (JWT RS256, point de terminaison du jeton) : https://developers.google.com/identity/protocols/oauth2/service-account
- Google Cloud, contraintes de base des organisations (blocage de la création de clés depuis le 3 mai 2024) : https://docs.cloud.google.com/organization-policy/manage-baseline-constraints
- DEV Community, causes des erreurs 403 de l'API URL Inspection (type de propriété, utilisateur non ajouté) : https://dev.to/morinaga/what-i-learned-debugging-gsc-url-inspection-api-403-sc-domain-vs-url-prefix-properties-438k
