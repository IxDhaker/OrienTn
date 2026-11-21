import Filiere from '../models/Filiere.js';
import VieAssociative from '../models/VieAssociative.js';

/**
 * Contrôleur Filières & Vie Associative (Package UML : Etablissements)
 */

export const getFilieres = async (req, res) => {
  try {
    const { domaine, search } = req.query;
    const query = {};
    if (domaine && domaine !== 'ALL') {
      query.domaine = new RegExp(domaine, 'i');
    }
    if (search) {
      query.$or = [
        { nom: new RegExp(search, 'i') },
        { code: new RegExp(search, 'i') }
      ];
    }

    const data = await Filiere.find(query).populate('offresFormation');
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getFiliereById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Filiere.findOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { id: !isNaN(id) ? parseInt(id) : null },
        { code: id.toUpperCase() }
      ]
    }).populate('offresFormation');

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Filière introuvable.' });
    }
    return res.json({ success: true, data: doc });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getVieAssociative = async (req, res) => {
  try {
    const { faculteId, type } = req.query;
    const query = {};
    if (faculteId) query.faculte = faculteId;
    if (type) query.type = new RegExp(type, 'i');

    const data = await VieAssociative.find(query).populate('faculte');
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export default {
  getFilieres,
  getFiliereById,
  getVieAssociative
};
