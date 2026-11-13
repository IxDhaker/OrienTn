import RoadmapService from '../services/RoadmapService.js';
import ServiceIA from '../services/ServiceIA.js';
import Filiere from '../models/Filiere.js';
import RoadmapPreparation from '../models/RoadmapPreparation.js';

export const generateSummerPrepRoadmap = async (req, res) => {
  const { chosenSection, domain, facultyName, targetLevel, etudiantId } = req.body;

  if (!chosenSection && !domain) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez spécifier la section ou le domaine choisi pour générer la roadmap.'
    });
  }

  const filiereTitre = chosenSection || domain;

  try {
    // 1. Utiliser le RoadmapService conforme UML
    let roadmapDoc = null;
    try {
      roadmapDoc = await RoadmapService.generer(
        etudiantId || null,
        filiereTitre,
        {
          domaine: domain || 'Informatique',
          faculteNom: facultyName || 'Faculté Tunisienne'
        }
      );
    } catch (serviceErr) {
      console.warn('⚠️ Erreur RoadmapService MongoDB, passage en fallback ServiceIA direct :', serviceErr.message);
    }

    // 2. Formater la réponse pour SummerPrepPage.jsx
    let formattedRoadmap = null;

    if (roadmapDoc && roadmapDoc.etapes && roadmapDoc.etapes.length > 0) {
      formattedRoadmap = {
        title: `Plan d'action estival (Summer Prep) : ${filiereTitre}`,
        faculty: facultyName || 'Université Tunisienne',
        domain: domain || 'Général',
        intro: `Félicitations pour votre affectation ! Voici le programme d'accompagnement estival généré par le moteur IA d'OrienTn pour préparer votre rentrée à ${facultyName || 'votre faculté'}.`,
        weeks: roadmapDoc.etapes.map((e) => ({
          week: `Semaines ${e.ordre * 2 - 1} & ${e.ordre * 2}`,
          focus: e.titre,
          topics: e.sujets && e.sujets.length > 0 ? e.sujets : [e.description],
          resources: e.ressources && e.ressources.length > 0 ? e.ressources : ['Documentation officielle', 'Supports universitaires UVT']
        }))
      };

      return res.json({
        success: true,
        source: 'ORIENTN_ROADMAP_SERVICE',
        roadmapId: roadmapDoc._id,
        roadmap: formattedRoadmap
      });
    }

    // 3. Fallback direct via ServiceIA si base non disponible
    const planEtapes = await ServiceIA.genererPlan(
      { nom: filiereTitre, domaine: domain || 'Informatique' },
      { faculteNom: facultyName }
    );

    formattedRoadmap = {
      title: `Plan d'action estival (Summer Prep) : ${filiereTitre}`,
      faculty: facultyName || 'Université Tunisienne',
      domain: domain || 'Général',
      intro: `Félicitations pour votre admission ! Voici un programme structuré sur 6 semaines conçu pour vous donner une longueur d'avance dès le premier semestre à ${facultyName || 'votre faculté'}.`,
      weeks: planEtapes.map((e) => ({
        week: `Semaines ${e.ordre * 2 - 1} & ${e.ordre * 2}`,
        focus: e.titre,
        topics: e.sujets,
        resources: e.ressources
      }))
    };

    return res.json({
      success: true,
      source: 'SERVICE_IA_DIRECT',
      roadmap: formattedRoadmap
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
