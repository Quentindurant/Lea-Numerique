import type { SolutionContent } from "./types";

// Aucun nom d'autre opérateur sur cette page, et pas de section marques (champ brands absent).
export const operateurTelecom: SolutionContent = {
  slug: "operateur-telecom",
  lastModified: "2026-10-19",

  seo: {
    title: "Opérateur télécom entreprise à Angers (49)",
    description:
      "Votre opérateur téléphonique pro en Maine-et-Loire : lignes fixes, trunks SIP, forfaits mobiles et fibre, numéros conservés. Demandez un devis gratuit.",
  },

  hero: {
    eyebrow: "Abonnements télécoms",
    title: "Opérateur télécom pour les professionnels du Maine-et-Loire",
    intro:
      "Opérateur téléphonique et internet des entreprises, Léa Numérique fournit lignes fixes et trunks SIP, forfaits mobiles et fibre professionnelle ; ses clients gardent leurs numéros grâce à la portabilité. Depuis Angers, nous installons et maintenons aussi le standard, le réseau et le pare-feu qui s'y raccordent.",
    image: {
      src: "/images/maintenance-support-informatique.webp",
      alt: "La mascotte Léa Numérique au téléphone devant un ordinateur portable",
    },
  },

  sections: [
    {
      title: "Pourquoi changer d'opérateur ou regrouper vos abonnements télécoms",
      paragraphs: [
        "Lignes, mobiles et accès internet s'ajoutent au fil des besoins, souvent chez des fournisseurs différents. Plusieurs situations poussent à tout remettre à plat :",
      ],
      bullets: [
        "Le réseau cuivre ferme commune par commune jusqu'en 2030, emportant lignes analogiques et ADSL.",
        "Une ligne ouverte pour un ancien fax est toujours facturée.",
        "En mairie, chaque bâtiment communal a souvent son propre contrat et sa propre échéance.",
        "Lors d'une panne, l'opérateur accuse le standard et l'installateur accuse la ligne.",
      ],
    },
    {
      title: "Nos offres d'opérateur : lignes, portabilité, mobiles et fibre",
      paragraphs: [
        "Abonnements et installation chez le même prestataire : une panne s'analyse de la fibre jusqu'au poste.",
      ],
      subsections: [
        {
          title: "Lignes fixes et trunks SIP",
          paragraphs: [
            "Une ligne fixe suffit à un petit site sans standard. Au-delà, un trunk SIP relie votre [standard IP Yeastar ou 3CX](/solutions/telephonie-ip) au réseau téléphonique par l'accès internet : il porte vos numéros, directs (SDA) compris, et remplace les lignes analogiques (un appel à la fois) ou numériques T0 (deux), qui disparaissent avec le cuivre. Le nombre d'appels simultanés se règle dans l'abonnement, sans câble supplémentaire.",
          ],
        },
        {
          title: "Portabilité de vos numéros fixes et mobiles",
          paragraphs: [
            "Les numéros imprimés sur vos devis et vos cartes de visite restent les mêmes. Le RIO (relevé d'identité opérateur) d'une ligne s'obtient en appelant le 3179 depuis cette ligne, fixe ou mobile ; pour une tranche de numéros directs (SDA), la liste se demande à l'opérateur actuel. Ces éléments accompagnent la commande, et nous transmettons la demande de portabilité.",
          ],
        },
        {
          title: "Forfaits mobiles professionnels",
          paragraphs: [
            "Une ligne au nom de l'entreprise lui reste attachée : au départ d'un salarié, son successeur peut reprendre le numéro, et les clients avec. L'application de votre standard fait du smartphone un poste du bureau : en Wi-Fi dans les locaux, par le forfait en déplacement.",
          ],
        },
        {
          title: "Accès internet fibre professionnel",
          paragraphs: [
            "Avec un trunk SIP, l'accès internet transporte aussi la voix. Mutualisée (FTTH), la fibre est partagée entre plusieurs abonnés, avec des débits le plus souvent sans garantie ; la FTTE ajoute des engagements de service sur cette même infrastructure, et la fibre dédiée (FTTO), réservée à vos locaux et plus chère, se justifie quand l'activité s'arrête sans connexion. Derrière le routeur, la [QoS du réseau local](/solutions/reseaux-wifi) donne la priorité aux appels et le [pare-feu de l'accès internet](/solutions/cybersecurite) filtre ce qui entre.",
          ],
        },
      ],
    },
    {
      title: "De l'audit des contrats à la bascule des numéros",
      paragraphs: [
        "Raccorder un site à la fibre peut prendre plusieurs semaines, voire plusieurs mois : anticipez l'échéance de vos contrats et la fermeture du cuivre dans votre commune.",
      ],
      bullets: [
        "[Audit de vos contrats et de vos lignes](/services#conseil) : factures, numéros, débits, fins d'engagement, lignes d'alarme ou d'ascenseur.",
        "Proposition : un devis gratuit, accès par accès et ligne par ligne.",
        "Préparation : commande des accès, collecte des RIO, [paramétrage du trunk SIP sur votre standard](/services#installation).",
        "Bascule le jour du portage, sur place en Anjou ou à distance, avec un test d'appel entrant et sortant par numéro.",
        "Suivi : la même équipe pour les abonnements et le standard, et si besoin un [contrat de maintenance avec helpdesk dédié](/services#maintenance).",
      ],
    },
  ],

  example: {
    title: "Exemple de déroulé : une entreprise du bâtiment change d'opérateur",
    context:
      "Cas type : une entreprise de second œuvre d'une vingtaine de personnes, avec trois lignes analogiques, un ADSL, un standard non IP et des forfaits mobiles chez un autre fournisseur. Ses numéros sont floqués sur les camionnettes de chantier.",
    steps: [
      "Audit des contrats et de leurs échéances.",
      "Fibre au bureau, trunk SIP sur un nouvel IPBX Yeastar.",
      "Portabilité de chaque ligne et de chaque mobile, avec son RIO.",
      "Forfaits mobiles et application du standard pour les conducteurs de travaux.",
      "Jour du portage : appels de test depuis le bureau et un chantier.",
    ],
    outcome:
      "Les numéros floqués n'ont pas changé, et le bureau transfère un appel vers un chantier comme vers le poste voisin. [Demandez l'étude de vos abonnements télécoms](/contact).",
  },

  faq: {
    title: "Portabilité, fin du cuivre, trunk SIP : vos questions",
    items: [
      {
        question: "Faut-il résilier nos contrats actuels avant de changer d'opérateur ?",
        answer:
          "Non, c'est même risqué : un numéro résilié peut être perdu. La demande de portabilité vaut résiliation de l'ancien contrat pour ce numéro, le jour du portage ; les sommes restant dues au titre d'un engagement en cours peuvent être facturées.",
      },
      {
        question: "Quand le réseau cuivre fermera-t-il dans notre commune ?",
        answer:
          "La fermeture avance par lots de communes, annoncés en principe trois ans à l'avance, jusqu'en 2030. Dans chaque commune, plus aucun abonnement cuivre n'est vendu, puis, un an après au plus tôt, les lignes existantes s'arrêtent, ADSL et VDSL compris. Un moteur de recherche du ministère de l'Économie indique l'échéance des communes dont la date est déjà fixée.",
      },
      {
        question: "Peut-on raccorder un trunk SIP à notre standard actuel ?",
        answer:
          "Oui, s'il s'agit d'un IPBX compatible SIP, ce que l'audit vérifie. Un autocommutateur non IP peut s'y relier par une passerelle, ou être remplacé.",
      },
      {
        question: "Que deviennent les lignes d'alarme, d'ascenseur ou de terminal de paiement ?",
        answer:
          "Reliées au réseau cuivre, elles s'arrêteront avec lui. Selon le modèle, l'équipement pourra passer par l'accès internet ou demandera un transmetteur adapté, à voir avec son mainteneur.",
      },
    ],
  },

  cta: {
    title: "Faites le point sur vos abonnements télécoms",
    text: "Décrivez-nous vos abonnements actuels : un expert vous recontacte sous 24h ouvrées pour préparer l'audit de vos contrats, puis vous remet un devis gratuit.",
    label: "Demander un devis gratuit",
  },
};
