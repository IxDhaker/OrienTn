import mongoose from 'mongoose';

/**
 * Modèle Faculte (Package : Etablissements)
 * Diagramme de classes UML OrienTn
 */
const faculteSchema = new mongoose.Schema(
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
    universite: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    gouvernorat: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    adresse: {
      type: String,
      trim: true
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    // Données complémentaires pour l'affichage web & carte
    nomCourt: {
      type: String,
      trim: true,
      index: true
    },
    siteWeb: {
      type: String,
      trim: true
    },
    contactEmail: {
      type: String,
      trim: true
    },
    contactTelephone: {
      type: String,
      trim: true
    },
    imageUrl: {
      type: String,
      trim: true
    },
    evenements: [
      {
        type: String,
        trim: true
      }
    ],
    // Composition UML : 1 Faculte *-- * OffreFormation
    offresFormation: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OffreFormation'
      }
    ],
    // Composition UML : 1 Faculte *-- * VieAssociative
    vieAssociative: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VieAssociative'
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtuals de compatibilité pour le frontend React
faculteSchema.virtual('name').get(function () {
  return this.nom;
});
faculteSchema.virtual('shortName').get(function () {
  return this.nomCourt || this.nom;
});
faculteSchema.virtual('university').get(function () {
  return this.universite;
});
faculteSchema.virtual('governorate').get(function () {
  return this.gouvernorat;
});
faculteSchema.virtual('address').get(function () {
  return this.adresse;
});
faculteSchema.virtual('location').get(function () {
  return { lat: this.latitude, lng: this.longitude };
});
faculteSchema.virtual('website').get(function () {
  return this.siteWeb;
});
faculteSchema.virtual('contact').get(function () {
  return { email: this.contactEmail, phone: this.contactTelephone };
});
faculteSchema.virtual('clubs').get(function () {
  return this.vieAssociative || [];
});
faculteSchema.virtual('sections').get(function () {
  return this.offresFormation || [];
});
faculteSchema.virtual('activities').get(function () {
  return this.evenements || [];
});

faculteSchema.index({ nom: 'text', nomCourt: 'text', universite: 'text', gouvernorat: 'text', description: 'text' });

export default mongoose.models.Faculte || mongoose.model('Faculte', faculteSchema);
