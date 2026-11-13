import SectionBac from '../models/SectionBac.js';
import Matiere from '../models/Matiere.js';
import CoefficientMatiere from '../models/CoefficientMatiere.js';
import ResultatScore from '../models/ResultatScore.js';
import CalculateurScore from '../services/CalculateurScore.js';
import { calculateTunisianScore, BAC_SECTIONS } from '../utils/scoreFormulas.js';

// Configuration par défaut en cas de base MongoDB vierge
const defaultSectionsConfig = [
  {
    code: 'MATH',
    name: BAC_SECTIONS.MATH,
    subjects: [
      { id: 'mg', label: 'Moyenne Générale du Bac', coeff: 4, placeholder: 'Ex: 14.50' },
      { id: 'math', label: 'Mathématiques', coeff: 2, placeholder: 'Ex: 16.00' },
      { id: 'physique', label: 'Sciences Physiques', coeff: 1.5, placeholder: 'Ex: 14.00' },
      { id: 'svt', label: 'Sciences de la Vie et de la Terre', coeff: 0.5, placeholder: 'Ex: 13.00' },
      { id: 'francais', label: 'Français', coeff: 0.5, placeholder: 'Ex: 12.00' },
      { id: 'anglais', label: 'Anglais', coeff: 0.5, placeholder: 'Ex: 15.00' }
    ]
  },
  {
    code: 'SC_EXP',
    name: BAC_SECTIONS.SC_EXP,
    subjects: [
      { id: 'mg', label: 'Moyenne Générale du Bac', coeff: 4, placeholder: 'Ex: 14.00' },
      { id: 'math', label: 'Mathématiques', coeff: 1.5, placeholder: 'Ex: 13.00' },
      { id: 'physique', label: 'Sciences Physiques', coeff: 1.5, placeholder: 'Ex: 14.50' },
      { id: 'svt', label: 'Sciences de la Vie et de la Terre', coeff: 1.5, placeholder: 'Ex: 15.00' },
      { id: 'francais', label: 'Français', coeff: 0.5, placeholder: 'Ex: 12.00' },
      { id: 'anglais', label: 'Anglais', coeff: 0.5, placeholder: 'Ex: 14.00' }
    ]
  },
  {
    code: 'INFO',
    name: BAC_SECTIONS.INFO,
    subjects: [
      { id: 'mg', label: 'Moyenne Générale du Bac', coeff: 4, placeholder: 'Ex: 15.00' },
      { id: 'math', label: 'Mathématiques', coeff: 1.5, placeholder: 'Ex: 14.00' },
      { id: 'algo_tic', label: 'Algorithmique & TIC', coeff: 1.5, placeholder: 'Ex: 17.50' },
      { id: 'physique', label: 'Sciences Physiques', coeff: 1, placeholder: 'Ex: 13.00' },
      { id: 'francais', label: 'Français', coeff: 0.5, placeholder: 'Ex: 12.50' },
      { id: 'anglais', label: 'Anglais', coeff: 0.5, placeholder: 'Ex: 16.00' }
    ]
  },
  {
    code: 'TECH',
    name: BAC_SECTIONS.TECH,
    subjects: [
      { id: 'mg', label: 'Moyenne Générale du Bac', coeff: 4, placeholder: 'Ex: 13.50' },
      { id: 'technique', label: 'Technologie (Génie Méca/Élec)', coeff: 1.5, placeholder: 'Ex: 15.00' },
      { id: 'math', label: 'Mathématiques', coeff: 1.5, placeholder: 'Ex: 13.00' },
      { id: 'physique', label: 'Sciences Physiques', coeff: 1, placeholder: 'Ex: 12.50' },
      { id: 'francais', label: 'Français', coeff: 0.5, placeholder: 'Ex: 11.00' },
      { id: 'anglais', label: 'Anglais', coeff: 0.5, placeholder: 'Ex: 13.00' }
    ]
  },
  {
    code: 'ECO',
    name: BAC_SECTIONS.ECO,
    subjects: [
      { id: 'mg', label: 'Moyenne Générale du Bac', coeff: 4, placeholder: 'Ex: 14.00' },
      { id: 'economie', label: 'Économie', coeff: 1.5, placeholder: 'Ex: 15.00' },
      { id: 'gestion', label: 'Gestion', coeff: 1.5, placeholder: 'Ex: 14.50' },
      { id: 'math', label: 'Mathématiques', coeff: 1, placeholder: 'Ex: 12.00' },
      { id: 'histoire_geo', label: 'Histoire & Géographie', coeff: 0.5, placeholder: 'Ex: 13.00' },
      { id: 'francais', label: 'Français', coeff: 0.5, placeholder: 'Ex: 12.00' },
      { id: 'anglais', label: 'Anglais', coeff: 0.5, placeholder: 'Ex: 14.00' }
    ]
  },
  {
    code: 'LETTRES',
    name: BAC_SECTIONS.LETTRES,
    subjects: [
      { id: 'mg', label: 'Moyenne Générale du Bac', coeff: 4, placeholder: 'Ex: 13.00' },
      { id: 'arabe', label: 'Arabe', coeff: 2, placeholder: 'Ex: 14.00' },
      { id: 'francais', label: 'Français', coeff: 1.5, placeholder: 'Ex: 13.50' },
      { id: 'anglais', label: 'Anglais', coeff: 1.5, placeholder: 'Ex: 14.00' },
      { id: 'histoire_geo', label: 'Histoire & Géographie', coeff: 1, placeholder: 'Ex: 12.50' },
      { id: 'philosophie', label: 'Philosophie', coeff: 0.5, placeholder: 'Ex: 13.00' }
    ]
  },
  {
    code: 'SPORT',
    name: BAC_SECTIONS.SPORT,
    subjects: [
      { id: 'mg', label: 'Moyenne Générale du Bac', coeff: 4, placeholder: 'Ex: 13.50' },
      { id: 'sport_pratique', label: 'Sport Spécialité', coeff: 1.5, placeholder: 'Ex: 17.00' },
      { id: 'svt', label: 'Sciences Biologiques', coeff: 1, placeholder: 'Ex: 13.00' },
      { id: 'physique', label: 'Sciences Physiques', coeff: 1, placeholder: 'Ex: 11.50' },
      { id: 'francais', label: 'Français', coeff: 0.5, placeholder: 'Ex: 11.00' },
      { id: 'anglais', label: 'Anglais', coeff: 0.5, placeholder: 'Ex: 12.00' }
    ]
  }
];

export const getSections = async (req, res) => {
  try {
    const sections = await SectionBac.find().populate({
      path: 'coefficients',
      populate: { path: 'matiere' }
    });

    if (sections && sections.length > 0) {
      const formatted = sections.map((sec) => {
        const subjects = [
          { id: 'mg', label: 'Moyenne Générale du Bac', coeff: 4, placeholder: 'Ex: 14.00' }
        ];

        if (sec.coefficients && sec.coefficients.length > 0) {
          sec.coefficients.forEach((c) => {
            if (c.matiere) {
              subjects.push({
                id: c.matiere.code || c.matiere.nom.toLowerCase().replace(/[^a-z0-9]/g, '_'),
                label: c.matiere.nom,
                coeff: c.valeur,
                placeholder: 'Ex: 14.00'
              });
            }
          });
        }

        return {
          id: sec.id,
          code: sec.code || sec.nom,
          name: sec.nom,
          subjects
        };
      });

      return res.json({ success: true, sections: formatted });
    }
  } catch (err) {
    console.warn('⚠️ Utilisation de la configuration locale pour les sections :', err.message);
  }

  return res.json({ success: true, sections: defaultSectionsConfig });
};

export const calculateScore = async (req, res) => {
  try {
    const { section, grades, with7Percent, etudiantId } = req.body;

    if (!section || !grades) {
      return res.status(400).json({
        success: false,
        message: 'La section et les notes sont requises pour calculer le score.'
      });
    }

    // 1. Transformer l'objet grades en liste de NoteBac pour CalculateurScore
    const notesArray = Object.entries(grades).map(([key, val]) => ({
      matiereCode: key,
      valeur: parseFloat(val || 0)
    }));

    // 2. Appel au service métier UML : CalculateurScore.calculer(notes, section)
    const mg = parseFloat(grades.mg || grades.moyenne || 0);

    let calcResponse;
    try {
      calcResponse = await CalculateurScore.calculer(notesArray, section, {
        avec7Pourcent: !!with7Percent,
        moyenneGenerale: mg,
        etudiantId: etudiantId || null,
        saveResultat: true
      });
    } catch {
      // Fallback formule locale
      const localResult = calculateTunisianScore(section, grades, !!with7Percent);
      return res.json({ success: true, data: localResult });
    }

    // Formatter le résultat pour le frontend
    const localFormulaDetail = calculateTunisianScore(section, grades, !!with7Percent);

    return res.json({
      success: true,
      data: {
        ...localFormulaDetail,
        scoreFige: calcResponse.scoreFige,
        finalScore: calcResponse.scoreFige,
        resultatId: calcResponse.resultatScore?._id || null
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
