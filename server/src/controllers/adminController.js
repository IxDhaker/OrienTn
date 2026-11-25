import Faculte from '../models/Faculte.js';
import Filiere from '../models/Filiere.js';
import OffreFormation from '../models/OffreFormation.js';
import VieAssociative from '../models/VieAssociative.js';
import SectionBac from '../models/SectionBac.js';
import { nextId } from '../utils/nextId.js';

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (e) {
    const status = e.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ success: false, message: e.message });
  }
};

const validScore = (v) => typeof v === 'number' && v >= 0 && v <= 250;

// ---------- FACULTÉS ----------
export const createFaculty = handle(async (req, res) => {
  const f = await Faculte.create({ ...req.body, id: await nextId(Faculte) });
  res.status(201).json({ success: true, data: f });
});

export const updateFaculty = handle(async (req, res) => {
  const { id, offresFormation, vieAssociative, ...data } = req.body; // champs protégés
  const f = await Faculte.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!f) return res.status(404).json({ success: false, message: 'Faculté introuvable.' });
  res.json({ success: true, data: f });
});

export const deleteFaculty = handle(async (req, res) => {
  const f = await Faculte.findByIdAndDelete(req.params.id);
  if (!f) return res.status(404).json({ success: false, message: 'Faculté introuvable.' });
  await OffreFormation.deleteMany({ faculte: f._id });
  await VieAssociative.deleteMany({ faculte: f._id });
  res.json({ success: true, message: 'Faculté supprimée.' });
});

// ---------- SECTIONS (OffreFormation + scores) ----------
export const createOffre = handle(async (req, res) => {
  const faculte = await Faculte.findById(req.params.id);
  if (!faculte) return res.status(404).json({ success: false, message: 'Faculté introuvable.' });

  const { filiere = {}, annee, scoreSeuil, capacite, scoresParSection = {} } = req.body;
  if (!validScore(Number(scoreSeuil))) {
    return res.status(400).json({ success: false, message: 'scoreSeuil invalide (0-250).' });
  }
  const fil = await Filiere.create({
    id: await nextId(Filiere),
    nom: filiere.nom,
    domaine: filiere.domaine,
    code: filiere.code,
    diplome: filiere.diplome || 'Licence',
    dureeAnnees: filiere.dureeAnnees || 3,
    description: filiere.description
  });
  const offre = await OffreFormation.create({
    annee, scoreSeuil, capacite, scoresParSection,
    faculte: faculte._id,
    filiere: fil._id
  });
  fil.offresFormation.push(offre._id);
  await fil.save();
  faculte.offresFormation.push(offre._id);
  await faculte.save();
  res.status(201).json({ success: true, data: offre });
});

export const updateOffre = handle(async (req, res) => {
  const { annee, scoreSeuil, capacite, scoresParSection } = req.body;
  const update = {};
  if (annee !== undefined) update.annee = annee;
  if (capacite !== undefined) update.capacite = capacite;
  if (scoreSeuil !== undefined) {
    if (!validScore(Number(scoreSeuil))) {
      return res.status(400).json({ success: false, message: 'scoreSeuil invalide (0-250).' });
    }
    update.scoreSeuil = scoreSeuil;
  }
  if (scoresParSection !== undefined) update.scoresParSection = scoresParSection;

  const offre = await OffreFormation.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!offre) return res.status(404).json({ success: false, message: 'Offre introuvable.' });
  res.json({ success: true, data: offre });
});

export const deleteOffre = handle(async (req, res) => {
  const offre = await OffreFormation.findByIdAndDelete(req.params.id);
  if (!offre) return res.status(404).json({ success: false, message: 'Offre introuvable.' });
  await Faculte.updateOne({ _id: offre.faculte }, { $pull: { offresFormation: offre._id } });
  await Filiere.updateOne({ _id: offre.filiere }, { $pull: { offresFormation: offre._id } });
  res.json({ success: true, message: 'Section supprimée.' });
});

// ---------- CLUBS (VieAssociative) ----------
export const createClub = handle(async (req, res) => {
  const faculte = await Faculte.findById(req.params.id);
  if (!faculte) return res.status(404).json({ success: false, message: 'Faculté introuvable.' });
  const { nom, type, description, logoUrl } = req.body;
  const club = await VieAssociative.create({ nom, type, description, logoUrl, faculte: faculte._id });
  faculte.vieAssociative.push(club._id);
  await faculte.save();
  res.status(201).json({ success: true, data: club });
});

export const updateClub = handle(async (req, res) => {
  const { nom, type, description, logoUrl } = req.body;
  const club = await VieAssociative.findByIdAndUpdate(
    req.params.id, { nom, type, description, logoUrl }, { new: true, runValidators: true }
  );
  if (!club) return res.status(404).json({ success: false, message: 'Club introuvable.' });
  res.json({ success: true, data: club });
});

export const deleteClub = handle(async (req, res) => {
  const club = await VieAssociative.findByIdAndDelete(req.params.id);
  if (!club) return res.status(404).json({ success: false, message: 'Club introuvable.' });
  await Faculte.updateOne({ _id: club.faculte }, { $pull: { vieAssociative: club._id } });
  res.json({ success: true, message: 'Club supprimé.' });
});

// ---------- SECTIONS BAC (lecture) ----------
export const listSectionsBac = handle(async (req, res) => {
  res.json({ success: true, data: await SectionBac.find().sort({ id: 1 }) });
});