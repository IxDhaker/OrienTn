export const facultiesSeedData = [
  {
    name: "Institut National des Sciences Appliquées et de Technologie",
    shortName: "INSAT",
    university: "Université de Carthage",
    governorate: "Ariana",
    address: "Centre Urbain Nord, BP 676 - 1080 Tunis Cedex",
    location: { lat: 36.8428, lng: 10.1963 },
    description: "Établissement d'enseignement supérieur public qui forme des cadres de haut niveau dans les technologies de l'information et les technologies industrielles.",
    website: "http://www.insat.rnu.tn",
    contact: { email: "contact@insat.rnu.tn", phone: "+216 71 703 829" },
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60",
    sections: [
      {
        code: "MPI",
        name: "Cycle Préparatoire Intégré : Mathématiques - Physique - Informatique",
        domain: "Informatique",
        degree: "Cycle Ingénieur",
        durationYears: 5,
        capacity: 350,
        lastYearMinScores: { MATH: 168.5, SC_EXP: 165.2, INFO: 162.0, TECH: 155.0 }
      },
      {
        code: "CBA",
        name: "Cycle Préparatoire Intégré : Chimie - Biologie Appliquée",
        domain: "Sciences Fondamentales",
        degree: "Cycle Ingénieur",
        durationYears: 5,
        capacity: 150,
        lastYearMinScores: { MATH: 152.0, SC_EXP: 158.4 }
      }
    ],
    clubs: [
      { name: "IEEE INSAT Student Branch", category: "Technologique", description: "L'une des plus grandes branches étudiantes IEEE en Tunisie." },
      { name: "SecurNets", category: "Cybersécurité", description: "Premier club de sécurité informatique et hacking éthique en Tunisie." },
      { name: "Aerobotix", category: "Robotique", description: "Club spécialisé dans la robotique et l'aéromodélisme." },
      { name: "Ciné-Radio INSAT", category: "Culturel", description: "Club culturel d'activités artistiques, radio et cinématographiques." }
    ],
    activities: ["INSAT Hackathon", "TuniHack", "Securinets CTF Quals", "Journée Carrières"]
  },
  {
    name: "Institut Supérieur d'Informatique",
    shortName: "ISI",
    university: "Université de Tunis El Manar",
    governorate: "Ariana",
    address: "2 Rue Abou Raihane El Bayrouni, 2080 Ariana",
    location: { lat: 36.8601, lng: 10.1934 },
    description: "Institut réputé dédié à la formation en informatique, réseaux, génie logiciel et systèmes embarqués.",
    website: "http://www.isi.rnu.tn",
    contact: { email: "contact@isi.utm.tn", phone: "+216 71 706 164" },
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
    sections: [
      {
        code: "L-GL",
        name: "Licence en Génie Logiciel et Systèmes d'Information",
        domain: "Informatique",
        degree: "Licence",
        durationYears: 3,
        capacity: 180,
        lastYearMinScores: { MATH: 145.0, INFO: 148.5, SC_EXP: 142.0, TECH: 138.0 }
      },
      {
        code: "L-SI",
        name: "Licence en Systèmes Embarqués et IoT",
        domain: "Informatique",
        degree: "Licence",
        durationYears: 3,
        capacity: 120,
        lastYearMinScores: { MATH: 138.0, INFO: 140.0, TECH: 135.0 }
      }
    ],
    clubs: [
      { name: "Open Source Club (OSC)", category: "Technologique", description: "Promotion des logiciels libres et contributions open-source." },
      { name: "Microsoft Tech Club ISI", category: "Technologique", description: "Organisation de workshops Cloud, IA et DevOps." }
    ],
    activities: ["ISI Competitive Programming Contest", "Hack The Bot", "Journée Portes Ouvertes"]
  },
  {
    name: "Faculté de Médecine de Tunis",
    shortName: "FMT",
    university: "Université de Tunis El Manar",
    governorate: "Tunis",
    address: "15 Rue Djebel Lakhdar, La Rabta, 1007 Tunis",
    location: { lat: 36.8045, lng: 10.1615 },
    description: "Première faculté de médecine en Tunisie, formant les médecins généralistes et spécialistes depuis 1964.",
    website: "http://www.fmt.rnu.tn",
    contact: { email: "decanat@fmt.utm.tn", phone: "+216 71 563 800" },
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60",
    sections: [
      {
        code: "MED",
        name: "Doctorat en Médecine Humaine",
        domain: "Médecine & Santé",
        degree: "Doctorat",
        durationYears: 9,
        capacity: 300,
        lastYearMinScores: { SC_EXP: 182.5, MATH: 184.0 }
      }
    ],
    clubs: [
      { name: "Associa-Med", category: "Santé & Humanitaire", description: "Association tunisienne des stagiaires internes et étudiants en médecine." }
    ],
    activities: ["Caravanes de santé dans les régions de l'intérieur", "Simulations médicales", "Congrès des étudiants"]
  },
  {
    name: "Institut des Hautes Études Commerciales de Carthage",
    shortName: "IHEC Carthage",
    university: "Université de Carthage",
    governorate: "Tunis",
    address: "Rue Victor Hugo, Carthage Présidence 2016",
    location: { lat: 36.8607, lng: 10.3312 },
    description: "L'une des écoles de commerce les plus prestigieuses de Tunisie, réputée pour l'excellence en Finance, Marketing et Management.",
    website: "http://www.ihec.rnu.tn",
    contact: { email: "contact@ihec.ucar.tn", phone: "+216 71 730 081" },
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60",
    sections: [
      {
        code: "L-FIN",
        name: "Licence en Finance & Comptabilité",
        domain: "Économie & Gestion",
        degree: "Licence",
        durationYears: 3,
        capacity: 220,
        lastYearMinScores: { ECO: 154.0, MATH: 150.0, INFO: 145.0, SC_EXP: 142.0 }
      },
      {
        code: "L-MGT",
        name: "Licence en Management et Business Analytics",
        domain: "Économie & Gestion",
        degree: "Licence",
        durationYears: 3,
        capacity: 200,
        lastYearMinScores: { ECO: 148.0, MATH: 143.0, INFO: 139.0 }
      }
    ],
    clubs: [
      { name: "IHEC Junior Entreprise", category: "Entrepreneuriat", description: "Prestations d'études de marché et conseils pour les entreprises." },
      { name: "Radio Libre IHEC", category: "Culturel & Média", description: "Radio étudiante dynamique couvrant la vie universitaire." }
    ],
    activities: ["IHEC Financial Days", "Marketing Summit", "Carrefour de l'Emploi"]
  },
  {
    name: "École Nationale d'Ingénieurs de Sousse",
    shortName: "ENISO",
    university: "Université de Sousse",
    governorate: "Sousse",
    address: "Technopôle de Sousse, Cité Erriadh, 4054 Sousse",
    location: { lat: 35.8256, lng: 10.5888 },
    description: "École d'ingénieurs innovante reconnue pour ses filières en mécatronique, informatique appliquée et électronique industrielle.",
    website: "http://www.eniso.rnu.tn",
    contact: { email: "eniso@eniso.rnu.tn", phone: "+216 73 369 500" },
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60",
    sections: [
      {
        code: "ING-INFO",
        name: "Cycle Ingénieur en Informatique Appliquée",
        domain: "Informatique",
        degree: "Cycle Ingénieur",
        durationYears: 3,
        capacity: 80,
        lastYearMinScores: { MATH: 155.0, TECH: 150.0, INFO: 153.0 }
      },
      {
        code: "ING-MEC",
        name: "Cycle Ingénieur en Mécatronique",
        domain: "Ingénierie",
        degree: "Cycle Ingénieur",
        durationYears: 3,
        capacity: 75,
        lastYearMinScores: { MATH: 149.0, TECH: 152.0 }
      }
    ],
    clubs: [
      { name: "ENISO Team Robotique", category: "Robotique", description: "Participation aux compétitions nationales comme Eurobot et Eniso Smart Challenge." }
    ],
    activities: ["ENISO Smart Challenge", "Journée Industrielle"]
  },
  {
    name: "Faculté des Sciences de Sfax",
    shortName: "FSS",
    university: "Université de Sfax",
    governorate: "Sfax",
    address: "Route de Soukra Km 3.5, BP 1171, 3000 Sfax",
    location: { lat: 34.7275, lng: 10.7176 },
    description: "Grand centre de recherche et d'enseignement scientifique dans le sud tunisien.",
    website: "http://www.fss.rnu.tn",
    contact: { email: "fss@fss.rnu.tn", phone: "+216 74 274 088" },
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=60",
    sections: [
      {
        code: "L-CS",
        name: "Licence en Sciences de l'Informatique",
        domain: "Informatique",
        degree: "Licence",
        durationYears: 3,
        capacity: 250,
        lastYearMinScores: { MATH: 135.0, INFO: 138.0, SC_EXP: 130.0 }
      }
    ],
    clubs: [
      { name: "Google Developer Student Club (GDSC FSS)", category: "Technologique", description: "Ateliers et formations sur les technologies Google." }
    ],
    activities: ["Hackathons de codage", "Séminaires scientifiques de recherche"]
  }
];
