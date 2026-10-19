# Plan d'action pour agent IA : référencement de lea-numerique.fr

Date de l'audit : 19/10/2026
Site : https://lea-numerique.fr (intégrateur IT à Angers : téléphonie IP, réseaux, informatique, cybersécurité)
Source du problème : rapport "Indexation des pages" de Google Search Console

---

## 1. Contexte et constats d'audit

### Ce que dit Google Search Console
- 11 pages connues : 5 indexées, 6 non indexées (2 motifs).
- Motif A, "Introuvable (404)", 4 URLs : `/pages/services`, `/collections/frontpage`, `/products/snom-d150`, `/pages/partenaires`. Dernière exploration entre avril et juin 2026.
- Motif B, "Détectée, actuellement non indexée", 2 URLs : `/services` et `/mentions-legales`. Première détection le 10/10/2026.

### Ce que l'audit du site a confirmé
| Point | Constat | Verdict |
|---|---|---|
| Techno | Site Next.js (images servies via `/_next/image`). Les anciennes URLs au format `/pages/`, `/collections/`, `/products/` viennent d'un ancien site (type Shopify) | Information |
| robots.txt | `User-Agent: *` / `Allow: /` + ligne `Sitemap:` correcte | OK |
| sitemap.xml | 7 URLs propres (accueil, solutions, services, contact, a-propos, mentions-legales, politique-confidentialite), aucune ancienne URL | OK |
| Balises | Chaque page a un title unique, une meta description, une canonical auto-référente, `index, follow` | OK |
| `/services` | Indexable, aucun blocage, contenu présent mais surtout des listes à puces (peu de texte rédigé) | Faible |
| Anciennes URLs | Les 4 renvoient bien une 404 sèche, sans redirection 301 | À corriger |
| `www` | `https://www.lea-numerique.fr/` aboutit sur la version sans www (type de redirection non vérifié) | À vérifier |
| Architecture | `/solutions` regroupe 4 sujets (téléphonie, réseaux, informatique, cybersécurité) sur une seule URL. Le maillage utilise des ancres `#telephonie`, `#reseaux`, etc., qui ne créent pas de pages indexables distinctes | Faiblesse majeure |
| Mentions légales | Pas de SIREN/RCS, pas de capital, pas de directeur de publication, hébergeur "disponible sur demande". Incomplet légalement (LCEN) et mauvais signal de confiance | À corriger (données à fournir par le propriétaire) |
| Données structurées | Non vérifiables par cet audit (le contenu récupéré ne montre pas les scripts JSON-LD) | À vérifier |
| Vitesse / Core Web Vitals | Non mesurés | À mesurer |

### Diagnostic
Il n'y a pas de blocage technique. Le site est très jeune pour Google (première détection le 10/10/2026), très petit (7 pages), avec peu de signaux de confiance externes. "Détectée, actuellement non indexée" signifie que Google connaît l'URL mais n'a pas jugé utile de l'indexer pour l'instant. Les leviers sont donc : (1) nettoyer l'héritage de l'ancien site, (2) renforcer le contenu et l'architecture, (3) obtenir des signaux externes, (4) corriger la conformité. Il ne faut pas sur-ingénierer la partie technique, elle est saine.

---

## 2. Règles pour l'agent

1. Ne jamais inventer d'information légale ou d'entreprise (SIREN, RCS, capital, nom du directeur de publication, hébergeur). Les demander au propriétaire.
2. Ne rien déployer en production sans validation humaine (checkpoints marqués **[VALIDATION]**).
3. Travailler sur une branche dédiée, un commit par phase, message de commit explicite.
4. Pas de contenu généré en masse ni de pages "villes" quasi identiques (risque de pages satellites). Chaque page doit apporter un contenu réellement utile et distinct.
5. Ne pas conserver de pages 404 qui ont un équivalent pertinent : rediriger. Ne pas rediriger vers l'accueil de façon systématique si la page cible n'a aucun rapport (Google peut traiter ça comme une soft 404).
6. Aucune demande d'indexation répétée en boucle : une demande par URL modifiée, puis attendre.
7. Rédiger sans tirets cadratins (tirets longs), avec un ton naturel, professionnel et local.

---

## 3. Phases

### Phase 0 : Audit de référence (lecture seule)
Objectif : figer un état "avant" mesurable.

Tâches :
- Vérifier les codes HTTP et en-têtes de : `/`, `/solutions`, `/services`, `/a-propos`, `/contact`, `/mentions-legales`, `/politique-confidentialite`, les 4 anciennes URLs, `http://` et `www`.
  - Attendu : 200 pour les pages actuelles, 301 unique (pas de chaîne) de `http` vers `https` et de `www` vers non-www.
- Vérifier la présence éventuelle d'un `X-Robots-Tag: noindex` dans les en-têtes (invisible dans le HTML).
- Récupérer la page rendue comme Googlebot (user-agent Googlebot smartphone) et comparer au rendu normal : le contenu est-il bien présent dans le HTML initial (SSR/SSG) ?
- Lister les données structurées existantes (JSON-LD) et les valider.
- Mesurer Lighthouse mobile (Performance, SEO, Accessibilité) sur accueil, `/solutions`, `/services`.
- Crawler le site en interne : liens cassés, liens vers les anciennes URLs, pages orphelines, profondeur de clic.
- Vérifier la cohérence du numéro de téléphone et de l'adresse (NAP) sur le site, dans le JSON-LD et dans les mentions légales.

Livrable : `audit-avant.md` (tableau constats, preuves, capture des en-têtes).

### Phase 1 : Redirections 301 des anciennes URLs
Objectif : supprimer les 4 erreurs 404 héritées de l'ancien site.

Mapping proposé :
| Ancienne URL | Cible | Justification |
|---|---|---|
| `/pages/services` | `/services` | Équivalent direct |
| `/collections/frontpage` | `/` | Page de collection racine de l'ancien site |
| `/pages/partenaires` | `/a-propos` (ou `/#partenaires` si une section existe) | Les partenaires sont présentés dans l'accueil et dans À propos |
| `/products/snom-d150` | `/solutions` | Page produit de téléphone IP, thématique la plus proche. Alternative : laisser en 410 si le propriétaire préfère |

Implémentation (si Next.js, à confirmer dans le dépôt) :

```js
// next.config.js
module.exports = {
  async redirects() {
    return [
      { source: '/pages/services', destination: '/services', permanent: true },
      { source: '/collections/frontpage', destination: '/', permanent: true },
      { source: '/pages/partenaires', destination: '/a-propos', permanent: true },
      { source: '/products/snom-d150', destination: '/solutions', permanent: true },
      // filet de sécurité pour les autres anciennes URLs
      { source: '/products/:slug*', destination: '/solutions', permanent: true },
      { source: '/collections/:slug*', destination: '/solutions', permanent: true },
      { source: '/pages/:slug*', destination: '/', permanent: true },
    ];
  },
};
```

Tests : chaque ancienne URL renvoie un seul 301 vers une page en 200, sans chaîne ni boucle.

**[VALIDATION]** Faire confirmer le mapping par le propriétaire avant déploiement.

Après déploiement : dans Search Console, ne pas cliquer sur "Valider la correction" de masse. Les anciennes URLs disparaîtront d'elles-mêmes à la prochaine exploration. Si besoin, valider uniquement le motif "Introuvable (404)" après déploiement des redirections.

### Phase 2 : Architecture et contenu (levier principal)
Objectif : donner à Google de vraies pages à indexer et à classer.

2.1 Éclater `/solutions` en pages dédiées :
- `/solutions/telephonie-ip` : Yeastar, 3CX, Yealink, Wazo
- `/solutions/reseaux-wifi` : câblage, Wi-Fi pro, VLAN/QoS, VPN, Ubiquiti, TP-Link, Zyxel
- `/solutions/materiel-informatique` : postes, serveurs, NAS, imprimantes, HP/Lenovo/Dell
- `/solutions/cybersecurite` : Fortinet, EDR, sauvegarde, PRA, audit, vidéosurveillance Hikvision

La page `/solutions` devient une page hub qui renvoie vers ces 4 pages avec des ancres descriptives (et non `#telephonie`).
Mettre en place une redirection de `/solutions#...` n'est pas nécessaire (les fragments ne sont pas envoyés au serveur), mais mettre à jour tous les liens internes (header, footer, accueil, `/services`, `/a-propos`).

2.2 Étoffer `/services` :
- Passer de listes à puces à du texte rédigé : au moins 500 à 800 mots utiles, sous-sections (conseil, installation, maintenance, sécurité), exemple de déroulé de projet, délais, cas concrets (mairie, EHPAD, notaire, PME).
- Ajouter des liens contextuels vers les 4 pages solutions.
- Conserver l'angle "maintenance informatique entreprise Angers" du title actuel.

2.3 Contenu par page solution (600 à 900 mots, unique) :
- Problème client, solution, marques, exemple de projet, déroulé, FAQ de 3 à 5 questions spécifiques.
- Mentions locales naturelles (Angers, Maine-et-Loire) sans bourrage.
- Un seul H1, H2/H3 cohérents, title de 50 à 60 caractères, meta description de 140 à 155 caractères, avec un appel à l'action.

2.4 Maillage interne :
- Chaque page importante reçoit au moins 3 liens internes depuis des pages différentes, avec une ancre descriptive.
- Ajouter un fil d'Ariane sur les pages profondes.

2.5 Ajouter au sitemap les nouvelles URLs avec un `lastmod` réel (date de dernière modification de chaque page, pas une date identique partout).

2.6 `/mentions-legales` et `/politique-confidentialite` : option recommandée, passer en `noindex, follow` et les retirer du sitemap. Elles n'ont aucune valeur SEO et polluent le rapport d'indexation. Alternative : les laisser indexables, sans impact négatif.

**[VALIDATION]** Faire valider le plan d'arborescence et les textes avant publication. Le propriétaire connaît ses vraies offres et références.

### Phase 3 : Données structurées
Objectif : aider Google à comprendre l'entité.

- `Organization` ou `ProfessionalService` (variante de `LocalBusiness`) sur toutes les pages : nom, URL, logo, adresse, téléphone, e-mail, horaires (lun-ven 9h-17h30), zone desservie (Angers, Maine-et-Loire), `sameAs` (LinkedIn, fiche Google Business Profile, etc. une fois créés).
- `BreadcrumbList` sur les pages profondes.
- `FAQPage` pour les FAQ : à garder pour la sémantique, mais ne pas en attendre d'extrait enrichi, Google les réserve désormais à quelques types de sites.
- Valider chaque type avec le test des résultats enrichis de Google et le validateur Schema.org.
- Les données du JSON-LD doivent correspondre exactement au contenu visible (NAP identique partout).

Modèle à compléter (les champs entre crochets sont à fournir, ne pas inventer) :

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Léa Numérique",
  "url": "https://lea-numerique.fr",
  "logo": "https://lea-numerique.fr/images/logo.png",
  "telephone": "[NUMERO AU FORMAT +33 VERIFIE]",
  "email": "hello@lea-numerique.fr",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "19 place du Président Kennedy",
    "postalCode": "49100",
    "addressLocality": "Angers",
    "addressCountry": "FR"
  },
  "areaServed": ["Angers", "Maine-et-Loire", "Pays de la Loire", "France"],
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "09:00",
    "closes": "17:30"
  }],
  "sameAs": ["[URL LINKEDIN]", "[URL GOOGLE BUSINESS PROFILE]"]
}
```

### Phase 4 : Conformité et confiance
- Compléter les mentions légales avec les données réelles : SIREN/RCS, capital social, numéro de TVA intracommunautaire, directeur de la publication, nom et coordonnées de l'hébergeur (obligatoire, "sur demande" ne suffit pas).
- Vérifier la politique de confidentialité (cohérence avec le formulaire de contact et les cookies).
- Vérifier que le numéro de téléphone affiché est bien le numéro réel et joignable. Un NAP incohérent nuit au référencement local.

**[VALIDATION]** Informations à fournir par le propriétaire avant toute modification.

### Phase 5 : Signaux externes (tâches humaines, l'agent prépare le matériel)
C'est le levier qui accélère le plus l'indexation d'un site neuf.
- Créer et vérifier la fiche **Google Business Profile** (catégorie "Prestataire de services informatiques", adresse, horaires, zone de service, photos, description). L'agent rédige les textes.
- Liens depuis les sites des partenaires (pages "revendeurs / partenaires certifiés" de Yeastar, 3CX, Yealink, Ubiquiti, Fortinet, etc.) : l'agent liste les programmes et prépare les demandes.
- Annuaires professionnels sérieux (CCI, annuaires locaux angevins, annuaires IT) : liste priorisée, pas de spam d'annuaires.
- Page LinkedIn entreprise avec lien vers le site.
- Faire reconnaître les 800+ clients et références : demander quelques témoignages ou études de cas publiables (avec accord des clients).

### Phase 6 : Soumission et suivi
- Re-soumettre le sitemap mis à jour dans Search Console.
- **Manuel** : dans l'inspection d'URL, demander l'indexation de `/services`, des 4 nouvelles pages solutions et de la page hub, une fois publiées. L'API d'inspection d'URL est en lecture seule, elle sert au suivi mais ne permet pas de demander l'indexation de pages classiques.
- Suivi hebdomadaire via l'API d'inspection d'URL (si accès disponible) ou par export Search Console : statut d'indexation de chaque URL, date de dernière exploration, requêtes et impressions.
- Rapport à J+7, J+14, J+30.

Attentes réalistes : l'indexation d'un site neuf prend de quelques jours à plusieurs semaines. Une page "détectée, actuellement non indexée" peut passer en indexée sans autre action une fois la qualité et les liens renforcés. Le classement sur des requêtes concurrentielles comme "informatique entreprise Angers" prend plusieurs mois.

---

## 4. Priorisation

| Priorité | Action | Effort | Impact |
|---|---|---|---|
| 1 | Redirections 301 des 4 anciennes URLs (Phase 1) | Faible | Moyen (nettoyage) |
| 1 | Google Business Profile + 3 à 5 liens externes de qualité (Phase 5) | Moyen | Élevé |
| 2 | Éclatement de `/solutions` en 4 pages + étoffement de `/services` (Phase 2) | Élevé | Élevé |
| 2 | Mentions légales complètes (Phase 4) | Faible | Moyen |
| 3 | Données structurées (Phase 3) | Faible | Moyen |
| 3 | `noindex` sur mentions légales et confidentialité (Phase 2.6) | Faible | Faible |

---

## 5. Définition de "terminé"

- 0 erreur 404 liée aux anciennes URLs dans Search Console et 4 redirections 301 propres en production.
- `/services` et les nouvelles pages solutions en statut "Indexée".
- Sitemap à jour, sans URL en redirection ni en erreur.
- JSON-LD valide, NAP identique partout.
- Mentions légales complètes.
- Fiche Google Business Profile vérifiée et au moins 3 liens externes obtenus.
- Rapport de suivi à J+30 livré avec les statuts d'indexation et les premières requêtes.

---

## 6. Livrables attendus de l'agent
1. `audit-avant.md` (Phase 0)
2. Branche Git avec les redirections, nouvelles pages, JSON-LD, sitemap
3. Textes des nouvelles pages (un fichier par page pour relecture)
4. Textes de la fiche Google Business Profile et liste des liens à solliciter
5. `suivi-indexation.md` mis à jour chaque semaine

## 7. Informations à demander au propriétaire avant de commencer
- Accès au dépôt et à l'hébergement, accès Search Console.
- SIREN/RCS, capital, TVA, directeur de publication, hébergeur.
- Confirmation du numéro de téléphone officiel.
- Liste réelle des offres, références et études de cas publiables.
- Validation du mapping des redirections et de l'arborescence.
