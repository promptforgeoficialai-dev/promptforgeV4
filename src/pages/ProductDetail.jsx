import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { allProducts } from '../data/products';
import { 
  Zap, Star, ShieldCheck, Download, 
  ShoppingCart, ArrowLeft, CheckCircle2, Globe 
} from 'lucide-react';
import StarsCanvas from '../components/canvas/Stars';

const ProductDetail = () => {
  const { id } = useParams();
  const product = allProducts.find((p) => p.id === parseInt(id)) || allProducts[0];

  return (
    <div className="relative z-0 bg-[#020617] min-h-screen pt-32 pb-20 px-6">
      <StarsCanvas />
      
      <div className="max-w-7xl mx-auto">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12 font-bold text-xs uppercase tracking-widest">
          <ArrowLeft size={16} /> Volver al Mercado
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* LADO IZQUIERDO: VISUAL GIGANTE */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-purple-600/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
              <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10">
                <div className="glass px-4 py-2 rounded-2xl flex items-center gap-3 border border-white/20">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Disponible para descarga inmediata</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* LADO DERECHO: DATOS Y COMPRA */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="text-purple-500 font-black text-xs uppercase tracking-[0.3em]">{product.category}</span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
                {product.name}
              </h1>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white">{product.rating}</span>
                </div>
                <div className="text-slate-500 font-medium">•</div>
                <div className="text-slate-400 font-bold text-sm uppercase tracking-widest">{product.sales} Ventas</div>
              </div>
            </div>

            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              {product.description}. Este método ha sido forjado con ingeniería de prompts avanzada para garantizar resultados en entornos de alta demanda.
            </p>

            {/* BENEFICIOS INCLUIDOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8 border-y border-white/5">
              <BenefitItem text="Acceso Permanente" />
              <BenefitItem text="Actualizaciones de por vida" />
              <BenefitItem text="Soporte VIP 24/7" />
              <BenefitItem text="Documentación Técnica" />
            </div>

            <div className="flex items-center gap-8 pt-6">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Precio de acceso</p>
                <p className="text-5xl font-black text-white tracking-tighter">${product.price}</p>
              </div>
              <button className="flex-1 bg-white text-black hover:bg-purple-600 hover:text-white h-20 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-4 group">
                ADQUIRIR MÉTODO <ShoppingCart className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">Pago seguro procesado por Stripe & PayPal</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const BenefitItem = ({ text }) => (
  <div className="flex items-center gap-3">
    <CheckCircle2 size={18} className="text-purple-500" />
    <span className="text-sm font-bold text-slate-300">{text}</span>
  </div>
);

export default ProductDetail;