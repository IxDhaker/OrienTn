import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Lien identique à <Link>, mais ouvre le popup d'authentification si l'utilisateur n'est pas connecté. */
export default function GuardedLink({ onClick, ...props }) {
  const { user, openAuth } = useAuth();

  const handleClick = (e) => {
    if (!user) {
      e.preventDefault();
      openAuth('login');
      return;
    }
    onClick?.(e);
  };

  return <Link {...props} onClick={handleClick} />;
}
