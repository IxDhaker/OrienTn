import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, MapPin, Sparkles, Building2, Award, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: 'Calculateur Officiel de Score',
      desc: 'Saisie personnalisée des notes selon votre section (Math, Info, Sc. Exp, Éco, etc.) avec application exacte des formules ministérielles.',
      icon: Calculator,
      color: 'bg-red-50 text-red-600 border-red-200',
      link: '/calculator',
      btn: 'Calculer mon score'
    },
    {
      title: 'Recommandation Intelligente',
      desc: 'Filtrage instantané des sections et facultés selon votre score, catégorisées en Sécurisées, Cibles et Ambitieuses.',
      icon: Award,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      link: '/recommendations',
      btn: 'Découvrir mes filières'
    },
    {
      title: 'Carte Interactive de la Tunisie',
      desc: 'Visualisez les universités et instituts sur une carte interactive géolocalisée avec filtres par région et gouvernorat.',
      icon: MapPin,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      link: '/map',
      btn: 'Explorer la carte'
    },
    {
      title: 'Fiches Riches des Facultés',
      desc: 'Explorez en détail les sections proposées, la vie de campus, les clubs d’excellence (IEEE, SecurNets, Junior Entreprise) et activités.',
      icon: Building2,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      link: '/faculties',
      btn: 'Consulter les fiches'
    },
    {
      title: 'Summer Prep IA (Roadmap Estivale)',
      desc: 'Un plan d’action estival généré par l’Intelligence Artificielle (RAG en Python) pour préparer la rentrée universitaire en toute confiance.',
      icon: Sparkles,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      link: '/summer-prep',
      btn: 'Générer ma Roadmap IA',
      highlight: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold uppercase tracking-wider mb-4">
          <span>🇹🇳 Orientation Universitaire Tunisienne 2026</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
          Trouvez votre voie universitaire en Tunisie grâce à la{' '}
          <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
            Data & l'IA
          </span>
        </h1>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          Calculez précisément votre score Bac, découvrez les universités adaptées sur la carte de la Tunisie, et démarrez sereinement grâce à une roadmap de préparation estivale générée sur mesure par l'IA.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/calculator"
            className="inline-flex items-center px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-200 transition"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Calculer mon Score Bac
          </Link>
          <Link
            to="/map"
            className="inline-flex items-center px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition"
          >
            <MapPin className="w-5 h-5 mr-2 text-red-600" />
            Voir la Carte des Facultés
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl p-6 border transition hover:shadow-lg flex flex-col justify-between ${
                feat.highlight ? 'border-purple-300 ring-2 ring-purple-100 lg:col-span-2' : 'border-slate-200'
              }`}
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${feat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">{feat.desc}</p>
              </div>
              <Link
                to={feat.link}
                className="inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700 mt-auto"
              >
                <span>{feat.btn}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Tech Stack & Team Info */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-red-400">Architecture du Projet</span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2 mb-4 text-white">
            Architecture Moderne : MERN Stack + Python RAG
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Ce projet est conçu pour une équipe de 4 étudiants conformément au cahier des charges :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start space-x-3 bg-white/5 p-3.5 rounded-xl border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Étudiant 1 : Base de Données</span>
                <p className="text-xs text-slate-400">Modèles MongoDB (Mongoose), seed des universités, scores minimaux et clubs.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-white/5 p-3.5 rounded-xl border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Étudiant 2 : Frontend & Cartographie</span>
                <p className="text-xs text-slate-400">Interface React, géolocalisation Leaflet de la Tunisie, fiches facultés.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-white/5 p-3.5 rounded-xl border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Étudiant 3 : API Backend Node.js / Express</span>
                <p className="text-xs text-slate-400">Calculateur de score officiel du Bac, moteur de filtrage et recommandations.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-white/5 p-3.5 rounded-xl border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Étudiant 4 : Module IA / RAG en Python</span>
                <p className="text-xs text-slate-400">FastAPI, LangChain, vector store et génération du Summer Prep personnalisé.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
