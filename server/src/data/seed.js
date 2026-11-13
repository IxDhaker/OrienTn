import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  Etudiant,
  Administrateur,
  SectionBac,
  Matiere,
  CoefficientMatiere,
  Faculte,
  Filiere,
  OffreFormation,
  VieAssociative,
  ResultatScore,
  Recommandation,
  RoadmapPreparation
} from '../models/index.js';

import CalculateurScore from '../services/CalculateurScore.js';
import MoteurRecommandation from '../services/MoteurRecommandation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const seedDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/orientn';
  console.log(`🔌 Connexion à MongoDB sur : ${mongoUri}`);

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connecté avec succès à MongoDB pour le peuplement.');
  } catch (err) {
    console.error(`⚠️ Impossible de se connecter directement à MongoDB (${err.message}).`);
    console.log('💡 Note : Assurez-vous que le service MongoDB ou un conteneur Docker est en cours d\'exécution.');
    console.log('📄 Un fichier de sauvegarde JSON complet sera tout de même généré dans server/src/data/mongoSeedData.json');
  }

  // 1. Définition des Sections du Baccalauréat Tunisien (Package Scoring)
  const sectionsData = [
    { id: 1, nom: "Sciences de l'Informatique", code: 'INFO' },
    { id: 2, nom: 'Mathématiques', code: 'MATH' },
    { id: 3, nom: 'Sciences Expérimentales', code: 'SC_EXP' },
    { id: 4, nom: 'Sciences Techniques', code: 'TECH' },
    { id: 5, nom: 'Économie et Gestion', code: 'ECO' },
    { id: 6, nom: 'Lettres', code: 'LETTRES' },
    { id: 7, nom: 'Sport', code: 'SPORT' }
  ];

  // 2. Définition des Matières Nationales (Package Scoring)
  const matieresData = [
    { id: 1, nom: 'Mathématiques', code: 'math' },
    { id: 2, nom: 'Sciences Physiques', code: 'physique' },
    { id: 3, nom: 'Algorithmique & TIC', code: 'algo_tic' },
    { id: 4, nom: 'Sciences de la Vie et de la Terre', code: 'svt' },
    { id: 5, nom: 'Technologie', code: 'technique' },
    { id: 6, nom: 'Économie', code: 'economie' },
    { id: 7, nom: 'Gestion', code: 'gestion' },
    { id: 8, nom: 'Arabe', code: 'arabe' },
    { id: 9, nom: 'Français', code: 'francais' },
    { id: 10, nom: 'Anglais', code: 'anglais' },
    { id: 11, nom: 'Histoire & Géographie', code: 'histoire_geo' },
    { id: 12, nom: 'Philosophie', code: 'philosophie' },
    { id: 13, nom: 'Sport Pratique', code: 'sport_pratique' }
  ];

  // 3. Coefficients officiels par section (Package Scoring)
  // Formule FG officielle : 4*MG + Somme(Note * Coeff)
  const coeffMapping = {
    INFO: [
      { code: 'math', coeff: 1.5 },
      { code: 'algo_tic', coeff: 1.5 },
      { code: 'physique', coeff: 1.0 },
      { code: 'francais', coeff: 0.5 },
      { code: 'anglais', coeff: 0.5 }
    ],
    MATH: [
      { code: 'math', coeff: 2.0 },
      { code: 'physique', coeff: 1.5 },
      { code: 'svt', coeff: 0.5 },
      { code: 'francais', coeff: 0.5 },
      { code: 'anglais', coeff: 0.5 }
    ],
    SC_EXP: [
      { code: 'math', coeff: 1.5 },
      { code: 'physique', coeff: 1.5 },
      { code: 'svt', coeff: 1.5 },
      { code: 'francais', coeff: 0.5 },
      { code: 'anglais', coeff: 0.5 }
    ],
    TECH: [
      { code: 'technique', coeff: 1.5 },
      { code: 'math', coeff: 1.5 },
      { code: 'physique', coeff: 1.0 },
      { code: 'francais', coeff: 0.5 },
      { code: 'anglais', coeff: 0.5 }
    ],
    ECO: [
      { code: 'economie', coeff: 1.5 },
      { code: 'gestion', coeff: 1.5 },
      { code: 'math', coeff: 1.0 },
      { code: 'histoire_geo', coeff: 0.5 },
      { code: 'francais', coeff: 0.5 },
      { code: 'anglais', coeff: 0.5 }
    ],
    LETTRES: [
      { code: 'arabe', coeff: 2.0 },
      { code: 'francais', coeff: 1.5 },
      { code: 'anglais', coeff: 1.5 },
      { code: 'histoire_geo', coeff: 1.0 },
      { code: 'philosophie', coeff: 0.5 }
    ],
    SPORT: [
      { code: 'sport_pratique', coeff: 1.5 },
      { code: 'svt', coeff: 1.0 },
      { code: 'physique', coeff: 1.0 },
      { code: 'francais', coeff: 0.5 },
      { code: 'anglais', coeff: 0.5 }
    ]
  };

  // 4. Utilisateurs : Administrateur & Étudiants (Package Utilisateurs)
  const adminsData = [
    {
      id: 1,
      login: 'admin@orientn.tn',
      motDePasseHash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W6efXm5k1J5.jJeq' // orientn2025
    }
  ];

  const etudiantsData = [
    {
      id: 1,
      nom: 'Trabelsi',
      prenom: 'Yassine',
      email: 'yassine.trabelsi@bac.tn'
    },
    {
      id: 2,
      nom: 'Ben Salem',
      prenom: 'Mariem',
      email: 'mariem.bensalem@bac.tn'
    },
    {
      id: 3,
      nom: 'Chaabane',
      prenom: 'Ahmed',
      email: 'ahmed.chaabane@bac.tn'
    }
  ];

  // 5. Facultés et Établissements (Package Etablissements)
  const facultesData = [
    {
      id: 1,
      nom: "Institut National des Sciences Appliquées et de Technologie",
      nomCourt: "INSAT",
      universite: "Université de Carthage",
      gouvernorat: "Ariana",
      adresse: "Centre Urbain Nord, BP 676 - 1080 Tunis Cedex",
      latitude: 36.8428,
      longitude: 10.1963,
      description: "Établissement d'enseignement supérieur d'élite en Tunisie, formant des cadres et ingénieurs de haut niveau dans les technologies de pointe, génie logiciel, réseaux et industrie.",
      siteWeb: "http://www.insat.rnu.tn",
      contactEmail: "contact@insat.rnu.tn",
      contactTelephone: "+216 71 703 829",
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60",
      evenements: ["INSAT Hackathon", "TuniHack", "Securinets CTF Quals", "Forum Entreprises INSAT"]
    },
    {
      id: 2,
      nom: "Institut Supérieur d'Informatique",
      nomCourt: "ISI",
      universite: "Université de Tunis El Manar",
      gouvernorat: "Ariana",
      adresse: "2 Rue Abou Raihane El Bayrouni, 2080 Ariana",
      latitude: 36.8601,
      longitude: 10.1934,
      description: "Pôle d'excellence dédié à l'informatique, aux sciences des données, au génie logiciel et aux systèmes embarqués en Tunisie.",
      siteWeb: "http://www.isi.rnu.tn",
      contactEmail: "contact@isi.utm.tn",
      contactTelephone: "+216 71 706 164",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
      evenements: ["ISI Tech Day", "Challenge IoT", "Open Source Camp"]
    },
    {
      id: 3,
      nom: "Faculté de Médecine de Tunis",
      nomCourt: "FMT",
      universite: "Université de Tunis El Manar",
      gouvernorat: "Tunis",
      adresse: "15 Rue Djebel Lakhdar, La Rabta, 1007 Tunis",
      latitude: 36.8021,
      longitude: 10.1558,
      description: "La plus ancienne et prestigieuse faculté de médecine de Tunisie, formant l'élite médicale et chirurgicale du pays.",
      siteWeb: "http://www.fmt.rnu.tn",
      contactEmail: "doyen@fmt.utm.tn",
      contactTelephone: "+216 71 563 700",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60",
      evenements: ["Journées Médicales de Tunis", "Campagne Don de Sang", "Colloque d'Éthique Médicale"]
    },
    {
      id: 4,
      nom: "École Nationale d'Ingénieurs de Tunis",
      nomCourt: "ENIT",
      universite: "Université de Tunis El Manar",
      gouvernorat: "Tunis",
      adresse: "BP 37, Le Belvédère 1002 Tunis",
      latitude: 36.8315,
      longitude: 10.1472,
      description: "Doyenne des écoles d'ingénieurs tunisiennes, formant des leaders en génie civil, génie électrique, télécoms et hydraulique.",
      siteWeb: "http://www.enit.rnu.tn",
      contactEmail: "direction@enit.rnu.tn",
      contactTelephone: "+216 71 874 700",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60",
      evenements: ["Forum ENIT Entreprises", "RoboENIT", "Civil Engineering Days"]
    },
    {
      id: 5,
      nom: "Institut des Hautes Études Commerciales de Carthage",
      nomCourt: "IHEC Carthage",
      universite: "Université de Carthage",
      gouvernorat: "Tunis",
      adresse: "Rue Victor Hugo, Carthage Présidence 2016",
      latitude: 36.8582,
      longitude: 10.3308,
      description: "Première business school publique de Tunisie, réputée pour l'excellence de ses cursus en finance, marketing, management et comptabilité.",
      siteWeb: "http://www.ihec.rnu.tn",
      contactEmail: "contact@ihec.rnu.tn",
      contactTelephone: "+216 71 730 089",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
      evenements: ["IHEC Financial Summit", "Marketing Night", "TEDxIHECCarthage"]
    },
    {
      id: 6,
      nom: "Faculté de Médecine de Monastir",
      nomCourt: "FMM",
      universite: "Université de Monastir",
      gouvernorat: "Monastir",
      adresse: "Avenue Avicenne, 5019 Monastir",
      latitude: 35.7656,
      longitude: 10.8258,
      description: "Faculté médicale renommée du Sahel tunisien, rattachée aux centres hospitaliers universitaires Fattouma Bourguiba et Tahar Sfar.",
      siteWeb: "http://www.fmm.rnu.tn",
      contactEmail: "contact@fmm.rnu.tn",
      contactTelephone: "+216 73 462 200",
      imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop&q=60",
      evenements: ["Congrès Médical du Sahel", "Semaine de Prévention Santé"]
    },
    {
      id: 7,
      nom: "École Nationale d'Ingénieurs de Sfax",
      nomCourt: "ENIS",
      universite: "Université de Sfax",
      gouvernorat: "Sfax",
      adresse: "Route de Soukra Km 4, BP 1173, 3038 Sfax",
      latitude: 34.7262,
      longitude: 10.7178,
      description: "Grand établissement d'ingénieurs au sud de la Tunisie, pionnier en génie informatique, génie mécanique, matériaux et électromécanique.",
      siteWeb: "http://www.enis.rnu.tn",
      contactEmail: "enis@enis.tn",
      contactTelephone: "+216 74 274 088",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60",
      evenements: ["Forum ENIS Entreprises", "Sfax Robot Cup", "Engineering Days"]
    },
    {
      id: 8,
      nom: "École Supérieure des Sciences et de la Technologie de Hammam Sousse",
      nomCourt: "ESSTHS",
      universite: "Université de Sousse",
      gouvernorat: "Sousse",
      adresse: "Rue Lamine El Abassi, 4011 Hammam Sousse",
      latitude: 35.8583,
      longitude: 10.5952,
      description: "Établissement dynamique offrant des licences et masters reconnus en technologies de l'information, électronique et sciences physiques.",
      siteWeb: "http://www.essths.rnu.tn",
      contactEmail: "contact@essths.u-sousse.tn",
      contactTelephone: "+216 73 369 500",
      imageUrl: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop&q=60",
      evenements: ["ESSTHS Hackathon", "Journée Innovation Verte"]
    }
  ];

  // 6. Filières Académiques (Package Etablissements)
  const filieresData = [
    {
      id: 1,
      nom: "Cycle Préparatoire Intégré : Math - Physique - Informatique (MPI)",
      domaine: "Informatique & Ingénierie",
      description: "Cursus préparatoire intégré en deux ans donnant accès direct aux cycles d'ingénieurs en génie logiciel, réseaux et systèmes.",
      code: "MPI",
      diplome: "Cycle Ingénieur",
      dureeAnnees: 5
    },
    {
      id: 2,
      nom: "Licence en Génie Logiciel et Systèmes d'Information",
      domaine: "Informatique",
      description: "Formation orientée vers la conception d'architectures logicielles modernes, applications cloud, web fullstack et DevOps.",
      code: "L-GL",
      diplome: "Licence",
      dureeAnnees: 3
    },
    {
      id: 3,
      nom: "Cycle Préparatoire Intégré : Chimie - Biologie Appliquée (CBA)",
      domaine: "Sciences Fondamentales",
      description: "Formation de haut niveau en génie chimique, biotechnologie et procédés agroalimentaires.",
      code: "CBA",
      diplome: "Cycle Ingénieur",
      dureeAnnees: 5
    },
    {
      id: 4,
      nom: "Diplôme National de Docteur en Médecine",
      domaine: "Médecine & Santé",
      description: "Études médicales complètes comprenant les cycles pré-cliniques, cliniques et internat hospitalier.",
      code: "MED",
      diplome: "Doctorat en Médecine",
      dureeAnnees: 7
    },
    {
      id: 5,
      nom: "Cycle Ingénieur en Génie Électrique & Automatique",
      domaine: "Ingénierie",
      description: "Formation pointue sur les énergies renouvelables, systèmes de commande industriels et électronique de puissance.",
      code: "GE",
      diplome: "Cycle Ingénieur",
      dureeAnnees: 3
    },
    {
      id: 6,
      nom: "Licence en Sciences Économiques et Financières",
      domaine: "Économie & Gestion",
      description: "Formation aux marchés de capitaux, analyse financière internationale, audit bancaire et fintech.",
      code: "L-FIN",
      diplome: "Licence",
      dureeAnnees: 3
    },
    {
      id: 7,
      nom: "Licence en Business Computing (Informatique de Gestion)",
      domaine: "Informatique & Économie",
      description: "Cursus hybride alliant modélisation décisionnelle, business intelligence (BI) et gouvernance des systèmes d'information.",
      code: "L-BC",
      diplome: "Licence",
      dureeAnnees: 3
    },
    {
      id: 8,
      nom: "Licence en Mathématiques et Applications",
      domaine: "Sciences Fondamentales",
      description: "Formation de pointe en modélisation stochastique, cryptographie et analyse mathématique approfondie.",
      code: "L-MATH",
      diplome: "Licence",
      dureeAnnees: 3
    }
  ];

  // 7. Vie Associative par Faculté (Package Etablissements)
  const viesAssociativesData = [
    // INSAT
    { faculteId: 1, type: "Club Technologique", nom: "IEEE INSAT Student Branch", description: "L'une des branches étudiantes IEEE les plus actives d'Afrique et du Moyen-Orient." },
    { faculteId: 1, type: "Club Cybersécurité", nom: "SecurNets", description: "Pionnier du hacking éthique et organisateur du CTF annuel d'envergure internationale." },
    { faculteId: 1, type: "Club Robotique", nom: "Aerobotix INSAT", description: "Conception de robots autonomes et drones compétitifs aux championnats nationaux." },
    { faculteId: 1, type: "Club Culturel", nom: "Ciné-Radio INSAT", description: "Animation culturelle du campus, production radiophonique et ciné-club." },

    // ISI
    { faculteId: 2, type: "Club Open Source", nom: "Open Source Club ISI (OSC)", description: "Promotion des logiciels libres, Linux, ateliers Git et développement collaboratif." },
    { faculteId: 2, type: "Club Robotique", nom: "Club Robotique ISI (CRI)", description: "Conception de systèmes embarqués, Arduino, Raspberry Pi et participation aux compétitions." },
    { faculteId: 2, type: "Junior Entreprise", nom: "Junior Entreprise ISI", description: "Mise en relation d'étudiants avec le tissu industriel pour des missions professionnelles." },

    // FMT
    { faculteId: 3, type: "Association Médicale", nom: "Associa-Med Tunis", description: "Association des stagiaires internes et étudiants en médecine, membre de l'IFMSA." },
    { faculteId: 3, type: "Club Humanitaire", nom: "Croissant-Rouge FMT", description: "Actions de sensibilisation sanitaire, caravanes médicales et soutien aux zones prioritaires." },

    // ENIT
    { faculteId: 4, type: "Junior Entreprise", nom: "ENIT Junior Entreprise", description: "La plus ancienne junior entreprise de Tunisie, réalisant des études d'ingénierie réelles." },
    { faculteId: 4, type: "Club Robotique", nom: "RoboENIT", description: "Club historique de robotique industrielle et mécatronique." },

    // IHEC Carthage
    { faculteId: 5, type: "Club Finance", nom: "IHEC Finance Club", description: "Simulations de trading boursier, valorisation d'entreprises et visites de la BVMT." },
    { faculteId: 5, type: "Club Entrepreneuriat", nom: "Enactus IHEC Carthage", description: "Développement de projets d'entrepreneuriat social à fort impact sociétal." },

    // FMM
    { faculteId: 6, type: "Association Médicale", nom: "Associa-Med Monastir", description: "Actions de santé publique, santé reproductive et échanges cliniques internationaux." },

    // ENIS
    { faculteId: 7, type: "Club Robotique", nom: "Club Robotique ENIS", description: "Organisateur de la Sfax Robot Cup et projets mécatroniques." },

    // ESSTHS
    { faculteId: 8, type: "Club Développement", nom: "ESSTHS Coding Club", description: "Algorithmique compétitive, hackathons web et formations en technologies modernes." }
  ];

  // 8. Offres de Formation (Package Etablissements)
  // Liaison Faculté - Filière - Score Seuil - Capacité - Sections Bac Autorisées
  const offresFormationConfig = [
    {
      faculteId: 1, // INSAT
      filiereId: 1, // MPI
      annee: 2024,
      scoreSeuil: 162.0,
      capacite: 350,
      sectionsCodes: ['MATH', 'INFO', 'SC_EXP', 'TECH'],
      scoresParSection: { MATH: 168.5, INFO: 162.0, SC_EXP: 165.2, TECH: 155.0 }
    },
    {
      faculteId: 1, // INSAT
      filiereId: 3, // CBA
      annee: 2024,
      scoreSeuil: 152.0,
      capacite: 150,
      sectionsCodes: ['MATH', 'SC_EXP'],
      scoresParSection: { MATH: 152.0, SC_EXP: 158.4 }
    },
    {
      faculteId: 2, // ISI
      filiereId: 2, // L-GL
      annee: 2024,
      scoreSeuil: 145.0,
      capacite: 180,
      sectionsCodes: ['INFO', 'MATH', 'SC_EXP', 'TECH'],
      scoresParSection: { INFO: 148.5, MATH: 145.0, SC_EXP: 142.0, TECH: 138.0 }
    },
    {
      faculteId: 2, // ISI
      filiereId: 7, // L-BC
      annee: 2024,
      scoreSeuil: 138.0,
      capacite: 120,
      sectionsCodes: ['INFO', 'ECO', 'MATH'],
      scoresParSection: { INFO: 140.0, ECO: 138.0, MATH: 135.0 }
    },
    {
      faculteId: 3, // FMT
      filiereId: 4, // Médecine
      annee: 2024,
      scoreSeuil: 172.5,
      capacite: 400,
      sectionsCodes: ['SC_EXP', 'MATH'],
      scoresParSection: { SC_EXP: 173.8, MATH: 171.2 }
    },
    {
      faculteId: 6, // FMM
      filiereId: 4, // Médecine
      annee: 2024,
      scoreSeuil: 169.0,
      capacite: 300,
      sectionsCodes: ['SC_EXP', 'MATH'],
      scoresParSection: { SC_EXP: 170.1, MATH: 167.8 }
    },
    {
      faculteId: 4, // ENIT
      filiereId: 5, // GE
      annee: 2024,
      scoreSeuil: 155.0,
      capacite: 160,
      sectionsCodes: ['MATH', 'TECH', 'SC_EXP'],
      scoresParSection: { MATH: 158.0, TECH: 155.0, SC_EXP: 152.0 }
    },
    {
      faculteId: 5, // IHEC
      filiereId: 6, // L-FIN
      annee: 2024,
      scoreSeuil: 142.0,
      capacite: 250,
      sectionsCodes: ['ECO', 'MATH', 'INFO'],
      scoresParSection: { ECO: 143.5, MATH: 140.0, INFO: 139.5 }
    },
    {
      faculteId: 7, // ENIS
      filiereId: 5, // GE
      annee: 2024,
      scoreSeuil: 148.0,
      capacite: 140,
      sectionsCodes: ['TECH', 'MATH', 'SC_EXP'],
      scoresParSection: { TECH: 148.0, MATH: 150.0, SC_EXP: 145.0 }
    },
    {
      faculteId: 8, // ESSTHS
      filiereId: 2, // L-GL
      annee: 2024,
      scoreSeuil: 135.0,
      capacite: 150,
      sectionsCodes: ['INFO', 'MATH', 'TECH', 'SC_EXP'],
      scoresParSection: { INFO: 136.5, MATH: 134.0, TECH: 132.0, SC_EXP: 130.0 }
    }
  ];

  // 9. Roadmap de Préparation & Étapes (Package IA)
  const roadmapSampleEtapes = [
    {
      ordre: 1,
      titre: "Fondations Algorithmiques & Logique Orientée Objet",
      description: "Consolidation des structures de données en C/C++, pointeurs, gestion de la mémoire et principes fondamentaux de la POO.",
      dureeSemaines: 2,
      sujets: [
        "Pointeurs et allocation dynamique",
        "Structures linéaires (piles, files, listes)",
        "Principes POO : Encapsulation, Héritage, Polymorphisme"
      ],
      ressources: [
        "Cours OpenClassrooms C++ / Java",
        "Exercices LeetCode niveau Easy",
        "Supports UVT Informatique"
      ]
    },
    {
      ordre: 2,
      titre: "Bases de Données Relationnelles & SQL Avancé",
      description: "Modélisation des données avec la méthode Merise, conception de schémas relationnels et requêtage SQL.",
      dureeSemaines: 2,
      sujets: [
        "Modèles Conceptuels et Logiques de Données (MCD/MLD)",
        "Jointures, agrégations et sous-requêtes SQL",
        "Installation et administration basique de PostgreSQL / MongoDB"
      ],
      ressources: [
        "SQLZoo interactif",
        "Documentation officielle PostgreSQL",
        "Tutoriels Merise YouTube"
      ]
    },
    {
      ordre: 3,
      titre: "Architecture Web & Outils Collaboratifs (Git / DevOps)",
      description: "Apprentissage des bonnes pratiques de travail en équipe, gestion de versions et développement fullstack.",
      dureeSemaines: 2,
      sujets: [
        "Architecture Client-Serveur et API REST",
        "Commandes Git fondamentales et flux GitHub",
        "Initiation aux technologies web modernes (React & Express)"
      ],
      ressources: [
        "FreeCodeCamp Fullstack",
        "Documentation Git",
        "Ateliers Open Source INSAT / ISI"
      ]
    }
  ];

  // =========================================================================
  // EXÉCUTION DU PEUPLEMENT DANS MONGODB (si connecté)
  // =========================================================================
  const isMongoConnected = mongoose.connection.readyState === 1;

  if (isMongoConnected) {
    console.log('🧹 Nettoyage des anciennes collections MongoDB...');
    await Promise.all([
      Etudiant.deleteMany({}),
      Administrateur.deleteMany({}),
      SectionBac.deleteMany({}),
      Matiere.deleteMany({}),
      CoefficientMatiere.deleteMany({}),
      Faculte.deleteMany({}),
      Filiere.deleteMany({}),
      OffreFormation.deleteMany({}),
      VieAssociative.deleteMany({}),
      ResultatScore.deleteMany({}),
      Recommandation.deleteMany({}),
      RoadmapPreparation.deleteMany({})
    ]);
    console.log('✨ Base de données nettoyée avec succès.');

    // Insertion SectionsBac & Matieres
    console.log('📥 Insertion des Sections du Bac et des Matières...');
    const insertedSections = await SectionBac.insertMany(sectionsData);
    const insertedMatieres = await Matiere.insertMany(matieresData);

    const sectionsMap = new Map();
    insertedSections.forEach((s) => sectionsMap.set(s.code, s));

    const matieresMap = new Map();
    insertedMatieres.forEach((m) => matieresMap.set(m.code, m));

    // Insertion CoefficientMatiere
    console.log('📥 Insertion des Coefficients des Matières officielles...');
    const coeffsToInsert = [];
    for (const [secCode, items] of Object.entries(coeffMapping)) {
      const secDoc = sectionsMap.get(secCode);
      if (!secDoc) continue;

      for (const item of items) {
        const matDoc = matieresMap.get(item.code);
        if (!matDoc) continue;

        coeffsToInsert.push({
          valeur: item.coeff,
          estBonus: false,
          section: secDoc._id,
          matiere: matDoc._id
        });
      }
    }
    const insertedCoeffs = await CoefficientMatiere.insertMany(coeffsToInsert);

    // Mettre à jour les références dans SectionBac
    for (const sec of insertedSections) {
      const relatedCoeffIds = insertedCoeffs
        .filter((c) => c.section.toString() === sec._id.toString())
        .map((c) => c._id);
      await SectionBac.findByIdAndUpdate(sec._id, { coefficients: relatedCoeffIds });
    }

    // Insertion Utilisateurs
    console.log('📥 Insertion des Utilisateurs (Administrateurs & Étudiants)...');
    await Administrateur.insertMany(adminsData);
    const insertedEtudiants = await Etudiant.insertMany(etudiantsData);

    // Insertion Facultés & Filières
    console.log('📥 Insertion des Facultés et Filières Universitaires...');
    const insertedFacultes = await Faculte.insertMany(facultesData);
    const insertedFilieres = await Filiere.insertMany(filieresData);

    const facultesMap = new Map();
    insertedFacultes.forEach((f) => facultesMap.set(f.id, f));

    const filieresMap = new Map();
    insertedFilieres.forEach((fil) => filieresMap.set(fil.id, fil));

    // Insertion VieAssociative
    console.log('📥 Insertion des Clubs et de la Vie Associative...');
    const viesToInsert = viesAssociativesData.map((v) => {
      const facDoc = facultesMap.get(v.faculteId);
      return {
        type: v.type,
        nom: v.nom,
        description: v.description,
        faculte: facDoc ? facDoc._id : null
      };
    });
    const insertedVies = await VieAssociative.insertMany(viesToInsert);

    // Mettre à jour Faculte avec les IDs des vies associatives (Composition UML)
    for (const fac of insertedFacultes) {
      const relatedVies = insertedVies
        .filter((v) => v.faculte && v.faculte.toString() === fac._id.toString())
        .map((v) => v._id);
      await Faculte.findByIdAndUpdate(fac._id, { vieAssociative: relatedVies });
    }

    // Insertion Offres de Formation
    console.log('📥 Insertion des Offres de Formation et Scores Seuils...');
    const offresToInsert = offresFormationConfig.map((cfg) => {
      const facDoc = facultesMap.get(cfg.faculteId);
      const filDoc = filieresMap.get(cfg.filiereId);
      const secIds = cfg.sectionsCodes.map((code) => sectionsMap.get(code)?._id).filter(Boolean);

      return {
        annee: cfg.annee,
        scoreSeuil: cfg.scoreSeuil,
        capacite: cfg.capacite,
        faculte: facDoc ? facDoc._id : null,
        filiere: filDoc ? filDoc._id : null,
        sectionsBac: secIds,
        scoresParSection: cfg.scoresParSection
      };
    });
    const insertedOffres = await OffreFormation.insertMany(offresToInsert);

    // Mettre à jour les compositions et associations
    for (const fac of insertedFacultes) {
      const relatedOffres = insertedOffres
        .filter((o) => o.faculte && o.faculte.toString() === fac._id.toString())
        .map((o) => o._id);
      await Faculte.findByIdAndUpdate(fac._id, { offresFormation: relatedOffres });
    }

    for (const fil of insertedFilieres) {
      const relatedOffres = insertedOffres
        .filter((o) => o.filiere && o.filiere.toString() === fil._id.toString())
        .map((o) => o._id);
      await Filiere.findByIdAndUpdate(fil._id, { offresFormation: relatedOffres });
    }

    // Association 'accessible aux' entre SectionBac et OffreFormation
    for (const sec of insertedSections) {
      const relatedOffres = insertedOffres
        .filter((o) => o.sectionsBac.some((sId) => sId.toString() === sec._id.toString()))
        .map((o) => o._id);
      await SectionBac.findByIdAndUpdate(sec._id, { offresFormation: relatedOffres });
    }

    // Insertion Exemple ResultatScore & Recommandations (Package Scoring)
    console.log('📥 Insertion d\'un exemple de ResultatScore et Recommandations...');
    const etudiant1 = insertedEtudiants[0];
    const sectionInfo = sectionsMap.get('INFO');

    // Simulation de calcul de score pour l'étudiant 1
    const testNotes = [
      { matiere: matieresMap.get('math')._id, valeur: 15.5, matiereNom: 'Mathématiques' },
      { matiere: matieresMap.get('algo_tic')._id, valeur: 17.0, matiereNom: 'Algorithmique & TIC' },
      { matiere: matieresMap.get('physique')._id, valeur: 14.0, matiereNom: 'Sciences Physiques' },
      { matiere: matieresMap.get('francais')._id, valeur: 13.0, matiereNom: 'Français' },
      { matiere: matieresMap.get('anglais')._id, valeur: 16.5, matiereNom: 'Anglais' }
    ];

    const calcResult = await CalculateurScore.calculer(testNotes, sectionInfo, {
      moyenneGenerale: 15.2,
      avec7Pourcent: false
    });

    const sampleResultatScore = await ResultatScore.create({
      id: 1,
      date: new Date(),
      scoreFige: calcResult.scoreFige,
      moyenneGenerale: 15.2,
      etudiant: etudiant1._id,
      section: sectionInfo._id,
      notes: testNotes,
      avec7Pourcent: false
    });

    // Moteur de recommandation produisant des Recommandations
    await MoteurRecommandation.recommander(sampleResultatScore);

    // Insertion Exemple RoadmapPreparation (Package IA)
    console.log('📥 Insertion d\'une Roadmap de Préparation Estivale (IA)...');
    const filiereMPI = filieresMap.get(1); // MPI
    const faculteINSAT = facultesMap.get(1);

    const sampleRoadmap = await RoadmapPreparation.create({
      id: 1,
      dateGeneration: new Date(),
      resume: "Plan d'action estival intensif pour la filière MPI à l'INSAT",
      promptUtilise: "Préparation estivale complète pour bachelier admis au cycle préparatoire MPI de l'INSAT",
      statut: "GENEREE",
      etudiant: etudiant1._id,
      filiere: filiereMPI._id,
      faculte: faculteINSAT._id,
      etapes: roadmapSampleEtapes
    });

    // Mettre à jour l'étudiant avec ses références (associations UML)
    await Etudiant.findByIdAndUpdate(etudiant1._id, {
      resultatsScore: [sampleResultatScore._id],
      roadmaps: [sampleRoadmap._id]
    });

    console.log('🎉 Initialisation MongoDB terminée avec un succès total à 100% !');
  }

  // =========================================================================
  // CRÉATION DU DUMP JSON COMPLET POUR ARCHIVE & INITIALISATION AUTONOME
  // =========================================================================
  const exportPayload = {
    generatedAt: new Date().toISOString(),
    system: "OrienTn - Architecture StarUML 100% Conforme",
    packages: {
      Utilisateurs: {
        Administrateurs: adminsData,
        Etudiants: etudiantsData
      },
      Scoring: {
        SectionsBac: sectionsData,
        Matieres: matieresData,
        Coefficients: coeffMapping
      },
      Etablissements: {
        Facultes: facultesData,
        Filieres: filieresData,
        ViesAssociatives: viesAssociativesData,
        OffresFormation: offresFormationConfig
      },
      IA: {
        RoadmapExemple: {
          resume: "Plan d'action estival pour MPI",
          etapes: roadmapSampleEtapes
        }
      }
    }
  };

  const dumpPath = path.resolve(__dirname, 'mongoSeedData.json');
  fs.writeFileSync(dumpPath, JSON.stringify(exportPayload, null, 2), 'utf-8');
  console.log(`💾 Jeu de données exporté avec succès dans : ${dumpPath}`);

  return exportPayload;
};

// Exécution directe si appelé via `node src/data/seed.js`
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase()
    .then(() => {
      console.log('✅ Fin de la procédure de seed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Erreur critique pendant le seed :', err);
      process.exit(1);
    });
}
