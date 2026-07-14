import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial } from '@react-three/drei';
import { Lock, Mail, Chrome, ArrowLeft, ShieldCheck, Zap, KeyRound } from 'lucide-react';

const LoginEngine3D = () => (
  <div className="absolute inset-0 z-0 opacity-40">
    <Canvas camera={{ position: [0, 0, 5] }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <Float speed={5} rotationIntensity={2} floatIntensity={2}>
          <Sphere args={[1.5, 64, 64]}>
            <MeshDistortMaterial color="#7C3AED" speed={3} distort={0.4} radius={1} />
          </Sphere>
        </Float>
      </Suspense>
    </Canvas>
  </div>
);

const Login = () => {
  const { loginGoogle, loginEmail, registerEmail, resetPassword } = useAuth();
  const [mode, setMode] = useState('login'); // login, register, forgot
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'login') await loginEmail(email, pass);
      if (mode === 'register') await registerEmail(email, pass);
      if (mode === 'forgot') { await resetPassword(email); alert("Check your email"); return; }
      navigate(from, { replace: true });
    } catch (err) { alert(err.message); }
  };

  const handleGoogle = async () => {
    try { await loginGoogle(); navigate(from, { replace: true }); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-[#000105] text-white flex items-center justify-center px-6 relative overflow-hidden font-sans">
      <LoginEngine3D />
      
      {/* Botón Volver */}
      <button onClick={() => navigate('/')} className="absolute top-10 left-10 flex items-center gap-2 text-slate-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest z-50">
        <ArrowLeft size={16}/> Back_to_Home
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl p-16 rounded-[4rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl relative z-10 text-center"
      >
        <header className="mb-12">
          <div className="w-20 h-20 bg-purple-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-[0_0_40px_rgba(124,58,237,0.4)]">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-5xl font-black tracking-tighter uppercase italic">PromptForge_Auth</h2>
          <p className="text-slate-500 text-sm mt-4 font-medium uppercase tracking-[0.2em]">Secure Session Nucleus</p>
        </header>

        <AnimatePresence mode="wait">
          <motion.form key={mode} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSubmit} className="space-y-6">
            
            {mode === 'login' && (
              <button type="button" onClick={handleGoogle} className="w-full py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-4 hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-95 group">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6 group-hover:rotate-[360deg] transition-all duration-700" alt="google" />
                SIGN_IN_WITH_GOOGLE
              </button>
            )}

            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="email" placeholder="DATABASE_IDENTIFIER (EMAIL)" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/40 border border-white/5 p-6 pl-16 rounded-2xl outline-none focus:border-purple-500 text-sm font-bold transition-all" required />
            </div>

            {mode !== 'forgot' && (
              <div className="relative">
                <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="password" placeholder="SECURE_ACCESS_KEY (PASS)" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-black/40 border border-white/5 p-6 pl-16 rounded-2xl outline-none focus:border-purple-500 text-sm font-bold transition-all" required />
              </div>
            )}

            <button type="submit" className="w-full py-6 bg-purple-600 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:bg-purple-500 transition-all uppercase tracking-[0.3em] text-xs">
              {mode === 'login' ? 'Initiate_Session' : mode === 'register' ? 'Forge_New_Account' : 'Request_Recovery'}
            </button>
          </motion.form>
        </AnimatePresence>

        <footer className="mt-12 flex flex-col gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <div className="flex justify-center gap-6">
            {mode === 'login' ? (
              <>
                <button onClick={() => setMode('register')} className="hover:text-purple-400 transition-colors">Create_Account</button>
                <button onClick={() => setMode('forgot')} className="hover:text-purple-400 transition-colors">Lost_Access?</button>
              </>
            ) : (
              <button onClick={() => setMode('login')} className="hover:text-purple-400 transition-colors">Back_to_Login</button>
            )}
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default Login;