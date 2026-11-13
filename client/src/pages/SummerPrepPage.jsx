import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { generateSummerPrepRoadmap } from '../services/api';
import { Sparkles, Calendar, BookOpen, CheckSquare, ExternalLink, Bot, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SummerPrepPage() {
  const location = useLocation();

  const [section, setSection] = useState(
    location.state?.chosenSection || "Licence en Génie Logiciel et Systèmes d'Information"
  );
  const [domain, setDomain] = useState(location.state?.domain || 'Informatique');
  const [faculty, setFaculty] = useState(location.state?.facultyName || 'INSAT');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [checkedTasks, setCheckedTasks] = useState({});

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await generateSummerPrepRoadmap({
        chosenSection: section,
        domain: domain,
        facultyName: faculty
      });

      if (res.success && res.roadmap) {
        setRoadmap(res.roadmap);
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setRoadmap({
        title: `Plan d'action estival (Summer Prep) : ${section}`,
        faculty: faculty,
        intro: `Félicitations pour votre affectation ! Voici le programme d'accompagnement estival généré par l'IA d'OrienTn pour préparer votre rentrée à ${faculty}.`,
        weeks: [
          {
            week: 'Semaines 1 & 2',
            focus: 'Fondations Algorithmiques & Logique Orientée Objet',
            topics: ['Consolidation de la programmation Java / C++', 'Structures de données dynamiques', 'Pointeurs et gestion mémoire'],
            resources: ['OpenClassrooms POO', 'Exercices LeetCode faciles']
          },
          {
            week: 'Semaines 3 & 4',
            focus: 'Bases de Données & Modélisation des Systèmes',
            topics: ['Conception Merise (MCD, MLD)', 'Requêtes SQL avancées', 'Introduction aux bases NoSQL (MongoDB)'],
            resources: ['SQLZoo', 'Tutoriels YouTube Modélisation Merise']
          },
          {
            week: 'Semaines 5 & 6',
            focus: 'Développement Web Moderne & Outils Collaboratifs',
            topics: ['Architecture Client-Serveur', 'Prise en main de Git et GitHub', 'Initiation à React ou Express'],
            resources: ['FreeCodeCamp', 'Documentation Git']
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (key) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Accompagnement IA Personnalisé</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Génération IA - Summer Prep Roadmap
        </h1>
        <p className="text-slate-600 mt-2 text-sm leading-relaxed">
          Une fois votre section choisie, l'Intelligence Artificielle (RAG en Python) analyse le cursus universitaire et vous construit un plan d'action d'été sur mesure pour briller dès le premier semestre.
        </p>
      </div>

      {/* Formulaire de configuration */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-10">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Section / Filière Choisie :
            </label>
            <input
              type="text"
              required
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="Ex: Cycle Ingénieur Informatique, Génie Logiciel..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Domaine d'études :
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:outline-hidden bg-white"
            >
              <option value="Informatique">Informatique & Génie Logiciel</option>
              <option value="Médecine & Santé">Médecine & Santé</option>
              <option value="Économie & Gestion">Économie & Gestion</option>
              <option value="Ingénierie">Ingénierie & Mécatronique</option>
              <option value="Sciences Fondamentales">Sciences Fondamentales</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Faculté / Institut cible :
            </label>
            <input
              type="text"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              placeholder="Ex: INSAT, ISI, FMT, IHEC, ENIT..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-purple-200 transition flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5 text-purple-200" />
              <span>{loading ? 'Génération par le RAG en cours...' : 'Générer mon Plan Estival avec l\'IA'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Affichage de la Roadmap générée */}
      {roadmap && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Roadmap */}
          <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center space-x-2 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Plan Recommandé par le Modèle IA d'OrienTn</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
              {roadmap.title}
            </h2>
            <p className="text-purple-100 text-sm leading-relaxed max-w-3xl">
              {roadmap.intro}
            </p>
          </div>

          {/* Liste des semaines */}
          <div className="grid grid-cols-1 gap-6">
            {roadmap.weeks?.map((w, wIdx) => (
              <div
                key={wIdx}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:border-purple-200 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 font-black flex items-center justify-center text-sm">
                      {wIdx + 1}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                        {w.week}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">{w.focus}</h3>
                    </div>
                  </div>
                </div>

                {/* Topics / Description */}
                {w.description && (
                  <p className="text-xs sm:text-sm text-slate-600 mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    💡 {w.description}
                  </p>
                )}

                {/* Topics list */}
                {w.topics && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Points d'apprentissage clés :
                    </h4>
                    <div className="space-y-2">
                      {w.topics.map((top, tIdx) => {
                        const taskKey = `${wIdx}-${tIdx}`;
                        const isDone = !!checkedTasks[taskKey];
                        return (
                          <div
                            key={tIdx}
                            onClick={() => toggleTask(taskKey)}
                            className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition text-xs sm:text-sm ${
                              isDone
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 line-through'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => {}}
                              className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span>{top}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tasks list if from Python RAG */}
                {w.tasks && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Actions recommandées :
                    </h4>
                    <div className="space-y-2">
                      {w.tasks.map((task, tIdx) => {
                        const taskKey = `py-${wIdx}-${tIdx}`;
                        const isDone = !!checkedTasks[taskKey];
                        return (
                          <div
                            key={tIdx}
                            onClick={() => toggleTask(taskKey)}
                            className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition text-xs sm:text-sm ${
                              isDone
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 line-through'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => {}}
                              className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span>{task}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Ressources conseillées */}
                {w.resources?.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Ressources recommandées :
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {w.resources.map((res, rIdx) => (
                        <span
                          key={rIdx}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200"
                        >
                          🔗 {res}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
