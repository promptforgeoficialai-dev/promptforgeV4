import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ChevronRight, Rocket, ShieldCheck, Target, Crown, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="relative z-0 bg-[#020617] min-h-screen overflow-hidden">
      
      {/* CAPA DE ILUMINACIÓN CINEMATOGRÁFICA */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-purple-600/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      {/* SECCIÓN HERO (ESTILO APPLE / OPENAI) */}
      <section className="relative pt-44 pb-32 px-6 flex flex-col items-center text-center">
        
        {/* Badge Flotante V4 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl px-5 py-2 rounded-full mb-12 flex items-center gap-3 border border-white/10 shadow-[0_0_30px_rgba(124,58,237,0.2)]"
        >
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">
            PROMPTFORGE V4 • THE FUTURE OF AI
          </span>
        </motion.div>

        {/* Título Monumental */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-9xl lg:text-[140px] font-extrabold tracking-tighter leading-[0.8] text-white mb-12"
        >
          FORJA TU <br />
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent italic pr-4">
            IMPERIO.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto text-slate-400 text-lg md:text-2xl font-medium mb-16 leading-relaxed"
        >
          La forja definitiva de recursos digitales. Prompts de élite, automatizaciones y sistemas IA diseñados para dominar el mercado.
        </motion.p>

        {/* Botones Estilo Linear */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 mb-24"
        >
          <button className="bg-white text-black font-black px-12 py-5 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:bg-purple-600 hover:text-white transition-all duration-500 flex items-center gap-3 active:scale-95 uppercase text-xs tracking-widest">
            EXPLORAR MARKETPLACE <ArrowRight size={18} />
          </button>
          <button className="bg-white/5 border border-white/10 backdrop-blur-md text-white font-black px-12 py-5 rounded-2xl hover:bg-white/10 transition-all active:scale-95 uppercase text-xs tracking-widest">
            ACCESO VIP
          </button>
        </motion.div>

        {/* Visual de "Logos de Tecnología" */}
        <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale">
          <span className="font-black text-xl tracking-widest uppercase">OpenAI</span>
          <span className="font-black text-xl tracking-widest uppercase">Midjourney</span>
          <span className="font-black text-xl tracking-widest uppercase">Claude</span>
          <span className="font-black text-xl tracking-widest uppercase">Vercel</span>
        </div>
      </section>

      {/* SECCIÓN DE MÉTODOS (GLASSMORPHISM BENTO GRID) */}
      <section className="relative py-32 bg-white/[0.01] border-y border-white/5 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="text-left">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 italic uppercase">Nuestra Forja</h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-xs">Ingeniería de vanguardia</p>
            </div>
            <div className="h-[1px] flex-1 bg-white/10 hidden md:block mx-12 mb-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={<Zap/>} title="Prompts Premium" desc="Optimización avanzada para GPT-4o y Claude 3.5 Sonnet." />
            <FeatureCard icon={<ShieldCheck/>} title="Sistemas Seguros" desc="Estructuras de automatización de grado empresarial." />
            <FeatureCard icon={<Rocket/>} title="Escalabilidad" desc="Métodos diseñados para multiplicar tus ingresos x10." />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-purple-500/50 hover:bg-white/[0.04] transition-all duration-700 group cursor-default shadow-2xl">
    <div className="w-14 h-14 rounded-2xl bg-[#020617] border border-white/5 flex items-center justify-center mb-8 text-purple-400 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-inner">
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);

export default Home;