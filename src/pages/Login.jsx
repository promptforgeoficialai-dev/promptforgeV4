import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StarsCanvas from '../components/canvas/Stars';
import { LogIn, ShieldCheck, Chrome } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login();
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative z-0 bg-[#020617] min-h-screen flex items-center justify-center px-6">
      <StarsCanvas />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-12 rounded-[3rem] bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-cyan-400 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <ShieldCheck size={40} className="text-white" />
        </div>

        <h2 className="text-4xl font-black tracking-tighter text-white mb-4 text-gradient">BIENVENIDO</h2>
        <p className="text-slate-400 font-medium mb-10">Ingresa a la forja para gestionar tus métodos y herramientas de IA.</p>

        <button 
          onClick={handleLogin}
          className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-4 hover:bg-purple-500 hover:text-white transition-all duration-500 active:scale-95 shadow-xl group"
        >
          <Chrome size={20} className="group-hover:rotate-[360deg] transition-transform duration-700" />
          CONTINUAR CON GOOGLE
        </button>

        <div className="mt-10 pt-10 border-t border-white/5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Encriptación de grado militar SSL</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;