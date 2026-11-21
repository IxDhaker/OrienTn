import Etudiant from '../models/Etudiant.js';
import Administrateur from '../models/Administrateur.js';

/**
 * Contrôleur Utilisateurs (Package UML : Utilisateurs)
 * Gère les entités Etudiant et Administrateur
 */

// --- ETUDIANT ---

export const getEtudiants = async (req, res) => {
  try {
    const data = await Etudiant.find()
      .populate('resultatsScore')
      .populate('roadmaps');
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getEtudiantById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Etudiant.findOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { id: !isNaN(id) ? parseInt(id) : null },
        { email: id }
      ]
    })
      .populate('resultatsScore')
      .populate('roadmaps');

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Étudiant introuvable.' });
    }
    return res.json({ success: true, data: doc });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const createEtudiant = async (req, res) => {
  try {
    const highest = await Etudiant.findOne().sort('-id').select('id');
    const nextId = highest && highest.id ? highest.id + 1 : 1;
    const doc = await Etudiant.create({ ...req.body, id: nextId });
    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

// --- ADMINISTRATEUR ---

export const getAdministrateurs = async (req, res) => {
  try {
    const data = await Administrateur.find().select('-motDePasseHash');
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const createAdministrateur = async (req, res) => {
  try {
    const highest = await Administrateur.findOne().sort('-id').select('id');
    const nextId = highest && highest.id ? highest.id + 1 : 1;
    const doc = await Administrateur.create({ ...req.body, id: nextId });
    return res.status(201).json({ success: true, data: { id: doc.id, login: doc.login } });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

export default {
  getEtudiants,
  getEtudiantById,
  createEtudiant,
  getAdministrateurs,
  createAdministrateur
};
