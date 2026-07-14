import React, { Suspense, useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Preload, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Sparkles, Zap, ShieldCheck, ArrowRight, ShoppingCart, Search, 
  Layout, User, LogOut, Crown, Star, Download, ChevronRight, 
  Lock, Rocket, Globe, Radar, Activity, Target, Radio, Cpu, 
  Library, Box, Share2, Layers, Terminal, MousePointer2, Mail, Heart, FileText, Settings, Eye, KeyRound
} from 'lucide-react';
import { 
  FaInstagram, FaTiktok, FaTwitter, FaDiscord, 
  FaYoutube, FaGithub, FaTelegramPlane, FaWhatsapp, FaLinkedinIn 
} from "react-icons/fa";

// CONTEXTO Y FIREBASE
import { AuthProvider, useAuth } from './context/AuthContext';
import { db } from './firebase/config';
import { collection, onSnapshot, query, orderBy, doc, setDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { allProducts } from './data/products';

// --- [ 1. EL MOTOR ESPACIAL INTERACTIVO ] ---

function StarField({ speed = 0.05 }) {
  const ref = useRef();
  const [positions] = useState(() => {
    const p = new Float32Array(20000 * 3);
    for (let i = 0; i < 20000; i++) p[i] = (Math.random() - 0.5) * 20;
    return p;
  });
  useFrame((state, delta) => {
    ref.current.position.z += delta * speed * 30;
    if (ref.current.position.z > 10) ref.current.position.z = 0;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.mouse.y * 0.2, 0.05);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, state.mouse.x * 0.2, 0.05);
  });
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#ffffff" size={0.006} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

const SpacePortal = ({ isWarping }) => (
  <div className="fixed inset-0 z-0 bg-[#000105]">
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Suspense fallback={null}><StarField speed={isWarping ? 5 : 0.08} /></Suspense>
    </Canvas>
  </div>
);

// --- [ 2. MOTOR 3D PARA LOGIN (EL PORTAL) ] ---
const LoginEngine3D = () => (
  <div className="absolute inset-0 z-0 opacity-30">
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

// --- [ 3. VISTAS DE LA APLICACIÓN ] ---

const HomeView = ({ onAction }) => {
  const navigate = useNavigate();
  return (
    <div className="relative">
      <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10">
          <div className="glass-morphism px-8 py-3 rounded-full mb-12 border border-purple-500/30 text-purple-400 text-[10px] font-black uppercase tracking-[0.8em] animate-pulse">
            Quantum_Core_v4.0
          </div>
          <h1 className="text-8xl md:text-[220px] font-black tracking-tighter leading-[0.8] text-white italic mb-16 select-none">
            FORJA TU <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-white to-cyan-400">IMPERIO.</span>
          </h1>
          <button 
            onClick={() => { onAction(true); setTimeout(() => { navigate('/marketplace'); onAction(false); }, 1000); }}
            className="bg-white text-black font-black px-20 py-8 rounded-full shadow-[0_0_80px_rgba(255,255,255,0.2)] hover:bg-purple-600 hover:text-white transition-all duration-700 uppercase text-xs tracking-[0.5em] active:scale-90"
          >
            ACTIVAR_MOTOR_DE_MERCADO
          </button>
        </motion.div>
      </section>
    </div>
  );
};

const MarketplaceView = () => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "product"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
  }, []);

  const handleBuy = async (p) => {
    if(!user) return navigate('/login');
    await setDoc(doc(db, "users", user.uid), { purchases: arrayUnion({...p, purchasedAt: new Date().toISOString()})}, {merge: true});
    alert("ADQUISICIÓN COMPLETADA");
  };

  return (
    <div className="pt-40 pb-40 px-10 relative z-10 max-w-7xl mx-auto min-h-screen">
      <header className="mb-24 space-y-12">
        <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter italic uppercase leading-none">Market_<span className="text-purple-600">Archive.</span></h2>
        <div className="relative max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={24} />
          <input type="text" placeholder="ACCESS_NUCLEUS_DATA..." className="w-full bg-white/[0.03] border border-white/10 p-8 pl-16 rounded-[2.5rem] outline-none focus:border-purple-500 text-white font-black text-xl backdrop-blur-3xl transition-all" onChange={(e) => setSearch(e.target.value)} />
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).map((p) => (
          <motion.div key={p.id} whileHover={{ y: -10 }} className="p-8 rounded-[3.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-2xl hover:border-purple-500/50 transition-all group">
            <img src={p.image} className="h-64 w-full object-cover rounded-[2.5rem] mb-8" alt="p" />
            <h3 className="font-black text-white text-xl mb-4 italic uppercase">{p.name}</h3>
            <div className="flex justify-between items-center border-t border-white/5 pt-6">
              <span className="text-3xl font-black text-purple-400">${p.price}</span>
              <button onClick={() => handleBuy(p)} className="bg-white text-black p-4 rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-90"><ShoppingCart size={22}/></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- [ NUEVO: LOGIN VIEW PROFESIONAL ] ---
const LoginView = () => {
  const { login, loginEmail, registerEmail, resetPassword, user } = useAuth();
  const [mode, setMode] = useState('login'); // login, register, forgot
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/dashboard'); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'login') await loginEmail(email, pass);
      if (mode === 'register') await registerEmail(email, pass);
      if (mode === 'forgot') { await resetPassword(email); alert("Correo enviado"); return; }
      navigate('/dashboard');
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <LoginEngine3D />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl p-16 rounded-[4rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl relative z-10 text-center">
        <header className="mb-12">
          <div className="w-20 h-20 bg-purple-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-[0_0_40px_rgba(124,58,237,0.4)]">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h2 className="text-5xl font-black tracking-tighter uppercase italic text-white">Nucleus_Auth</h2>
          <p className="text-slate-500 text-sm mt-4 font-bold uppercase tracking-[0.2em]">Secure Session Initiate</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'login' && (
            <button type="button" onClick={login} className="w-full py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-4 hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-95 group">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6 group-hover:rotate-[360deg] transition-all duration-700" alt="google" />
              CONTINUAR CON GOOGLE
            </button>
          )}

          <div className="relative">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="email" placeholder="IDENTIFIER_EMAIL" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/40 border border-white/5 p-6 pl-16 rounded-2xl outline-none focus:border-purple-500 text-white font-bold" required />
          </div>

          {mode !== 'forgot' && (
            <div className="relative">
              <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="password" placeholder="ACCESS_KEY" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-black/40 border border-white/5 p-6 pl-16 rounded-2xl outline-none focus:border-purple-500 text-white font-bold" required />
            </div>
          )}

          <button type="submit" className="w-full py-6 bg-purple-600 text-white font-black rounded-2xl shadow-xl hover:bg-purple-500 transition-all uppercase tracking-widest text-xs">
            {mode === 'login' ? 'Iniciar Sesión' : mode === 'register' ? 'Crear Cuenta' : 'Recuperar'}
          </button>
        </form>

        <div className="mt-10 flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
           <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="hover:text-white transition-colors">{mode === 'login' ? 'Crear Cuenta' : 'Ya tengo cuenta'}</button>
           {mode === 'login' && <button onClick={() => setMode('forgot')} className="hover:text-white transition-colors">¿Olvidaste la clave?</button>}
        </div>
      </motion.div>
    </div>
  );
};

// --- [ 4. ESTRUCTURA APP PRINCIPAL ] ---

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  const [isWarping, setIsWarping] = useState(false);
  const { user, isAdmin, logout } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#000105] text-white selection:bg-cyan-500/40 overflow-x-hidden font-sans relative">
          <SpacePortal isWarping={isWarping} />
          
          <nav className="fixed top-0 w-full z-[100] h-24 flex items-center px-10 border-b border-white/5 backdrop-blur-xl bg-black/10">
            <div className="max-w-[1800px] mx-auto w-full flex justify-between items-center text-white">
              <Link to="/" className="text-2xl font-black italic tracking-tighter flex items-center gap-4 uppercase"><div className="w-8 h-8 bg-purple-600 rounded-xl" />PromptForge</Link>
              <div className="hidden md:flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                <Link to="/" className="hover:text-white transition-all">Home</Link>
                <Link to="/marketplace" className="hover:text-purple-400 transition-all">Market</Link>
                <Link to="/biblioteca" className="hover:text-cyan-400 transition-all">Bóveda</Link>
              </div>
              <div className="flex items-center gap-6">
                {user ? (
                  <Link to="/dashboard" className="w-14 h-14 rounded-3xl border-2 border-purple-500 overflow-hidden hover:scale-110 transition-transform"><img src={user.photoURL} alt="p" /></Link>
                ) : (
                  <Link to="/login" className="bg-white text-black px-10 py-3 rounded-full text-[10px] font-black hover:bg-purple-600 hover:text-white transition-all shadow-2xl">VIP</Link>
                )}
              </div>
            </div>
          </nav>

          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeView onAction={setIsWarping} />} />
              <Route path="/marketplace" element={<MarketplaceView />} />
              <Route path="/login" element={<LoginView />} />
              <Route path="/biblioteca" element={<PrivateRoute><div className="pt-40 text-center text-7xl font-black">BIBLIOTECA</div></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><div className="pt-40 text-center text-7xl font-black italic">DASHBOARD_SYNC</div></PrivateRoute>} />
            </Routes>
          </AnimatePresence>

          <footer className="py-40 border-t border-white/5 text-center relative z-10 bg-black/40">
            <div className="text-9xl md:text-[300px] font-black tracking-tighter mb-8 italic text-slate-900 select-none uppercase opacity-10">PromptForge</div>
            <p className="text-slate-800 text-[12px] font-bold uppercase tracking-[2em]">Supreme Technology Platform</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}