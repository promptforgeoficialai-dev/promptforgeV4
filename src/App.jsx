import React, { Suspense, useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Preload, Float, Sphere, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Sparkles, Zap, ShieldCheck, ArrowRight, ShoppingCart, Search, 
  Layout, User, LogOut, Crown, Star, Download, ChevronRight, 
  Lock, Rocket, Globe, Radar, Activity, Target, Radio, Cpu, 
  Library, Box, Share2, Layers, Terminal, MousePointer2, Mail, Heart, FileText, Settings, Eye
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

// --- [ 1. MOTOR 3D: HERO E INTERFACE ] ---

function HeroEngine() {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.cos(t / 4) / 2;
    meshRef.current.rotation.y = Math.sin(t / 4) / 2;
  });

  return (
    <Float speed={5} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.5, 0.3, 200, 32]} />
        <meshStandardMaterial color="#7C3AED" emissive="#A855F7" emissiveIntensity={2} wireframe />
      </mesh>
    </Float>
  );
}

function StarField() {
  const ref = useRef();
  const [positions] = useState(() => {
    const p = new Float32Array(20000 * 3);
    for (let i = 0; i < 20000; i++) p[i] = (Math.random() - 0.5) * 20;
    return p;
  });
  useFrame((state, delta) => {
    ref.current.position.z += delta * 0.1;
    if (ref.current.position.z > 10) ref.current.position.z = 0;
  });
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#ffffff" size={0.006} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

const GlobalCanvas = () => (
  <div className="fixed inset-0 z-0 bg-[#000105]">
    <Canvas camera={{ position: [0, 0, 5] }}>
      <Suspense fallback={null}>
        <StarField />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#7C3AED" />
      </Suspense>
    </Canvas>
  </div>
);

// --- [ 2. VISTA PRINCIPAL (HOME) - SIN ESPACIOS VACÍOS ] ---

const HomeView = () => {
  const navigate = useNavigate();
  return (
    <div className="relative z-10">
      {/* SECCIÓN 1: HERO 3D + REDES SOCIALES INICIALES */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5] }}><HeroEngine /></Canvas>
        </div>
        
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="z-10 mt-20">
          <h1 className="text-7xl md:text-[180px] font-black tracking-tighter leading-[0.8] text-white italic mb-10 select-none">
            FORJA TU <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-white to-cyan-400 pr-10">IMPERIO.</span>
          </h1>

          {/* REDES SOCIALES DE IMPACTO (INICIO) */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <SocialPill icon={<FaInstagram/>} label="Instagram" link="#" color="hover:bg-pink-600" />
            <SocialPill icon={<FaTiktok/>} label="TikTok" link="#" color="hover:bg-slate-800" />
            <SocialPill icon={<FaTwitter/>} label="X.com" link="#" color="hover:bg-blue-500" />
            <SocialPill icon={<FaDiscord/>} label="Discord" link="#" color="hover:bg-indigo-600" />
          </div>

          <button onClick={() => navigate('/marketplace')} className="bg-white text-black font-black px-16 py-7 rounded-full shadow-[0_0_80px_rgba(255,255,255,0.2)] hover:bg-purple-600 hover:text-white transition-all duration-700 uppercase text-xs tracking-[0.6em] active:scale-90">
            ENTRAR_A_LA_DATAFORJA
          </button>
        </motion.div>
      </section>

      {/* SECCIÓN 2: TELEMETRÍA (PARA QUE NO HAYA HUECOS NEGROS) */}
      <section className="py-40 px-10 bg-black/40 backdrop-blur-3xl border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <HUDCard icon={<Cpu/>} label="AI_CORE" value="V.4.2" desc="Sincronización total con modelos GPT-5 y Claude 3.5." />
          <HUDCard icon={<Radar/>} label="SCANNER" value="ONLINE" desc="Detectando los métodos más rentables del mercado." />
          <HUDCard icon={<ShieldCheck/>} label="VAULT" value="SECURE" desc="Cifrado cuántico para tus adquisiciones digitales." />
          <HUDCard icon={<Globe/>} label="NETWORK" value="GLOBAL" desc="Forjadores activos en más de 45 sectores." />
        </div>
      </section>

      {/* SECCIÓN 3: RED SOCIAL COMPLETA (MÁS RICA) */}
      <section className="py-64 px-10">
        <div className="max-w-7xl mx-auto text-center space-y-20">
          <h2 className="text-5xl font-black italic uppercase tracking-tighter">Únete_a_la_Élite</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <BigSocial icon={<FaYoutube/>} name="YouTube" />
            <BigSocial icon={<FaGithub/>} name="GitHub" />
            <BigSocial icon={<FaTelegramPlane/>} name="Telegram" />
            <BigSocial icon={<FaWhatsapp/>} name="WhatsApp" />
            <BigSocial icon={<FaLinkedinIn/>} name="LinkedIn" />
          </div>
        </div>
      </section>
    </div>
  );
};

const SocialPill = ({ icon, label, link, color }) => (
  <a href={link} target="_blank" className={`flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl transition-all ${color} group`}>
    <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </a>
);

const HUDCard = ({ icon, label, value, desc }) => (
  <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col gap-4">
    <div className="flex justify-between items-center border-b border-white/5 pb-4">
      <div className="text-purple-400">{icon}</div>
      <div className="text-xs font-black text-cyan-400">{value}</div>
    </div>
    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</div>
    <p className="text-slate-400 text-xs font-medium leading-loose">{desc}</p>
  </div>
);

const BigSocial = ({ icon, name }) => (
  <motion.div whileHover={{ scale: 1.05, y: -10 }} className="p-12 rounded-[4rem] bg-white/[0.01] border border-white/5 backdrop-blur-2xl flex flex-col items-center gap-6 group hover:border-purple-500/50 transition-all duration-700">
    <div className="text-5xl text-slate-600 group-hover:text-purple-500 transition-colors">{icon}</div>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 group-hover:text-white">{name}</span>
  </motion.div>
);

// --- [ 3. MARKETPLACE Y BÓVEDA (FUNCIONALES) ] ---

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
    alert("ADQUISICIÓN COMPLETADA");
  };

  return (
    <div className="pt-40 pb-40 px-10 relative z-10 max-w-7xl mx-auto">
      <header className="mb-24 space-y-12">
        <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter italic uppercase leading-none">Market_<span className="text-purple-600">Archive.</span></h2>
        {/* BARRA DE BÚSQUEDA */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={24} />
          <input type="text" placeholder="ACCESS_NUCLEUS_DATA..." className="w-full bg-white/[0.03] border border-white/10 p-8 pl-16 rounded-[2.5rem] outline-none focus:border-purple-500 text-white font-black text-xl backdrop-blur-3xl" onChange={(e) => setSearch(e.target.value)} />
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).map((p) => (
          <div key={p.id} className="p-8 rounded-[3.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-2xl hover:border-purple-500/50 transition-all group">
            <img src={p.image} className="h-64 w-full object-cover rounded-[2.5rem] mb-8" alt="p" />
            <h3 className="font-black text-white text-xl mb-4 italic uppercase">{p.name}</h3>
            <div className="flex justify-between items-center pt-6 border-t border-white/5">
              <span className="text-3xl font-black text-purple-400 tracking-tighter">${p.price}</span>
              <button onClick={() => handleBuy(p)} className="p-4 bg-white text-black hover:bg-purple-600 hover:text-white rounded-2xl shadow-xl transition-all"><ShoppingCart size={24}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LibraryView = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user) return onSnapshot(doc(db, "users", user.uid), (d) => setPurchases(d.data()?.purchases || []));
  }, [user]);

  return (
    <div className="pt-40 pb-40 px-10 relative z-10 max-w-7xl mx-auto min-h-screen text-white">
      <header className="mb-20 space-y-10">
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic text-white">Mi_<span className="text-purple-500">Bóveda.</span></h2>
        {/* BARRA DE BÚSQUEDA BIBLIOTECA */}
        <div className="relative max-w-xl">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" />
           <input type="text" placeholder="BUSCAR_EN_BOVEDA..." className="w-full bg-white/[0.03] border border-white/10 p-6 pl-16 rounded-[2rem] outline-none focus:border-purple-500 text-white font-bold backdrop-blur-3xl" onChange={(e) => setSearch(e.target.value)} />
        </div>
      </header>
      <div className="grid md:grid-cols-2 gap-8">
        {purchases.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).map((p, i) => (
          <div key={i} className="p-10 rounded-[3rem] bg-slate-900/60 border border-white/5 flex items-center justify-between group">
            <div className="flex gap-6 items-center">
              <img src={p.image} className="w-20 h-20 rounded-3xl object-cover shadow-2xl" alt="p" />
              <h4 className="font-black text-lg uppercase group-hover:text-purple-400 transition-colors">{p.name}</h4>
            </div>
            <button onClick={() => p.downloadUrl ? window.open(p.downloadUrl) : alert("Sin link.")} className="p-5 bg-white/5 hover:bg-purple-600 rounded-3xl transition-all shadow-xl"><Download size={24}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- [ 4. ESTRUCTURA APP COMPLETA ] ---

export default function App() {
  const { user, isAdmin, login } = useAuth();
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#000105] text-white selection:bg-cyan-500/40 overflow-x-hidden font-sans relative">
          <GlobalCanvas />
          
          <nav className="fixed top-0 w-full z-[100] h-24 flex items-center px-10 border-b border-white/5 backdrop-blur-xl bg-black/10">
            <div className="max-w-[1800px] mx-auto w-full flex justify-between items-center text-white font-black italic tracking-tighter">
              <Link to="/" className="text-3xl flex items-center gap-4"><div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-cyan-400 rounded-2xl" />PromForge</Link>
              <div className="hidden md:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                <Link to="/" className="hover:text-white transition-all">Home</Link>
                <Link to="/marketplace" className="hover:text-purple-400 transition-all">Market</Link>
                <Link to="/biblioteca" className="hover:text-cyan-400 transition-all">Bóveda</Link>
              </div>
              {user ? (
                <Link to="/dashboard" className="w-14 h-14 rounded-3xl border-2 border-purple-500 overflow-hidden hover:scale-110 transition-transform"><img src={user.photoURL} alt="p" /></Link>
              ) : (
                <button onClick={login} className="bg-white text-black px-12 py-4 rounded-full text-[10px] font-black hover:bg-purple-600 hover:text-white transition-all shadow-2xl">VIP</button>
              )}
            </div>
          </nav>

          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/marketplace" element={<MarketplaceView />} />
              <Route path="/biblioteca" element={<LibraryView />} />
              <Route path="/dashboard" element={<div className="h-screen flex items-center justify-center font-black text-7xl italic">DASHBOARD_ONLINE</div>} />
            </Routes>
          </AnimatePresence>

          <footer className="py-64 border-t border-white/5 text-center relative z-10 bg-black/40">
            <div className="text-9xl md:text-[300px] font-black tracking-tighter mb-12 italic text-slate-900 select-none uppercase opacity-10">PromptForge</div>
            <p className="text-slate-800 text-[12px] font-bold uppercase tracking-[2em]">Evolution_Core_2024</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}