import express from 'express';
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

const router = express.Router();

// GET Modèle d'architecture global
router.get('/meta', (req, res) => {
  res.json({
    success: true,
    packages: {
      Utilisateurs: ['Etudiant', 'Administrateur'],
      Scoring: [
        'SectionBac',
        'Matiere',
        'CoefficientMatiere',
        'ResultatScore',
        'NoteBac',
        'Recommandation',
        'CalculateurScore',
        'MoteurRecommandation'
      ],
      Etablissements: ['Faculte', 'Filiere', 'OffreFormation', 'VieAssociative'],
      IA: ['RoadmapPreparation', 'EtapeRoadmap', 'RoadmapService', 'ServiceIA']
    }
  });
});

// 1. Package Utilisateurs
router.get('/etudiants', async (req, res) => {
  try {
    const data = await Etudiant.find().populate('resultatsScore').populate('roadmaps');
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/etudiants', async (req, res) => {
  try {
    const highest = await Etudiant.findOne().sort('-id');
    const nextId = highest && highest.id ? highest.id + 1 : 1;
    const doc = await Etudiant.create({ ...req.body, id: nextId });
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 2. Package Scoring
router.get('/sections-bac', async (req, res) => {
  try {
    const data = await SectionBac.find().populate({
      path: 'coefficients',
      populate: { path: 'matiere' }
    });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/matieres', async (req, res) => {
  try {
    const data = await Matiere.find();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/coefficients', async (req, res) => {
  try {
    const data = await CoefficientMatiere.find().populate('section').populate('matiere');
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/resultats-score', async (req, res) => {
  try {
    const data = await ResultatScore.find()
      .populate('etudiant')
      .populate('section')
      .populate('recommandations');
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/recommandations', async (req, res) => {
  try {
    const data = await Recommandation.find().populate({
      path: 'offreFormation',
      populate: ['faculte', 'filiere']
    });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Package Etablissements
router.get('/facultes', async (req, res) => {
  try {
    const data = await Faculte.find().populate({
      path: 'offresFormation',
      populate: { path: 'filiere' }
    }).populate('vieAssociative');
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/filieres', async (req, res) => {
  try {
    const data = await Filiere.find().populate('offresFormation');
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/offres-formation', async (req, res) => {
  try {
    const data = await OffreFormation.find()
      .populate('faculte')
      .populate('filiere')
      .populate('sectionsBac');
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/vie-associative', async (req, res) => {
  try {
    const data = await VieAssociative.find().populate('faculte');
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Package IA
router.get('/roadmaps', async (req, res) => {
  try {
    const data = await RoadmapPreparation.find().populate('etudiant').populate('filiere');
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
