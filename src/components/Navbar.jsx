import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAdmin } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-[100] bg-[#020617]/60 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-gradient-to-tr from-purple-600 to-cyan-400 rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.3)] group-hover:rotate-12 transition-transform" />
          <span className="text-xl font-black tracking-tighter text-white uppercase">PROMFORGE</span>
        </Link>

        <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
          <Link to="/" className="hover:text-white transition">Inicio</Link>
          <Link to="/marketplace" className="hover:text-white transition">Marketplace</Link>
          <Link to="/comunidad" className="hover:text-white transition">Comunidad</Link>
          {isAdmin && <Link to="/admin" className="text-purple-400 hover:text-purple-300 transition">Admin</Link>}
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-white"><ShoppingBag size={20}/></button>
          {user ? (
            <Link to="/dashboard" className="w-10 h-10 rounded-full border-2 border-purple-500 overflow-hidden">
              <img src={user.photoURL} alt="avatar" />
            </Link>
          ) : (
            <Link to="/login" className="bg-white text-black px-6 py-2 rounded-full text-xs font-black hover:bg-purple-500 hover:text-white transition-all shadow-xl shadow-white/5">ACCESO VIP</Link>
          )}
        </div>
      </div>
    </nav>
  );
}