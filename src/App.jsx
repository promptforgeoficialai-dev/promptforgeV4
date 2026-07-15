import React, { Suspense, useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Preload, Float, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Sparkles, Zap, ShieldCheck, ArrowRight, ShoppingCart, Search, 
  User, LogOut, Crown, Star, Download, ChevronRight, 
  Lock, Rocket, Globe, Radar, Activity, Target, Radio, Cpu, 
  Library, Box, Eye, Mail, Heart, FileText
} from 'lucide-react';
import { 
  FaInstagram, FaTiktok, FaTwitter, FaDiscord, 
  FaYoutube, FaGithub, FaTelegramPlane, FaWhatsapp, FaLinkedinIn 
} from "react-icons/fa";

// CONTEXTO Y FIREBASE
import { AuthProvider, useAuth } from './context/AuthContext';
import { db } from './firebase/config';
import { collection, onSnapshot, query, orderBy, doc, setDoc, arrayUnion } from 'firebase/firestore';

// --- [ 1. COMPONENTES 3D BLINDADOS ] ---

function StarField() {
  const ref = useRef();
  const [positions] = useState(() => {
    const p = new Float32Array(15000 * 3);
    for (let i = 0; i < 15000; i++) p[i] = (Math.random() - 0.5) * 20;
    return p;
  });
  useFrame((state, delta) => {
    ref.current.position.z += delta * 0.15;
    if (ref.current.position.z > 5) ref.current.position.z = 0;
  });
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#ffffff" size={0.007} sizeAttenuation depthWrite={false} />
    </Points>
  );
}

function MainEngine() {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.2;
    meshRef.current.rotation.y = t * 0.3;
  });
  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.2, 0.3, 128, 32]} />
        <MeshTransmissionMaterial backside samples={6} thickness={1} chromaticAberration={0.2} color="#7C3AED" transmission={1} />
      </mesh>
    </Float>
  );
}

// --- [ 2. PANELES HUD HD ] ---

const HUD_UI = () => (
  <div className="fixed inset-0 pointer-events-none z-50 hidden xl:block p-10 font-black italic">
    <div className="absolute top-10 left-10 w-24 h-24 border-t-2 border-l-2 border-cyan-400/30 rounded-tl-[3rem]" />
    <div className="absolute top-10 right-10 w-24 h-24 border-t-2 border-r-2 border-purple-500/30 rounded-tr-[3rem]" />
    <div className="absolute top-1/2 left-10 -translate-y-1/2 space-y-6">
       <div className="bg-white/5 border border-white/10 p-4 rounded-2xl w-48 backdrop-blur-md">
          <div className="text-[8px] tracking-[0.3em] text-slate-500 mb-2 uppercase">Neural_Sync</div>
          <div className="flex items-center gap-3 text-cyan-400 text-xs"><Activity size={14}/> STABLE</div>
       </div>
       <div className="bg-white/5 border border-white/10 p-4 rounded-2xl w-48 backdrop-blur-md text-right">
          <div className="text-[8px] tracking-[0.3em] text-slate-500 mb-2 uppercase">Signal_Link</div>
          <div className="flex items-center justify-end gap-3 text-purple-500 text-xs">ACTIVE <Radio size={14}/></div>
       </div>
    </div>
  </div>
);

// --- [ 3. VISTAS (HOME, MARKET, BÓVEDA) ] ---

const HomeView = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
           <Suspense fallback={null}><MainEngine /><Environment preset="city" /></Suspense>
        </Canvas>
      </div>

      <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative z-10">
        <motion.h1 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-7xl md:text-[220px] font-black tracking-tighter leading-[0.8] text-white italic select-none mb-16 uppercase">
          FORJA TU <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-white to-cyan-400 pr-12">IMPERIO.</span>
        </motion.h1>
        <button onClick={() => navigate('/marketplace')} className="bg-white text-black font-black px-16 py-7 rounded-full shadow-[0_0_80px_rgba(255,255,255,0.2)] hover:bg-purple-600 hover:text-white transition-all duration-700 uppercase text-xs tracking-[0.6em] active:scale-90">INICIAR_SISTEMA_MARKET</button>
      </section>

      {/* REDES SOCIALES NO POBRES */}
      <section className="py-40 px-10 relative z-10 bg-black/40 backdrop-blur-3xl border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center space-y-24">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase text-white tracking-tighter">Conexión_Nucleus</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <BigSocial icon={<FaInstagram/>} name="Instagram" color="hover:text-pink-500" />
            <BigSocial icon={<FaTiktok/>} name="TikTok" color="hover:text-white" />
            <BigSocial icon={<FaTwitter/>} name="X.com" color="hover:text-blue-400" />
            <BigSocial icon={<FaDiscord/>} name="Discord" color="hover:text-indigo-600" />
            <BigSocial icon={<FaGithub/>} name="GitHub" color="hover:text-white" />
          </div>
        </div>
      </section>
    </div>
  );
};

const BigSocial = ({ icon, name, color }) => (
  <motion.a href="#" className={`p-16 rounded-[4rem] bg-white/[0.01] border border-white/5 backdrop-blur-2xl flex flex-col items-center gap-6 group ${color} transition-all duration-500 shadow-2xl`}>
    <div className="text-6xl text-slate-700 group-hover:text-current transition-colors">{icon}</div>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">{name}</span>
  </motion.a>
);

const MarketplaceView = () => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const { login, user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "product"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
  }, []);

  const buy = async (p) => {
    if(!user) return login();
    await setDoc(doc(db, "users", user.uid), { purchases: arrayUnion({...p, purchasedAt: new Date().toISOString()})}, {merge: true});
    alert("¡Adquirido!");
  };

  return (
    <div className="pt-40 pb-40 px-10 relative z-10 max-w-7xl mx-auto min-h-screen">
      <header className="mb-24 space-y-12">
        <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter italic uppercase leading-none">Market_<span className="text-purple-600">Archive.</span></h2>
        <div className="relative max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={24} />
          <input type="text" placeholder="ACCESS_DATABASE..." className="w-full bg-white/[0.03] border border-white/10 p-8 pl-16 rounded-[2.5rem] outline-none focus:border-purple-500 text-white font-black text-xl backdrop-blur-3xl" onChange={(e) => setSearch(e.target.value)} />
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).map((p) => (
          <motion.div key={p.id} whileHover={{ y: -10 }} className="group p-8 rounded-[3.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-2xl hover:border-purple-500/50 transition-all text-white shadow-2xl">
            <img src={p.image} className="h-64 w-full object-cover rounded-[2.5rem] mb-8" alt="p" />
            <h3 className="font-black text-xl mb-4 italic uppercase">{p.name}</h3>
            <div className="flex justify-between items-center border-t border-white/5 pt-6 text-white uppercase font-black tracking-widest"><span className="text-3xl text-purple-400">${p.price}</span><button onClick={() => buy(p)} className="bg-white text-black p-4 rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-90"><ShoppingCart size={22}/></button></div>
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
  useEffect(() => { if (user) return onSnapshot(doc(db, "users", user.uid), (d) => setPurchases(d.data()?.purchases || [])); }, [user]);

  return (
    <div className="pt-40 pb-40 px-10 relative z-10 max-w-7xl mx-auto min-h-screen text-white">
      <header className="mb-20 space-y-10">
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">Mi_<span className="text-purple-500">Bóveda.</span></h2>
        <div className="relative max-w-xl">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" />
           <input type="text" placeholder="BUSCAR_EN_BOVEDA..." className="w-full bg-white/[0.03] border border-white/10 p-6 pl-16 rounded-[2rem] outline-none focus:border-purple-500 text-white font-bold backdrop-blur-3xl" onChange={(e) => setSearch(e.target.value)} />
        </div>
      </header>
      <div className="grid md:grid-cols-2 gap-8">
        {purchases.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).map((p, i) => (
          <div key={i} className="p-10 rounded-[3rem] bg-slate-900/60 border border-white/5 flex items-center justify-between group hover:border-purple-500/50 transition-all shadow-2xl">
            <div className="flex gap-6 items-center text-white font-black uppercase"><img src={p.image} className="w-20 h-20 rounded-3xl object-cover" alt="p" /><h4>{p.name}</h4></div>
            <button onClick={() => p.downloadUrl ? window.open(p.downloadUrl) : alert("Sin link.")} className="p-5 bg-white/5 hover:bg-purple-600 rounded-3xl transition-all shadow-xl text-white"><Download size={24}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- [ 4. COMPONENTE APP ] ---

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  const { user, login, logout, isAdmin } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#000105] text-white selection:bg-cyan-500/40 overflow-x-hidden font-sans relative">
          
          <div className="fixed inset-0 z-0 bg-[#000105]">
             <Canvas camera={{ position: [0, 0, 1] }}><Suspense fallback={null}><StarField /></Suspense></Canvas>
          </div>
          
          <HUD_UI />
          
          <nav className="fixed top-0 w-full z-[100] h-24 flex items-center px-10 border-b border-white/5 backdrop-blur-xl bg-black/10">
            <div className="max-w-[1800px] mx-auto w-full flex justify-between items-center text-white">
              <Link to="/" className="text-2xl font-black italic tracking-tighter flex items-center gap-4 uppercase"><div className="w-10 h-10 bg-purple-600 rounded-xl shadow-lg shadow-purple-500/20" />PromptForge</Link>
              <div className="hidden md:flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                <Link to="/" className="hover:text-white transition-all tracking-[0.5em]">Home</Link>
                <Link to="/marketplace" className="hover:text-white transition-all tracking-[0.5em]">Market</Link>
                <Link to="/biblioteca" className="hover:text-white transition-all tracking-[0.5em]">Bóveda</Link>
              </div>
              <div className="flex items-center gap-6">{user ? <Link to="/dashboard" className="w-14 h-14 rounded-3xl border-2 border-purple-500 overflow-hidden shadow-2xl hover:scale-110 transition-transform"><img src={user.photoURL} alt="p" /></Link> : <button onClick={login} className="bg-white text-black px-10 py-3 rounded-full text-[10px] font-black shadow-xl uppercase">VIP</button>}</div>
            </div>
          </nav>

          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/marketplace" element={<MarketplaceView />} />
              <Route path="/biblioteca" element={<PrivateRoute><LibraryView /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><div className="h-screen flex flex-col items-center justify-center font-black text-7xl italic uppercase">Control_Panel<button onClick={logout} className="text-red-500 text-xs mt-10 uppercase tracking-widest">Logout</button></div></PrivateRoute>} />
              <Route path="/login" element={<div className="h-screen flex items-center justify-center font-black text-6xl italic uppercase">Redirecting...</div>} />
            </Routes>
          </AnimatePresence>

          <footer className="py-64 border-t border-white/5 text-center relative z-10 bg-black/40">
            <div className="text-9xl md:text-[300px] font-black tracking-tighter mb-12 italic text-slate-900 select-none uppercase opacity-10">PromptForge</div>
            <p className="text-slate-800 text-[12px] font-bold uppercase tracking-[2em]">Build_the_Future_with_IA</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}