import React, { Suspense, useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Points, PointMaterial, Preload, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Sparkles, Zap, ShieldCheck, ArrowRight, ShoppingCart, Search, 
  Layout, User, LogOut, Crown, Star, Plus, Download, 
  ChevronRight, Lock, Rocket, Mail, Globe, Github, Heart, Eye,
  Activity, Radio, Cpu, Binary, Radar, MousePointer2, Box
} from 'lucide-react';
import { 
  FaInstagram, FaTiktok, FaTwitter, FaDiscord, 
  FaYoutube, FaGithub, FaTelegramPlane, FaWhatsapp, FaLinkedinIn 
} from "react-icons/fa";

// CONTEXTO Y FIREBASE
import { AuthProvider, useAuth } from './context/AuthContext';
import { db } from './firebase/config';
import { doc, setDoc, arrayUnion, onSnapshot, collection, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { allProducts } from './data/products';

// --- [ 1. EL MOTOR 3D SUPREMO: ESPACIO INTERACTIVO ] ---

function SupremeStars() {
  const ref = useRef();
  const [positions] = useState(() => {
    const p = new Float32Array(15000 * 3);
    for (let i = 0; i < 15000; i++) p[i] = (Math.random() - 0.5) * 30;
    return p;
  });

  useFrame((state) => {
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.mouse.y * 0.2, 0.05);
    ref.current.rotation.y += THREE.MathUtils.lerp(0, state.mouse.x * 0.2, 0.05);
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#a855f7" size={0.009} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

function ProductSilhouette() {
  const mesh = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.x = Math.cos(t / 2) / 4;
    mesh.current.rotation.y = Math.sin(t / 4) / 4;
  });
  return (
    <Float speed={5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={mesh}>
        <torusKnotGeometry args={[1.5, 0.4, 256, 32]} />
        <MeshTransmissionMaterial backside samples={15} thickness={1} chromaticAberration={0.5} color="#7C3AED" transmission={1} />
      </mesh>
    </Float>
  );
}

const Background3D = () => (
  <div className="fixed inset-0 z-0 bg-[#000105] pointer-events-none">
    <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
      <Suspense fallback={null}>
        <SupremeStars />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#7C3AED" />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  </div>
);

// --- [ 2. COMPONENTES LÓGICOS ] ---

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="h-screen bg-[#000105] flex items-center justify-center font-black text-purple-500 italic animate-pulse tracking-[1em]">INITIALIZING...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  return children;
};

// --- [ 3. VISTAS (HOME, MARKET, VAULT, LOGIN) ] ---

const HomeView = () => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
      {/* HUD Laterales para que no se vea pobre */}
      <div className="fixed inset-y-0 left-10 z-50 hidden xl:flex flex-col justify-center gap-12 text-slate-600">
         <div className="space-y-2"><div className="w-1 h-1 bg-cyan-400 animate-ping rounded-full"/><span className="text-[7px] font-black uppercase tracking-[0.5em] vertical-text">Signal_Active</span></div>
         <div className="h-32 w-px bg-white/10 mx-auto" />
         <div className="text-[8px] font-black uppercase tracking-widest leading-loose">Core_Temp: 24°C <br/> Latency: 2ms</div>
      </div>

      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5] }}><Suspense fallback={null}><ProductSilhouette /></Suspense></Canvas>
        </div>

        <div className="z-10">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-morphism px-8 py-3 rounded-full mb-12 border border-purple-500/30 shadow-[0_0_50px_rgba(124,58,237,0.3)] inline-block">
            <span className="text-[10px] font-black uppercase tracking-[0.8em] text-purple-400">Quantum_Engine_V4</span>
          </motion.div>
          
          <h1 className="text-7xl md:text-[180px] font-black tracking-tighter leading-[0.85] text-white italic select-none uppercase">
            FORJA EL <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-white to-cyan-400 pr-12 drop-shadow-[0_0_80px_rgba(124,58,237,0.5)]">FUTURO.</span>
          </h1>

          <div className="mt-20 flex flex-col md:flex-row gap-8 justify-center">
            <button onClick={() => navigate('/marketplace')} className="bg-white text-black font-black px-16 py-8 rounded-3xl shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:bg-purple-600 hover:text-white transition-all duration-700 uppercase text-xs tracking-[0.4em] active:scale-95">
              Acceder al Mercado
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN REDES SOCIALES SUPREMA (SCROLL) */}
      <section className="py-64 px-10 relative z-10 bg-black/40 backdrop-blur-3xl border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-black italic uppercase mb-24 tracking-tighter text-white">Red_De_Conexión</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <SocialBtn icon={<FaInstagram/>} label="Instagram" /><SocialBtn icon={<FaTiktok/>} label="TikTok" /><SocialBtn icon={<FaTwitter/>} label="X.com" /><SocialBtn icon={<FaDiscord/>} label="Discord" /><SocialBtn icon={<FaGithub/>} label="GitHub" />
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const SocialBtn = ({ icon, label }) => (
  <motion.div whileHover={{ y: -15, scale: 1.1 }} className="p-16 rounded-[4rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl flex flex-col items-center gap-6 group cursor-pointer hover:border-purple-500/50 transition-all duration-500 shadow-2xl">
    <div className="text-6xl text-slate-700 group-hover:text-purple-400 transition-colors">{icon}</div>
    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-600 group-hover:text-white">{label}</span>
  </motion.div>
);

const MarketplaceView = () => {
  const [search, setSearch] = useState('');
  const [dbProducts, setDbProducts] = useState([]);
  const { login, user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "product"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (s) => setDbProducts(s.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const list = dbProducts.length > 0 ? dbProducts : allProducts;

  return (
    <div className="pt-32 pb-40 px-10 max-w-7xl mx-auto relative z-10 min-h-screen">
      <header className="mb-24 flex flex-col md:flex-row justify-between items-end gap-10 text-white">
        <div>
          <h2 className="text-8xl md:text-[150px] font-black tracking-tighter italic uppercase leading-none opacity-10 absolute top-0 left-0">ARCHIVE.</h2>
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter italic uppercase relative">DATA_FORJA</h2>
        </div>
        {/* BUSCADOR DEL MERCADO */}
        <div className="relative w-full md:w-[500px]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" />
          <input type="text" placeholder="BUSCAR_INTELIGENCIA..." className="w-full bg-white/[0.02] border border-white/10 p-6 pl-16 rounded-3xl outline-none focus:border-purple-500 text-white font-bold backdrop-blur-3xl" onChange={(e) => setSearch(e.target.value)} />
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {list.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).map((p) => (
          <motion.div key={p.id} whileHover={{ y: -20 }} className="group p-8 rounded-[4rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl hover:border-purple-500/50 transition-all shadow-2xl">
            <img src={p.image} className="h-64 w-full object-cover rounded-[3rem] mb-10 shadow-2xl border border-white/5" alt="p" />
            <h3 className="font-black text-2xl mb-4 italic uppercase text-white tracking-tighter">{p.name}</h3>
            <div className="flex justify-between items-center border-t border-white/5 pt-8">
              <span className="text-4xl font-black text-purple-400 tracking-tighter">${p.price}</span>
              <button className="p-6 bg-white text-black rounded-3xl hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-90"><ShoppingCart size={24}/></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const LibraryView = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState('');
  useEffect(() => { if(user) return onSnapshot(doc(db, "users", user.uid), (d) => setPurchases(d.data()?.purchases || [])); }, [user]);

  return (
    <div className="pt-44 pb-40 px-10 relative z-10 max-w-7xl mx-auto min-h-screen text-white">
      <header className="mb-24 space-y-12">
        <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-none">Mi_<span className="text-purple-500">Bóveda.</span></h2>
        {/* BUSCADOR DE LA BIBLIOTECA */}
        <div className="relative max-w-2xl">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" />
           <input type="text" placeholder="SEARCH_MY_VAULT..." className="w-full bg-white/[0.03] border border-white/10 p-8 pl-16 rounded-[2.5rem] outline-none focus:border-purple-500 text-white font-black text-xl backdrop-blur-3xl" onChange={(e) => setSearch(e.target.value)} />
        </div>
      </header>
      <div className="grid md:grid-cols-2 gap-12">
        {purchases.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).map((p, i) => (
          <div key={i} className="p-10 rounded-[4rem] bg-slate-900/60 border border-white/5 flex items-center justify-between group hover:border-purple-500/50 transition-all shadow-2xl backdrop-blur-xl">
            <div className="flex gap-8 items-center text-white font-black">
              <img src={p.image} className="w-24 h-24 rounded-3xl object-cover shadow-2xl border border-white/10" alt="p" />
              <h4 className="text-2xl uppercase tracking-tighter">{p.name}</h4>
            </div>
            <button onClick={() => p.downloadUrl ? window.open(p.downloadUrl) : alert("encriptado")} className="p-6 bg-white/5 hover:bg-purple-600 rounded-2xl shadow-xl transition-all"><Download size={24}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const LoginView = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (user) navigate('/dashboard'); }, [user]);

  return (
    <div className="h-screen flex items-center justify-center relative z-50 px-6 text-white overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl p-24 rounded-[6rem] bg-[#020617]/40 border border-white/10 backdrop-blur-3xl text-center shadow-2xl">
        <div className="w-32 h-32 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-[2.5rem] mx-auto mb-16 flex items-center justify-center shadow-2xl ring-4 ring-purple-500/20"><Lock size={60} className="text-white"/></div>
        <h2 className="text-7xl font-black italic uppercase mb-8 tracking-tighter">Secure_Access</h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.5em] mb-16 italic">System_Auth_Protocol_v.4.0</p>
        <button onClick={login} className="w-full py-10 bg-white text-black font-black rounded-full shadow-[0_0_80px_rgba(255,255,255,0.1)] hover:bg-purple-600 hover:text-white transition-all active:scale-95 uppercase tracking-[1em] text-xs">Authorize_Identity</button>
      </motion.div>
    </div>
  );
};

// --- [ 4. ESTRUCTURA APP PRINCIPAL ] ---

export default function App() {
  const { user, isAdmin, login } = useAuth();
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#000105] text-white selection:bg-cyan-500/40 overflow-x-hidden font-sans relative">
          
          <Background3D />
          
          <nav className="fixed top-0 w-full z-[100] h-24 flex items-center px-10 border-b border-white/5 backdrop-blur-xl bg-black/10">
            <div className="max-w-[1800px] mx-auto w-full flex justify-between items-center text-white">
              <Link to="/" className="text-3xl font-black italic tracking-tighter flex items-center gap-4 uppercase tracking-tighter"><div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-cyan-400 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.5)]" />PromptForge</Link>
              <div className="hidden md:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                <Link to="/" className="hover:text-white transition-all">Command_Center</Link>
                <Link to="/marketplace" className="hover:text-purple-400 transition-all">Data_Market</Link>
                <Link to="/biblioteca" className="hover:text-cyan-400 transition-all">Private_Vault</Link>
              </div>
              <div className="flex items-center gap-6">
                {user ? <Link to="/dashboard" className="w-14 h-14 rounded-3xl border-2 border-purple-500 overflow-hidden hover:scale-110 transition-transform shadow-2xl shadow-purple-500/20"><img src={user.photoURL} alt="p" /></Link> : <button onClick={login} className="bg-white text-black px-10 py-3 rounded-full text-[10px] font-black shadow-[0_0_30px_rgba(255,255,255,0.2)] uppercase">Login</button>}
              </div>
            </div>
          </nav>

          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/marketplace" element={<MarketplaceView />} />
              <Route path="/biblioteca" element={<PrivateRoute><LibraryView /></PrivateRoute>} />
              <Route path="/login" element={<LoginView />} />
              <Route path="/dashboard" element={<PrivateRoute><div className="h-screen flex items-center justify-center font-black text-8xl italic uppercase tracking-tighter">Syncing_Profile...</div></PrivateRoute>} />
            </Routes>
          </AnimatePresence>

          <footer className="py-40 border-t border-white/5 text-center relative z-10 bg-black/80 backdrop-blur-3xl">
            <div className="text-9xl md:text-[300px] font-black tracking-tighter mb-8 italic text-slate-900 select-none uppercase opacity-10">PromptForge</div>
            <p className="text-slate-800 text-[12px] font-bold uppercase tracking-[2em]">Build_the_Future_with_IA</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}