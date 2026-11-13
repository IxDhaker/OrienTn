import mongoose from 'mongoose';

/**
 * Modèle Matiere (Package : Scoring)
 * Diagramme de classes UML OrienTn
 */
const matiereSchema = new mongoose.Schema(
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
      unique: true,
      trim: true
    },
    // Code mnémonique technique optionnel (ex: 'math', 'physique', 'algo_tic')
    code: {
      type: String,
      trim: true,
      lowercase: true,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export default mongoose.models.Matiere || mongoose.model('Matiere', matiereSchema);
