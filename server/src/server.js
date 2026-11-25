import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db.js';

import scoreRoutes from './routes/scoreRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import umlRoutes from './routes/umlRoutes.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connexion Base de Données
connectDB();

// Routes API Métier
app.use('/api/score', scoreRoutes);
app.use('/api/faculties', facultyRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Routes Modèle StarUML (Conformité 100% diagramme de classes)
app.use('/api/uml', umlRoutes);
app.use('/api/modele', umlRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'OrienTn Backend API (Express & Node.js)',
    architecture: 'StarUML Class Diagram 100% Conforme',
    packages: ['Utilisateurs', 'Scoring', 'Etablissements', 'IA'],
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur OrienTn démarré sur http://localhost:${PORT}`);
  console.log(`📡 Endpoints disponibles :`);
  console.log(`   - Calculateur de score : http://localhost:${PORT}/api/score`);
  console.log(`   - Facultés & Carte     : http://localhost:${PORT}/api/faculties`);
  console.log(`   - Recommandations      : http://localhost:${PORT}/api/recommendations`);
  console.log(`   - IA Summer Prep       : http://localhost:${PORT}/api/ai/summer-prep`);
  console.log(`   - Modèle StarUML API   : http://localhost:${PORT}/api/uml/meta`);
});
