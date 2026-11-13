import mongoose from 'mongoose';
import Filiere from '../models/Filiere.js';
import Etudiant from '../models/Etudiant.js';
import RoadmapPreparation from '../models/RoadmapPreparation.js';
import ServiceIA from './ServiceIA.js';

/**
 * Service RoadmapService (Package : IA)
 * Méthode UML : + generer(etudiant: Etudiant, filiere: Filiere) -> RoadmapPreparation
 * Dépendances UML :
 *   - appelle ServiceIA
 *   - crée RoadmapPreparation
 */
export class RoadmapService {
  /**
   * Génère et enregistre une feuille de route estivale personnalisée
   * @param {Object} etudiant - Document Etudiant ou identifiant de l'étudiant
   * @param {Object} filiere - Document Filiere ou identifiant/nom de la filière
   * @param {Object} context - Contexte supplémentaire (faculté, prompt personnalisé)
   * @returns {Promise<RoadmapPreparation>}
   */
  static async generer(etudiant = null, filiere, context = {}) {
    const isConnected = mongoose.connection.readyState === 1;

    // 1. Résolution de la filière
    let filiereDoc = null;
    let filiereNom = typeof filiere === 'string' ? filiere : filiere?.nom || 'Filière';
    let filiereDomaine = context.domaine || filiere?.domaine || 'Informatique';

    if (isConnected) {
      if (typeof filiere === 'string') {
        filiereDoc = await Filiere.findOne({
          $or: [{ nom: new RegExp(filiere, 'i') }, { code: filiere.toUpperCase() }]
        });
        if (!filiereDoc) {
          filiereDoc = await Filiere.create({
            id: Math.floor(Date.now() % 100000),
            nom: filiere,
            domaine: filiereDomaine,
            description: `Filière d'études universitaires : ${filiere}`
          });
        }
      } else if (filiere && filiere._id) {
        filiereDoc = filiere;
      }
    }

    if (!filiereDoc) {
      filiereDoc = {
        nom: filiereNom,
        domaine: filiereDomaine
      };
    }

    // 2. Résolution de l'étudiant
    let etudiantId = null;
    if (isConnected) {
      if (etudiant && etudiant._id) {
        etudiantId = etudiant._id;
      } else if (typeof etudiant === 'string') {
        const foundEtudiant = await Etudiant.findById(etudiant);
        if (foundEtudiant) etudiantId = foundEtudiant._id;
      }
    }

    // 3. Appel de ServiceIA.genererPlan(filiere)
    const etapesGenerees = await ServiceIA.genererPlan(filiereDoc, {
      faculteNom: context.faculteNom || '',
      domaine: filiereDoc.domaine
    });

    const resumeTexte = `Programme estival de préparation universitaire pour ${filiereDoc.nom}`;
    const promptTexte = context.prompt || `Génération de plan d'action estival pour la filière ${filiereDoc.nom} (${filiereDoc.domaine})`;

    // 4. Création de RoadmapPreparation
    let roadmap = null;
    if (isConnected && filiereDoc._id) {
      const highest = await RoadmapPreparation.findOne().sort('-id').select('id');
      const nextId = highest && highest.id ? highest.id + 1 : 1;

      roadmap = await RoadmapPreparation.create({
        id: nextId,
        dateGeneration: new Date(),
        resume: resumeTexte,
        promptUtilise: promptTexte,
        statut: 'GENEREE',
        etudiant: etudiantId,
        filiere: filiereDoc._id,
        faculte: context.faculteId || null,
        etapes: etapesGenerees
      });

      if (etudiantId) {
        await Etudiant.findByIdAndUpdate(etudiantId, {
          $push: { roadmaps: roadmap._id }
        });
      }
    } else {
      roadmap = {
        id: 1,
        dateGeneration: new Date(),
        resume: resumeTexte,
        promptUtilise: promptTexte,
        statut: 'GENEREE',
        etudiant: null,
        filiere: filiereDoc,
        etapes: etapesGenerees
      };
    }

    return roadmap;
  }
}

export default RoadmapService;
