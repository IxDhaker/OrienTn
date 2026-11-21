/**
 * Export centralisé de tous les contrôleurs
 * Structuré selon les packages du diagramme de classes StarUML
 */

// Package Utilisateurs
import * as utilisateurController from './utilisateurController.js';

// Package Scoring
import * as scoreController from './scoreController.js';
import * as recommendationController from './recommendationController.js';

// Package Etablissements
import * as facultyController from './facultyController.js';
import * as filiereController from './filiereController.js';
import * as offreFormationController from './offreFormationController.js';

// Package IA
import * as aiController from './aiController.js';
import * as roadmapController from './roadmapController.js';

export {
  utilisateurController,
  scoreController,
  recommendationController,
  facultyController,
  filiereController,
  offreFormationController,
  aiController,
  roadmapController
};

export default {
  Utilisateurs: utilisateurController,
  Scoring: {
    ...scoreController,
    ...recommendationController
  },
  Etablissements: {
    ...facultyController,
    ...filiereController,
    ...offreFormationController
  },
  IA: {
    ...aiController,
    ...roadmapController
  }
};
