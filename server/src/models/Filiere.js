import mongoose from 'mongoose';

/**
 * Modèle Filiere (Package : Etablissements)
 * Diagramme de classes UML OrienTn
 */
const filiereSchema = new mongoose.Schema(
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
      trim: true,
      index: true
    },
    domaine: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      trim: true
    },
    // Code filière optionnel (ex: 'GL', 'MPI', 'MED')
    code: {
      type: String,
      trim: true
    },
    diplome: {
      type: String,
      default: 'Licence'
    },
    dureeAnnees: {
      type: Number,
      default: 3
    },
    // Association navigable avec OffreFormation
    offresFormation: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OffreFormation'
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

filiereSchema.index({ nom: 'text', domaine: 'text', description: 'text' });

export default mongoose.models.Filiere || mongoose.model('Filiere', filiereSchema);
