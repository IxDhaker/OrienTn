import mongoose from 'mongoose';

/**
 * Schéma et Modèle OffreFormation (Package : Etablissements)
 * Diagramme de classes UML OrienTn
 */
export const offreFormationSchema = new mongoose.Schema(
  {
    annee: {
      type: Number,
      required: true,
      default: 2024,
      index: true
    },
    scoreSeuil: {
      type: Number,
      required: true,
      index: true
    },
    capacite: {
      type: Number,
      required: true,
      min: 0,
      default: 50
    },
    // Composition avec Faculte (1 Faculte *-- * OffreFormation)
    faculte: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculte',
      required: true,
      index: true
    },
    // Association avec Filiere (1 Filiere -- * OffreFormation)
    filiere: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Filiere',
      required: true,
      index: true
    },
    // Association [accessible aux] avec SectionBac (* OffreFormation -- * SectionBac)
    sectionsBac: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SectionBac'
      }
    ],
    // Dénormalisation des scores seuils par section pour requêtes rapides
    scoresParSection: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index composé
offreFormationSchema.index({ faculte: 1, filiere: 1, annee: 1 });

export default mongoose.models.OffreFormation || mongoose.model('OffreFormation', offreFormationSchema);
