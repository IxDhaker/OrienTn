/**
 * Formules officielles du Guide de l'Orientation Universitaire Tunisienne
 */

export const BAC_SECTIONS = {
  MATH: 'Mathématiques',
  SC_EXP: 'Sciences Expérimentales',
  INFO: "Sciences de l'Informatique",
  TECH: 'Sciences Techniques',
  ECO: 'Économie et Gestion',
  LETTRES: 'Lettres',
  SPORT: 'Sport'
};

/**
 * Calcul du Score de base / Formule Globale (FG) selon la section
 * @param {string} section 
 * @param {Object} grades Notes du bachelier
 * @param {boolean} with7Percent Appliquer la bonification géographique de 7%
 * @returns {Object} Détail du calcul et score final
 */
export const calculateTunisianScore = (section, grades, with7Percent = false) => {
  const mg = parseFloat(grades.mg || grades.moyenne || 0); // Moyenne Générale du Bac
  let fg = 0;
  let formulaUsed = '';

  switch (section) {
    case 'MATH': {
      const m = parseFloat(grades.math || 0);
      const sp = parseFloat(grades.physique || 0);
      const svt = parseFloat(grades.svt || 0);
      const fr = parseFloat(grades.francais || 0);
      const ang = parseFloat(grades.anglais || 0);

      fg = 4 * mg + 2 * m + 1.5 * sp + 0.5 * svt + 0.5 * fr + 0.5 * ang;
      formulaUsed = '4*MG + 2*M + 1.5*SP + 0.5*SVT + 0.5*FR + 0.5*ANG';
      break;
    }

    case 'SC_EXP': {
      const m = parseFloat(grades.math || 0);
      const sp = parseFloat(grades.physique || 0);
      const svt = parseFloat(grades.svt || 0);
      const fr = parseFloat(grades.francais || 0);
      const ang = parseFloat(grades.anglais || 0);

      fg = 4 * mg + 1.5 * m + 1.5 * sp + 1.5 * svt + 0.5 * fr + 0.5 * ang;
      formulaUsed = '4*MG + 1.5*M + 1.5*SP + 1.5*SVT + 0.5*FR + 0.5*ANG';
      break;
    }

    case 'INFO': {
      const m = parseFloat(grades.math || 0);
      const tic = parseFloat(grades.algo_tic || grades.informatique || 0);
      const sp = parseFloat(grades.physique || 0);
      const fr = parseFloat(grades.francais || 0);
      const ang = parseFloat(grades.anglais || 0);

      fg = 4 * mg + 1.5 * m + 1.5 * tic + 1 * sp + 0.5 * fr + 0.5 * ang;
      formulaUsed = '4*MG + 1.5*M + 1.5*TIC + 1*SP + 0.5*FR + 0.5*ANG';
      break;
    }

    case 'TECH': {
      const m = parseFloat(grades.math || 0);
      const te = parseFloat(grades.technique || 0);
      const sp = parseFloat(grades.physique || 0);
      const fr = parseFloat(grades.francais || 0);
      const ang = parseFloat(grades.anglais || 0);

      fg = 4 * mg + 1.5 * te + 1.5 * m + 1 * sp + 0.5 * fr + 0.5 * ang;
      formulaUsed = '4*MG + 1.5*TE + 1.5*M + 1*SP + 0.5*FR + 0.5*ANG';
      break;
    }

    case 'ECO': {
      const eco = parseFloat(grades.economie || 0);
      const gest = parseFloat(grades.gestion || 0);
      const m = parseFloat(grades.math || 0);
      const hg = parseFloat(grades.histoire_geo || 0);
      const fr = parseFloat(grades.francais || 0);
      const ang = parseFloat(grades.anglais || 0);

      fg = 4 * mg + 1.5 * eco + 1.5 * gest + 1 * m + 0.5 * hg + 0.5 * fr + 0.5 * ang;
      formulaUsed = '4*MG + 1.5*ECO + 1.5*GEST + 1*M + 0.5*HG + 0.5*FR + 0.5*ANG';
      break;
    }

    case 'LETTRES': {
      const ar = parseFloat(grades.arabe || 0);
      const fr = parseFloat(grades.francais || 0);
      const ang = parseFloat(grades.anglais || 0);
      const hg = parseFloat(grades.histoire_geo || 0);
      const philo = parseFloat(grades.philosophie || 0);

      fg = 4 * mg + 2 * ar + 1.5 * fr + 1.5 * ang + 1 * hg + 0.5 * philo;
      formulaUsed = '4*MG + 2*AR + 1.5*FR + 1.5*ANG + 1*HG + 0.5*PHILO';
      break;
    }

    case 'SPORT': {
      const sport = parseFloat(grades.sport_pratique || 0);
      const sp = parseFloat(grades.physique || 0);
      const svt = parseFloat(grades.svt || 0);
      const fr = parseFloat(grades.francais || 0);
      const ang = parseFloat(grades.anglais || 0);

      fg = 4 * mg + 1.5 * sport + 1 * sp + 1 * svt + 0.5 * fr + 0.5 * ang;
      formulaUsed = '4*MG + 1.5*SPORT + 1*SP + 1*SVT + 0.5*FR + 0.5*ANG';
      break;
    }

    default:
      throw new Error(`Section invalide : ${section}`);
  }

  const baseScore = Math.round(fg * 100) / 100;
  const bonifiedScore = with7Percent ? Math.round((baseScore * 1.07) * 100) / 100 : baseScore;

  return {
    section,
    sectionName: BAC_SECTIONS[section] || section,
    moyenneGenerale: mg,
    baseScore,
    bonus7PercentApplied: with7Percent,
    finalScore: bonifiedScore,
    formula: formulaUsed
  };
};
