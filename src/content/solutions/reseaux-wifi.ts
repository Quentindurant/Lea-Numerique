import type { SolutionContent } from "./types";

export const reseauxWifi: SolutionContent = {
  slug: "reseaux-wifi",
  lastModified: "2026-10-19",

  seo: {
    title: "Réseau informatique et Wi-Fi pro à Angers",
    description:
      "Câblage RJ45 et fibre, Wi-Fi professionnel, VLAN, QoS et VPN entre sites : votre réseau installé et supervisé en Anjou. Demandez un devis gratuit.",
  },

  hero: {
    eyebrow: "Réseaux et Wi-Fi",
    title: "Réseau informatique, câblage et Wi-Fi professionnel à Angers",
    intro:
      "Fichiers partagés, logiciels métier, téléphonie, caméras : tout passe par votre réseau. Léa Numérique le dimensionne d'après vos locaux et vos usages, réalise le câblage, configure les équipements actifs puis assure la [supervision et la maintenance du réseau](/services#maintenance).",
    image: {
      src: "/images/reseau-wifi-professionnel.webp",
      alt: "Illustration : un symbole Wi-Fi central relie quatre collaborateurs équipés d'un smartphone, d'une tablette et d'un ordinateur portable",
    },
  },

  sections: [
    {
      title: "Les signes qu'un réseau d'entreprise doit être revu",
      paragraphs: ["Beaucoup de réseaux ont grandi par ajouts successifs, jusqu'au jour où l'ensemble ne suit plus :"],
      bullets: [
        "Le Wi-Fi décroche en salle de réunion ou à l'atelier.",
        "Dans la baie, plus personne ne sait quelle prise correspond à quel port.",
        "En EHPAD, les tablettes de soins doivent capter jusque dans les chambres ; en mairie, le Wi-Fi public doit être isolé des postes des agents.",
        "Le second site ou les collaborateurs nomades accèdent aux fichiers sans liaison chiffrée.",
      ],
    },
    {
      title: "Les choix techniques d'un réseau professionnel",
      paragraphs: [
        "Le câblage survit à plusieurs générations de switchs et de bornes : c'est la couche à soigner en premier.",
      ],
      subsections: [
        {
          title: "Câblage RJ45, fibre optique et baie de brassage",
          paragraphs: [
            "Le cuivre de catégorie 6 ou 6A dessert les bureaux, jusqu'à 90 mètres de câble fixe par lien ; au-delà, ou entre deux bâtiments, la fibre optique prend le relais. Dans la baie, chaque prise aboutit sur un panneau de brassage repéré : déplacer un poste revient à changer un cordon.",
          ],
        },
        {
          title: "Switchs administrables et PoE",
          paragraphs: [
            "Un switch administrable gère VLAN et QoS ; en version PoE, il alimente aussi [téléphones IP](/solutions/telephonie-ip), bornes Wi-Fi et caméras par le câble réseau. Point à vérifier : son budget PoE, la puissance totale qu'il peut distribuer.",
          ],
        },
        {
          title: "Wi-Fi professionnel",
          paragraphs: [
            "Des bornes pilotées depuis une console unique remplacent box et répéteurs : les appareils passent de l'une à l'autre sans perdre la connexion, et chaque usage a son propre réseau, relié au bon VLAN.",
          ],
        },
        {
          title: "VLAN, QoS et VPN",
          paragraphs: [
            "Un VLAN découpe le réseau en réseaux logiques séparés : postes, téléphonie, invités, caméras, machines de production. Entre eux, le [pare-feu nouvelle génération](/solutions/cybersecurite) applique vos règles. La QoS fait passer la voix en premier ; le VPN relie vos sites distants et vos équipes mobiles par un tunnel chiffré, à travers l'[accès internet fibre de chaque site](/solutions/operateur-telecom).",
          ],
        },
      ],
    },
    {
      title: "Étapes d'un projet réseau, du relevé des locaux à la supervision",
      paragraphs: ["Le projet commence en général par une visite sur place, en Maine-et-Loire ou ailleurs en France."],
      bullets: [
        "[Audit de l'infrastructure existante](/services#conseil) : prises testées, équipements et usages inventoriés zone par zone.",
        "Conception : plan de câblage, emplacement des bornes, VLAN et filtrage, chiffrés dans un devis clair.",
        "[Installation du câblage et des équipements actifs](/services#installation) : câbles, baie, switchs, bornes, routeur et pare-feu.",
        "Tests et recette technique : prises contrôlées, couverture radio vérifiée sur place.",
        "Prise en main : le référent apprend à gérer l'accès invités depuis la console.",
        "Suivi : monitoring réseau et maintenance sous contrat, avec intervention sur site sous 4h.",
      ],
    },
  ],

  brands: {
    title: "Équipements réseau : Ubiquiti, TP-Link, Zyxel et Fortinet",
    items: [
      {
        name: "Ubiquiti",
        description:
          "Les bornes Wi-Fi et switchs UniFi s'administrent depuis une seule application, sans abonnement obligatoire ; Léa Numérique détient la certification Ubiquiti.",
      },
      {
        name: "TP-Link",
        description:
          "La gamme professionnelle Omada se pilote depuis un contrôleur unique, installé sur place ou hébergé dans le cloud.",
      },
      {
        name: "Zyxel",
        description:
          "Les équipements Zyxel compatibles Nebula se gèrent à distance depuis cette plateforme cloud, pratique pour plusieurs petits sites.",
      },
      {
        name: "Fortinet",
        description:
          "Les pare-feu FortiGate gèrent VPN et SD-WAN, et pilotent directement switchs FortiSwitch et bornes FortiAP ; Léa Numérique est certifiée Fortinet.",
      },
    ],
  },

  example: {
    title: "Exemple type : refonte du réseau d'une PME entre bureaux, atelier et dépôt",
    context:
      "Cas fictif : une PME d'une trentaine de personnes, bureaux et atelier dans deux bâtiments voisins ; le dépôt distant rejoint le siège par un bureau à distance exposé sur internet.",
    steps: [
      "Relevé des locaux et des usages.",
      "Baie de brassage dans les bureaux, liaison fibre vers l'atelier.",
      "Switchs PoE et bornes adaptées aux grands volumes de l'atelier.",
      "VLAN distincts pour postes, téléphonie, machines de production et invités.",
      "VPN chiffré entre les pare-feu du siège et du dépôt, puis tests.",
    ],
    outcome:
      "À l'arrivée, le Wi-Fi couvre l'atelier et les machines de production sont isolées du reste du réseau ; le dépôt, lui, passe par une liaison chiffrée.",
  },

  faq: {
    title: "Réseau, câblage et Wi-Fi : questions fréquentes",
    items: [
      {
        question: "Faut-il refaire tout le câblage pour un Wi-Fi professionnel ?",
        answer:
          "Rarement : chaque borne n'a besoin que d'un câble RJ45, qui l'alimente aussi en PoE. Après test, les liens en catégorie 5e ou 6 en bon état restent utilisables.",
      },
      {
        question: "Combien de bornes Wi-Fi faut-il prévoir ?",
        answer:
          "Cela dépend moins de la surface que des murs (béton, rayonnages métalliques) et du nombre d'appareils connectés en même temps : une salle de réunion pleine demande plus de capacité qu'un couloir.",
      },
      {
        question: "Peut-on offrir le Wi-Fi aux visiteurs sans exposer le réseau interne ?",
        answer:
          "Oui : sur un VLAN isolé, le réseau invités n'accède qu'à internet, avec un débit plafonné et une page d'acceptation des conditions d'utilisation.",
      },
      {
        question: "Quelle différence entre VPN site à site et VPN nomade ?",
        answer:
          "Le premier relie en permanence deux réseaux par un tunnel chiffré entre pare-feu : le site distant accède au [serveur ou au NAS du siège](/solutions/materiel-informatique) comme sur place. Le second s'ouvre à la demande depuis un portable, idéalement avec une authentification à double facteur.",
      },
    ],
  },

  cta: {
    title: "Parlons de votre réseau",
    text: "Un plan de vos locaux, même sommaire, suffit pour préparer le diagnostic, sans frais ; le devis détaillé qui suit est gratuit.",
    label: "Décrire mon projet réseau",
  },
};
