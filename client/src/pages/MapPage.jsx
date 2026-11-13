import React, { useState, useEffect } from 'react';
import { getFaculties } from '../services/api';
import TunisiaMap from '../components/TunisiaMap';
import { MapPin, Building2, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MapPage() {
  const [faculties, setFaculties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGov, setSelectedGov] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const governorates = ['ALL', 'Tunis', 'Ariana', 'Sousse', 'Sfax', 'Monastir'];

  useEffect(() => {
    const loadFaculties = async () => {
      setLoading(true);
      try {
        const res = await getFaculties();
        if (res.success && res.data) {
          setFaculties(res.data);
        }
      } catch (err) {
        console.error('Erreur chargement map :', err);
      } finally {
        setLoading(false);
      }
    };
    loadFaculties();
  }, []);

  const filtered = faculties.filter((fac) => {
    const matchesGov = selectedGov === 'ALL' || fac.governorate.toLowerCase() === selectedGov.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      fac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.shortName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGov && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
          <MapPin className="w-8 h-8 text-red-600 mr-3" />
          Carte Interactive des Établissements en Tunisie
        </h1>
        <p className="text-slate-600 mt-1">
          Explorez les facultés, grandes écoles et instituts géolocalisés à travers toute la Tunisie.
        </p>
      </div>

      {/* Barre de recherche et filtre */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom (ex: INSAT, Médecine, ISI...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden"
          />
        </div>

        <div>
          <select
            value={selectedGov}
            onChange={(e) => setSelectedGov(e.target.value)}
            className="text-xs sm:text-sm font-medium px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 text-slate-700 focus:outline-hidden"
          >
            {governorates.map((g) => (
              <option key={g} value={g}>
                Gouvernorat : {g === 'ALL' ? 'Toutes les régions' : g}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          {filtered.length} universités affichées
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Carte */}
        <div className="lg:col-span-3">
          <TunisiaMap faculties={filtered} />
        </div>

        {/* Liste latérale */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-4 max-h-[600px] overflow-y-auto space-y-3">
          <h3 className="font-bold text-xs uppercase text-slate-400 tracking-wider">
            Établissements ({filtered.length})
          </h3>

          {filtered.map((fac) => (
            <div
              key={fac._id || fac.shortName}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-red-50/50 hover:border-red-200 transition"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-red-600">{fac.shortName}</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-600">
                  {fac.governorate}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">{fac.name}</h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{fac.description}</p>
              <Link
                to={`/faculties?id=${fac._id || fac.shortName}`}
                className="mt-2 text-[11px] font-semibold text-red-600 hover:text-red-700 block"
              >
                Voir la fiche complète →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
