import RoadmapPreparation from '../models/RoadmapPreparation.js';
import ResultatScore from '../models/ResultatScore.js';
import Recommandation from '../models/Recommandation.js';

/**
 * Contrôleur Roadmap & Résultats (Package UML : IA & Scoring)
 */

export const getRoadmaps = async (req, res) => {
  try {
    const { etudiantId, filiereId } = req.query;
    const query = {};
    if (etudiantId) query.etudiant = etudiantId;
    if (filiereId) query.filiere = filiereId;

    const data = await RoadmapPreparation.find(query)
      .populate('etudiant')
      .populate('filiere')
      .populate('faculte');
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getRoadmapById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await RoadmapPreparation.findOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { id: !isNaN(id) ? parseInt(id) : null }
      ]
    })
      .populate('etudiant')
      .populate('filiere')
      .populate('faculte');

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Roadmap introuvable.' });
    }
    return res.json({ success: true, data: doc });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getResultatsScore = async (req, res) => {
  try {
    const { etudiantId } = req.query;
    const query = {};
    if (etudiantId) query.etudiant = etudiantId;

    const data = await ResultatScore.find(query)
      .populate('etudiant')
      .populate('section')
      .populate('recommandations');
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getRecommandationsList = async (req, res) => {
  try {
    const { resultatId } = req.query;
    const query = {};
    if (resultatId) query.resultat = resultatId;

    const data = await Recommandation.find(query).populate({
      path: 'offreFormation',
      populate: ['faculte', 'filiere']
    });
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export default {
  getRoadmaps,
  getRoadmapById,
  getResultatsScore,
  getRecommandationsList
};
