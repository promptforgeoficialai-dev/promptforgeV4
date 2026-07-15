import React, { Suspense, useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Preload, Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Sparkles, Zap, ShieldCheck, ArrowRight, ShoppingCart, Search, 
  Layout, User, LogOut, Crown, Star, Download, ChevronRight, 
  Lock, Rocket, Globe, Radar, Activity, Target, Radio, Cpu, 
  Box, Share2, Terminal, Mail, Heart, FileText, Settings, Eye, KeyRound
} from 'lucide-react';
import { 
  FaInstagram, FaTiktok, FaTwitter, FaDiscord, 
  FaYoutube, FaGithub, FaTelegramPlane, FaWhatsapp, FaLinkedinIn 
} from "react-icons/fa";

// CONTEXTO Y FIREBASE (Asegúrate de que existan estos archivos)
import { AuthProvider, useAuth } from './context/AuthContext';
import { db } from './firebase/config';
import { collection, onSnapshot, query, orderBy, doc, setDoc, arrayUnion } from 'firebase/firestore';

// --- [ 1. MOTORES 3D: NÚCLEO Y ESPACIO ] ---

function QuantumEngine() {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.cos(t / 4) / 2;
    meshRef.current.rotation.y = Math.sin(t / 4) / 2;
  });
  return (
    <Float speed={5} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.5, 0.4, 256, 32]} />
        <MeshTransmissionMaterial
          backside samples={15} thickness={1} chromaticAberration={0.5}
          anisotropy={0.3} distortion={0.5} color="#7C3AED" transmission={1}
        />
      </mesh>
    </Float>
  );
}

function StarField({ speed = 0.05 }) {
  const ref = useRef();
  const [positions] = useState(() => {
    const p = new Float32Array(20000 * 3);
    for (let i = 0; i < 20000; i++) p[i] = (Math.random() - 0.5) * 15;
    return p;
  });
  useFrame((state, delta) => {
    ref.current.position.z += delta * speed * 30;
    if (ref.current.position.z > 10) ref.current.position.z = 0;
  });
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#ffffff" size={0.008} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

const GlobalScene = ({ isWarping }) => (
  <div className="fixed inset-0 z-0 bg-[#000105]">
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Suspense fallback={null}><StarField speed={isWarping ? 5 : 0.08} /></Suspense>
    </Canvas>
  </div>
);

// --- [ 2. PANELES HUD (CENTRAL DE MANDO) ] ---

const HUDOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-50 hidden xl:block p-10 font-black italic">
    <div className="absolute top-10 left-10 w-24 h-24 border-t-2 border-l-2 border-purple-500/40 rounded-tl-[3rem]" />
    <div className="absolute top-10 right-10 w-24 h-24 border-t-2 border-r-2 border-purple-500/40 rounded-tr-[3rem]" />
    <div className="absolute top-1/2 left-10 -translate-y-1/2 space-y-6">
       <HUDItem icon={<Activity size={14}/>} label="Neural_Sync" value="Stable" color="text-cyan-400" />
       <HUDItem icon={<Radio size={14}/>} label="Signal_Link" value="Active" color="text-purple-500" />
       <HUDItem icon={<Cpu size={14}/>} label="AI_Core" value="V4.0" color="text-pink-500" />
    </div>
  </div>
);

const HUDItem = ({ icon, label, value, color }) => (
  <div className="glass-morphism p-4 rounded-2xl border border-white/5 w-48 space-y-2">
    <div className="flex justify-between items-center text-[8px] tracking-[0.3em] text-slate-500">{label} <span className={color}>{value}</span></div>
    <div className="flex items-center gap-3 text-white">{icon} <div className="h-[2px] flex-1 bg-white/10 rounded-full overflow-hidden"><motion.div animate={{ width: ["0%", "100%"] }} className="h-full bg-purple-600" /></div></div>
  </div>
);

// --- [ 3. VISTA PRINCIPAL (HOME) ] ---

const HomeView = ({ onAction }) => {
  const navigate = useNavigate();
  return (
    <div className="relative">
      <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative z-10">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5] }}><QuantumEngine /></Canvas>
        </div>
        
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="z-10 mt-20">
          <h1 className="text-8xl md:text-[250px] font-black tracking-tighter leading-[0.75] text-white italic select-none mb-16">
            FORJA TU <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-white to-cyan-400 pr-12">IMPERIO.</span>
          </h1>

          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <button 
              onClick={() => { onAction(true); setTimeout(() => { navigate('/marketplace'); onAction(false); }, 1000); }}
              className="bg-white text-black font-black px-20 py-8 rounded-full shadow-[0_0_80px_rgba(255,255,255,0.2)] hover:bg-purple-600 hover:text-white transition-all duration-700 uppercase text-xs tracking-[0.6em] active:scale-95"
            >
              ACTIVAR_PROTOCOLO_MARKET
            </button>
          </div>
        </motion.div>
      </section>

      {/* SECCIÓN SOCIAL REDES (NO POBRE) */}
      <section className="py-64 px-10 relative z-10 bg-black/40 backdrop-blur-3xl border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-black italic uppercase mb-24 tracking-tighter text-white">RED_NUCLEUS</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <SocialBox icon={<FaInstagram/>} name="Instagram" link="https://instagram.com/TU_LINK" />
            <SocialBox icon={<FaTiktok/>} name="TikTok" link="https://tiktok.com/@TU_LINK" />
            <SocialBox icon={<FaTwitter/>} name="X.com" link="https://twitter.com/TU_LINK" />
            <SocialBox icon={<FaDiscord/>} name="Discord" link="https://discord.gg/TU_LINK" />
            <SocialBox icon={<FaGithub/>} name="GitHub" link="https://github.com/TU_LINK" />
          </div>
        </div>
      </section>
    </div>
  );
};

const SocialBox = ({ icon, name, link }) => (
  <motion.a href={link} target="_blank" whileHover={{ y: -15, scale: 1.05 }} className="p-16 rounded-[4rem] bg-white/[0.01] border border-white/5 backdrop-blur-xl flex flex-col items-center gap-6 group hover:border-purple-500/50 shadow-2xl transition-all duration-500">
    <div className="text-6xl text-slate-700 group-hover:text-purple-400 transition-colors">{icon}</div>
    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 group-hover:text-white">{name}</span>
  </motion.a>
);

// --- [ 4. MARKETPLACE: LIMPIO Y CON BUSCADOR ] ---

const MarketplaceView = () => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const { user, login } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "product"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
  }, []);

  const handleBuy = async (p) => {
    if(!user) return login();
    await setDoc(doc(db, "users", user.uid), { purchases: arrayUnion({...p, purchasedAt: new Date().toISOString()})}, {merge: true});
    alert("¡ADQUIRIDO!");
  };

  return (
    <div className="pt-40 pb-40 px-10 relative z-10 max-w-7xl mx-auto min-h-screen">
      <header className="mb-24 space-y-12">
        <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter italic uppercase leading-none">Market_<span className="text-purple-600">Database.</span></h2>
        {/* BARRA DE BÚSQUEDA */}
        <div className="relative max-w-2xl text-white">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={24} />
          <input type="text" placeholder="BUSCAR_INTELIGENCIA_EN_LA_FORJA..." className="w-full bg-white/[0.03] border border-white/10 p-8 pl-18 rounded-[2.5rem] outline-none focus:border-purple-500 text-white font-black text-xl backdrop-blur-3xl transition-all" onChange={(e) => setSearch(e.target.value)} />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).map((p) => (
          <motion.div key={p.id} whileHover={{ y: -10 }} className="group p-8 rounded-[3.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-2xl hover:border-purple-500/50 transition-all text-white">
            <img src={p.image} className="h-64 w-full object-cover rounded-[2.5rem] mb-8 border border-white/5 shadow-2xl" alt="p" />
            <h3 className="font-black text-xl mb-4 italic uppercase">{p.name}</h3>
            <div className="flex justify-between items-center pt-6 border-t border-white/5">
              <span className="text-3xl font-black text-purple-400">${p.price}</span>
              <button onClick={() => handleBuy(p)} className="p-4 bg-white text-black hover:bg-purple-600 hover:text-white rounded-2xl transition-all shadow-xl"><ShoppingCart size={24}/></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- [ 5. BIBLIOTECA (BÓVEDA) CON BUSCADOR ] ---

const LibraryView = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState('');
  useEffect(() => { if (user) return onSnapshot(doc(db, "users", user.uid), (d) => setPurchases(d.data()?.purchases || [])); }, [user]);

  return (
    <div className="pt-40 pb-40 px-10 relative z-10 max-w-7xl mx-auto min-h-screen">
      <header className="mb-20 space-y-10">
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none text-white text-center md:text-left">Mi_<span className="text-purple-500">Bóveda.</span></h2>
        {/* BUSCADOR DE BIBLIOTECA */}
        <div className="relative max-w-xl mx-auto md:mx-0">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" />
           <input type="text" placeholder="FILTRAR_MIS_ADQUISICIONES..." className="w-full bg-white/[0.03] border border-white/10 p-6 pl-16 rounded-[2rem] outline-none focus:border-purple-500 text-white font-bold backdrop-blur-3xl" onChange={(e) => setSearch(e.target.value)} />
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {purchases.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).map((p, i) => (
          <div key={i} className="p-10 rounded-[3rem] bg-slate-900/60 border border-white/5 flex items-center justify-between group hover:border-purple-500/50 transition-all shadow-2xl">
            <div className="flex gap-6 items-center text-white"><img src={p.image} className="w-20 h-20 rounded-3xl object-cover" alt="p" /><h4 className="font-black text-lg uppercase">{p.name}</h4></div>
            <button onClick={() => p.downloadUrl ? window.open(p.downloadUrl) : alert("Archivo encriptado.")} className="p-5 bg-white/5 hover:bg-purple-600 rounded-3xl transition-all shadow-xl text-white"><Download size={24}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- [ 6. PORTAL DE LOGIN SUPREMO ] ---

const LoginView = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (user) navigate('/dashboard'); }, [user]);

  return (
    <div className="h-screen flex items-center justify-center relative z-50 px-6 text-white">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl p-20 rounded-[5rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl text-center shadow-2xl">
        <div className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-3xl mx-auto mb-16 flex items-center justify-center shadow-2xl animate-pulse ring-4 ring-purple-500/20"><Lock size={40}/></div>
        <h2 className="text-6xl font-black italic uppercase mb-8 tracking-tighter">Acceso_VIP</h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.5em] mb-16">Sistema de Autenticación de Forja v.4.0</p>
        <button onClick={login} className="w-full py-8 bg-white text-black font-black rounded-full shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:bg-purple-600 hover:text-white transition-all uppercase tracking-[1em] text-xs">AUTORIZAR_CON_GOOGLE</button>
      </motion.div>
    </div>
  );
};

// --- [ 7. ESTRUCTURA APP MAESTRA ] ---

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  const [isWarping, setIsWarping] = useState(false);
  const { user, isAdmin, login } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#000105] text-white selection:bg-cyan-500/40 overflow-x-hidden font-sans relative">
          <SpacePortal isWarping={isWarping} />
          <HUDOverlay />
          
          <nav className="fixed top-0 w-full z-[100] h-24 flex items-center px-10 border-b border-white/5 backdrop-blur-xl bg-black/10">
            <div className="max-w-[1800px] mx-auto w-full flex justify-between items-center text-white">
              <Link to="/" className="text-3xl font-black italic tracking-tighter flex items-center gap-4 uppercase"><div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-cyan-400 rounded-xl shadow-lg" />PromptForge</Link>
              <div className="hidden md:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                <Link to="/" className="hover:text-white transition-all">Command_Center</Link>
                <Link to="/marketplace" className="hover:text-purple-400 transition-all">Forge_Market</Link>
                <Link to="/biblioteca" className="hover:text-cyan-400 transition-all">Private_Vault</Link>
              </div>
              <div className="flex items-center gap-6">
                {user ? <Link to="/dashboard" className="w-14 h-14 rounded-3xl border-2 border-purple-500 overflow-hidden shadow-2xl hover:scale-110 transition-transform"><img src={user.photoURL} alt="p" /></Link> : <button onClick={login} className="bg-white text-black px-12 py-3 rounded-full text-[10px] font-black shadow-2xl uppercase">Iniciar_VIP</button>}
              </div>
            </div>
          </nav>

          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeView onAction={setIsWarping} />} />
              <Route path="/marketplace" element={<MarketplaceView />} />
              <Route path="/biblioteca" element={<PrivateRoute><LibraryView /></PrivateRoute>} />
              <Route path="/login" element={<LoginView />} />
              <Route path="/dashboard" element={<PrivateRoute><div className="h-screen flex items-center justify-center font-black text-7xl italic uppercase">Profile_Sincronizado</div></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute adminOnly={true}><div className="h-screen flex items-center justify-center font-black text-7xl italic uppercase">Nucleus_Admin</div></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>

          <footer className="py-64 border-t border-white/5 text-center relative z-10 bg-black/40">
            <div className="text-9xl md:text-[300px] font-black tracking-tighter mb-12 italic text-slate-900 select-none uppercase opacity-10">PromptForge</div>
            <p className="text-slate-800 text-[12px] font-bold uppercase tracking-[2em]">Supreme Edition 2024</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}