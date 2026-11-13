import MoteurRecommandation from '../services/MoteurRecommandation.js';
import ResultatScore from '../models/ResultatScore.js';
import SectionBac from '../models/SectionBac.js';
import { facultiesSeedData } from '../data/facultiesSeed.js';

export const getRecommendations = async (req, res) => {
  try {
    const { score, section, domain, governorate, resultatId } = req.body;

    if (!score || !section) {
      return res.status(400).json({
        success: false,
        message: 'Le score et la section du Bac sont obligatoires pour la recommandation.'
      });
    }

    const numericScore = parseFloat(score);

    // 1. Tenter d'utiliser MoteurRecommandation avec la base MongoDB
    try {
      let resultatObj = null;

      if (resultatId) {
        resultatObj = await ResultatScore.findById(resultatId);
      }

      if (!resultatObj) {
        // Résolution de la section
        let sectionDoc = await SectionBac.findOne({
          $or: [{ code: section.toUpperCase() }, { nom: new RegExp(section, 'i') }]
        });

        resultatObj = {
          scoreFige: numericScore,
          section: sectionDoc ? sectionDoc._id : null
        };
      }

      const recs = await MoteurRecommandation.recommander(resultatObj, {
        gouvernorat: governorate,
        domaine: domain
      });

      if (recs && recs.length > 0) {
        return res.json({
          success: true,
          studentScore: numericScore,
          section,
          totalCount: recs.length,
          data: recs
        });
      }
    } catch (err) {
      console.warn('⚠️ MoteurRecommandation MongoDB indisponible ou vide, utilisation du fallback :', err.message);
    }

    // 2. Fallback avec le jeu de données embarqué
    const recommendations = [];

    facultiesSeedData.forEach((faculty) => {
      if (governorate && governorate !== 'ALL' && faculty.governorate.toLowerCase() !== governorate.toLowerCase()) {
        return;
      }

      faculty.sections.forEach((sec) => {
        if (domain && domain !== 'ALL' && !sec.domain.toLowerCase().includes(domain.toLowerCase())) {
          return;
        }

        const minScore = sec.lastYearMinScores ? sec.lastYearMinScores[section] : null;

        if (minScore && minScore > 0) {
          const diff = numericScore - minScore;
          let chance = 'Moyenne';
          let status = 'Cible';

          if (diff >= 5) {
            status = 'Sécurisée';
            chance = 'Très Forte (> 90%)';
          } else if (diff >= -2) {
            status = 'Optimale (Cible)';
            chance = 'Forte (~ 70-85%)';
          } else if (diff >= -8) {
            status = 'Ambitieuse';
            chance = 'Modérée (~ 30-50%)';
          } else {
            return;
          }

          recommendations.push({
            facultyId: faculty._id || faculty.shortName,
            facultyName: faculty.name,
            facultyShortName: faculty.shortName,
            university: faculty.university,
            governorate: faculty.governorate,
            location: faculty.location,
            sectionCode: sec.code,
            sectionName: sec.name,
            domain: sec.domain,
            degree: sec.degree,
            lastYearMinScore: minScore,
            studentScore: numericScore,
            diff: Math.round(diff * 100) / 100,
            status,
            chance
          });
        }
      });
    });

    recommendations.sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff));

    return res.json({
      success: true,
      studentScore: numericScore,
      section,
      totalCount: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
