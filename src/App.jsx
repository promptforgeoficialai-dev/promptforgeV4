import React, { Suspense, useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Sparkles, Zap, ShieldCheck, ArrowRight, ShoppingCart, Search, 
  Layout, User, LogOut, Crown, Star, Download, ChevronRight, 
  Lock, Rocket, Globe, Radar, Activity, Target, Radio, Cpu, 
  Library, Box, Share2, Layers, Terminal, MousePointer2, Mail, Heart, FileText, Settings, Eye,
  Wifi, Gauge, Crosshair, BarChart3, Binary
} from 'lucide-react';
import { 
  FaInstagram, FaTiktok, FaTwitter, FaDiscord, 
  FaYoutube, FaGithub, FaTelegramPlane, FaWhatsapp, FaLinkedinIn 
} from "react-icons/fa";

// CONTEXTO Y FIREBASE
import { AuthProvider, useAuth } from './context/AuthContext';
import { db } from './firebase/config';
import { collection, onSnapshot, query, orderBy, doc, setDoc, arrayUnion } from 'firebase/firestore';
import { allProducts } from './data/products';

// --- [ 1. MOTOR ESPACIAL INTERACTIVO ] ---
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
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.mouse.y * 0.2, 0.05);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, state.mouse.x * 0.2, 0.05);
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
      <Suspense fallback={null}><StarField speed={isWarping ? 5 : 0.08} /></Suspense>
    </Canvas>
  </div>
);

// --- [ 2. PANELES HUD HD ] ---
const HUD_HD = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] hidden xl:block p-10 font-mono">
      <div className="absolute top-10 left-10 w-32 h-32 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-[3rem] shadow-[0_0_20px_rgba(34,211,238,0.1)]" />
      <div className="absolute top-10 right-10 w-32 h-32 border-t-2 border-r-2 border-purple-500/40 rounded-tr-[3rem]" />
      <div className="absolute bottom-10 left-10 w-32 h-32 border-b-2 border-l-2 border-purple-500/40 rounded-bl-[3rem]" />
      <div className="absolute bottom-10 right-10 w-32 h-32 border-b-2 border-r-2 border-cyan-500/40 rounded-br-[3rem]" />

      <motion.div initial={{ x: -100 }} animate={{ x: 0 }} className="absolute top-1/4 left-10 w-64 glass-morphism p-6 rounded-[2rem] border border-white/10 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 text-cyan-400">
          <Cpu size={14} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">System_Core</span>
        </div>
        <HUDBar label="WARP_DRIVE" value={92} color="bg-purple-500" />
        <HUDBar label="AI_SYNC" value={98} color="bg-cyan-400" />
      </motion.div>

      <motion.div initial={{ x: 100 }} animate={{ x: 0 }} className="absolute top-1/4 right-10 w-64 glass-morphism p-6 rounded-[2rem] border border-white/10 space-y-6 text-right">
        <div className="flex items-center justify-end gap-3 border-b border-white/10 pb-4 text-purple-400">
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Tactical_Data</span>
          <Radar size={14} className="animate-spin" />
        </div>
        <p className="text-[10px] text-white font-bold tracking-widest">TIME: {time}</p>
        <p className="text-[8px] text-slate-500 uppercase font-black">Status: Forging_Active</p>
      </motion.div>
    </div>
  );
};

const HUDBar = ({ label, value, color }) => (
  <div className="space-y-2 text-left">
    <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase"><span>{label}</span><span>{value}%</span></div>
    <div className="h-1 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className={`h-full ${color}`} /></div>
  </div>
);

// --- [ 3. PROTECCIÓN Y LÓGICA ] ---
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="h-screen bg-[#000105] flex items-center justify-center font-black text-purple-500 italic animate-pulse">SYNCING_NUCLEUS...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  return children;
};

// --- [ 4. VISTAS PRINCIPALES ] ---
const HomeView = ({ onAction }) => {
  const navigate = useNavigate();
  return (
    <div className="relative h-screen flex flex-col items-center justify-center text-center px-6">
      <motion.h1 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-7xl md:text-[250px] font-black tracking-tighter leading-[0.75] text-white italic select-none uppercase">
        FORJA TU <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-white to-cyan-400 pr-12">IMPERIO.</span>
      </motion.h1>
      <button onClick={() => { onAction(true); setTimeout(() => { navigate('/marketplace'); onAction(false); }, 1000); }} className="bg-white text-black font-black px-20 py-8 rounded-full shadow-2xl hover:bg-purple-600 hover:text-white transition-all uppercase text-xs tracking-[0.6em] active:scale-95">INICIAR_WARP_DRIVE</button>
      <div className="absolute bottom-12 flex gap-8">
        <Social icon={<FaInstagram/>} link="https://instagram.com" />
        <Social icon={<FaTiktok/>} link="https://tiktok.com" />
        <Social icon={<FaTwitter/>} link="https://twitter.com" />
        <Social icon={<FaDiscord/>} link="https://discord.gg" />
      </div>
    </div>
  );
};

const Social = ({ icon, link }) => (
  <a href={link} target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl text-slate-400 hover:text-purple-400 hover:scale-110 transition-all backdrop-blur-xl">
    {icon}
  </a>
);

const MarketplaceView = () => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const { login, user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "product"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
  }, []);

  const handleBuy = async (p) => {
    if(!user) return login();
    await setDoc(doc(db, "users", user.uid), { purchases: arrayUnion({...p, purchasedAt: new Date().toISOString()})}, {merge: true});
    alert("¡Adquirido!");
  };

  return (
    <div className="pt-40 pb-40 px-10 relative z-10 max-w-7xl mx-auto min-h-screen">
      <header className="mb-24 space-y-12 text-white">
        <h2 className="text-7xl md:text-[150px] font-black tracking-tighter italic uppercase leading-none">Market_<span className="text-purple-600">Archive.</span></h2>
        <div className="relative max-w-2xl"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={24} /><input type="text" placeholder="ACCESS_DATABASE..." className="w-full bg-white/[0.03] border border-white/10 p-8 pl-16 rounded-[2.5rem] outline-none focus:border-purple-500 text-white font-black text-xl backdrop-blur-3xl transition-all" onChange={(e) => setSearch(e.target.value)} /></div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).map((p) => (
          <motion.div key={p.id} whileHover={{ y: -10 }} className="group p-8 rounded-[3.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-2xl hover:border-purple-500/50 transition-all text-white">
            <img src={p.image} className="h-64 w-full object-cover rounded-[2.5rem] mb-8" alt="p" />
            <h3 className="font-black text-xl mb-4 italic uppercase">{p.name}</h3>
            <div className="flex justify-between items-center border-t border-white/5 pt-6"><span className="text-3xl font-black text-purple-400">${p.price}</span><button onClick={() => handleBuy(p)} className="bg-white text-black p-4 rounded-2xl hover:bg-purple-600 hover:text-white transition-all active:scale-90"><ShoppingCart size={22}/></button></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [isWarping, setIsWarping] = useState(false);
  const { user, login } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#000105] text-white selection:bg-cyan-500/40 overflow-x-hidden font-sans relative">
          <SpacePortal isWarping={isWarping} />
          <HUD_HD />
          <nav className="fixed top-0 w-full z-[100] h-24 flex items-center px-10 border-b border-white/5 backdrop-blur-xl bg-black/10">
            <div className="max-w-[1800px] mx-auto w-full flex justify-between items-center text-white">
              <Link to="/" className="text-3xl font-black italic tracking-tighter flex items-center gap-4 uppercase"><div className="w-10 h-10 bg-purple-600 rounded-xl" />PromptForge</Link>
              <div className="hidden md:flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500"><Link to="/" className="hover:text-white transition-all">Home</Link><Link to="/marketplace" className="hover:text-white transition-all">Market</Link></div>
              {user ? <Link to="/dashboard" className="w-12 h-12 rounded-2xl border-2 border-purple-500 overflow-hidden"><img src={user.photoURL} alt="p" /></Link> : <button onClick={login} className="bg-white text-black px-10 py-3 rounded-full text-[10px] font-black shadow-2xl uppercase">VIP</button>}
            </div>
          </nav>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeView onAction={setIsWarping} />} />
              <Route path="/marketplace" element={<MarketplaceView />} />
              <Route path="/login" element={<div className="h-screen flex items-center justify-center font-black text-7xl uppercase italic">Redirecting...</div>} />
              <Route path="/dashboard" element={<PrivateRoute><div className="h-screen flex items-center justify-center font-black text-7xl uppercase italic">User_Vault_Locked</div></PrivateRoute>} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </AuthProvider>
  );
}