import mongoose from 'mongoose';

/**
 * Modèle Etudiant (Package : Utilisateurs)
 * Diagramme de classes UML OrienTn
 */
const etudiantSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    nom: {
      type: String,
      required: true,
      trim: true
    },
    prenom: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null
    },
    // Associations navigables
    resultatsScore: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ResultatScore'
      }
    ],
    roadmaps: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoadmapPreparation'
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual pour le nom complet
etudiantSchema.virtual('nomComplet').get(function () {
  return `${this.prenom} ${this.nom}`;
});

export default mongoose.models.Etudiant || mongoose.model('Etudiant', etudiantSchema);
