import mongoose from 'mongoose';

/**
 * Modèle CoefficientMatiere (Package : Scoring)
 * Diagramme de classes UML OrienTn
 */
const coefficientMatiereSchema = new mongoose.Schema(
  {
    valeur: {
      type: Number,
      required: true,
      min: 0
    },
    estBonus: {
      type: Boolean,
      default: false
    },
    // Association vers SectionBac (1 SectionBac a plusieurs CoefficientMatiere)
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SectionBac',
      required: true,
      index: true
    },
    // Association vers Matiere (navigable vers Matiere)
    matiere: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Matiere',
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index composé d'unicité pour une matière dans une section donnée
coefficientMatiereSchema.index({ section: 1, matiere: 1 }, { unique: true });

export default mongoose.models.CoefficientMatiere || mongoose.model('CoefficientMatiere', coefficientMatiereSchema);
