import type { SolutionContent } from "./types";

// Marques citées : Hikvision et TP-Link (gamme VIGI) uniquement. Aucun nom d'opérateur télécom.
// Le centre de télésurveillance n'est jamais présenté comme exploité par Léa Numérique.
export const alarmeVideosurveillance: SolutionContent = {
  slug: "alarme-videosurveillance",
  lastModified: "2026-10-20",

  seo: {
    title: "Alarme et vidéosurveillance à Angers (49)",
    description:
      "Alarme intrusion et incendie, télésurveillance, contrôle d'accès et vidéosurveillance pour entreprises du Maine-et-Loire. Demandez un devis gratuit.",
  },

  hero: {
    eyebrow: "Sûreté des locaux",
    title: "Installateur d'alarme et de vidéosurveillance à Angers",
    intro:
      "Alarme anti-intrusion ou incendie, télésurveillance, contrôle d'accès, interphone vidéo et caméras : Léa Numérique installe et maintient la protection des locaux de votre entreprise. Caméras, contrôle d'accès, interphones et transmetteurs d'alarme se raccordent désormais au réseau informatique : le même interlocuteur s'occupe donc du câblage et de leur sécurité.",
    image: {
      src: "/images/securite-informatique.webp",
      alt: "La mascotte Léa Numérique sécurise un poste de travail : bouclier d'alerte, clé et cadenas",
    },
  },

  sections: [
    {
      title: "Les besoins de protection d'une entreprise, d'une mairie ou d'un EHPAD",
      paragraphs: ["Chaque organisation a ses points sensibles :"],
      bullets: [
        "PME : un entrepôt rempli de stock, vide la nuit et le week-end.",
        "Mairie : une salle polyvalente prêtée aux associations, dont les clés circulent sans contrôle.",
        "EHPAD : une unité protégée fermée par code ou badge, et une entrée à surveiller la nuit.",
        "Étude notariale : des archives confidentielles et une porte d'entrée à ouvrir à distance.",
      ],
    },
    {
      title: "Alarme, accès et caméras : les équipements que nous installons",
      paragraphs: [
        "Caméras, lecteurs de badges et contrôleurs de portes, interphones et transmetteurs IP se raccordent au réseau (en PoE pour les caméras et les lecteurs) : nous les plaçons [sur un VLAN séparé, derrière des switchs PoE](/solutions/reseaux-wifi), et leur appliquons les règles de [sécurité des équipements connectés](/solutions/cybersecurite) (mots de passe d'usine remplacés, mises à jour suivies).",
      ],
      subsections: [
        {
          title: "Alarme anti-intrusion",
          paragraphs: [
            "Contacts d'ouverture et détecteurs de mouvement préviennent la centrale, qui déclenche sirène et transmetteur. Le bâtiment se découpe en zones : l'entrepôt peut rester sous alarme pendant qu'on travaille dans les bureaux.",
          ],
        },
        {
          title: "Alarme incendie",
          paragraphs: [
            "Le Code du travail impose un système d'alarme sonore, audible de tout point du bâtiment, là où plus de cinquante personnes peuvent se trouver habituellement et partout où l'on manipule des matières inflammables. Dans un établissement recevant du public, l'équipement exigé dépend en outre du type d'activité et de la catégorie. Ce système reste autonome, indépendant du réseau informatique.",
          ],
        },
        {
          title: "Télésurveillance et levée de doute",
          paragraphs: [
            "La centrale transmet chaque alarme à un centre de télésurveillance, qui doit lever le doute avant d'alerter les forces de l'ordre : vérifier que l'alerte est réelle, par exemple à distance grâce à une caméra ou à une écoute du site.",
          ],
        },
        {
          title: "Contrôle d'accès et interphonie",
          paragraphs: [
            "Badges et claviers à code remplacent les clés, avec des droits par porte et par plage horaire ; un badge perdu se désactive sans changer de serrure. L'interphone vidéo IP montre le visiteur avant d'ouvrir à distance et peut sonner sur un [standard téléphonique IP](/solutions/telephonie-ip) compatible SIP.",
          ],
        },
        {
          title: "Vidéosurveillance",
          paragraphs: [
            "Alimentées par le câble réseau (PoE), les caméras IP enregistrent sur un enregistreur réseau (NVR) installé dans vos locaux. Leur nombre, leur résolution et la durée de conservation déterminent la capacité des disques ; la nuit, le franchissement d'une zone peut déclencher une alerte.",
          ],
        },
      ],
    },
    {
      title: "Caméras au travail : ce que dit la loi",
      paragraphs: [
        "Selon la CNIL, les caméras peuvent couvrir entrées, issues de secours et zones de stockage, mais pas filmer les salariés à leur poste, sauf circonstance particulière (on filme alors la caisse plutôt que le caissier), ni les zones de pause. Des panneaux informent salariés et visiteurs, les représentants du personnel sont consultés avant l'installation, et seules les personnes habilitées voient les images, conservées en principe un mois au plus.",
        "Un lieu ouvert au public, comme l'accueil d'une mairie ou un magasin, ne se filme qu'avec l'autorisation du préfet ; filmer la voie publique est en principe réservé aux autorités publiques.",
      ],
    },
    {
      title: "De la visite des locaux à la maintenance",
      paragraphs: ["Chaque projet suit les mêmes étapes, à Angers comme ailleurs en Maine-et-Loire :"],
      bullets: [
        "Visite des locaux : accès, horaires d'occupation, réseau existant.",
        "Proposition : emplacement des détecteurs, lecteurs et caméras, dans un devis clair.",
        "[Installation et câblage](/services#installation) : prises, switchs PoE, VLAN, pose des équipements.",
        "Paramétrage des zones, des badges et de la conservation des images, tests, prise en main par vos référents.",
        "[Contrat de maintenance des équipements](/services#maintenance) : helpdesk, télémaintenance, intervention sur site selon votre contrat.",
      ],
    },
  ],

  brands: {
    title: "Caméras et enregistreurs : Hikvision et TP-Link VIGI",
    items: [
      {
        name: "Hikvision",
        description:
          "Ses caméras AcuSense distinguent une personne ou un véhicule d'un animal ou d'un feuillage, ce qui limite les fausses alertes ; les ColorVu filment en couleur presque sans lumière.",
      },
      {
        name: "TP-Link VIGI",
        description:
          "Caméras et enregistreurs VIGI se gèrent dans Omada Central, la plateforme cloud des switchs et bornes Wi-Fi TP-Link ; par défaut, les vidéos restent enregistrées dans vos locaux.",
      },
    ],
  },

  example: {
    title: "Exemple type : alarme, badges et caméras pour une PME avec entrepôt",
    context:
      "Cas fictif : une PME de négoce d'une vingtaine de salariés, entrepôt attenant aux bureaux, alarme sur ligne cuivre, clés distribuées au fil des embauches.",
    steps: [
      "Alarme de l'entrepôt reliée à un centre de télésurveillance, transmetteur IP et 4G.",
      "Badges à plages horaires, y compris pour l'entreprise de nettoyage.",
      "Caméras des quais et du parking sur un VLAN séparé, panneaux d'information.",
      "Interphone vidéo à l'accueil, tests, formation du responsable.",
    ],
    outcome:
      "Plus de clés à récupérer, un entrepôt télésurveillé la nuit et le week-end, des images réservées aux personnes habilitées. [Parlez-nous de vos locaux](/contact).",
  },

  faq: {
    title: "Alarme et vidéosurveillance : vos questions",
    items: [
      {
        question: "Peut-on voir les caméras à distance sans exposer le réseau ?",
        answer:
          "Oui, par un VPN : smartphone ou portable rejoignent d'abord le réseau de l'entreprise par un tunnel chiffré. Rediriger un port vers l'enregistreur le rendrait joignable depuis tout internet, où des robots scrutent sans cesse ce type d'appareil.",
      },
      {
        question: "Notre alarme passe par une ligne cuivre ou la 2G : que faire ?",
        answer:
          "Changer de transmetteur avant l'arrêt du réseau utilisé : en métropole, la 2G s'éteint d'ici fin 2026, la 3G entre 2028 et fin 2029, et le cuivre ferme par vagues de communes jusqu'en 2030. Un modèle IP secouru en 4G passe par votre [accès internet professionnel](/solutions/operateur-telecom).",
      },
      {
        question: "Alarme filaire ou sans fil : laquelle choisir ?",
        answer:
          "L'alarme filaire, sans piles ni brouillage radio à craindre, convient à un bâtiment neuf ou en travaux ; l'alarme sans fil s'installe sans travaux dans des locaux occupés, à condition que sa centrale détecte le brouillage.",
      },
    ],
  },

  cta: {
    title: "Un projet d'alarme ou de caméras ?",
    text: "Décrivez-nous vos bâtiments et leurs accès : réponse sous 24h ouvrées, puis, si besoin, visite ou appel de diagnostic. Devis gratuit et sans engagement.",
    label: "Demander un devis gratuit",
  },
};
