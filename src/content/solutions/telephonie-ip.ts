import type { SolutionContent } from "./types";

export const telephonieIp: SolutionContent = {
  slug: "telephonie-ip",
  lastModified: "2026-10-19",

  seo: {
    title: "Téléphonie IP pour entreprises à Angers",
    description:
      "Standard téléphonique IP 3CX ou Yeastar, postes Yealink et télétravail : installation et formation en Maine-et-Loire. Demandez votre devis gratuit.",
  },

  hero: {
    eyebrow: "Téléphonie d'entreprise",
    title: "Téléphonie IP et standard d'entreprise à Angers",
    intro:
      "Un standard IP remplace l'ancien autocommutateur par un système piloté depuis une interface web, au bureau comme en télétravail. Léa Numérique installe des IPBX Yeastar ou 3CX et des postes Yealink, de l'audit à la [mise en service et à la prise en main par vos équipes](/services#installation).",
    image: {
      src: "/images/telephonie-ip-entreprise.webp",
      alt: "Illustration d'un accueil téléphonique : standardiste avec casque à son bureau, entourée d'un téléphone, d'un smartphone et d'une enveloppe de messagerie",
    },
  },

  sections: [
    {
      title: "Pourquoi les organisations changent de standard téléphonique",
      paragraphs: [
        "Le projet démarre souvent avec un autocommutateur dont les pièces se font rares, ou avec la [fin du cuivre et de ses lignes analogiques](/solutions/operateur-telecom) : le réseau cuivre historique ferme par étapes jusqu'en 2030.",
        "Au quotidien, les difficultés se ressemblent :",
      ],
      bullets: [
        "À l'accueil d'une PME, des appels sonnent dans le vide pendant la pause de midi.",
        "En mairie, l'accueil suit des horaires d'ouverture au public qui varient selon les jours.",
        "En EHPAD, les soignants changent d'étage et doivent rester joignables partout.",
        "En cabinet, les collaborateurs en télétravail donnent leur numéro de portable personnel.",
      ],
    },
    {
      title: "Standard IP : fonctionnement et critères de choix",
      paragraphs: [
        "Un IPBX est un standard qui fonctionne sur le réseau informatique : postes, accueil vocal, files d'attente, renvoi sur mobile, messagerie vocale. Un [trunk SIP, fourni avec nos lignes professionnelles](/solutions/operateur-telecom), le relie au réseau téléphonique à travers votre accès internet.",
      ],
      subsections: [
        {
          title: "Sur site ou hébergé dans le cloud",
          paragraphs: [
            "Un boîtier dans vos locaux assure les appels internes même sans internet et accueille facilement des appareils analogiques. Un standard hébergé, dit virtuel, ne demande que les postes et centralise plusieurs sites, mais dépend entièrement de la connexion.",
          ],
        },
        {
          title: "3CX ou Yeastar : comment trancher",
          paragraphs: [
            "Les deux offrent des fonctions proches, applications mobiles et intégrations CRM comprises. Yeastar se prête bien à un boîtier doté de ports analogiques, 3CX à un serveur ou un environnement virtualisé existant ; le coût des licences sur plusieurs années départage souvent.",
          ],
        },
        {
          title: "Postes fixes, DECT ou application",
          paragraphs: [
            "Les téléphones de bureau Yealink, alimentables par le câble réseau (PoE), conviennent aux postes sédentaires ; les combinés DECT suivent les personnels mobiles d'une base à l'autre sans couper l'appel. L'application sur smartphone ou ordinateur sert au télétravail.",
          ],
        },
        {
          title: "Réseau et sécurité du standard",
          paragraphs: [
            "La voix supporte mal la gigue : elle circule de préférence sur un VLAN dédié, prioritaire grâce à la [QoS de votre réseau d'entreprise](/solutions/reseaux-wifi). Exposé sur internet sans [pare-feu correctement paramétré](/solutions/cybersecurite), un standard peut être détourné pour passer des appels surtaxés à vos frais.",
          ],
        },
      ],
    },
    {
      title: "Déroulé d'un projet de téléphonie IP, de l'audit au suivi",
      paragraphs: ["Un même interlocuteur suit chaque étape, sur place en Anjou comme à distance."],
      bullets: [
        "[Audit de votre installation téléphonique](/services#conseil) : lignes, postes, appareils analogiques, parcours des appels et réseau.",
        "Proposition : le matériel retenu et le scénario d'accueil, chiffrés dans un devis clair.",
        "Paramétrage : numérotation, groupes d'appels, horaires et messages ; les postes Yealink se configurent depuis l'IPBX.",
        "Mise en service à un moment calme, avec appels de test entrants et sortants.",
        "Formation des utilisateurs et d'un référent pour les horaires et messages.",
        "Suivi par un [contrat de maintenance avec helpdesk et télémaintenance](/services#maintenance).",
      ],
    },
  ],

  brands: {
    title: "IPBX et téléphones : nos marques partenaires",
    items: [
      {
        name: "Yeastar",
        description:
          "IPBX P-Series en boîtier, en version logicielle ou cloud, avec modules analogiques et application Linkus ; Léa Numérique est partenaire certifié Yeastar.",
      },
      {
        name: "3CX",
        description:
          "Standard logiciel installé sur un serveur Windows ou Linux, ou hébergé, avec client web et applications mobiles.",
      },
      {
        name: "Yealink",
        description:
          "Postes de bureau et combinés sans fil DECT, configurés automatiquement par les IPBX 3CX et Yeastar.",
      },
      {
        name: "Wazo",
        description:
          "Plateforme de communications unifiées issue du logiciel libre, en mode hébergé, qui permet aussi d'appeler depuis Microsoft Teams.",
      },
    ],
  },

  example: {
    title: "Exemple de déroulé pour une étude notariale d'une douzaine de personnes",
    context:
      "Situation de départ, à titre d'illustration : standard en fin de vie, accueil débordé aux heures de rendez-vous, fax encore utilisé, deux collaborateurs en télétravail partiel.",
    steps: [
      "Audit des lignes, des postes, du fax et des parcours d'appel.",
      "IPBX Yeastar en boîtier avec un port analogique pour le fax, postes Yealink filaires.",
      "Message d'accueil orientant vers le secrétariat de chaque notaire, application Linkus pour le télétravail.",
      "Mise en service en fin de journée avec tests d'appels, puis formation de l'équipe.",
    ],
    outcome:
      "Un standard unique et des collaborateurs joignables sur leur numéro professionnel où qu'ils soient ; l'accueil modifie lui-même ses messages. [Demandez un devis pour votre standard](/contact).",
  },

  faq: {
    title: "Vos questions sur la téléphonie IP",
    items: [
      {
        question: "Faut-il remplacer tous nos téléphones ?",
        answer:
          "Les postes d'un standard propriétaire sont généralement incompatibles avec un IPBX. Un fax ou un téléphone analogique peut en revanche rester en service via une passerelle ou les ports analogiques de l'IPBX.",
      },
      {
        question: "Notre connexion internet suffit-elle pour la téléphonie IP ?",
        answer:
          "Un appel en G.711, la qualité téléphonique classique, occupe un peu moins de 100 kbit/s dans chaque sens : une [fibre professionnelle](/solutions/operateur-telecom) suffit largement pour une PME. La stabilité de la ligne compte davantage que son débit.",
      },
      {
        question: "Comment un collaborateur en télétravail reçoit-il ses appels ?",
        answer:
          "Par l'application du standard (Linkus chez Yeastar, application 3CX) sur ordinateur ou smartphone, connectée à l'IPBX comme un poste du bureau. Ses appels sortants affichent le numéro de l'entreprise, pas son numéro personnel.",
      },
    ],
  },

  cta: {
    title: "Faites le point sur votre téléphonie",
    text: "Indiquez-nous le nombre de postes et de sites à relier : vous aurez un retour sous 24h ouvrées et un devis gratuit, sans engagement.",
    label: "Demander un devis gratuit",
  },
};
