import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Calculator, MapPin, Sparkles, Building2, Compass, Award } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const { user, openAuth, logout } = useAuth();

  // Non connecté : tout clic sur un lien du menu ouvre le popup d'authentification
  const guard = (e, to) => {
    if (!user && to !== '/') {
      e.preventDefault();
      openAuth('login');
    }
  };

  const navLinks = [
    { to: '/', label: 'Accueil', icon: Compass },
    { to: '/calculator', label: 'Calculateur Score', icon: Calculator },
    { to: '/recommendations', label: 'Recommandations', icon: Award },
    { to: '/map', label: 'Carte de Tunisie', icon: MapPin },
    { to: '/faculties', label: 'Facultés & Fiches', icon: Building2 },
    { to: '/summer-prep', label: 'Summer Prep IA', icon: Sparkles, highlight: true }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-bold shadow-md shadow-red-200">
              <span className="text-xl">🇹🇳</span>
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent">
                OrienTn
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                Orientation 2026
              </span>
            </div>
          </Link>

          <nav className="flex items-center space-x-1 sm:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;

              if (link.highlight) {
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={(e) => guard(e, link.to)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm hover:shadow-md hover:from-purple-700 hover:to-indigo-700 transition"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.to}
                  to={link.to}
                    onClick={(e) => guard(e, link.to)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-red-50 text-red-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{link.label}</span>
                </Link>
              );
            })}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 ml-1 border-l border-slate-200">
                <span className="flex items-center space-x-1.5 text-sm font-semibold text-slate-700">
                  <User className="w-4 h-4" />
                  <span className="hidden lg:inline">{user.prenom}</span>
                </span>
                <button onClick={logout} title="Déconnexion" className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-2 ml-1 border-l border-slate-200">
                <button
                  onClick={() => openAuth('login')}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold border border-red-200 text-red-700 hover:bg-red-50 transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Connexion</span>
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="px-3.5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm hover:shadow-md transition"
                >
                  Inscription
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
