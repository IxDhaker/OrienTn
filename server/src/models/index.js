// ==========================================
// Package : Utilisateurs
// ==========================================
import Etudiant from './Etudiant.js';
import Administrateur from './Administrateur.js';

// ==========================================
// Package : Scoring
// ==========================================
import SectionBac from './SectionBac.js';
import Matiere from './Matiere.js';
import CoefficientMatiere from './CoefficientMatiere.js';
import ResultatScore, { NoteBac, noteBacSchema } from './ResultatScore.js';
import Recommandation from './Recommandation.js';

// ==========================================
// Package : Etablissements
// ==========================================
import Faculte from './Faculte.js';
import Filiere from './Filiere.js';
import OffreFormation, { offreFormationSchema } from './OffreFormation.js';
import VieAssociative, { vieAssociativeSchema } from './VieAssociative.js';

// ==========================================
// Package : IA
// ==========================================
import RoadmapPreparation, { EtapeRoadmap, etapeRoadmapSchema } from './RoadmapPreparation.js';

// Exportation groupée par packages selon le diagramme StarUML
export const Utilisateurs = {
  Etudiant,
  Administrateur
};

export const Scoring = {
  SectionBac,
  Matiere,
  CoefficientMatiere,
  ResultatScore,
  NoteBac,
  Recommandation
};

export const Etablissements = {
  Faculte,
  Filiere,
  OffreFormation,
  VieAssociative
};

export const IA = {
  RoadmapPreparation,
  EtapeRoadmap
};

// Exportations nommées individuelles
export {
  Etudiant,
  Administrateur,
  SectionBac,
  Matiere,
  CoefficientMatiere,
  ResultatScore,
  NoteBac,
  noteBacSchema,
  Recommandation,
  Faculte,
  Filiere,
  OffreFormation,
  offreFormationSchema,
  VieAssociative,
  vieAssociativeSchema,
  RoadmapPreparation,
  EtapeRoadmap,
  etapeRoadmapSchema
};

export default {
  Utilisateurs,
  Scoring,
  Etablissements,
  IA
};
