import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🇹🇳</span>
            <span className="text-lg font-bold text-white tracking-wide">OrienTn</span>
            <span className="text-sm text-slate-500">| Plateforme Web d'Orientation Universitaire Intelligente</span>
          </div>
          <p className="text-xs text-slate-500 text-center md:text-right">
            Conçu pour les bacheliers tunisiens • MERN Stack (MongoDB, Express, React, Node.js) & Python RAG
          </p>
        </div>
      </div>
    </footer>
  );
}
