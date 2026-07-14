import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allProducts } from '../data/products';
import { Search, ShoppingCart, SlidersHorizontal, Sparkles } from 'lucide-react';
import StarsCanvas from '../components/canvas/Stars';

const Marketplace = () => {
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  const categories = ['Todos', 'Prompts IA', 'Automatización', 'Diseño', 'Cursos', 'Programación'];

  const filteredProducts = allProducts.filter(p => 
    (category === 'Todos' || p.category === category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="relative z-0 bg-[#020617] min-h-screen pt-32 pb-20">
      <StarsCanvas />
      
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-4">FORJA<br/><span className="text-purple-600 italic">MARKET.</span></h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Librería Premium — 44 Recursos Disponibles</p>
          </div>
          
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Buscar inteligencia..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 p-5 pl-14 rounded-3xl outline-none focus:border-purple-500 transition-all text-white font-bold backdrop-blur-md" 
            />
          </div>
        </header>

        {/* Filtros Horizontales */}
        <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${category === cat ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID DE PRODUCTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredProducts.map((p, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: (index % 8) * 0.05 }}
                key={p.id}
                className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 hover:border-purple-500/50 hover:bg-white/[0.04] transition-all"
              >
                <div className="relative h-52 mb-6 overflow-hidden rounded-[2rem] border border-white/5">
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={p.name} />
                  <div className="absolute bottom-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                    {p.category}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{p.name}</h3>
                <p className="text-slate-500 text-xs mb-8 line-clamp-2 leading-relaxed font-medium">{p.description}</p>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Inversión</div>
                    <div className="text-2xl font-black text-white">${p.price}</div>
                  </div>
                  <button className="bg-white text-black p-4 rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-90">
                    <ShoppingCart size={22} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;