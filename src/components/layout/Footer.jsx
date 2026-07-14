import React from 'react';
import { ShieldCheck, Mail, Globe, Github } from 'lucide-react';

// Exportamos al principio para máxima compatibilidad
export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#010413] border-t border-white/5 pt-32 pb-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
          
          <div className="space-y-6">
            <div className="text-3xl font-black tracking-tighter italic text-white uppercase">PROMFORGE</div>
            <p className="text-slate-500 text-sm font-medium leading-loose">
              Elevando el estándar de la productividad humana mediante el forjado de herramientas inteligentes.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500">Legal</h4>
            <ul className="space-y-4 text-slate-400 font-bold text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Privacidad</li>
              <li className="hover:text-white cursor-pointer transition-colors">Términos</li>
            </ul>
          </div>

          <div className="space-y-6 text-slate-500">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500">Soporte</h4>
            <div className="flex gap-4">
               <Mail size={20} className="hover:text-white cursor-pointer" />
               <Globe size={20} className="hover:text-white cursor-pointer" />
               <Github size={20} className="hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">
            © 2024 PROMPTFORGE OFFICIAL — FORJANDO EL FUTURO.
          </p>
        </div>
      </div>
    </footer>
  );
}