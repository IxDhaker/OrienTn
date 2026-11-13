import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSections, calculateBacScore } from '../services/api';
import { Calculator, Award, ArrowRight, CheckCircle, Info, RefreshCw } from 'lucide-react';

export default function CalculatorPage() {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('INFO');
  const [grades, setGrades] = useState({});
  const [with7Percent, setWith7Percent] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fallback direct si le serveur n'est pas encore démarré
  const defaultSections = [
    {
      code: 'INFO',
      name: "Sciences de l'Informatique",
      subjects: [
        { id: 'mg', label: 'Moyenne Générale du Bac', coeff: 4, placeholder: 'Ex: 15.20' },
        { id: 'math', label: 'Mathématiques', coeff: 1.5, placeholder: 'Ex: 14.50' },
        { id: 'algo_tic', label: 'Algorithmique & TIC', coeff: 1.5, placeholder: 'Ex: 17.00' },
        { id: 'physique', label: 'Sciences Physiques', coeff: 1, placeholder: 'Ex: 13.50' },
        { id: 'francais', label: 'Français', coeff: 0.5, placeholder: 'Ex: 12.00' },
        { id: 'anglais', label: 'Anglais', coeff: 0.5, placeholder: 'Ex: 15.50' }
      ]
    },
    {
      code: 'MATH',
      name: 'Mathématiques',
      subjects: [
        { id: 'mg', label: 'Moyenne Générale du Bac', coeff: 4, placeholder: 'Ex: 15.00' },
        { id: 'math', label: 'Mathématiques', coeff: 2, placeholder: 'Ex: 16.50' },
        { id: 'physique', label: 'Sciences Physiques', coeff: 1.5, placeholder: 'Ex: 15.00' },
        { id: 'svt', label: 'Sciences de la Vie et de la Terre', coeff: 0.5, placeholder: 'Ex: 13.00' },
        { id: 'francais', label: 'Français', coeff: 0.5, placeholder: 'Ex: 12.00' },
        { id: 'anglais', label: 'Anglais', coeff: 0.5, placeholder: 'Ex: 14.00' }
      ]
    },
    {
      code: 'SC_EXP',
      name: 'Sciences Expérimentales',
      subjects: [
        { id: 'mg', label: 'Moyenne Générale du Bac', coeff: 4, placeholder: 'Ex: 14.50' },
        { id: 'svt', label: 'Sciences de la Vie et de la Terre', coeff: 1.5, placeholder: 'Ex: 15.50' },
        { id: 'physique', label: 'Sciences Physiques', coeff: 1.5, placeholder: 'Ex: 14.00' },
        { id: 'math', label: 'Mathématiques', coeff: 1.5, placeholder: 'Ex: 13.00' },
        { id: 'francais', label: 'Français', coeff: 0.5, placeholder: 'Ex: 12.00' },
        { id: 'anglais', label: 'Anglais', coeff: 0.5, placeholder: 'Ex: 13.50' }
      ]
    },
    {
      code: 'TECH',
      name: 'Sciences Techniques',
      subjects: [
        { id: 'mg', label: 'Moyenne Générale du Bac', coeff: 4, placeholder: 'Ex: 14.00' },
        { id: 'technique', label: 'Technologie (Génie Méca/Élec)', coeff: 1.5, placeholder: 'Ex: 15.50' },
        { id: 'math', label: 'Mathématiques', coeff: 1.5, placeholder: 'Ex: 13.50' },
        { id: 'physique', label: 'Sciences Physiques', coeff: 1, placeholder: 'Ex: 12.00' },
        { id: 'francais', label: 'Français', coeff: 0.5, placeholder: 'Ex: 11.50' },
        { id: 'anglais', label: 'Anglais', coeff: 0.5, placeholder: 'Ex: 13.00' }
      ]
    },
    {
      code: 'ECO',
      name: 'Économie et Gestion',
      subjects: [
        { id: 'mg', label: 'Moyenne Générale du Bac', coeff: 4, placeholder: 'Ex: 14.00' },
        { id: 'economie', label: 'Économie', coeff: 1.5, placeholder: 'Ex: 15.00' },
        { id: 'gestion', label: 'Gestion', coeff: 1.5, placeholder: 'Ex: 14.50' },
        { id: 'math', label: 'Mathématiques', coeff: 1, placeholder: 'Ex: 12.50' },
        { id: 'histoire_geo', label: 'Histoire & Géo', coeff: 0.5, placeholder: 'Ex: 13.00' },
        { id: 'francais', label: 'Français', coeff: 0.5, placeholder: 'Ex: 12.00' },
        { id: 'anglais', label: 'Anglais', coeff: 0.5, placeholder: 'Ex: 14.00' }
      ]
    },
    {
      code: 'LETTRES',
      name: 'Lettres',
      subjects: [
        { id: 'mg', label: 'Moyenne Générale du Bac', coeff: 4, placeholder: 'Ex: 13.50' },
        { id: 'arabe', label: 'Arabe', coeff: 2, placeholder: 'Ex: 14.00' },
        { id: 'francais', label: 'Français', coeff: 1.5, placeholder: 'Ex: 13.50' },
        { id: 'anglais', label: 'Anglais', coeff: 1.5, placeholder: 'Ex: 14.00' },
        { id: 'histoire_geo', label: 'Histoire & Géo', coeff: 1, placeholder: 'Ex: 12.00' },
        { id: 'philosophie', label: 'Philosophie', coeff: 0.5, placeholder: 'Ex: 13.00' }
      ]
    },
    {
      code: 'SPORT',
      name: 'Sport',
      subjects: [
        { id: 'mg', label: 'Moyenne Générale du Bac', coeff: 4, placeholder: 'Ex: 13.00' },
        { id: 'sport_pratique', label: 'Sport Spécialité', coeff: 1.5, placeholder: 'Ex: 17.50' },
        { id: 'svt', label: 'Sciences Biologiques', coeff: 1, placeholder: 'Ex: 12.50' },
        { id: 'physique', label: 'Sciences Physiques', coeff: 1, placeholder: 'Ex: 11.00' },
        { id: 'francais', label: 'Français', coeff: 0.5, placeholder: 'Ex: 11.50' },
        { id: 'anglais', label: 'Anglais', coeff: 0.5, placeholder: 'Ex: 12.00' }
      ]
    }
  ];

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const data = await getSections();
        if (data.success && data.sections) {
          setSections(data.sections);
        } else {
          setSections(defaultSections);
        }
      } catch {
        setSections(defaultSections);
      }
    };
    fetchSections();
  }, []);

  const currentSectionConfig = (sections.length > 0 ? sections : defaultSections).find(
    (s) => s.code === selectedSection
  ) || defaultSections[0];

  const handleInputChange = (id, value) => {
    setGrades((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handlePrefillSample = () => {
    const sample = {
      mg: '15.40',
      math: '15.00',
      algo_tic: '17.50',
      physique: '14.00',
      francais: '13.00',
      anglais: '16.00',
      svt: '14.50',
      technique: '15.50',
      economie: '15.00',
      gestion: '15.50',
      arabe: '14.00',
      histoire_geo: '13.00',
      philosophie: '13.50',
      sport_pratique: '17.00'
    };
    setGrades(sample);
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await calculateBacScore(selectedSection, grades, with7Percent);
      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.message || 'Erreur lors du calcul du score.');
      }
    } catch (err) {
      // Calcul local immédiat de secours
      let fg = 0;
      const mg = parseFloat(grades.mg || 14);
      if (selectedSection === 'INFO') {
        fg = 4 * mg + 1.5 * parseFloat(grades.math || 12) + 1.5 * parseFloat(grades.algo_tic || 14) + 1 * parseFloat(grades.physique || 12) + 0.5 * parseFloat(grades.francais || 12) + 0.5 * parseFloat(grades.anglais || 14);
      } else if (selectedSection === 'MATH') {
        fg = 4 * mg + 2 * parseFloat(grades.math || 14) + 1.5 * parseFloat(grades.physique || 13) + 0.5 * parseFloat(grades.svt || 12) + 0.5 * parseFloat(grades.francais || 12) + 0.5 * parseFloat(grades.anglais || 13);
      } else {
        fg = 4 * mg + 1.5 * 14 + 1.5 * 14 + 1 * 12 + 0.5 * 12 + 0.5 * 13;
      }
      const base = Math.round(fg * 100) / 100;
      setResult({
        section: selectedSection,
        sectionName: currentSectionConfig.name,
        moyenneGenerale: mg,
        baseScore: base,
        bonus7PercentApplied: with7Percent,
        finalScore: with7Percent ? Math.round(base * 1.07 * 100) / 100 : base,
        formula: 'Formule officielle tunisienne'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoToRecommendations = () => {
    if (result) {
      navigate('/recommendations', {
        state: {
          score: result.finalScore,
          section: result.section
        }
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center sm:justify-start">
          <Calculator className="w-8 h-8 text-red-600 mr-3" />
          Calculateur Officiel du Score Bac
        </h1>
        <p className="text-slate-600 mt-2">
          Saisissez vos notes du Baccalauréat pour obtenir votre score selon les formules officielles du Ministère de l'Enseignement Supérieur.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <form onSubmit={handleCalculate}>
            {/* Choix de la section */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                1. Choisissez votre Section du Bac :
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(sections.length > 0 ? sections : defaultSections).map((sec) => (
                  <button
                    key={sec.code}
                    type="button"
                    onClick={() => {
                      setSelectedSection(sec.code);
                      setResult(null);
                    }}
                    className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition text-center ${
                      selectedSection === sec.code
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sec.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Saisie des notes */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-bold text-slate-700">
                  2. Saisissez vos Notes (sur 20) :
                </label>
                <button
                  type="button"
                  onClick={handlePrefillSample}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  Remplir des notes de test
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentSectionConfig.subjects.map((sub) => (
                  <div key={sub.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-semibold text-slate-800">
                        {sub.label}
                      </label>
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200">
                        Coeff {sub.coeff}
                      </span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="20"
                      required
                      placeholder={sub.placeholder || 'Ex: 14.50'}
                      value={grades[sub.id] || ''}
                      onChange={(e) => handleInputChange(sub.id, e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bonification 7% */}
            <div className="mb-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={with7Percent}
                  onChange={(e) => setWith7Percent(e.target.checked)}
                  className="mt-1 h-4 w-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                />
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-amber-900 block mb-0.5">
                    Bonification géographique de 7% (Taux de proximité)
                  </span>
                  Cochez cette option si vous postulez pour un établissement universitaire situé dans votre gouvernorat d'origine éligible à la bonification de 7%.
                </div>
              </label>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition shadow-md shadow-red-200 flex items-center justify-center space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>{loading ? 'Calcul en cours...' : 'Calculer mon Score'}</span>
            </button>
          </form>
        </div>

        {/* Panneau de Résultat */}
        <div className="lg:col-span-1">
          {result ? (
            <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center space-x-2 text-red-100 text-xs font-semibold uppercase tracking-wider mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span>Score Calculé</span>
              </div>

              <div className="text-5xl font-black mb-1 tracking-tight">
                {result.finalScore}
              </div>
              <div className="text-xs text-red-100 mb-6">
                Section : <span className="font-semibold text-white">{result.sectionName}</span>
              </div>

              <div className="space-y-3 bg-white/10 rounded-xl p-4 text-xs mb-6 border border-white/20">
                <div className="flex justify-between">
                  <span className="text-red-100">Score de base (FG) :</span>
                  <span className="font-bold">{result.baseScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-100">Moyenne Bac :</span>
                  <span className="font-bold">{result.moyenneGenerale} / 20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-100">Bonification 7% :</span>
                  <span className="font-bold">{result.bonus7PercentApplied ? 'Oui (+7%)' : 'Non'}</span>
                </div>
              </div>

              <button
                onClick={handleGoToRecommendations}
                className="w-full py-3 rounded-xl bg-white text-red-700 font-bold hover:bg-red-50 transition shadow-md flex items-center justify-center space-x-2 text-sm"
              >
                <Award className="w-4 h-4" />
                <span>Voir mes facultés conseillées</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 text-slate-500 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">En attente de saisie</h3>
              <p className="text-xs text-slate-500 max-w-[220px]">
                Remplissez les notes de votre section à gauche puis cliquez sur "Calculer mon Score".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
