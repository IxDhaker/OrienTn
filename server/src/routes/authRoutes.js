import express from 'express';
import { login, registerEtudiant, loginEtudiant } from '../controllers/authController.js';

const router = express.Router();
router.post('/login', login); // admin
router.post('/register', registerEtudiant); // bachelier
router.post('/student-login', loginEtudiant); // bachelier
export default router;
