import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Award, Zap, Star, Share2 } from 'lucide-react';
import StarsCanvas from '../components/canvas/Stars';

const Community = () => {
  return (
    <div className="relative z-0 bg-[#020617] min-h-screen pt-32 pb-20 px-6">
      <StarsCanvas />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LADO IZQUIERDO: ESTADÍSTICAS DE COMUNIDAD */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 backdrop-blur-xl">
            <h2 className="text-3xl font-black tracking-tighter mb-6">COMUNIDAD<br/><span className="text-purple-500 italic">ELITE.</span></h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">Conecta con los mejores ingenieros de prompts y expertos en automatización del mundo.</p>
            
            <div className="space-y-4">
              <CommunityStat icon={<Users/>} label="Miembros Activos" value="12,450" />
              <CommunityStat icon={<MessageSquare/>} label="Prompts Compartidos" value="5,800" />
              <CommunityStat icon={<Award/>} label="Expertos Verificados" value="120" />
            </div>
          </div>

          <button className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all">
            UNIRSE AL DISCORD VIP
          </button>
        </div>

        {/* LADO DERECHO: FEED DE ACTIVIDAD */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500 ml-4">Actividad Reciente</h3>
          
          <ActivityItem 
            user="Marc Forge" 
            action="ha forjado un nuevo método de" 
            target="Automatización en Make.com" 
            time="Hace 2 min" 
          />
          <ActivityItem 
            user="Elena IA" 
            action="ha subido su calificación a 5.0 en" 
            target="Midjourney Master Pack" 
            time="Hace 15 min" 
          />
          <ActivityItem 
            user="CryptoDev" 
            action="acaba de unirse a la" 
            target="Comunidad Elite" 
            time="Hace 1 hora" 
          />
        </div>
      </div>
    </div>
  );
};

const CommunityStat = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
    <div className="text-purple-500">{icon}</div>
    <div>
      <div className="text-lg font-black">{value}</div>
      <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{label}</div>
    </div>
  </div>
);

const ActivityItem = ({ user, action, target, time }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 border border-white/10" />
      <div>
        <p className="text-sm text-slate-300">
          <span className="font-black text-white">{user}</span> {action} <span className="text-purple-400 font-bold">{target}</span>
        </p>
        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{time}</span>
      </div>
    </div>
    <Share2 size={18} className="text-slate-700 group-hover:text-white transition-colors cursor-pointer" />
  </motion.div>
);

export default Community;