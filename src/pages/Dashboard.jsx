import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Layout, ShoppingCart, Download, Star, 
  Settings, LogOut, Zap, Clock 
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR (3 Columnas) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 backdrop-blur-md">
            <img src={user.photoURL} className="w-20 h-20 rounded-2xl mb-6 border-2 border-purple-500/30" alt="avatar" />
            <h3 className="font-black text-xl tracking-tighter line-clamp-1">{user.displayName}</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">Forjador Élite</p>
            
            <nav className="space-y-2">
              <SidebarLink icon={<Layout size={18}/>} label="Panel" active />
              <SidebarLink icon={<ShoppingCart size={18}/>} label="Mis Compras" />
              <SidebarLink icon={<Star size={18}/>} label="Favoritos" />
              <SidebarLink icon={<Settings size={18}/>} label="Ajustes" />
              <button onClick={logout} className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm">
                <LogOut size={18}/> Salir
              </button>
            </nav>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL (9 Columnas) */}
        <main className="lg:col-span-9 space-y-8">
          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Recursos Activos" value="12" icon={<Zap className="text-yellow-400"/>} />
            <StatCard label="Inversión Total" value="$245" icon={<ShoppingCart className="text-purple-400"/>} />
            <StatCard label="Tiempo Ahorrado" value="140h" icon={<Clock className="text-cyan-400"/>} />
          </div>

          {/* LISTA DE DESCARGAS */}
          <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-md">
            <h3 className="text-2xl font-black mb-8 tracking-tighter">ÚLTIMAS ADQUISICIONES</h3>
            <div className="space-y-4">
              <DownloadItem name="GPT-4 Business Architect" type="Master Prompt" date="10 Julio 2024" />
              <DownloadItem name="Midjourney Cinematic V6" type="Asset Pack" date="08 Julio 2024" />
              <DownloadItem name="Auto-Content Machine" type="Workflow" date="05 Julio 2024" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, label, active }) => (
  <button className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm ${active ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
    {icon} {label}
  </button>
);

const StatCard = ({ label, value, icon }) => (
  <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl bg-white/5">{icon}</div>
    </div>
    <div className="text-4xl font-black tracking-tighter mb-1">{value}</div>
    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</div>
  </div>
);

const DownloadItem = ({ name, type, date }) => (
  <div className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all group">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5 text-purple-400 group-hover:scale-110 transition-transform">
        <Download size={20} />
      </div>
      <div>
        <h4 className="font-bold text-sm">{name}</h4>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{type} • {date}</p>
      </div>
    </div>
    <button className="px-6 py-2 bg-white text-black rounded-xl text-[10px] font-black hover:bg-purple-500 hover:text-white transition-all uppercase tracking-widest">
      Descargar
    </button>
  </div>
);

export default Dashboard;