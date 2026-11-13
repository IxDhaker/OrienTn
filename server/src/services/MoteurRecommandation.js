import mongoose from 'mongoose';
import OffreFormation from '../models/OffreFormation.js';
import Recommandation from '../models/Recommandation.js';
import ResultatScore from '../models/ResultatScore.js';

/**
 * Service MoteurRecommandation (Package : Scoring)
 * Méthode UML : + recommander(resultat: ResultatScore) -> List<Recommandation>
 * Dépendances UML :
 *   - compare au seuil de OffreFormation
 *   - produit Recommandation
 */
export class MoteurRecommandation {
  /**
   * Génère les recommandations basées sur le score du résultat
   * @param {Object} resultat - Document ResultatScore ou objet avec scoreFige et section
   * @param {Object} filters - Filtres optionnels (gouvernorat, domaine, etc.)
   * @returns {Promise<Array<Recommandation>>}
   */
  static async recommander(resultat, filters = {}) {
    if (!resultat || typeof resultat.scoreFige === 'undefined') {
      throw new Error('Un ResultatScore valide avec scoreFige est requis pour le moteur de recommandation.');
    }

    const isConnected = mongoose.connection.readyState === 1;
    if (!isConnected) {
      return [];
    }

    const scoreEtudiant = parseFloat(resultat.scoreFige);
    const sectionId = resultat.section?._id || resultat.section;

    // Récupérer les offres de formation accessibles pour cette section de bac
    const query = {};
    if (sectionId) {
      query.$or = [
        { sectionsBac: sectionId },
        { sectionsBac: { $size: 0 } },
        { sectionsBac: { $exists: false } }
      ];
    }

    const offres = await OffreFormation.find(query)
      .populate('faculte')
      .populate('filiere')
      .populate('sectionsBac');

    const rawRecommendations = [];

    for (const offre of offres) {
      if (!offre.faculte || !offre.filiere) continue;

      // Filtre gouvernorat
      if (filters.gouvernorat && filters.gouvernorat !== 'ALL') {
        if (offre.faculte.gouvernorat.toLowerCase() !== filters.gouvernorat.toLowerCase()) {
          continue;
        }
      }

      // Filtre domaine
      if (filters.domaine && filters.domaine !== 'ALL') {
        if (!offre.filiere.domaine.toLowerCase().includes(filters.domaine.toLowerCase())) {
          continue;
        }
      }

      const seuil = offre.scoreSeuil;
      const ecartAvecSeuil = Math.round((scoreEtudiant - seuil) * 100) / 100;

      // Catégorisation de la recommandation
      let statut = 'Cible';
      let chance = 'Modérée (~ 50%)';

      if (ecartAvecSeuil >= 5) {
        statut = 'Sécurisée';
        chance = 'Très Forte (> 90%)';
      } else if (ecartAvecSeuil >= -2) {
        statut = 'Optimale (Cible)';
        chance = 'Forte (~ 75-85%)';
      } else if (ecartAvecSeuil >= -8) {
        statut = 'Ambitieuse';
        chance = 'Modérée (~ 35-50%)';
      } else {
        // Trop éloigné du seuil
        continue;
      }

      rawRecommendations.push({
        ecartAvecSeuil,
        statut,
        chanceAdmission: chance,
        offreFormation: offre._id,
        offreFormationDetails: offre,
        faculte: offre.faculte,
        filiere: offre.filiere,
        scoreSeuil: seuil,
        scoreEtudiant,
        diffAbs: Math.abs(ecartAvecSeuil)
      });
    }

    // Trier par adéquation (les cibles et opportunités optimales en premier)
    rawRecommendations.sort((a, b) => a.diffAbs - b.diffAbs);

    // Attribuer les rangs (1, 2, 3...)
    const recommendations = [];
    const savedRecDocs = [];

    for (let i = 0; i < rawRecommendations.length; i++) {
      const item = rawRecommendations[i];
      const rang = i + 1;

      const recData = {
        rang,
        ecartAvecSeuil: item.ecartAvecSeuil,
        offreFormation: item.offreFormation,
        resultat: resultat._id || null,
        statut: item.statut,
        chanceAdmission: item.chanceAdmission,
        // Champs dénormalisés pour compatibilité API frontend
        facultyId: item.faculte._id,
        facultyName: item.faculte.nom,
        facultyShortName: item.faculte.nomCourt || item.faculte.nom,
        university: item.faculte.universite,
        governorate: item.faculte.gouvernorat,
        location: { lat: item.faculte.latitude, lng: item.faculte.longitude },
        sectionCode: item.filiere.code || 'SEC',
        sectionName: item.filiere.nom,
        domain: item.filiere.domaine,
        degree: item.filiere.diplome || 'Licence',
        lastYearMinScore: item.scoreSeuil,
        studentScore: item.scoreEtudiant,
        diff: item.ecartAvecSeuil,
        status: item.statut,
        chance: item.chanceAdmission
      };

      recommendations.push(recData);

      // Si le resultat est persisté avec un _id MongoDB, persister la recommandation
      if (resultat._id) {
        try {
          const recDoc = await Recommandation.create({
            rang,
            ecartAvecSeuil: item.ecartAvecSeuil,
            offreFormation: item.offreFormation,
            resultat: resultat._id,
            statut: item.statut,
            chanceAdmission: item.chanceAdmission
          });
          savedRecDocs.push(recDoc._id);
        } catch {
          // Ignorer erreur de sauvegarde en mode lecture seule
        }
      }
    }

    // Si des recommandations ont été enregistrées, mettre à jour ResultatScore
    if (savedRecDocs.length > 0 && resultat._id) {
      await ResultatScore.findByIdAndUpdate(resultat._id, {
        recommandations: savedRecDocs
      });
    }

    return recommendations;
  }
}

export default MoteurRecommandation;
