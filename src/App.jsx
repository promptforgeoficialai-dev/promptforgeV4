import React, { Suspense, useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Sparkles, Zap, ShieldCheck, ArrowRight, ShoppingCart, Search, 
  User, LogOut, Crown, Star, Download, ChevronRight, 
  Lock, Rocket, Globe, Radar, Activity, Target, Radio, Cpu, 
  Library, Box, Eye, Mail, Heart, FileText, Settings, Wifi, Binary, Gauge, Terminal, MousePointer2
} from 'lucide-react';
import { 
  FaInstagram, FaTiktok, FaTwitter, FaDiscord, 
  FaYoutube, FaGithub, FaTelegramPlane, FaWhatsapp, FaLinkedinIn 
} from "react-icons/fa";

// CONTEXTO Y FIREBASE
import { AuthProvider, useAuth } from './context/AuthContext';
import { db } from './firebase/config';
import { collection, onSnapshot, query, orderBy, doc, setDoc, arrayUnion } from 'firebase/firestore';

// --- [ 1. MOTOR ESPACIAL 3D SUPREMO ] ---

function StarField({ speed = 0.05 }) {
  const ref = useRef();
  const [positions] = useState(() => {
    const p = new Float32Array(25000 * 3);
    for (let i = 0; i < 25000; i++) p[i] = (Math.random() - 0.5) * 20;
    return p;
  });

  useFrame((state, delta) => {
    ref.current.position.z += delta * speed * 30;
    if (ref.current.position.z > 10) ref.current.position.z = 0;
    // Movimiento con el mouse para dar PROFUNDIDAD real
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.mouse.y * 0.3, 0.05);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, state.mouse.x * 0.3, 0.05);
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#ffffff" size={0.008} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

const SpacePortal = ({ isWarping }) => (
  <div className="fixed inset-0 z-0 bg-[#000105]">
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Suspense fallback={null}>
        <StarField speed={isWarping ? 5 : 0.08} />
      </Suspense>
    </Canvas>
    {/* Capa de atmósfera y profundidad */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000105_100%)] opacity-80" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
  </div>
);

// --- [ 2. COMPONENTES HUD (NO MÁS ESPACIOS POBRES) ] ---

const HUD_Layer = () => (
  <div className="fixed inset-0 pointer-events-none z-50 hidden xl:block p-10 font-black italic">
    {/* Marcos Dinámicos */}
    <div className="absolute top-10 left-10 w-40 h-40 border-t-4 border-l-4 border-purple-500/20 rounded-tl-[4rem] animate-pulse" />
    <div className="absolute top-10 right-10 w-40 h-40 border-t-4 border-r-4 border-purple-500/20 rounded-tr-[4rem] animate-pulse" />
    
    {/* Telemetría Izquierda */}
    <div className="absolute top-1/3 left-10 space-y-8">
       <div className="flex flex-col gap-2">
          <span className="text-[7px] tracking-[0.6em] text-slate-600 uppercase font-black">Core_Logic_Sync</span>
          <div className="flex items-center gap-4 text-cyan-400">
             <Cpu size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
             <span className="text-xs">SYSTEM_STABLE_V4</span>
          </div>
       </div>
       <div className="h-[200px] w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </div>

    {/* Telemetría Derecha (Radares) */}
    <div className="absolute top-1/3 right-10 space-y-12 text-right">
       <div className="space-y-4">
          <Radar className="text-purple-600 animate-spin ml-auto" size={30} />
          <p className="text-[7px] tracking-[0.4em] text-slate-500">SCANNING_DATA_FLOW</p>
       </div>
       <div className="space-y-2">
          <div className="text-[9px] text-green-500">LIVE_TRAFFIC: 12,450 MB/S</div>
          <div className="text-[9px] text-purple-400">USERS_ONLINE: 523</div>
       </div>
    </div>
  </div>
);

// --- [ 3. VISTA HOME: EL CENTRO DE MANDO ] ---

const HomeView = ({ onWarp }) => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen">
      <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative z-10">
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
           <h1 className="text-8xl md:text-[260px] font-black tracking-tighter leading-[0.75] text-white italic mb-16 select-none uppercase">
            FORJA TU <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-white to-cyan-400 pr-12">IMPERIO.</span>
          </h1>
          
          {/* REDES SOCIALES PREMIUM EN HOME */}
          <div className="flex flex-wrap justify-center gap-6 mb-20">
            <SocialBtn icon={<FaInstagram/>} label="IG" link="#" color="hover:border-pink-500 hover:text-pink-500" />
            <SocialBtn icon={<FaTiktok/>} label="TK" link="#" color="hover:border-white hover:text-white" />
            <SocialBtn icon={<FaDiscord/>} label="DC" link="#" color="hover:border-indigo-500 hover:text-indigo-500" />
            <SocialBtn icon={<FaTwitter/>} label="X" link="#" color="hover:border-cyan-400 hover:text-cyan-400" />
            <SocialBtn icon={<FaGithub/>} label="GH" link="#" color="hover:border-purple-400 hover:text-purple-400" />
          </div>

          <button 
            onClick={() => { onWarp(true); setTimeout(() => { navigate('/marketplace'); onWarp(false); }, 1000); }}
            className="bg-white text-black font-black px-24 py-10 rounded-[3rem] shadow-[0_0_100px_rgba(255,255,255,0.2)] hover:bg-purple-600 hover:text-white transition-all duration-700 uppercase text-xs tracking-[1em] active:scale-95"
          >
            ENGAGE_MARKET_ACCESS
          </button>
        </motion.div>
      </section>
    </div>
  );
};

const SocialBtn = ({ icon, label, link, color }) => (
  <motion.a href={link} target="_blank" whileHover={{ y: -10, scale: 1.1 }} className={`w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-2xl flex flex-col items-center justify-center gap-2 transition-all duration-500 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
  </motion.a>
);

// --- [ 4. LOGIN: PORTAL DE ACCESO PREMIUM ] ---

const LoginPortal = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (user) navigate('/dashboard'); }, [user]);

  return (
    <div className="h-screen flex items-center justify-center relative z-50 px-6 text-white overflow-hidden">
      {/* Efecto de luz exclusivo de Login */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" />
      
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl p-24 rounded-[6rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl text-center shadow-2xl relative overflow-hidden">
        {/* Haz de luz animado */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan" />
        
        <div className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-3xl mx-auto mb-16 flex items-center justify-center shadow-2xl ring-2 ring-white/10"><Lock size={40} className="text-white"/></div>
        <h2 className="text-7xl font-black italic uppercase mb-6 tracking-tighter">Secure_Access</h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.5em] mb-20">PromptForge_Authentication_Node</p>
        
        <button onClick={login} className="w-full py-10 bg-white text-black font-black rounded-full shadow-[0_0_60px_rgba(255,255,255,0.1)] hover:bg-purple-600 hover:text-white transition-all active:scale-95 group uppercase tracking-[1em] text-xs">
           Authorize_Identity
        </button>
        
        <p className="mt-16 text-[8px] font-black text-slate-700 uppercase tracking-[1em]">Cifrado de grado militar activo</p>
      </motion.div>
    </div>
  );
};

// --- [ 5. BIBLIOTECA: LA BÓVEDA CON BUSCADOR ] ---

const LibraryView = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState('');
  useEffect(() => { if (user) return onSnapshot(doc(db, "users", user.uid), (d) => setPurchases(d.data()?.purchases || [])); }, [user]);

  return (
    <div className="pt-44 pb-40 px-10 relative z-10 max-w-7xl mx-auto min-h-screen">
      <header className="mb-24 space-y-16">
        <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-none text-white text-center md:text-left">Mi_<span className="text-purple-500 font-black">Bóveda.</span></h2>
        {/* BUSCADOR DE BIBLIOTECA */}
        <div className="relative max-w-2xl mx-auto md:mx-0 group">
           <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-purple-400 transition-colors" size={28} />
           <input 
            type="text" 
            placeholder="ACCESS_SECURE_LIBRARY..." 
            className="w-full bg-white/[0.03] border border-white/10 p-10 pl-24 rounded-[3rem] outline-none focus:border-purple-500 text-white font-black text-2xl backdrop-blur-3xl transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {purchases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {purchases.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).map((p, i) => (
            <motion.div key={i} whileHover={{ y: -10 }} className="p-10 rounded-[4rem] bg-slate-900/60 border border-white/5 flex items-center justify-between group hover:border-purple-500/50 transition-all shadow-2xl backdrop-blur-xl">
              <div className="flex gap-8 items-center text-white">
                <img src={p.image} className="w-24 h-24 rounded-3xl object-cover shadow-2xl border border-white/10" alt="p" />
                <div>
                  <h4 className="font-black text-2xl uppercase tracking-tighter">{p.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">Ready_for_deployment</p>
                </div>
              </div>
              <button onClick={() => p.downloadUrl ? window.open(p.downloadUrl) : alert("Sin link.")} className="p-8 bg-white/5 hover:bg-purple-600 rounded-3xl transition-all shadow-xl text-white"><Download size={32}/></button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="p-32 rounded-[5rem] bg-white/[0.01] border border-white/5 border-dashed text-center opacity-20"><Box className="mx-auto mb-10" size={100} /><p className="font-black uppercase tracking-[1em] text-3xl italic">Vault_Empty</p></div>
      )}
    </div>
  );
};

// --- [ 6. ESTRUCTURA APP MAESTRA ] ---

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  const [isWarping, setIsWarping] = useState(false);
  const { user, isAdmin, login, logout } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#000105] text-white selection:bg-cyan-500/40 overflow-x-hidden font-sans relative">
          <SpacePortal isWarping={isWarping} />
          <HUD_Layer />
          
          <nav className="fixed top-0 w-full z-[100] h-24 flex items-center px-10 border-b border-white/5 backdrop-blur-xl bg-black/10">
            <div className="max-w-[1800px] mx-auto w-full flex justify-between items-center text-white font-black italic tracking-tighter">
              <Link to="/" className="text-3xl flex items-center gap-4 uppercase tracking-tighter"><div className="w-10 h-10 bg-purple-600 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.5)]" />PromptForge</Link>
              <div className="hidden md:flex gap-16 text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">
                <Link to="/" className="hover:text-white transition-all">Home_Nucleus</Link>
                <Link to="/marketplace" className="hover:text-purple-400 transition-all">Data_Market</Link>
                <Link to="/biblioteca" className="hover:text-cyan-400 transition-all text-cyan-400">Private_Vault</Link>
              </div>
              <div className="flex items-center gap-6">
                {user ? <Link to="/dashboard" className="w-14 h-14 rounded-3xl border-2 border-purple-500 overflow-hidden hover:scale-110 transition-transform"><img src={user.photoURL} alt="p" /></Link> : <Link to="/login" className="bg-white text-black px-12 py-3 rounded-full text-[10px] font-black shadow-xl uppercase tracking-[1em]">Login</Link>}
              </div>
            </div>
          </nav>

          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeView onWarp={setIsWarping} />} />
              <Route path="/marketplace" element={<div className="pt-40 text-center font-black text-8xl uppercase italic opacity-20">Marketplace_Live</div>} />
              <Route path="/biblioteca" element={<PrivateRoute><LibraryView /></PrivateRoute>} />
              <Route path="/login" element={<LoginPortal />} />
              <Route path="/dashboard" element={<PrivateRoute><div className="h-screen flex flex-col items-center justify-center font-black text-8xl italic uppercase text-white tracking-tighter">Syncing_Profile<button onClick={logout} className="text-red-500 text-xs mt-10 tracking-[1em] uppercase">Terminate_Session</button></div></PrivateRoute>} />
            </Routes>
          </AnimatePresence>

          <footer className="py-64 border-t border-white/5 text-center relative z-10 bg-black/60">
            <div className="text-9xl md:text-[300px] font-black tracking-tighter mb-8 italic text-slate-900 select-none uppercase opacity-10">PromptForge</div>
            <p className="text-slate-800 text-[12px] font-bold uppercase tracking-[2em]">Build_the_Future_with_IA</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}