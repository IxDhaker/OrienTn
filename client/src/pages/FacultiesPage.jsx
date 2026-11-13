import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getFaculties } from '../services/api';
import { Building2, Globe, Phone, Mail, Users, BookOpen, Calendar, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FacultiesPage() {
  const [searchParams] = useSearchParams();
  const highlightedId = searchParams.get('id');

  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getFaculties();
        if (res.success && res.data) {
          setFaculties(res.data);
          if (highlightedId) {
            const found = res.data.find(
              (f) => f._id === highlightedId || f.shortName.toLowerCase() === highlightedId.toLowerCase()
            );
            if (found) setSelectedFaculty(found);
          } else {
            setSelectedFaculty(res.data[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [highlightedId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
          <Building2 className="w-8 h-8 text-amber-600 mr-3" />
          Fiches Descriptives des Établissements & Vie Associative
        </h1>
        <p className="text-slate-600 mt-1">
          Découvrez la vie étudiante, les clubs actifs (IEEE, robotique, hacking, junior entreprises) et les cursus proposés.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne de sélection de la faculté */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="font-bold text-xs uppercase text-slate-400 tracking-wider mb-2">
            Sélectionner un établissement
          </h3>
          {faculties.map((fac) => (
            <button
              key={fac._id || fac.shortName}
              onClick={() => setSelectedFaculty(fac)}
              className={`w-full text-left p-4 rounded-2xl border transition flex items-center justify-between ${
                selectedFaculty?.shortName === fac.shortName
                  ? 'bg-red-50 border-red-300 ring-2 ring-red-100 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="font-bold text-sm text-slate-900 block">{fac.shortName}</span>
                <span className="text-xs text-slate-500 line-clamp-1">{fac.name}</span>
              </div>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-medium">
                {fac.governorate}
              </span>
            </button>
          ))}
        </div>

        {/* Détail complet de la faculté sélectionnée */}
        <div className="lg:col-span-2">
          {selectedFaculty ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Header Image & Info */}
              <div className="relative h-48 bg-slate-800">
                <img
                  src={selectedFaculty.imageUrl || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800'}
                  alt={selectedFaculty.name}
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent p-6 flex flex-col justify-end">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
                    {selectedFaculty.university}
                  </span>
                  <h2 className="text-2xl font-black text-white">{selectedFaculty.name}</h2>
                  <div className="flex items-center text-xs text-slate-300 mt-1 space-x-3">
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-red-400" />
                      {selectedFaculty.address || selectedFaculty.governorate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-8">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                    À propos de l'établissement
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedFaculty.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100 text-xs">
                    {selectedFaculty.website && (
                      <a
                        href={selectedFaculty.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-red-600 hover:underline font-semibold"
                      >
                        <Globe className="w-3.5 h-3.5 mr-1" />
                        Site Officiel ({selectedFaculty.shortName})
                      </a>
                    )}
                    {selectedFaculty.contact?.phone && (
                      <span className="inline-flex items-center text-slate-600">
                        <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {selectedFaculty.contact.phone}
                      </span>
                    )}
                    {selectedFaculty.contact?.email && (
                      <span className="inline-flex items-center text-slate-600">
                        <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {selectedFaculty.contact.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Sections & Diplômes */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center">
                    <BookOpen className="w-4 h-4 mr-1.5 text-blue-600" />
                    Sections & Filières Disponibles ({selectedFaculty.sections?.length || 0})
                  </h3>
                  <div className="space-y-3">
                    {selectedFaculty.sections?.map((sec, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 text-sm">{sec.name}</span>
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                              {sec.degree} • {sec.durationYears} ans
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 block mt-0.5">
                            Domaine : {sec.domain} • Code : {sec.code}
                          </span>
                        </div>
                        <Link
                          to="/summer-prep"
                          state={{
                            chosenSection: sec.name,
                            domain: sec.domain,
                            facultyName: selectedFaculty.shortName
                          }}
                          className="inline-flex items-center px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shrink-0"
                        >
                          <Sparkles className="w-3 h-3 mr-1 text-purple-200" />
                          Summer Prep IA
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clubs & Vie associative */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-1.5 text-emerald-600" />
                    Vie Associative & Clubs Étudiants ({selectedFaculty.clubs?.length || 0})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedFaculty.clubs?.map((club, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-slate-900 text-sm">{club.name}</h4>
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                            {club.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {club.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activités & Événements phares */}
                {selectedFaculty.activities?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5 text-amber-600" />
                      Événements Annuels Phares
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFaculty.activities.map((act, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-semibold bg-amber-50 text-amber-800 px-3 py-1 rounded-xl border border-amber-200"
                        >
                          🎉 {act}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
              Sélectionnez une faculté pour afficher sa fiche descriptive.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
