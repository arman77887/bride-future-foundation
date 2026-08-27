import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <nav className="bg-brand-green text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg tracking-wider">
          BFF Portal
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/officers" className="hover:text-brand-gold transition">Officers</Link>
          <Link to="/vacancies" className="hover:text-brand-gold transition">Careers</Link>
          <Link to="/donate" className="hover:text-brand-gold transition">Donate</Link>
          {isAuthenticated ? (
            <button onClick={logout} className="bg-brand-red px-4 py-2 rounded text-sm font-semibold hover:opacity-90">
              Logout
            </button>
          ) : (
            <Link to="/login" className="bg-brand-gold text-gray-900 px-4 py-2 rounded text-sm font-semibold hover:opacity-90">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
