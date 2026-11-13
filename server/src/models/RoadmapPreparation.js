import mongoose from 'mongoose';

/**
 * Schéma EtapeRoadmap (Package : IA)
 * Composition au sein de RoadmapPreparation
 */
export const etapeRoadmapSchema = new mongoose.Schema(
  {
    ordre: {
      type: Number,
      required: true,
      min: 1
    },
    titre: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    dureeSemaines: {
      type: Number,
      required: true,
      default: 2,
      min: 1
    },
    // Sujets et ressources pour l'affichage riche
    sujets: [{ type: String, trim: true }],
    ressources: [{ type: String, trim: true }]
  },
  { _id: true }
);

// Virtuals de compatibilité pour le frontend
etapeRoadmapSchema.virtual('focus').get(function () {
  return this.titre;
});
etapeRoadmapSchema.virtual('week').get(function () {
  return `Étape ${this.ordre} (${this.dureeSemaines} sem.)`;
});
etapeRoadmapSchema.virtual('topics').get(function () {
  return this.sujets;
});
etapeRoadmapSchema.virtual('resources').get(function () {
  return this.ressources;
});

export const EtapeRoadmap = mongoose.models.EtapeRoadmap || mongoose.model('EtapeRoadmap', etapeRoadmapSchema);

/**
 * Modèle RoadmapPreparation (Package : IA)
 * Diagramme de classes UML OrienTn
 */
const roadmapPreparationSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    dateGeneration: {
      type: Date,
      default: Date.now,
      index: true
    },
    resume: {
      type: String,
      trim: true
    },
    promptUtilise: {
      type: String,
      trim: true
    },
    statut: {
      type: String,
      enum: ['EN_ATTENTE', 'GENEREE', 'EN_COURS', 'TERMINEE'],
      default: 'GENEREE',
      index: true
    },
    // Association [reçoit] : 1 Etudiant <==> RoadmapPreparation * (navigable)
    etudiant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Etudiant',
      default: null,
      index: true
    },
    // Association [pour] : RoadmapPreparation * <==> Filiere 1 (navigable)
    filiere: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Filiere',
      required: true,
      index: true
    },
    // Composition UML : 1 RoadmapPreparation *-- * EtapeRoadmap
    etapes: [etapeRoadmapSchema],
    // Faculté cible associée (contexte)
    faculte: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculte',
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual pour le titre
roadmapPreparationSchema.virtual('titre').get(function () {
  return `Roadmap de préparation - ${this.resume || 'Filière'}`;
});

export default mongoose.models.RoadmapPreparation || mongoose.model('RoadmapPreparation', roadmapPreparationSchema);
