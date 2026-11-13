import axios from 'axios';

/**
 * Interface / Implémentation ServiceIA (Package : IA)
 * Méthode UML : + genererPlan(filiere: Filiere) -> List<EtapeRoadmap>
 */
export class ServiceIA {
  /**
   * Génère un plan estival (liste d'étapes de préparation) pour une filière
   * @param {Object} filiere - Document Filiere ou objet décrivant la filière
   * @param {Object} context - Contexte optionnel (nom de la faculté, niveau, etc.)
   * @returns {Promise<Array<Object>>} Liste des étapes (EtapeRoadmap)
   */
  static async genererPlan(filiere, context = {}) {
    const filiereNom = filiere.nom || (typeof filiere === 'string' ? filiere : 'Filière Universitaire');
    const domaine = filiere.domaine || context.domaine || 'Informatique';
    const faculteNom = context.faculteNom || 'Université Tunisienne';

    const pythonRagUrl = process.env.PYTHON_RAG_URL || 'http://localhost:8000';

    // 1. Tenter l'appel au microservice Python RAG
    try {
      const response = await axios.post(
        `${pythonRagUrl}/api/summer-prep`,
        {
          chosenSection: filiereNom,
          domain: domaine,
          facultyName: faculteNom
        },
        { timeout: 3000 }
      );

      if (response.data && response.data.roadmap && response.data.roadmap.weeks) {
        const weeks = response.data.roadmap.weeks;
        return weeks.map((w, index) => ({
          ordre: index + 1,
          titre: w.focus || w.week || `Étape ${index + 1}`,
          description: w.description || (w.topics ? w.topics.join(' ; ') : `Préparation pour ${filiereNom}`),
          dureeSemaines: 2,
          sujets: w.topics || w.tasks || [],
          ressources: w.resources || []
        }));
      }
    } catch {
      // Fallback si Python RAG est inaccessible
    }

    // 2. Générateur de secours intelligent selon le domaine académique
    const isTech = /info|informatique|logiciel|système|ingénierie|technologie|data/i.test(`${filiereNom} ${domaine}`);
    const isMed = /médecine|santé|dentaire|pharmacie|biologie/i.test(`${filiereNom} ${domaine}`);
    const isEco = /économie|gestion|finance|marketing|comptabilité|commerce/i.test(`${filiereNom} ${domaine}`);

    if (isTech) {
      return [
        {
          ordre: 1,
          titre: 'Fondations Algorithmiques & Logique Orientée Objet',
          description: 'Consolidation des algorithmes, structures de données fondamentales et logique de programmation.',
          dureeSemaines: 2,
          sujets: ['Pointeurs et allocation dynamique en C/C++', 'Structures de données linéaires (piles, files, listes)', 'Concepts clés de la POO (Encapsulation, Héritage, Polymorphisme)'],
          ressources: ['Cours OpenClassrooms POO', 'Exercices LeetCode Easy', 'Supports pédagogiques UVT']
        },
        {
          ordre: 2,
          titre: 'Bases de Données Relationnelles & Modélisation',
          description: 'Comprendre la structure des données relationnelles et manipuler le langage SQL.',
          dureeSemaines: 2,
          sujets: ['Conception de schémas Merise (MCD, MLD)', 'Requêtes SQL (Jointures, Sous-requêtes, Agrégrations)', 'Installation et configuration de MySQL ou PostgreSQL'],
          ressources: ['SQLZoo interactif', 'Documentation officielle PostgreSQL', 'Tutoriels YouTube Modélisation Merise']
        },
        {
          ordre: 3,
          titre: 'Développement Web Moderne & Outils Collaboratifs',
          description: 'Introduction aux architectures client-serveur et au versioning avec Git.',
          dureeSemaines: 2,
          sujets: ['Comprendre les protocoles HTTP et API REST', 'Prise en main de Git et GitHub', 'Initiation à React ou Node.js'],
          ressources: ['FreeCodeCamp', 'Documentation officielle Git', 'Mini-projet guidé']
        }
      ];
    } else if (isMed) {
      return [
        {
          ordre: 1,
          titre: 'Terminologie Médicale & Anatomie Générale',
          description: 'Acquisition du vocabulaire médical gréco-latin et principes d’anatomie humaine descriptive.',
          dureeSemaines: 2,
          sujets: ['Vocabulaire médical et racines grecques/latines', 'Ostéologie et arthrologie de base', 'Plans anatomiques et orientation spatiale'],
          ressources: ['Atlas d’Anatomie Netter', 'Applications 3D Complete Anatomy', 'Guide d’anatomie PCEM1']
        },
        {
          ordre: 2,
          titre: 'Biologie Cellulaire & Génétique Fondamentale',
          description: 'Compréhension approfondie des mécanismes cellulaires et moléculaires.',
          dureeSemaines: 2,
          sujets: ['Structure membranaire et transport transmembranaire', 'Cycle cellulaire, mitose et méiose', 'Transcription, traduction et régulation génétique'],
          ressources: ['Manuels de référence Biologie Cellulaire', 'Vidéos de biochimie et biologie médicale']
        },
        {
          ordre: 3,
          titre: 'Organisation & Méthodologie d’Apprentissage Médical',
          description: 'Adoption de méthodes d’apprentissage à haute rétention pour le premier cycle.',
          dureeSemaines: 2,
          sujets: ['Techniques de répétition espacée (Anki)', 'Gestion du stress, sommeil et rythme de travail soutenu', 'Découverte des associations étudiantes (Associa-Med)'],
          ressources: ['Decks Anki PCEM1 Tunisie', 'Guides des aînés de la faculté']
        }
      ];
    } else if (isEco) {
      return [
        {
          ordre: 1,
          titre: 'Mathématiques Appliquées & Statistiques Descriptives',
          description: 'Remise à niveau sur les outils quantitatifs indispensables à la gestion.',
          dureeSemaines: 2,
          sujets: ['Fonctions à plusieurs variables et optimisation', 'Statistiques descriptives (moyenne, écart-type, corrélations)', 'Algèbre linéaire appliquée'],
          ressources: ['Khan Academy Microéconomie', 'Exercices résolus d’économie quantitative']
        },
        {
          ordre: 2,
          titre: 'Fondamentaux de la Comptabilité Générale',
          description: 'Maîtrise du Système Comptable Tunisien (SCT) et des états financiers.',
          dureeSemaines: 2,
          sujets: ['Principe de la partie double et journal comptable', 'Bilan, compte de résultat et annexes', 'Opérations courantes d’achat et de vente'],
          ressources: ['Système Comptable des Entreprises Tunisiennes', 'Exercices pratiques de comptabilité']
        },
        {
          ordre: 3,
          titre: 'Outils Numériques de Gestion & Culture Économique',
          description: 'Maîtrise d’Excel avancé et compréhension des enjeux économiques tunisiens.',
          dureeSemaines: 2,
          sujets: ['Formules avancées Excel (RechercheX, Tableaux croisés)', 'Comprendre les rapports de la Banque Centrale de Tunisie', 'Bases du marketing et de la finance d’entreprise'],
          ressources: ['Tutoriels Excel for Business', 'Publications économiques (IlBoursa, Managers)']
        }
      ];
    }

    // Défaut
    return [
      {
        ordre: 1,
        titre: 'Méthodologie du Travail Universitaire',
        description: 'Transition lycée-faculté, autonomie et techniques de recherche académique.',
        dureeSemaines: 2,
        sujets: ['Prise de notes efficace en amphithéâtre', 'Recherche documentaire et gestion bibliographique', 'Planification du travail personnel'],
        ressources: ['Guides universitaires de méthodologie']
      },
      {
        ordre: 2,
        titre: 'Renforcement Linguistique & Communication Professionnelle',
        description: 'Perfectionnement du français et de l’anglais dans un contexte académique.',
        dureeSemaines: 2,
        sujets: ['Rédaction de synthèses et rapports', 'Expression orale et présentation de projets', 'Vocabulaire spécialisé de la filière'],
        ressources: ['Plateformes d’apprentissage de langues']
      },
      {
        ordre: 3,
        titre: 'Outils Numériques & Environnement de Campus',
        description: 'Maîtrise des logiciels de productivité et découverte de la vie associative.',
        dureeSemaines: 2,
        sujets: ['Outils collaboratifs (Google Workspace, Notion)', 'Introduction aux clubs étudiants de la faculté', 'Préparation du premier semestre'],
        ressources: ['Tutoriels outils collaboratifs']
      }
    ];
  }
}

export default ServiceIA;
