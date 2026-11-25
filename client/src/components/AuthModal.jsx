import React, { useState } from 'react';
import Modal, { fieldClass, primaryBtn } from './Modal';
import { useAuth } from '../context/AuthContext';
import { studentLogin, studentRegister } from '../services/api';

const empty = { nom: '', prenom: '', email: '', password: '' };

export default function AuthModal() {
  const { modal, setModal, closeAuth, saveSession } = useAuth();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  if (!modal) return null;
  const isRegister = modal === 'register';
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const switchMode = (m) => {
    setError('');
    setSuccess('');
    setModal(m);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await studentRegister(form);
        // Pas de connexion automatique : on renvoie vers le formulaire de connexion
        setForm({ ...empty, email: form.email });
        setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        setModal('login');
      } else {
        const res = await studentLogin(form.email, form.password);
        saveSession(res.token, res.user);
        setForm(empty);
        setSuccess('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={isRegister ? 'Créer un compte bachelier' : 'Connexion'} onClose={() => { setSuccess(''); closeAuth(); }}>
      <form onSubmit={submit} className="space-y-3">
        {isRegister && (
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-medium text-slate-700">
              Prénom
              <input className={fieldClass} value={form.prenom} onChange={set('prenom')} required />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Nom
              <input className={fieldClass} value={form.nom} onChange={set('nom')} required />
            </label>
          </div>
        )}
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input type="email" className={fieldClass} value={form.email} onChange={set('email')} required />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Mot de passe
          <input type="password" minLength={6} className={fieldClass} value={form.password} onChange={set('password')} required />
        </label>
        {success && <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{success}</p>}
        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
        <button disabled={loading} className={`${primaryBtn} w-full`}>
          {loading ? '...' : isRegister ? "S'inscrire" : 'Se connecter'}
        </button>
        <p className="text-sm text-center text-slate-500">
          {isRegister ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
          <button type="button" className="text-red-600 font-semibold hover:underline" onClick={() => switchMode(isRegister ? 'login' : 'register')}>
            {isRegister ? 'Se connecter' : "S'inscrire"}
          </button>
        </p>
      </form>
    </Modal>
  );
}
