import mongoose from 'mongoose';

/**
 * Schéma et Modèle VieAssociative (Package : Etablissements)
 * Diagramme de classes UML OrienTn
 */
export const vieAssociativeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      default: 'Club'
    },
    nom: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    faculte: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculte',
      index: true
    },
    // Compatibilité interface utilisateur
    logoUrl: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtuals pour compatibilité avec le frontend existant
vieAssociativeSchema.virtual('name').get(function () {
  return this.nom;
});
vieAssociativeSchema.virtual('category').get(function () {
  return this.type;
});

export default mongoose.models.VieAssociative || mongoose.model('VieAssociative', vieAssociativeSchema);
