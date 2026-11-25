import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/api';

export default function AdminLoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await adminLogin(login, password);
      localStorage.setItem('adminToken', res.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion.');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Connexion Admin</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Login" value={login} onChange={(e) => setLogin(e.target.value)} />
        <input className="w-full border rounded p-2" type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full bg-red-600 text-white rounded p-2 font-semibold">Se connecter</button>
      </form>
    </div>
  );
}