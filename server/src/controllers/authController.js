import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Administrateur from '../models/Administrateur.js';
import Etudiant from '../models/Etudiant.js';
import { nextId } from '../utils/nextId.js';

const sign = (payload) => jwt.sign(payload, process.env.ADMIN_JWT_SECRET, { expiresIn: '8h' });

// ---------- ADMIN ----------
export const login = async (req, res) => {
  try {
    const { login, password } = req.body;
    const admin = await Administrateur.findOne({ login });
    if (!admin || !(await bcrypt.compare(password || '', admin.motDePasseHash))) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
    }
    const token = sign({ id: admin.id, login: admin.login, role: 'admin' });
    res.json({ success: true, token, admin: { login: admin.login } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ---------- BACHELIER (Etudiant) ----------
const studentPayload = (etu) => ({
  id: etu.id,
  nom: etu.nom,
  prenom: etu.prenom,
  email: etu.email
});

export const registerEtudiant = async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;
    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Email invalide.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Mot de passe : 6 caractères minimum.' });
    }
    const cleanEmail = email.toLowerCase().trim();
    if (await Etudiant.findOne({ email: cleanEmail })) {
      return res.status(409).json({ success: false, message: 'Un compte existe déjà avec cet email.' });
    }
    const etu = await Etudiant.create({
      id: await nextId(Etudiant),
      nom,
      prenom,
      email: cleanEmail,
      motDePasseHash: await bcrypt.hash(password, 10)
    });
    // Pas de token à l'inscription : l'utilisateur doit se connecter ensuite
    res.status(201).json({ success: true, message: 'Compte créé avec succès.', user: studentPayload(etu) });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const loginEtudiant = async (req, res) => {
  try {
    const { email, password } = req.body;
    const etu = await Etudiant.findOne({ email: (email || '').toLowerCase().trim() }).select('+motDePasseHash');
    if (!etu || !etu.motDePasseHash || !(await bcrypt.compare(password || '', etu.motDePasseHash))) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
    }
    const token = sign({ id: etu.id, role: 'etudiant' });
    res.json({ success: true, token, user: studentPayload(etu) });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
