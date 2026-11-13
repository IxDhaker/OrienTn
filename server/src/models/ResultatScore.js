import mongoose from 'mongoose';

/**
 * Schéma NoteBac (Package : Scoring)
 * Composite au sein de ResultatScore
 */
export const noteBacSchema = new mongoose.Schema(
  {
    valeur: {
      type: Number,
      required: true,
      min: 0,
      max: 20
    },
    // Association vers Matiere (1 Matiere navigable)
    matiere: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Matiere',
      required: true
    },
    // Nom ou code de la matière en dénormalisation pratique
    matiereNom: {
      type: String,
      trim: true
    }
  },
  { _id: true }
);

export const NoteBac = mongoose.models.NoteBac || mongoose.model('NoteBac', noteBacSchema);

/**
 * Modèle ResultatScore (Package : Scoring)
 * Diagramme de classes UML OrienTn
 */
const resultatScoreSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    scoreFige: {
      type: Number,
      required: true
    },
    moyenneGenerale: {
      type: Number,
      required: true,
      min: 0,
      max: 20
    },
    // Association [réalise] : Etudiant 1 <==> ResultatScore *
    etudiant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Etudiant',
      default: null,
      index: true
    },
    // Association [simulé avec] : ResultatScore * <==> SectionBac 1
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SectionBac',
      required: true,
      index: true
    },
    // Composition 1 ResultatScore *-- * NoteBac
    notes: [noteBacSchema],
    // Association [produit] : 1 ResultatScore <==> Recommandation *
    recommandations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recommandation'
      }
    ],
    // Indicateur bonus régional 7% (métier tunisien)
    avec7Pourcent: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export default mongoose.models.ResultatScore || mongoose.model('ResultatScore', resultatScoreSchema);
