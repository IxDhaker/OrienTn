import OffreFormation from '../models/OffreFormation.js';
import SectionBac from '../models/SectionBac.js';
import Matiere from '../models/Matiere.js';
import CoefficientMatiere from '../models/CoefficientMatiere.js';

/**
 * Contrôleur Offres de Formation & Scoring Configuration (Package UML : Etablissements & Scoring)
 */

export const getOffresFormation = async (req, res) => {
  try {
    const { faculteId, filiereId, annee } = req.query;
    const query = {};
    if (faculteId) query.faculte = faculteId;
    if (filiereId) query.filiere = filiereId;
    if (annee) query.annee = parseInt(annee);

    const data = await OffreFormation.find(query)
      .populate('faculte')
      .populate('filiere')
      .populate('sectionsBac');
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getSectionsBac = async (req, res) => {
  try {
    const data = await SectionBac.find().populate({
      path: 'coefficients',
      populate: { path: 'matiere' }
    });
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getMatieres = async (req, res) => {
  try {
    const data = await Matiere.find();
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getCoefficients = async (req, res) => {
  try {
    const { sectionId } = req.query;
    const query = {};
    if (sectionId) query.section = sectionId;

    const data = await CoefficientMatiere.find(query)
      .populate('section')
      .populate('matiere');
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export default {
  getOffresFormation,
  getSectionsBac,
  getMatieres,
  getCoefficients
};
