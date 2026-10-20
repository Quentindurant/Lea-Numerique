# Fiche Google Business Profile de Léa Numérique

Phase 5 du plan d'action, priorité 1. Ce document sert à créer, valider puis animer la fiche d'établissement Google de Léa Numérique. Il s'adresse au développeur du site, qui fait la démarche avec le dirigeant.

Limites, libellés et règles vérifiés dans l'aide Google et des sources récentes le 19 octobre 2026 (liste en bas de page). Google modifie régulièrement l'interface : si un libellé diffère légèrement, suivez le sens et notez l'écart dans ce document.

## En bref

| Étape | Qui | Effort estimé |
|---|---|---|
| 1. Répondre aux questions préalables (section 2) | Dirigeant | 15 min |
| 2. Vérifier qu'aucune fiche n'existe déjà, puis créer la fiche | Dirigeant (compte Google de l'entreprise) avec le développeur | 30 min |
| 3. Valider la fiche (méthode imposée par Google) | Dirigeant | 15 min à 1 h, puis jusqu'à 5 jours ouvrés d'examen (14 jours si courrier) |
| 4. Ajouter le développeur comme administrateur | Dirigeant | 5 min |
| 5. Coller description, services, horaires, zone, lien (sections 7 à 12) | Développeur | 45 min |
| 6. Photos (section 13) | Dirigeant et équipe | 1 à 2 h de prise de vue |
| 7. Trois premières publications (section 14) | Développeur | 20 min, une par semaine |
| 8. Demandes d'avis aux clients existants (section 15) | Dirigeant | 1 h, puis au fil des projets |

Ne modifiez ni le nom, ni l'adresse, ni la catégorie pendant la validation : un code reçu par courrier ne fonctionnerait plus et la validation serait à refaire.

## 1. Pourquoi c'est le levier le plus rapide

- Pour une recherche comme « informatique Angers » ou « téléphonie entreprise Angers », Google affiche en général, au-dessus ou au milieu des résultats classiques, un bloc de résultats locaux avec une carte. Ce bloc vient des fiches d'établissement, pas du classement du site.
- Google classe ces fiches selon la pertinence (la fiche correspond-elle à la recherche ?), la distance entre l'établissement et la personne qui cherche, et la proéminence (notoriété, liens vers l'établissement, nombre d'avis et notes). Il précise qu'il n'existe aucun moyen de payer pour être mieux placé.
- Le site est très jeune pour Google (première détection le 10/10/2026). Se classer dans les résultats classiques sur ces requêtes prendra plusieurs mois, alors qu'une fiche validée et complète peut apparaître dans les résultats locaux dès les jours ou semaines qui suivent la validation, sans garantie de position.
- La fiche est aussi la première source externe qui confirme à Google le nom, l'adresse et le téléphone décrits dans le JSON-LD du site. Une fois créée, son URL rejoint le champ `sameAs` de `src/lib/site.ts`.
- Depuis la fin de 2025, Google retire les questions-réponses des fiches. Aux États-Unis et en Inde, une fonction appelée Ask Maps (Gemini) répond aux questions des internautes à partir des informations de la fiche, des avis, des photos et du site. D'après la presse de mars et mai 2026, ces fonctions n'étaient pas encore ouvertes en France ; elles montrent toutefois que la fiche et le site deviennent la matière première des réponses générées par Google.

## 2. Questions à poser au dirigeant avant de commencer

| Question | Pourquoi |
|---|---|
| Recevez-vous des clients au 19 place du Président Kennedy, avec une personne présente pendant les horaires affichés ? | Décide si l'adresse est visible ou masquée (section 4). |
| Une enseigne ou une plaque permanente au nom de Léa Numérique est-elle visible à cette adresse ? | La validation par vidéo exige le nom sur un support permanent pour un établissement qui reçoit du public. |
| Cette adresse est-elle une domiciliation, un centre d'affaires ou un espace de coworking ? | Google refuse les fiches sur une adresse de domiciliation. En coworking, la fiche n'est acceptée qu'avec une signalétique claire, du personnel présent et des clients reçus. |
| Le 02 19 23 06 91 arrive-t-il directement sur une personne, ou passe-t-il par un serveur vocal ? Peut-il recevoir des SMS ? | Les serveurs vocaux interactifs ne reçoivent pas le code de validation téléphonique de Google. |
| Une fiche Léa Numérique existe-t-elle déjà (créée par Google, par un ancien prestataire ou par l'ancien site) ? | Une seule fiche par établissement : on revendique l'existante au lieu d'en créer une seconde. |
| Quel compte Google sera propriétaire principal ? | Un compte de l'entreprise (par exemple lié à hello@lea-numerique.fr), pas un compte personnel. Il n'y a qu'un seul propriétaire principal par fiche. |
| Mois et année de création de l'entreprise, jours de fermeture (jours fériés, congés) ? | Champ « date d'ouverture » (mois et année suffisent) et horaires exceptionnels. Ne rien deviner. |

## 3. Création et validation, étape par étape

1. **Chercher une fiche existante.** Dans Google Maps, cherchez « Léa Numérique Angers », puis le numéro « 02 19 23 06 91 ».
   - Fiche trouvée mais non gérée : ouvrez-la, choisissez « Revendiquer cet établissement », puis « Gérer ».
   - Fiche déjà gérée par quelqu'un d'autre : faites une demande de propriété depuis la fiche (article Google « Demander la propriété d'une fiche », lien en bas de page). Ne créez pas de doublon.
2. **Se connecter avec le compte Google de l'entreprise**, ouvrir [business.google.com/add](https://business.google.com/add) et choisir « Ajouter votre établissement sur Google ».
3. **Nom** : `Léa Numérique`, exactement (section 5).
4. **Catégorie principale** : la catégorie télécoms, « Fournisseur de services de télécommunications » ou l'intitulé équivalent proposé par l'interface (section 6). Ajoutez les catégories secondaires une fois la validation terminée : Google demande de ne pas modifier la catégorie pendant la validation.
5. **Lieu que les clients peuvent visiter** : répondre selon la section 4. Si la réponse est non, l'adresse est saisie pour la validation mais n'est pas affichée.
6. **Zone desservie** : Angers, Maine-et-Loire, Pays de la Loire (section 10).
7. **Coordonnées** : téléphone `02 19 23 06 91`, site `https://lea-numerique.fr/?utm_source=google&utm_medium=organic&utm_campaign=gbp-fiche` (section 12).
8. **Validation** : Google propose lui-même une ou plusieurs méthodes, on ne peut pas les choisir.
   - *Téléphone ou SMS* : il faut répondre au numéro de l'établissement. Si un serveur vocal décroche, demandez au dirigeant de router temporairement la ligne vers un poste, ou choisissez le SMS si la ligne les reçoit.
   - *E-mail* : suivre le lien reçu à l'adresse affichée par Google.
   - *Appel vidéo en direct* : pendant les heures ouvrées, depuis l'établissement, avec un appareil compatible. Il faut montrer l'emplacement (façade, panneau de rue), le matériel de l'entreprise et l'accès à des zones réservées au personnel.
   - *Vidéo enregistrée* (recommandée par Google quand elle est proposée) : un seul plan continu de 30 secondes minimum, filmé en direct depuis un mobile dans l'application, sans montage. Préparez la liste des plans avant de filmer :
     - établissement qui reçoit du public : panneau de rue ou numéro, façade et enseigne au nom de Léa Numérique, puis vous dans un espace réservé au personnel (bureau technique, stock) ;
     - zone desservie sans accueil : repères de la rue à l'adresse, outils et matériel (valise d'outillage, testeur de câblage, matériel en stock), véhicule ou vêtements au nom de l'entreprise s'il y en a, document au nom de Léa Numérique à cette adresse (facture d'énergie ou de télécom).
     Ne filmez ni numéros bancaires ou d'identité, ni visages d'autres personnes, ni écrans contenant des données de clients.
   - *Courrier* : code à cinq chiffres reçu sous 14 jours environ, valable 30 jours. Ne redemandez pas de code entre-temps, cela annule le précédent.
9. **Examen** : jusqu'à cinq jours ouvrés après la validation, parfois plus. Si Google affiche « Examiner les problèmes », suivez les instructions (par exemple refaire une vidéo complète avec les éléments manquants).
10. **Ajouter le développeur** : Plus > Paramètres de la fiche > Utilisateurs et accès > Ajouter, rôle « Administrateur ». L'administrateur peut tout modifier, répondre aux avis et publier, mais ne peut ni ajouter d'utilisateurs ni supprimer la fiche. Le dirigeant reste propriétaire.
11. **Compléter la fiche** avec les sections 6 à 14, puis lancer les demandes d'avis (section 15).

## 4. Adresse visible ou zone desservie

| Situation à l'adresse du 19 place du Président Kennedy | Réglage dans la fiche |
|---|---|
| Des clients y sont reçus pendant les horaires, une personne est présente, le nom est affiché en permanence | Adresse visible et zone desservie (établissement « mixte » selon Google). |
| Aucun client n'y est reçu : l'équipe se déplace chez les clients ou intervient à distance | Adresse masquée, zone desservie seule. L'adresse est quand même saisie : Google en a besoin pour la validation, mais ne l'affiche pas. |
| Adresse de domiciliation ou bureau virtuel | Pas de fiche à cette adresse. Voir avec le dirigeant le lieu réel de travail de l'équipe. |
| Espace de coworking | Fiche possible seulement avec signalétique claire, personnel présent et clients reçus. Sinon, zone desservie seule depuis le lieu de travail réel. |

Ce choix est à faire confirmer par le dirigeant. Masquer l'adresse sur la fiche ne crée pas d'incohérence avec le site : le site peut continuer à l'afficher.

## 5. Nom de la fiche

Saisir **Léa Numérique**, tel qu'il apparaît sur le site et sur les documents de l'entreprise.

| À ne pas saisir | Raison |
|---|---|
| Léa Numérique Angers | Information géographique ajoutée au nom. |
| Léa Numérique, informatique et téléphonie | Description de services ajoutée au nom. |
| LÉA NUMÉRIQUE | Nom entièrement en majuscules. |
| Léa Numérique SAS | La forme juridique n'est pas utilisée dans le nom d'usage. |

Google peut suspendre une fiche dont le nom ne respecte pas ces règles. Les mots-clés se placent dans les catégories, la description et les services.

## 6. Catégories

Google autorise une catégorie principale et jusqu'à neuf catégories secondaires, mais recommande d'en choisir le moins possible, en se demandant ce que l'établissement *est* et non ce qu'il vend. Les catégories ne doivent pas servir à ajouter des mots-clés.

**Intitulés vérifiés** dans la liste française des catégories Google pour la France (liste extraite par l'outil PlePer, consultée le 19/10/2026) :

| Intitulé exact | Identifiant Google | Verdict | Justification |
|---|---|---|---|
| Assistance et services informatiques | `computer_support_and_services` | Secondaire (principale seulement si la catégorie télécoms est introuvable) | Installation, maintenance sous contrat, helpdesk, gestion de parc. L'informatique est désormais une activité en retrait. |
| Service réseaux informatiques | `computer_networking_center` | Secondaire | Câblage RJ45 et fibre, Wi-Fi professionnel, VLAN, VPN, équipements actifs. |
| Service de sécurité informatique | `computer_security_service` | Secondaire | Pare-feu Fortinet, EDR, filtrage, sauvegarde, audit de sécurité, PRA. |
| Consultant informatique | `computer_consultant` | Secondaire | Audit de l'existant, préconisations, plan de transformation IT. |
| Télévision en circuit fermé (CCTV) | `closed_circuit_television` | Secondaire | Vidéosurveillance (Hikvision, TP-Link) : activité confirmée par le propriétaire. |
| Service de réparation d'ordinateurs | `computer_repair_service` | À éviter | Attire les demandes de dépannage de particuliers, hors de la cible. |
| Magasin d'informatique | `computer_store` | À éviter | Pas de magasin ouvert au public. |
| Services aux entreprises | `business_to_business_service` | Inutile | Trop générique, n'apporte aucune pertinence. |

Il n'existe pas de catégorie intitulée « Prestataire de services informatiques » (formulation du plan d'action) : l'équivalent est « Assistance et services informatiques ». Il n'existe pas non plus de catégorie « Téléphonie d'entreprise ».

**Téléphonie : une catégorie à confirmer dans l'interface.** L'intitulé français 2026 des catégories télécoms n'a pas pu être lu : notre outil n'a récupéré que la première moitié de la liste (jusqu'à la lettre L, sur 3 878 catégories). Les identifiants existent ; les libellés ci-dessous sont ceux d'une liste de 2021 et peuvent avoir changé :

| Identifiant Google | Libellé 2021, à vérifier | Quand la choisir |
|---|---|---|
| `telecommunications_service_provider` | Fournisseur de services de télécommunications | **À retenir** : le propriétaire confirme que Léa Numérique vend des lignes fixes et trunks SIP, la portabilité des numéros, des forfaits mobiles et des accès internet fibre pro. |
| `telecommunications_contractor` | Entrepreneur en télécommunications | Si l'activité téléphonie est surtout l'installation (IPBX, postes, câblage). |
| `telephone_company` | Compagnie de téléphone | À éviter : catégorie des opérateurs de téléphonie grand public, la catégorie précédente correspond mieux à une offre pour les entreprises. |
| `security_system_installer` | Installateur du système de sécurité | **À retenir** en secondaire : alarmes anti-intrusion et incendie, télésurveillance, contrôle d'accès et interphonie (activités confirmées). |

Pour les trouver, tapez « télécom » ou « sécurité » dans le champ catégorie et retenez l'intitulé proposé dont le sens correspond.

**Proposition (6 catégories)** : principale « Fournisseur de services de télécommunications » (intitulé à confirmer dans l'interface, voir le tableau ci-dessus) ; secondaires « Installateur du système de sécurité », « Télévision en circuit fermé (CCTV) », « Service réseaux informatiques », « Service de sécurité informatique » et « Assistance et services informatiques ». La catégorie principale est le signal le plus fort pour la carte des résultats locaux : c'est elle qui fera ressortir la fiche sur « opérateur téléphone 49 ». Si l'intitulé télécoms n'apparaît pas dans l'interface, mettre « Assistance et services informatiques » en principale et la catégorie télécoms la plus proche en secondaire.

Contrôle utile : sur Google Maps, la catégorie principale de chaque établissement s'affiche sous son nom. Regardez celle des entreprises angevines qui sortent sur « opérateur téléphone 49 », « téléphonie entreprise Angers » et « alarme entreprise Angers ».

## 7. Description de l'établissement (prête à coller)

Limite : 750 caractères. Pas d'URL ni de HTML, et Google demande de décrire l'établissement plutôt que des promotions ou des prix. Texte ci-dessous : 742 caractères.

```text
Léa Numérique est un opérateur télécom et intégrateur informatique installé à Angers. Nous fournissons aux entreprises, collectivités et établissements du Maine-et-Loire leurs lignes fixes et trunks SIP, forfaits mobiles et accès fibre, avec portabilité des numéros, ainsi que la téléphonie IP (Yeastar, 3CX, Yealink), les réseaux et le Wi-Fi, les postes et serveurs HP, Lenovo et Dell, la cybersécurité (pare-feu Fortinet, EDR, sauvegarde chiffrée), les alarmes, le contrôle d'accès et la vidéosurveillance. Le même interlocuteur suit votre projet de l'audit de l'existant à la maintenance, forme vos utilisateurs et intervient sur site sous 4 h dans le cadre d'un contrat de maintenance. Chaque demande reçoit une réponse sous 24 h ouvrées.
```

Version courte (200 caractères) pour les plateformes et annuaires qui demandent une description brève :

```text
Opérateur télécom et intégrateur informatique à Angers : lignes, mobiles et fibre pro, téléphonie IP, réseaux et Wi-Fi, matériel informatique et cybersécurité pour les organisations du Maine-et-Loire.
```

## 8. Services

Éditer la fiche > Services. Google propose d'abord des services prédéfinis selon la catégorie : cochez uniquement ceux réellement assurés. Ajoutez ensuite les services personnalisés ci-dessous avec « Ajouter un service personnalisé ». La description d'un service est limitée à 300 caractères ; ne mettez ni prix ni numéro de téléphone dans le nom.

| Nom du service | Description à coller | Caractères |
|---|---|---|
| Lignes fixes et trunks SIP | Lignes téléphoniques professionnelles et trunks SIP pour votre standard, avec portabilité de vos numéros existants. Mise en service et suivi par le même interlocuteur que votre standard et votre réseau. | 202 |
| Forfaits mobiles professionnels | Lignes mobiles pour vos collaborateurs, avec portabilité des numéros, en lien avec l'application de votre standard sur smartphone. | 130 |
| Accès internet fibre professionnel | Accès internet fibre pour vos locaux, choisi selon l'éligibilité de l'adresse et vos usages : téléphonie, visioconférence, accès à distance. | 140 |
| Téléphonie IP et standard d'entreprise | Audit de votre installation, puis mise en service d'un IPBX Yeastar ou 3CX et de téléphones IP Yealink, fixes ou sans fil. Standard virtuel, renvoi sur mobile, messagerie vocale et centralisation des appels, avec la formation des utilisateurs. | 243 |
| Réseaux et Wi-Fi professionnels | Réseau dimensionné selon vos locaux et votre activité : Wi-Fi professionnel, VLAN et QoS pour prioriser la voix, VPN sécurisé entre vos sites et pour les collaborateurs nomades, monitoring. Équipements Ubiquiti, TP-Link, Zyxel et Fortinet. | 239 |
| Câblage RJ45 et fibre optique | Câblage structuré en cuivre RJ45 et en fibre optique, configuration des équipements actifs, puis tests et recette technique avant la mise en service. | 149 |
| Matériel informatique professionnel | Postes de travail, portables, serveurs, NAS et imprimantes professionnelles HP, Lenovo et Dell : choix du matériel, déploiement des postes, migration Windows, virtualisation et gestion du parc. | 193 |
| Maintenance informatique sous contrat | Contrat personnalisé : helpdesk téléphonique dédié, télémaintenance sécurisée, intervention sur site sous 4 h, maintenance préventive, gestion du parc matériel, suivi et rapports mensuels. | 188 |
| Cybersécurité et pare-feu | Pare-feu nouvelle génération Fortinet, antivirus et EDR entreprise, filtrage web et DNS. L'audit de sécurité complet commence par repérer les points faibles de votre système d'information. | 188 |
| Sauvegarde et plan de reprise d'activité | Sauvegarde externalisée et chiffrée de vos données, et plan de reprise d'activité (PRA) : ce qu'il faut restaurer en premier, dans quel ordre et dans quel délai après un incident. | 179 |
| Vidéosurveillance | Caméras Hikvision ou TP-Link et enregistreur pour vos locaux, sur un réseau séparé, avec le même déroulé que vos autres équipements : étude des besoins, installation, formation des utilisateurs et maintenance. | 209 |
| Alarme anti-intrusion et télésurveillance | Centrale, détecteurs et sirène adaptés à vos locaux, avec liaison possible à un centre de télésurveillance. Étude, installation, mise en service et maintenance par le même interlocuteur que votre réseau. | 203 |
| Alarme incendie | Détection et alarme incendie selon le type d'établissement et ses obligations : étude des locaux, installation, essais et maintenance. | 134 |
| Contrôle d'accès et interphonie | Badges, digicodes et interphones pour gérer qui entre, où et à quelle heure, reliés à votre réseau et maintenus avec le reste de vos équipements. | 145 |
| Audit et conseil informatique | Audit de l'infrastructure existante, préconisations personnalisées et plan de transformation IT. Nous accompagnons vos équipes dans le changement et gérons la relation avec les constructeurs. | 191 |

Les services refusés par Google le sont automatiquement : si l'un disparaît, raccourcissez son nom et retirez tout terme promotionnel.

## 9. Horaires

| Jour | Horaires à saisir |
|---|---|
| Lundi à vendredi | 09:00 à 17:30 |
| Samedi, dimanche | Fermé |

Horaires exceptionnels : ajoutez les jours fériés et les fermetures annoncées par le dirigeant (à confirmer, ne rien supposer). Google demande les horaires pendant lesquels les clients peuvent vous joindre ou être reçus ; ce sont ceux du site.

## 10. Zone desservie

Jusqu'à 20 zones. Google recommande de limiter la zone globale à environ deux heures de trajet depuis l'établissement.

Saisir : **Angers**, **Maine-et-Loire**, **Pays de la Loire**.

Ne pas déclarer « France » : c'est vrai pour les clients multi-sites, mais hors de la recommandation des deux heures. La zone desservie informe les clients ; elle ne fait pas apparaître la fiche partout dans la région, la distance avec l'établissement reste un critère de classement.

## 11. Attributs

Les attributs proposés dépendent de la catégorie principale et du pays. Après avoir choisi les catégories, ouvrez Éditer la fiche et parcourez les attributs : cochez uniquement ce qui est vrai et vérifiable. Exemples à examiner selon ce qui apparaît : attributs d'accessibilité (seulement si l'adresse est visible et réellement accessible), prise de rendez-vous en ligne (seulement s'il existe un vrai outil de réservation, ce qui n'est pas le cas du formulaire de contact actuel), attributs d'identité de l'entreprise (au choix du dirigeant).

## 12. Lien vers le site

Champ site web de la fiche :

```text
https://lea-numerique.fr/?utm_source=google&utm_medium=organic&utm_campaign=gbp-fiche
```

- Les paramètres UTM ne créent pas de doublon : la page d'accueil déclare `https://lea-numerique.fr` comme URL canonique (balise `<link rel="canonical">` générée par Next.js). Dans Search Console, la variante avec paramètres pourra apparaître en « Autre page avec balise canonique correcte » : c'est normal.
- Une URL avec paramètres n'est pas une redirection et respecte la règle Google qui interdit les liens vers des pages de redirection.
- Le site n'a aujourd'hui aucun outil de mesure d'audience (aucun script Google Analytics, Matomo ou équivalent dans le dépôt). Les clics vers le site sont de toute façon comptés dans l'onglet Performances de la fiche ; les UTM serviront si un outil de mesure est installé plus tard (décision du dirigeant, avec les règles de la CNIL sur le consentement) ou pour lire les journaux du serveur.

## 13. Photos à fournir

Format JPG ou PNG, entre 10 Ko et 5 Mo, 720 × 720 pixels recommandés (250 × 250 minimum), photos nettes, bien éclairées et fidèles à la réalité (pas de retouche lourde ni d'image générée). Elles ne s'affichent qu'une fois la fiche validée.

| Photo | Quantité | Conseil |
|---|---|---|
| Logo | 1 | Version carrée du logo sur fond uni, à partir de `public/images/logo.png`. |
| Photo de couverture | 1 | Une intervention ou l'équipe au travail, format paysage. |
| Extérieur | 3 | Seulement si l'adresse est visible : façade avec plaque, entrée, vue de la rue. |
| Intérieur | 3 | Bureau, poste de préparation des ordinateurs, stock de matériel. |
| Équipe | 3 | Dirigeant et techniciens, avec l'accord écrit de chaque personne photographiée. |
| Au travail | 3 ou plus | Baie de brassage après câblage, pose d'une borne Wi-Fi, préparation de postes, installation d'un téléphone Yealink, configuration d'un pare-feu (écran flou). |
| Vidéo courte (facultatif) | 1 | 30 secondes sur un chantier type, sans son ou avec un commentaire simple. |

À ne jamais publier : mots de passe, adresses IP, schémas réseau ou écrans d'un client ; nom ou logo d'un client sans son accord ; visages d'élèves, de patients ou de résidents (collèges, établissements de santé, EHPAD) ; photos de banques d'images ou visuels des constructeurs, qui ne montrent pas l'entreprise.

## 14. Trois premières publications (prêtes à coller)

Type « Actualité », un texte, une photo et un bouton d'action. Ne mettez pas de numéro de téléphone dans le texte : Google peut refuser un post qui contient des coordonnées non validées ; utilisez plutôt le bouton d'action (« En savoir plus » vers une page, ou le bouton d'appel qui reprend le numéro validé). La limite constatée est de 1 500 caractères (Google ne la publie pas). Les posts de plus de six mois sont archivés. Publiez-les à une semaine d'intervalle, une fois les pages correspondantes en ligne.

**Publication 1 : présentation (640 caractères).** Bouton « En savoir plus », lien `https://lea-numerique.fr/services?utm_source=google&utm_medium=organic&utm_campaign=gbp-posts&utm_content=presentation`. Photo : l'équipe ou une intervention.

```text
De l'audit à la maintenance, un seul interlocuteur à Angers

Léa Numérique accompagne les entreprises, les collectivités, les établissements scolaires et de santé du Maine-et-Loire sur toute leur informatique : téléphonie IP, réseau et Wi-Fi, postes et serveurs, cybersécurité.

Un projet se déroule en cinq étapes : prise de contact, audit de l'existant, proposition avec un devis clair, mise en œuvre, puis suivi. Le devis est gratuit et sans engagement, et le diagnostic n'est pas facturé.

Après une demande envoyée depuis le site, vous recevez un accusé de réception, un expert étudie votre besoin et vous recontacte sous 24 h ouvrées.
```

**Publication 2 : téléphonie IP (661 caractères).** Bouton « En savoir plus », lien `https://lea-numerique.fr/solutions/telephonie-ip?utm_source=google&utm_medium=organic&utm_campaign=gbp-posts&utm_content=telephonie-ip`. Photo : un poste Yealink sur un bureau ou l'IPBX dans la baie.

```text
Téléphonie IP : un standard qui suit vos équipes

Un standard IP (IPBX) fait passer les appels par le réseau de l'entreprise. Au quotidien, cela permet le renvoi des appels sur mobile, la messagerie vocale, un standard virtuel, des appels centralisés entre plusieurs sites et des postes utilisables en télétravail.

Léa Numérique installe des IPBX Yeastar et 3CX et des téléphones IP Yealink, fixes ou sans fil. Nous commençons par l'audit de votre installation, réseau compris : la voix doit passer avant les autres flux (VLAN et QoS), sinon elle devient hachée dès que le réseau est chargé.

La mise en service se termine par la formation de vos utilisateurs.
```

**Publication 3 : sauvegarde (716 caractères).** Bouton « En savoir plus », lien `https://lea-numerique.fr/solutions/cybersecurite?utm_source=google&utm_medium=organic&utm_campaign=gbp-posts&utm_content=sauvegarde-3-2-1`. Photo : un NAS ou un serveur en baie (sans écran visible).

```text
Sauvegarde : la règle 3-2-1

Une sauvegarde fiable suit la règle 3-2-1 : 3 copies de vos données, sur 2 supports différents, dont 1 conservée hors de vos locaux. Une copie rangée dans le même bâtiment que le serveur peut disparaître avec lui (incendie, vol), et une sauvegarde accessible depuis le réseau peut être chiffrée par un rançongiciel.

Léa Numérique met en place une sauvegarde externalisée et chiffrée, et construit avec vous votre plan de reprise d'activité (PRA) : quelles données et quels services remettre en route en premier, et dans quel délai.

Un audit de sécurité complet permet de faire le point sur vos sauvegardes et sur le reste de votre protection : pare-feu, antivirus et EDR, filtrage web.
```

Ensuite, un post par mois suffit : une installation type (sans citer le client s'il n'a pas donné son accord écrit), un conseil technique, une actualité réelle de l'entreprise.

## 15. Avis clients

### Règles Google à respecter

- Demander un avis à tous les clients, satisfaits ou non. Solliciter seulement les clients contents (ou détourner les mécontents vers un formulaire privé) est interdit.
- Aucune contrepartie : ni remise, ni cadeau, ni tirage au sort, ni service offert, y compris pour faire modifier ou retirer un avis négatif.
- Pas d'avis des salariés, anciens salariés, proches ou associés (conflit d'intérêts), pas d'avis rédigés par l'entreprise, pas d'achat d'avis.
- Le client doit être connecté à un compte Google pour publier.

### Procédure

1. Récupérer le lien : fiche > « Voir les avis » > « Recevoir plus d'avis » > icône Partager > Copier. Le QR code se télécharge depuis un ordinateur (clic droit > Enregistrer l'image sous), pas depuis un mobile.
2. Lister les clients dont un projet ou une intervention s'est terminé ces douze derniers mois, et l'interlocuteur qui a suivi le projet.
3. Envoyer la demande peu après une étape concrète (mise en service, fin de chantier, ticket résolu), par e-mail ou SMS, depuis l'adresse de la personne qui a suivi le client. Une relance au maximum.
4. Répondre à chaque avis sous quelques jours, positif ou négatif.
5. Noter les demandes envoyées dans un tableau (client, date, avis reçu ou non) pour ne pas relancer deux fois.

### Modèle d'e-mail

```text
Objet : Votre avis sur notre intervention

Bonjour [Prénom],

Nous avons terminé [la mise en service de votre standard téléphonique / l'installation de votre Wi-Fi / l'intervention du JJ/MM] et nous espérons que tout fonctionne comme prévu.

Si vous avez deux minutes, votre avis sur notre fiche Google aidera d'autres organisations de la région à nous connaître. Racontez simplement comment le projet s'est passé, y compris ce qui aurait pu être mieux : tous les retours nous sont utiles.

Laisser un avis : [LIEN AVIS GOOGLE]
(un compte Google est nécessaire pour publier)

Indépendamment de cet avis, si un point reste à régler, répondez à ce message : nous nous en occupons.

Merci et bonne journée,
[Prénom Nom]
Léa Numérique
```

### Modèle de SMS

```text
Bonjour [Prénom], [Prénom] de Léa Numérique. Merci pour votre confiance sur [projet]. Si vous avez un moment, votre avis sur notre fiche Google nous aiderait : [LIEN]. Positif ou critique, il nous est utile. Bonne journée.
```

### Réponses aux avis

```text
Avis positif :
Merci [Prénom] pour ce retour. [Reprendre un élément précis cité par le client.] Nous restons à votre disposition pour la suite de [projet].
[Prénom], Léa Numérique

Avis négatif :
Bonjour [Prénom], merci d'avoir pris le temps d'écrire. Nous sommes désolés que [problème cité] ne vous ait pas donné satisfaction. [Prénom], qui suit votre dossier, vous appelle pour en parler et trouver une solution.
[Prénom], Léa Numérique
```

Dans une réponse publique, ne donnez jamais de détail sur l'installation d'un client (matériel, réseau, sécurité, incidents) : ce sont des informations sensibles pour lui.

## 16. Cohérence NAP avec le site

Les valeurs de la fiche doivent être identiques à celles de `src/lib/site.ts`, source unique du site (footer, page contact, JSON-LD).

| Champ | Site (`src/lib/site.ts`) | Fiche Google |
|---|---|---|
| Nom | Léa Numérique | Léa Numérique |
| Adresse | 19 place du Président Kennedy, 49100 Angers | Identique, visible ou masquée selon la section 4 |
| Téléphone | 02 19 23 06 91 (+33219230691) | 02 19 23 06 91 |
| Site | https://lea-numerique.fr | https://lea-numerique.fr/ avec les UTM de la section 12 |
| Horaires | Du lundi au vendredi, de 9h à 17h30 | Lundi à vendredi, 09:00 à 17:30 |
| E-mail | hello@lea-numerique.fr | Pas de champ e-mail public dans la fiche |

Si Google propose une forme abrégée de l'adresse lors de la saisie (par exemple « Pl. du Président Kennedy »), acceptez-la : c'est la même adresse pour lui. En revanche, le nom et le numéro ne doivent jamais varier d'une plateforme à l'autre. Les autres annuaires (Bing Places, Apple Business, PagesJaunes, LinkedIn) reprennent exactement ces valeurs : voir `docs/seo/liens-externes.md`.

## 17. Après la création

1. Copier l'URL publique de la fiche (bouton Partager de la fiche sur Google Maps) et l'ajouter au tableau `sameAs` de `src/lib/site.ts`, avec l'URL de la page LinkedIn.
2. Importer la fiche dans Bing Places (voir `docs/seo/liens-externes.md`).
3. Consulter chaque mois l'onglet Performances de la fiche (vues, appels, clics vers le site) et reporter les chiffres dans `docs/seo/suivi-indexation.md`.

## 18. Rappels

- Une seule fiche pour l'établissement : jamais de seconde fiche, même depuis un autre compte, ni de fiche par ville desservie.
- Ne jamais acheter d'avis, ni en échanger, ni en publier soi-même.
- Ne pas modifier le nom, l'adresse ou la catégorie pendant la validation.
- Garder le contrôle de la fiche : propriétaire principal sur un compte de l'entreprise, prestataires et salariés en administrateurs.
- Mettre à jour la fiche en même temps que le site (horaires, téléphone, adresse) pour que les informations restent identiques partout.

## Sources

Consultées le 19 octobre 2026.

- Google, Valider votre établissement : https://support.google.com/business/answer/7107242?hl=fr
- Google, Validation par vidéo : https://support.google.com/business/answer/14271705?hl=fr
- Google, Consignes pour représenter votre établissement (nom, adresse, zone desservie, catégories, horaires, doublons) : https://support.google.com/business/answer/3038177?hl=fr
- Google, Modifier les informations de la fiche (description 750 caractères, neuf catégories secondaires, date d'ouverture) : https://support.google.com/business/answer/3039617?hl=fr
- Google, Ajouter des services : https://support.google.com/business/answer/9455399?hl=fr
- Google, Zone desservie (20 zones, deux heures de trajet, établissement mixte) : https://support.google.com/business/answer/9157481?hl=fr
- Google, Créer une fiche et revendiquer une fiche existante : https://support.google.com/business/answer/2911778?hl=fr
- Google, Demander la propriété d'une fiche : https://support.google.com/business/answer/4566671
- Google, Utilisateurs et rôles de la fiche : https://support.google.com/business/answer/3403100?hl=fr
- Google, Photos (formats, tailles, types) : https://support.google.com/business/answer/6123536?hl=fr
- Google, Posts sur la fiche : https://support.google.com/business/answer/7342169?hl=fr
- Google, Règles relatives au contenu des posts : https://support.google.com/business/answer/7213077?hl=fr
- Google, Créer un lien ou un QR code pour demander des avis : https://support.google.com/business/answer/16816815?hl=fr
- Google, Conseils pour obtenir des avis : https://support.google.com/business/answer/3474122?hl=fr
- Google Maps, Règlement sur le contenu contribué (faux engagement, conflit d'intérêts, sollicitation sélective) : https://support.google.com/contributionpolicy/answer/7400114?hl=fr
- Google, Améliorer votre classement local (pertinence, distance, proéminence) : https://support.google.com/business/answer/7091?hl=fr
- PlePer, liste des catégories Google Business Profile en français pour la France : https://pleper.com/index.php?do=tools&sdo=gmb_categories&go=1&lang=fr&country=FR
- Consultante SEO Paris, liste des catégories en français (2021, pour les libellés télécoms non vérifiés en 2026) : https://www.consultante-seo.paris/wp-content/uploads/2021/06/Liste-des-Categories-Google-My-Business-en-franc%CC%A7ais_compressed.pdf
- LetterCounter, limites de caractères Google Business Profile (services 300 caractères, posts 1 500 caractères, 31 janvier 2026) : https://lettercounter.org/blog/google-business-profile-character-limit/
- Slashpost, retrait des questions-réponses et Ask Maps (2025 et 2026) : https://slashpost.ai/blogs/google-business-profile/google-business-profile-qa-removed-2026
- PPC Land, fin des questions-réponses sur Google Maps : https://ppc.land/google-quietly-kills-q-a-for-an-ai-button-most-wont-use/
- Économie Matin, fonctions Gemini de Google Maps et calendrier pour la France (13 mai 2026) : https://www.economiematin.fr/?p=221118
