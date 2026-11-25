import Faculte from '../models/Faculte.js';
import OffreFormation from '../models/OffreFormation.js';
import VieAssociative from '../models/VieAssociative.js';
import Filiere from '../models/Filiere.js';
import { facultiesSeedData } from '../data/facultiesSeed.js';

// Fonction de normalisation pour la compatibilité totale frontend React
const normalizeFaculty = (f) => {
  const plain = f.toObject ? f.toObject({ virtuals: true }) : { ...f };

  // Mapper offresFormation vers sections pour le frontend
  const sections = (plain.offresFormation || []).map((o) => {
    const fil = o.filiere || {};
    return {
      _id: o._id,
      year: o.annee,
      seuil: o.scoreSeuil,
      code: fil.code || 'SEC',
      name: fil.nom || 'Formation',
      domain: fil.domaine || 'Général',
      degree: fil.diplome || 'Licence',
      durationYears: fil.dureeAnnees || 3,
      capacity: o.capacite || 50,
      lastYearMinScores: o.scoresParSection || { ALL: o.scoreSeuil || 0 },
      description: fil.description || ''
    };
  });

  // Mapper vieAssociative vers clubs pour le frontend
    const clubs = (plain.vieAssociative || []).map((v) => ({
    _id: v._id,
    name: v.nom,
    category: v.type,
    description: v.description,
    logoUrl: v.logoUrl || ''
  }));

  return {
    ...plain,
    _id: plain._id,
    id: plain.id,
    nom: plain.nom,
    name: plain.nom || plain.name,
    nomCourt: plain.nomCourt,
    shortName: plain.nomCourt || plain.shortName || plain.nom,
    universite: plain.universite,
    university: plain.universite || plain.university,
    gouvernorat: plain.gouvernorat,
    governorate: plain.gouvernorat || plain.governorate,
    adresse: plain.adresse,
    address: plain.adresse || plain.address,
    location: {
      lat: plain.latitude ?? plain.location?.lat,
      lng: plain.longitude ?? plain.location?.lng
    },
    latitude: plain.latitude ?? plain.location?.lat,
    longitude: plain.longitude ?? plain.location?.lng,
    description: plain.description,
    website: plain.siteWeb || plain.website,
    contact: {
      email: plain.contactEmail || plain.contact?.email,
      phone: plain.contactTelephone || plain.contact?.phone
    },
    imageUrl: plain.imageUrl,
    sections: sections.length > 0 ? sections : plain.sections || [],
    clubs: clubs.length > 0 ? clubs : plain.clubs || [],
    activities: plain.evenements || plain.activities || []
  };
};

export const getFaculties = async (req, res) => {
  try {
    const { governorate, domain, search } = req.query;
    let faculties = [];

    try {
      let query = {};
      if (governorate && governorate !== 'ALL') {
        query.gouvernorat = new RegExp(`^${governorate}$`, 'i');
      }
      if (search) {
        query.$or = [
          { nom: new RegExp(search, 'i') },
          { nomCourt: new RegExp(search, 'i') },
          { universite: new RegExp(search, 'i') }
        ];
      }

      const docs = await Faculte.find(query)
        .populate({
          path: 'offresFormation',
          populate: { path: 'filiere' }
        })
        .populate('vieAssociative');

      if (docs && docs.length > 0) {
        faculties = docs.map(normalizeFaculty);

        // Filtrage par domaine si spécifié
        if (domain && domain !== 'ALL') {
          faculties = faculties.filter((f) =>
            f.sections.some((s) => s.domain.toLowerCase().includes(domain.toLowerCase()))
          );
        }
      }
    } catch (dbErr) {
      console.warn('⚠️ Utilisation du fallback mémoire pour les facultés :', dbErr.message);
    }

    // Si la base est vide ou non connectée, utiliser le jeu de données embarqué
    if (!faculties || faculties.length === 0) {
      faculties = facultiesSeedData;

      if (governorate && governorate !== 'ALL') {
        faculties = faculties.filter(
          (f) => f.governorate.toLowerCase() === governorate.toLowerCase()
        );
      }
      if (domain && domain !== 'ALL') {
        faculties = faculties.filter((f) =>
          f.sections.some((s) => s.domain.toLowerCase().includes(domain.toLowerCase()))
        );
      }
      if (search) {
        const q = search.toLowerCase();
        faculties = faculties.filter(
          (f) =>
            f.name.toLowerCase().includes(q) ||
            f.shortName.toLowerCase().includes(q) ||
            f.university.toLowerCase().includes(q)
        );
      }
    }

    return res.json({
      success: true,
      count: faculties.length,
      data: faculties
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;
    let faculty = null;

    try {
      let doc = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        doc = await Faculte.findById(id)
          .populate({
            path: 'offresFormation',
            populate: { path: 'filiere' }
          })
          .populate('vieAssociative');
      }

      if (!doc) {
        doc = await Faculte.findOne({
          $or: [
            { nomCourt: new RegExp(`^${id}$`, 'i') },
            { nom: new RegExp(id, 'i') },
            { id: !isNaN(id) ? parseInt(id) : -1 }
          ]
        })
          .populate({
            path: 'offresFormation',
            populate: { path: 'filiere' }
          })
          .populate('vieAssociative');
      }

      if (doc) {
        faculty = normalizeFaculty(doc);
      }
    } catch {
      // id possiblement non standard
    }

    if (!faculty) {
      faculty = facultiesSeedData.find(
        (f) =>
          f.shortName.toLowerCase() === id.toLowerCase() ||
          f.name.toLowerCase() === id.toLowerCase()
      );
    }

    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculté non trouvée.' });
    }

    return res.json({ success: true, data: faculty });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
