import mongoose from 'mongoose';

/**
 * Modèle Recommandation (Package : Scoring)
 * Diagramme de classes UML OrienTn
 */
const recommandationSchema = new mongoose.Schema(
  {
    rang: {
      type: Number,
      required: true,
      min: 1
    },
    ecartAvecSeuil: {
      type: Number,
      required: true
    },
    // Association produite par ResultatScore
    resultat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResultatScore',
      index: true
    },
    // Association vers OffreFormation (1 OffreFormation navigable)
    offreFormation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OffreFormation',
      required: true,
      index: true
    },
    // Statut calculé d'admissibilité (ex: 'Sécurisée', 'Cible', 'Ambitieuse')
    statut: {
      type: String,
      enum: ['Sécurisée', 'Optimale (Cible)', 'Cible', 'Ambitieuse', 'Hors Portée'],
      default: 'Cible'
    },
    chanceAdmission: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export default mongoose.models.Recommandation || mongoose.model('Recommandation', recommandationSchema);
