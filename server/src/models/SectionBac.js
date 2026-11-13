import mongoose from 'mongoose';

/**
 * Modèle SectionBac (Package : Scoring)
 * Diagramme de classes UML OrienTn
 */
const sectionBacSchema = new mongoose.Schema(
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
    // Code mnémonique optionnel (ex: 'INFO', 'MATH', 'SC_EXP')
    code: {
      type: String,
      trim: true,
      uppercase: true,
      index: true
    },
    // Association navigable avec CoefficientMatiere
    coefficients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoefficientMatiere'
      }
    ],
    // Association 'accessible aux' avec OffreFormation
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

export default mongoose.models.SectionBac || mongoose.model('SectionBac', sectionBacSchema);
