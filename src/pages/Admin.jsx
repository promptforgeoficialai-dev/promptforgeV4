import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingUp, Users, ShoppingCart, 
  Plus, Edit, Trash2, DollarSign, 
  LayoutDashboard, Package, ArrowUpRight 
} from 'lucide-react';

const Admin = () => {
  const { isAdmin, user } = useAuth();
  
  if (!isAdmin) return (
    <div className="h-screen flex items-center justify-center bg-[#020617] text-white">
      <h1 className="text-2xl font-bold">Acceso Denegado. Solo Forjadores Maestros.</h1>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER ADMIN */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">CENTRO DE MANDO</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Administración Global de PromptForge</p>
          </div>
          <button className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all">
            <Plus size={16}/> NUEVO PRODUCTO
          </button>
        </header>

        {/* STATS DE INGRESOS (DISEÑO PREMIUM) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AdminStat label="Ingresos Totales" value="$12,450" grow="+14%" icon={<DollarSign/>}/>
          <AdminStat label="Ventas Hoy" value="48" grow="+5%" icon={<ShoppingCart/>}/>
          <AdminStat label="Usuarios Nuevos" value="156" grow="+22%" icon={<Users/>}/>
          <AdminStat label="Productos Activos" value="44" grow="Stable" icon={<Package/>}/>
        </div>

        {/* GESTIÓN DE PRODUCTOS */}
        <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl">
          <h3 className="text-xl font-bold mb-8">INVENTARIO RECIENTE</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                  <th className="pb-4 px-4">Producto</th>
                  <th className="pb-4 px-4">Categoría</th>
                  <th className="pb-4 px-4">Precio</th>
                  <th className="pb-4 px-4">Ventas</th>
                  <th className="pb-4 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[1,2,3,4,5].map((i) => (
                  <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-white/10" />
                        <span className="font-bold text-sm">Método IA #00{i}</span>
                      </div>
                    </td>
                    <td className="py-6 px-4 text-slate-400 text-xs font-medium">Prompts IA</td>
                    <td className="py-6 px-4 font-black text-sm text-purple-400">$49.00</td>
                    <td className="py-6 px-4 font-bold text-sm">1,240</td>
                    <td className="py-6 px-4">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 hover:text-cyan-400 transition-colors"><Edit size={18}/></button>
                        <button className="p-2 hover:text-red-400 transition-colors"><Trash2 size={18}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminStat = ({ label, value, grow, icon }) => (
  <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 rounded-xl bg-purple-600/10 text-purple-400">{icon}</div>
      <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${grow.includes('+') ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'}`}>
        {grow}
      </span>
    </div>
    <div className="text-3xl font-black mb-1">{value}</div>
    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{label}</p>
  </div>
);

export default Admin;