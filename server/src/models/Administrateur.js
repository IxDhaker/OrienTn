import mongoose from 'mongoose';

/**
 * Modèle Administrateur (Package : Utilisateurs)
 * Diagramme de classes UML OrienTn
 */
const administrateurSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    login: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    motDePasseHash: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export default mongoose.models.Administrateur || mongoose.model('Administrateur', administrateurSchema);
