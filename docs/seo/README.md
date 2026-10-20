# Refonte du référencement de lea-numerique.fr

Travail fusionné dans `main` le 20/10/2026, à partir de la version en production du 19/10/2026 (commit `c43b8b1`).
La mise en ligne se fait au `git push origin main` (le CI déploie `main`).

## Ce qui a été fait

| Phase | Contenu |
|---|---|
| 0. Audit | 40 constats sur la version en production, contrôles faits sur le site en ligne, script d'audit réutilisable |
| 1. Redirections | Les 4 anciennes URLs Shopify passent en 301 direct vers une page en 200, plus des filets pour `/pages/*`, `/collections/*` et `/products/*` ; filet www en 301 (et non 308) |
| 2. Architecture et contenu | 4 pages `/solutions/telephonie-ip`, `/solutions/reseaux-wifi`, `/solutions/materiel-informatique`, `/solutions/cybersecurite` (de 930 à 960 mots chacune, FAQ, exemple type) ; `/solutions` devient une page hub ; `/services` réécrite en texte suivi ; fil d'Ariane ; maillage sans liens `/solutions#...` ; sitemap à 9 URLs avec des lastmod réels ; `noindex, follow` sur les pages légales |
| 3. Données structurées | `Service`, `BreadcrumbList` et `FAQPage` sur les pages solutions, `FAQPage` sur l'accueil, horaires au niveau de l'entreprise |
| 4. Mentions légales | Page pilotée par l'objet `legal` de `src/lib/site.ts` : un champ vide ne s'affiche pas, le build liste les champs manquants |
| 5 et 6. Signaux externes et suivi | Fiche Google Business Profile prête à remplir, liens partenaires et annuaires, procédure Search Console, script d'inspection d'URL |
| Offre opérateur | Page `/solutions/operateur-telecom` (lignes fixes et trunks SIP, portabilité, forfaits mobiles, fibre pro) pour les recherches « opérateur téléphone 49 » ; positionnement « opérateur télécom » sur l'accueil (H1 avec le nom de l'entreprise, title, chapeau, carte dédiée, question de FAQ), le footer, le hub à 6 domaines, le JSON-LD et la fiche Google ; aucun nom d'autre opérateur, ni sur le site ni dans les documents |
| Alarme et vidéosurveillance | Page `/solutions/alarme-videosurveillance` (alarme anti-intrusion et incendie, télésurveillance, contrôle d'accès et interphonie, vidéosurveillance Hikvision et TP-Link, cadre CNIL et préfectoral) ; la cybersécurité est recentrée ; accueil, footer, hub à 6 domaines, métas et fiche Google mis à jour ; l'informatique reste une page, en retrait sur l'accueil (simple lien) |
| Corrections | Accueil : 6 sections restaient invisibles dans un rendu sans défilement (proche de celui de Googlebot), corrigé ; ESLint réparé (plantait déjà sur `main`) ; tirets longs retirés ; plus de données du formulaire dans la console du navigateur ; corrections de la relecture indépendante |

Vérifié sur le site construit (`node scripts/seo/audit-local.mjs http://localhost:3000`) : 11 URLs du sitemap en 200, indexables et canoniques ; anciennes URLs en un seul 301 ; slug inconnu en 404 ; un seul H1 par page ; title de 51 à 60 caractères et description de 143 à 155 sur toutes les pages indexables ; JSON-LD valide et identique au texte visible ; chaque page solution liée dans le texte de 8 pages différentes ; aucun nom d'opérateur partenaire dans le HTML rendu ; aucun débordement en 390 et 1280 px.

## Récupérer `main` et mettre en ligne

```bash
cd ~/workspace/Lea-Numerique
git checkout main
git pull --ff-only ./seo-refonte.bundle main   # avance main sur la version refondue
rm seo-refonte.bundle
npm install && npm run dev                      # relecture locale sur http://localhost:3000
git push origin main                            # déclenche le déploiement (CI)
```

L'historique publié ne contient que des commits relus, sans nom d'opérateur partenaire. Aucune branche de travail n'est à pousser.

## À fournir avant la mise en production

1. **Mentions légales (obligation LCEN)** : complètes, d'après le registre et l'hébergeur confirmé (dénomination LE@ Numérique, SAS au capital de 95 300 €, SIREN 837 873 694, RCS Angers, TVA FR51837873694, directeur de la publication : le représentant légal, Groupe GC Développement ; hébergeur : OVH SAS, 2 rue Kellermann, 59100 Roubaix). Pour nommer la personne physique qui représente Groupe GC Développement, modifier `publicationDirector` dans `src/lib/site.ts`.
2. **Numéro officiel** : confirmer le 02 19 23 06 91, et dire s'il passe par un serveur vocal (cela bloque la validation de la fiche Google par téléphone).
3. **Adresse** : des clients sont-ils reçus au 19 place du Président Kennedy, avec une enseigne ? Cela décide si l'adresse est visible ou masquée sur la fiche Google.

## À valider par le propriétaire

**Redirections** : `/products/snom-d150` vers `/solutions/telephonie-ip` (au lieu d'une 410), `/pages/partenaires` vers `/a-propos`, filets `/pages/*` vers l'accueil.

**Textes** (à relire dans `docs/seo/textes/*.md`, à corriger dans `src/content/solutions/*.ts`, `src/app/solutions/page.tsx` ou `src/content/services.ts`) :
- Téléphonie IP : secours en cas de coupure (non écrit, à ajouter si la prestation existe ; la portabilité est traitée sur la page opérateur) ; usage réel de Wazo et de 3CX (sur site ou hébergé) ; intitulé exact des certifications Yeastar et Fortinet.
- Réseaux et Wi-Fi : fibre entre bâtiments posée en propre ou sous-traitée ; visite sur place avant chaque projet ; Wi-Fi public en mairie (journaux de connexion non traités).
- Matériel informatique : marques des serveurs et des NAS ; impression libérée par code ; renouvellement du parc par vagues ; zone couverte par l'intervention sous 4h.
- Cybersécurité : éditeurs de l'antivirus, de l'EDR et du filtrage DNS ; lieu d'hébergement des sauvegardes et détenteur de la clé ; prestataire de sauvegarde certifié HDS pour les données de santé (EHPAD) ; Zyxel présenté comme pare-feu pour petites structures (repris de l'ancienne page) ; contenu de l'audit (aucun test d'intrusion annoncé).
- Services : audits gratuits ou facturés (la page contact titre « Audit & devis gratuit ») ; contenu des rapports mensuels ; numéro et horaires du helpdesk ; reprise d'installations faites par un autre prestataire ; longueur de la page (environ 1 850 mots, raccourcissable).
- **Télésurveillance** : l'exploitation d'un centre de télésurveillance est soumise à autorisation du CNAPS. La page ne présente pas Léa Numérique comme exploitant ; si elle signe les abonnements de télésurveillance en son nom, vérifier cette autorisation. Le délai d'intervention sous 4h n'est pas annoncé pour les alarmes et caméras (« selon votre contrat ») : à préciser si le contrat le prévoit.
- Visuel dédié à prévoir pour la page alarme et vidéosurveillance (elle réutilise l'image cadenas de /services).
- **Statut d'opérateur** : confirmé, Léa Numérique signe les contrats télécoms en son nom. Seule vérification restante : la déclaration préalable à l'Arcep (article L33-1 du code des postes et des communications électroniques), normalement déjà faite.
- Opérateur télécom : types de fibre vendus (FTTH pro, FTTE, FTTO) et engagements éventuels (débit garanti, GTR) ; secours de l'accès internet (4G/5G ou second lien, non écrit) ; prix, durées d'engagement, délais de portabilité et de mise en service (non écrits) ; Léa Numérique collecte-t-elle les RIO et dépose-t-elle les demandes de portabilité (la page le dit) ; le helpdesk couvre-t-il aussi les lignes, les mobiles et la fibre (la page le dit) ; migration des lignes d'alarme, d'ascenseur ou de TPE proposée ou non ; fourniture de smartphones, numéros SDA supplémentaires.
- Alarme et vidéosurveillance : les contrats de maintenance couvrent-ils aussi alarmes, caméras et contrôle d'accès (la page le dit) ; qui exploite le centre de télésurveillance et la levée de doute vidéo ou audio est-elle proposée ; périmètre exact en alarme incendie (aucune capacité SSI de catégorie A ou B n'est écrite) ; alarmes filaires et sans fil ; visite sur place systématique avant devis ; gammes Hikvision AcuSense et ColorVu, TP-Link VIGI et Omada citées comme produits des fabricants ; certifications éventuelles (APSAD, NF&A2P) ; aide au dossier préfectoral et à la signalétique CNIL.
- Hub `/solutions` et exemples types : rédigés à partir des faits du site uniquement, à confirmer comme réalistes.

**Changements visibles hors contenu** :
- Accueil : « Monitoring 24/7 » remplacé par « Monitoring réseau », « Matériel certifié » par « Postes HP, Lenovo et Dell » (affirmations non étayées).
- Accueil : les logos d'opérateurs ont été retirés du bandeau des partenaires, et leurs fichiers supprimés de `public/images/partenaire` et `assets/images/partenaire`. Le chiffre « 16 marques partenaires » de la page à propos est conservé.
- Le dépôt GitHub est public : la branche ne cite aucun autre opérateur, mais l'historique de `main` contient encore les anciens textes et logos du site actuel. Passer le dépôt en privé si c'est gênant.
- En-tête : le menu complet ne s'affiche qu'à partir de 1280 px (menu burger en dessous), car le logo et les liens se chevauchaient entre 768 et 1279 px.
- Pages légales : l'en-tête garde un fond sombre (le logo blanc était illisible sur fond clair).

**Points relevés, non modifiés** :
- Page à propos : « depuis plus de 10 ans » et le chiffre « 10+ ans d'expérience » alors que la société a été créée le 01/03/2018 (registre). À reformuler si l'ancienneté désigne l'expérience de l'équipe, par exemple « une équipe forte de plus de 10 ans d'expérience ».
- Contraste : le bouton principal (blanc sur `#7C6EFA`) est à 3,8:1, sous le seuil AA de 4,5:1 ; `#5A4ED8` donnerait 6:1. C'est un choix de charte.
- L'image `/images/telephonie-ip-entreprise.webp` porte la mention « designed by freepik » : vérifier la licence ou changer de visuel.
- Politique de confidentialité (à faire valider, idéalement par un juriste) : le sujet du formulaire n'est pas cité ; « vous informer de nos offres si vous y avez consenti » sans case de consentement ; finalité « améliorer nos services » trop vague ; pas de base légale ; responsable du traitement non identifié ; droits incomplets (opposition, limitation, réclamation auprès de la CNIL) ; EmailJS cité sans localisation ni garanties en cas de transfert hors UE ; accusé de réception automatique non mentionné ; pas de mention d'information sous le formulaire ; titre « Contact DPO » à revoir si aucun DPO n'est désigné ; rien sur les cookies (aucun cookie aujourd'hui, à revoir si un outil de mesure d'audience est ajouté) ; politique non datée.
- Accueil « Votre projet IT en 4 étapes » et `/services` en 5 étapes : deux découpages du même déroulé, à harmoniser si souhaité.

## Après le déploiement (dans l'ordre)

1. Contrôles en production, dont la redirection www à vérifier : `curl -sI https://www.lea-numerique.fr/` et `curl -sI http://www.lea-numerique.fr/` doivent renvoyer un seul 301 vers `https://lea-numerique.fr/`.
2. Search Console : soumettre à nouveau le sitemap, puis UNE demande d'indexation pour l'accueil, `/services`, `/solutions` et les 6 pages solutions (dont `/solutions/operateur-telecom` et `/solutions/alarme-videosurveillance`). Procédure complète : `suivi-indexation.md`.
3. Fiche Google Business Profile : `google-business-profile.md`. C'est le levier le plus rapide pour les recherches comme « informatique Angers ».
4. Liens partenaires et annuaires : `liens-externes.md`.
5. Suivi à J+7, J+14, J+30 : tableau dans `suivi-indexation.md`, script `scripts/seo/gsc-inspection.mjs` si un compte de service est créé.

Attente réaliste : l'indexation des nouvelles pages prend de quelques jours à quelques semaines ; se classer sur « informatique entreprise Angers » prend plusieurs mois et dépend surtout de la fiche Google et des liens externes.

## Index des documents

| Fichier | Rôle |
|---|---|
| `plan-action.md` | Plan d'action d'origine |
| `audit-avant.md` | Audit de référence avant refonte (constats C1 à C40) |
| `textes/*.md` | Texte des nouvelles pages, à relire (régénérer avec `scripts/seo/export-textes.py`) |
| `google-business-profile.md` | Création, validation et contenu de la fiche Google |
| `liens-externes.md` | Annuaires partenaires, annuaires locaux, LinkedIn, témoignages |
| `suivi-indexation.md` | Procédure Search Console et tableau de suivi |

Scripts : `scripts/seo/audit-local.mjs` (audit d'un site local ou en ligne, sans dépendance), `scripts/seo/export-textes.py` (export des textes), `scripts/seo/gsc-inspection.mjs` (API URL Inspection, lecture seule).
