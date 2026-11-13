import mongoose from 'mongoose';
import SectionBac from '../models/SectionBac.js';
import Matiere from '../models/Matiere.js';
import CoefficientMatiere from '../models/CoefficientMatiere.js';
import ResultatScore from '../models/ResultatScore.js';
import { calculateTunisianScore } from '../utils/scoreFormulas.js';

/**
 * Service CalculateurScore (Package : Scoring)
 * Méthode UML : + calculer(notes: List<NoteBac>, section: SectionBac) -> float
 * Dépendances UML :
 *   - lit CoefficientMatiere
 *   - alimente ResultatScore
 */
export class CalculateurScore {
  /**
   * Calcule le score officiel du baccalauréat tunisien
   * @param {Array<{ matiere: string|ObjectId, valeur: number }>} notes - Liste des notes obtenues
   * @param {Object|string} section - Objet SectionBac ou identifiant/code de la section
   * @param {Object} options - Options supplémentaires (avec7Pourcent, moyenneGenerale, etudiantId)
   * @returns {Promise<{ score: number, resultatScore?: ResultatScore, detail: Object }>}
   */
  static async calculer(notes = [], section, options = {}) {
    const { avec7Pourcent = false, moyenneGenerale = 0, etudiantId = null, saveResultat = false } = options;
    const isConnected = mongoose.connection.readyState === 1;

    // Résolution de l'objet SectionBac
    let sectionDoc = null;
    let sectionCode = '';

    if (typeof section === 'string') {
      sectionCode = section.toUpperCase();
      if (isConnected) {
        sectionDoc = await SectionBac.findOne({
          $or: [{ code: sectionCode }, { nom: new RegExp(`^${section}$`, 'i') }]
        });
        if (sectionDoc && sectionDoc.code) sectionCode = sectionDoc.code;
      }
    } else if (section && section._id) {
      sectionDoc = section;
      sectionCode = section.code || section.nom;
    }

    // Récupération dynamique des coefficients depuis la base MongoDB si connecté
    let coefficients = [];
    if (isConnected && sectionDoc && sectionDoc._id) {
      coefficients = await CoefficientMatiere.find({ section: sectionDoc._id }).populate('matiere');
    }

    // Calcul par coefficients si présents en base
    let calculatedScore = 0;
    let mg = moyenneGenerale;

    // Mapper les notes par code/nom de matière
    const gradesMap = {};
    for (const note of notes) {
      let matKey = '';
      if (note.matiereCode) {
        matKey = note.matiereCode.toLowerCase();
      } else if (note.matiereNom) {
        matKey = note.matiereNom.toLowerCase();
      } else if (typeof note.matiere === 'string') {
        matKey = note.matiere.toLowerCase();
      } else if (note.matiere && note.matiere.nom) {
        matKey = note.matiere.nom.toLowerCase();
      }
      gradesMap[matKey] = parseFloat(note.valeur || 0);

      if (matKey === 'mg' || matKey === 'moyenne' || matKey === 'moyenne_generale') {
        mg = parseFloat(note.valeur || 0);
      }
    }

    if (coefficients.length > 0) {
      let sumCoeffNotes = 0;
      for (const cm of coefficients) {
        const mat = cm.matiere;
        const matName = mat.nom ? mat.nom.toLowerCase() : '';
        const matCode = mat.code ? mat.code.toLowerCase() : '';

        const noteVal = gradesMap[matCode] ?? gradesMap[matName] ?? 0;
        sumCoeffNotes += noteVal * cm.valeur;
      }
      calculatedScore = 4 * mg + sumCoeffNotes;
    } else {
      // Calcul via la formule de référence tunisienne
      const formulaResult = calculateTunisianScore(sectionCode || 'INFO', { ...gradesMap, mg }, false);
      calculatedScore = formulaResult.baseScore;
    }

    if (avec7Pourcent) {
      calculatedScore = Math.round(calculatedScore * 1.07 * 100) / 100;
    } else {
      calculatedScore = Math.round(calculatedScore * 100) / 100;
    }

    // Alimente ResultatScore si demandé ou si persistance requise
    let savedResultat = null;
    if (saveResultat && isConnected && sectionDoc) {
      try {
        const highestId = await ResultatScore.findOne().sort('-id').select('id');
        const nextId = highestId && highestId.id ? highestId.id + 1 : 1;

        savedResultat = await ResultatScore.create({
          id: nextId,
          date: new Date(),
          scoreFige: calculatedScore,
          moyenneGenerale: mg,
          section: sectionDoc._id,
          etudiant: etudiantId,
          avec7Pourcent,
          notes: notes.map((n) => ({
            valeur: n.valeur,
            matiere: n.matiereId || n.matiere,
            matiereNom: n.matiereNom || n.matiereCode
          }))
        });
      } catch (saveErr) {
        console.warn('⚠️ Impossible de persister ResultatScore :', saveErr.message);
      }
    }

    return {
      score: calculatedScore,
      scoreFige: calculatedScore,
      moyenneGenerale: mg,
      section: sectionDoc,
      resultatScore: savedResultat
    };
  }
}

export default CalculateurScore;
