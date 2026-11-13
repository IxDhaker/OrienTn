import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ExternalLink, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

// Correction des icônes Leaflet sous Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Icône personnalisée rouge tunisien pour les universités
const customUniversityIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function TunisiaMap({ faculties = [], selectedFacultyId = null }) {
  // Centre de la Tunisie
  const tunisiaCenter = [35.5, 9.8];

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg border border-slate-200">
      <MapContainer
        center={tunisiaCenter}
        zoom={7}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {faculties.map((fac) => {
          if (!fac.location || !fac.location.lat || !fac.location.lng) return null;

          return (
            <Marker
              key={fac._id || fac.shortName}
              position={[fac.location.lat, fac.location.lng]}
              icon={customUniversityIcon}
            >
              <Popup className="orientn-popup">
                <div className="p-1 max-w-[240px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-red-600 text-sm">{fac.shortName}</span>
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                      {fac.governorate}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 text-xs leading-snug mb-2">
                    {fac.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                    {fac.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-600 flex items-center">
                      <Users className="w-3 h-3 mr-1 text-slate-400" />
                      {fac.clubs?.length || 0} clubs
                    </span>
                    <Link
                      to={`/faculties?id=${fac._id || fac.shortName}`}
                      className="font-medium text-red-600 hover:text-red-700 flex items-center"
                    >
                      Détails <ExternalLink className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
