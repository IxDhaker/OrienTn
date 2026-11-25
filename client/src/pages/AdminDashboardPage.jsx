import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getFaculties, createFaculty, updateFaculty, deleteFaculty,
  createOffre, updateOffre, deleteOffre, createClub, updateClub, deleteClub
} from '../services/api';
import Modal, { fieldClass, primaryBtn, ghostBtn } from '../components/Modal';

const emptyFaculty = { nom: '', nomCourt: '', universite: '', gouvernorat: '', adresse: '', latitude: '', longitude: '', description: '' };
const emptyOffre = { nom: '', domaine: '', code: '', diplome: 'Licence', dureeAnnees: 3, annee: new Date().getFullYear(), scoreSeuil: '', capacite: 50 };
const emptyClub = { nom: '', type: 'Club', description: '' };

const Input = ({ label, ...p }) => (
  <label className="block text-sm">
    {label}
    <input className="w-full border rounded p-2 mt-1" {...p} />
  </label>
);

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('faculties');
  const [faculties, setFaculties] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [facForm, setFacForm] = useState(emptyFaculty);
  const [editingId, setEditingId] = useState(null);
  const [offreForm, setOffreForm] = useState(emptyOffre);
  const [clubForm, setClubForm] = useState(emptyClub);
  const [msg, setMsg] = useState('');
  const [scoreModal, setScoreModal] = useState(null);
  const [clubModal, setClubModal] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = async () => {
    const res = await getFaculties();
    const list = res.data || res;
    setFaculties(list);
    if (!selectedId && list[0]) setSelectedId(list[0]._id);
  };
  useEffect(() => { load(); }, []); // eslint-disable-line

  const selected = faculties.find((f) => f._id === selectedId);

  const run = async (fn, okMsg) => {
    try {
      await fn();
      setMsg(okMsg);
      await load();
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.removeItem('adminToken');
        return navigate('/admin/login');
      }
      setMsg('❌ ' + (e.response?.data?.message || e.message));
    }
  };

  const logout = () => { localStorage.removeItem('adminToken'); navigate('/admin/login'); };

  // ----- Facultés -----
  const saveFaculty = (e) => {
    e.preventDefault();
    const payload = { ...facForm, latitude: Number(facForm.latitude), longitude: Number(facForm.longitude) };
    run(async () => {
      if (editingId) await updateFaculty(editingId, payload);
      else await createFaculty(payload);
      setFacForm(emptyFaculty);
      setEditingId(null);
    }, '✅ Faculté enregistrée.');
  };
  const editFaculty = (f) => {
    setEditingId(f._id);
    setFacForm({
      nom: f.nom || '', nomCourt: f.nomCourt || '', universite: f.universite || '', gouvernorat: f.gouvernorat || '',
      adresse: f.adresse || '', latitude: f.latitude ?? '', longitude: f.longitude ?? '', description: f.description || ''
    });
  };

  // ----- Sections -----
  const addOffre = (e) => {
    e.preventDefault();
    const { nom, domaine, code, diplome, dureeAnnees, annee, scoreSeuil, capacite } = offreForm;
    run(async () => {
      await createOffre(selectedId, {
        filiere: { nom, domaine, code, diplome, dureeAnnees: Number(dureeAnnees) },
        annee: Number(annee), scoreSeuil: Number(scoreSeuil), capacite: Number(capacite)
      });
      setOffreForm(emptyOffre);
    }, '✅ Section ajoutée.');
  };
  const editScore = (sec) => setScoreModal({ id: sec._id, name: sec.name, seuil: sec.seuil, capacite: sec.capacity });
  const submitScore = (e) => {
    e.preventDefault();
    const m = scoreModal;
    setScoreModal(null);
    run(() => updateOffre(m.id, { scoreSeuil: Number(m.seuil), capacite: Number(m.capacite), annee: new Date().getFullYear() }), '✅ Score mis à jour.');
  };

  // ----- Clubs -----
  const addClub = (e) => {
    e.preventDefault();
    run(async () => { await createClub(selectedId, clubForm); setClubForm(emptyClub); }, '✅ Club ajouté.');
  };
  const editClub = (c) => setClubModal({ id: c._id, nom: c.name, type: c.category, description: c.description || '' });
  const submitClub = (e) => {
    e.preventDefault();
    const m = clubModal;
    setClubModal(null);
    run(() => updateClub(m.id, { nom: m.nom, type: m.type, description: m.description }), '✅ Club modifié.');
  };

  const confirmDel = (text, fn, ok) => setConfirm({ text, fn, ok });

  const FacultyPicker = () => (
    <select className="border rounded p-2 mb-4" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
      {faculties.map((f) => <option key={f._id} value={f._id}>{f.nom}</option>)}
    </select>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-black">Dashboard Admin</h1>
        <button onClick={logout} className="text-sm underline">Déconnexion</button>
      </div>

      <div className="flex gap-2 mb-4">
        {[['faculties', 'Facultés'], ['sections', 'Sections & scores'], ['clubs', 'Clubs']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-2 rounded-lg font-semibold ${tab === k ? 'bg-red-600 text-white' : 'bg-white border'}`}>{l}</button>
        ))}
      </div>
      {msg && <p className="mb-3 text-sm">{msg}</p>}

      {tab === 'faculties' && (
        <div>
          <form onSubmit={saveFaculty} className="grid grid-cols-2 gap-3 bg-white p-4 rounded-xl shadow mb-6">
            {Object.keys(emptyFaculty).map((k) => (
              <Input key={k} label={k} value={facForm[k]} required={['nom', 'universite', 'gouvernorat', 'latitude', 'longitude'].includes(k)}
                type={['latitude', 'longitude'].includes(k) ? 'number' : 'text'} step="any"
                onChange={(e) => setFacForm({ ...facForm, [k]: e.target.value })} />
            ))}
            <div className="col-span-2 flex gap-2">
              <button className="bg-red-600 text-white px-4 py-2 rounded">{editingId ? 'Modifier' : 'Ajouter'}</button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setFacForm(emptyFaculty); }} className="px-4 py-2 border rounded">Annuler</button>}
            </div>
          </form>
          <table className="w-full bg-white rounded-xl shadow text-sm">
            <thead><tr className="text-left border-b"><th className="p-2">Nom</th><th>Université</th><th>Gouvernorat</th><th></th></tr></thead>
            <tbody>
              {faculties.map((f) => (
                <tr key={f._id} className="border-b">
                  <td className="p-2">{f.nom}</td><td>{f.universite}</td><td>{f.gouvernorat}</td>
                  <td className="space-x-2">
                    <button onClick={() => editFaculty(f)} className="text-blue-600">Modifier</button>
                    <button onClick={() => confirmDel(`Supprimer ${f.nom} ?`, () => deleteFaculty(f._id), '✅ Faculté supprimée.')} className="text-red-600">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'sections' && (
        <div>
          <FacultyPicker />
          <table className="w-full bg-white rounded-xl shadow text-sm mb-6">
            <thead><tr className="text-left border-b"><th className="p-2">Section</th><th>Année</th><th>Score seuil</th><th>Capacité</th><th></th></tr></thead>
            <tbody>
              {(selected?.sections || []).map((s) => (
                <tr key={s._id} className="border-b">
                  <td className="p-2">{s.name}</td><td>{s.year}</td><td>{s.seuil}</td><td>{s.capacity}</td>
                  <td className="space-x-2">
                    <button onClick={() => editScore(s)} className="text-blue-600">Modifier score</button>
                    <button onClick={() => confirmDel(`Supprimer ${s.name} ?`, () => deleteOffre(s._id), '✅ Section supprimée.')} className="text-red-600">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <form onSubmit={addOffre} className="grid grid-cols-2 gap-3 bg-white p-4 rounded-xl shadow">
            {Object.keys(emptyOffre).map((k) => (
              <Input key={k} label={k} value={offreForm[k]} required={['nom', 'domaine', 'scoreSeuil'].includes(k)}
                type={['dureeAnnees', 'annee', 'scoreSeuil', 'capacite'].includes(k) ? 'number' : 'text'} step="any"
                onChange={(e) => setOffreForm({ ...offreForm, [k]: e.target.value })} />
            ))}
            <button className="col-span-2 bg-red-600 text-white px-4 py-2 rounded">Ajouter la section</button>
          </form>
        </div>
      )}

      {tab === 'clubs' && (
        <div>
          <FacultyPicker />
          <ul className="bg-white rounded-xl shadow divide-y mb-6">
            {(selected?.clubs || []).map((c) => (
              <li key={c._id} className="p-3 flex justify-between">
                <span><b>{c.name}</b> <i className="text-slate-500">({c.category})</i> {c.description}</span>
                <span className="space-x-2">
                  <button onClick={() => editClub(c)} className="text-blue-600">Modifier</button>
                  <button onClick={() => confirmDel(`Supprimer ${c.name} ?`, () => deleteClub(c._id), '✅ Club supprimé.')} className="text-red-600">Supprimer</button>
                </span>
              </li>
            ))}
          </ul>
          <form onSubmit={addClub} className="grid grid-cols-2 gap-3 bg-white p-4 rounded-xl shadow">
            {Object.keys(emptyClub).map((k) => (
              <Input key={k} label={k} value={clubForm[k]} required={k !== 'description'}
                onChange={(e) => setClubForm({ ...clubForm, [k]: e.target.value })} />
            ))}
            <button className="col-span-2 bg-red-600 text-white px-4 py-2 rounded">Ajouter le club</button>
          </form>
        </div>
      )}

      {scoreModal && (
        <Modal title="Modifier le score" onClose={() => setScoreModal(null)}>
          <form onSubmit={submitScore} className="space-y-3">
            <p className="text-sm text-slate-500">{scoreModal.name}</p>
            <label className="block text-sm font-medium">Score seuil
              <input type="number" step="any" min="0" max="250" required className={fieldClass} value={scoreModal.seuil}
                onChange={(e) => setScoreModal({ ...scoreModal, seuil: e.target.value })} />
            </label>
            <label className="block text-sm font-medium">Capacité
              <input type="number" min="0" required className={fieldClass} value={scoreModal.capacite}
                onChange={(e) => setScoreModal({ ...scoreModal, capacite: e.target.value })} />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={ghostBtn} onClick={() => setScoreModal(null)}>Annuler</button>
              <button className={primaryBtn}>Enregistrer</button>
            </div>
          </form>
        </Modal>
      )}

      {clubModal && (
        <Modal title="Modifier le club" onClose={() => setClubModal(null)}>
          <form onSubmit={submitClub} className="space-y-3">
            <label className="block text-sm font-medium">Nom
              <input required className={fieldClass} value={clubModal.nom}
                onChange={(e) => setClubModal({ ...clubModal, nom: e.target.value })} />
            </label>
            <label className="block text-sm font-medium">Type
              <input required className={fieldClass} value={clubModal.type}
                onChange={(e) => setClubModal({ ...clubModal, type: e.target.value })} />
            </label>
            <label className="block text-sm font-medium">Description
              <textarea rows="3" className={fieldClass} value={clubModal.description}
                onChange={(e) => setClubModal({ ...clubModal, description: e.target.value })} />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={ghostBtn} onClick={() => setClubModal(null)}>Annuler</button>
              <button className={primaryBtn}>Enregistrer</button>
            </div>
          </form>
        </Modal>
      )}

      {confirm && (
        <Modal title="Confirmation" onClose={() => setConfirm(null)} size="max-w-sm">
          <p className="text-sm text-slate-600 mb-5">{confirm.text}</p>
          <div className="flex justify-end gap-2">
            <button className={ghostBtn} onClick={() => setConfirm(null)}>Annuler</button>
            <button className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700"
              onClick={() => { const c = confirm; setConfirm(null); run(c.fn, c.ok); }}>Supprimer</button>
          </div>
        </Modal>
      )}
    </div>
  );
}