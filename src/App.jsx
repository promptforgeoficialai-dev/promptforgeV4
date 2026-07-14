import React, { Suspense, useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Preload } from '@react-three/drei';
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
import { collection, onSnapshot, query, orderBy, doc, setDoc, arrayUnion } from 'firebase/firestore';
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

// --- [ 2. PANELES HUD DE CABINA ] ---

const HUDPanel = ({ title, children, side = "left" }) => (
  <div className={`fixed top-1/2 -translate-y-1/2 ${side === "left" ? "left-10" : "right-10"} z-50 hidden xl:block`}>
    <motion.div initial={{ opacity: 0, x: side === "left" ? -50 : 50 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-md w-64 space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-400">{title}</span>
      </div>
      {children}
    </motion.div>
  </div>
);

// --- [ 3. VISTAS DE LA PLATAFORMA ] ---

const HomeView = ({ onAction }) => {
  const navigate = useNavigate();
  return (
    <div className="relative">
      <HUDPanel title="System_Status" side="left">
        <div className="space-y-4 text-white uppercase font-black tracking-widest text-[8px]">
          <div className="flex justify-between">Power: <span className="text-purple-400">98%</span></div>
          <div className="h-1 bg-white/5 rounded-full"><div className="h-full bg-purple-500 w-[98%]" /></div>
          <div className="pt-4 flex items-center gap-2 text-cyan-400"><Activity size={12}/> Link_Active</div>
        </div>
      </HUDPanel>

      <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative z-10">
        <motion.h1 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-7xl md:text-[250px] font-black tracking-tighter leading-[0.75] text-white italic select-none uppercase">
          FORJA TU <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-white to-cyan-400 pr-12">IMPERIO.</span>
        </motion.h1>
        <button 
          onClick={() => { onAction(true); setTimeout(() => { navigate('/marketplace'); onAction(false); }, 1000); }}
          className="bg-white text-black font-black px-20 py-8 rounded-full shadow-[0_0_80px_rgba(255,255,255,0.2)] hover:bg-purple-600 hover:text-white transition-all duration-700 uppercase text-xs tracking-[0.6em] active:scale-95"
        >
          INICIAR_WARP_DRIVE
        </button>
      </section>

      {/* REDES SOCIALES INTEGRADAS AL BAJAR */}
      <section className="py-40 px-10 relative z-10 bg-black/20 backdrop-blur-3xl border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black italic uppercase mb-16 tracking-tighter text-white">Conexión_Nucleus</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <SocialItem icon={<FaInstagram/>} name="Instagram" link="#" />
            <SocialItem icon={<FaTiktok/>} name="TikTok" link="#" />
            <SocialItem icon={<FaTwitter/>} name="X.com" link="#" />
            <SocialItem icon={<FaDiscord/>} name="Discord" link="#" />
            <SocialItem icon={<FaGithub/>} name="GitHub" link="#" />
          </div>
        </div>
      </section>
    </div>
  );
};

const SocialItem = ({ icon, name, link }) => (
  <motion.a href={link} target="_blank" whileHover={{ y: -10 }} className="p-10 rounded-[3rem] bg-white/[0.01] border border-white/5 backdrop-blur-xl flex flex-col items-center gap-4 group hover:bg-white/[0.03] transition-all">
    <div className="text-4xl text-slate-600 group-hover:text-purple-400 transition-colors">{icon}</div>
    <span className="text-[9px] font-black uppercase tracking-widest text-slate-800 group-hover:text-white">{name}</span>
  </motion.a>
);

const MarketplaceView = () => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const { login, user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "product"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data.length > 0 ? data : allProducts);
    });
  }, []);

  return (
    <div className="pt-40 pb-40 px-10 relative z-10 max-w-7xl mx-auto min-h-screen">
      <header className="mb-24 space-y-12">
        <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter italic uppercase leading-none">Market_<span className="text-purple-600">Archive.</span></h2>
        <div className="relative max-w-2xl text-white">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={24} />
          <input type="text" placeholder="ACCESS_DATABASE..." className="w-full bg-white/[0.03] border border-white/10 p-8 pl-16 rounded-[2.5rem] outline-none focus:border-purple-500 text-white font-black text-xl backdrop-blur-3xl transition-all" onChange={(e) => setSearch(e.target.value)} />
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).map((p) => (
          <motion.div key={p.id} whileHover={{ y: -10 }} className="group p-8 rounded-[3.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-2xl hover:border-purple-500/50 transition-all text-white">
            <img src={p.image} className="h-64 w-full object-cover rounded-[2.5rem] mb-8" alt="p" />
            <h3 className="font-black text-white text-xl mb-4 italic uppercase">{p.name}</h3>
            <div className="flex justify-between items-center border-t border-white/5 pt-6">
              <span className="text-3xl font-black text-purple-400">${p.price}</span>
              <button onClick={() => alert("Comprado")} className="bg-white text-black p-4 rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-90"><ShoppingCart size={22}/></button>
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
          <div key={i} className="p-10 rounded-[3rem] bg-slate-900/60 border border-white/5 flex items-center justify-between group">
            <div className="flex gap-6 items-center"><img src={p.image} className="w-20 h-20 rounded-3xl object-cover" alt="p" /><h4 className="font-black text-lg uppercase text-white">{p.name}</h4></div>
            <button onClick={() => p.downloadUrl ? window.open(p.downloadUrl) : alert("Sin link.")} className="p-5 bg-white/5 hover:bg-purple-600 rounded-3xl transition-all shadow-xl text-white"><Download size={24}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- [ 4. LOGIN VIEW SUPREMO (NUEVO) ] ---
const LoginView = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (user) navigate('/dashboard'); }, [user]);

  return (
    <div className="h-screen flex items-center justify-center relative z-10 px-6 text-white">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl p-20 rounded-[5rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl text-center shadow-2xl">
        <div className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-3xl mx-auto mb-16 flex items-center justify-center shadow-2xl animate-pulse"><Lock size={40}/></div>
        <h2 className="text-6xl font-black italic uppercase mb-16 tracking-tighter">Access_Denied</h2>
        <button onClick={login} className="w-full py-8 bg-white text-black font-black rounded-full shadow-2xl uppercase tracking-[1em] text-xs hover:bg-purple-600 hover:text-white transition-all">Authorize_Me</button>
      </motion.div>
    </div>
  );
};

// --- [ 5. ESTRUCTURA APP ] ---

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  const [isWarping, setIsWarping] = useState(false);
  const { user, login } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#000105] text-white selection:bg-cyan-500/40 overflow-x-hidden font-sans relative">
          <SpacePortal isWarping={isWarping} />
          
          <nav className="fixed top-0 w-full z-[100] h-24 flex items-center px-10 border-b border-white/5 backdrop-blur-xl bg-black/10 text-white font-black italic tracking-tighter">
            <div className="max-w-[1800px] mx-auto w-full flex justify-between items-center text-white">
              <Link to="/" className="text-2xl flex items-center gap-4 uppercase tracking-tighter"><div className="w-8 h-8 bg-purple-600 rounded-xl" />PromptForge</Link>
              <div className="hidden md:flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                <Link to="/" className="hover:text-white transition-all">Home</Link>
                <Link to="/marketplace" className="hover:text-purple-400 transition-all">Market</Link>
                <Link to="/biblioteca" className="hover:text-cyan-400 transition-all">Bóveda</Link>
              </div>
              {user ? <Link to="/dashboard" className="w-14 h-14 rounded-3xl border-2 border-purple-500 overflow-hidden"><img src={user.photoURL} alt="p" /></Link> : <button onClick={login} className="bg-white text-black px-10 py-3 rounded-full text-[10px] font-black shadow-2xl uppercase tracking-widest">VIP</button>}
            </div>
          </nav>

          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeView onAction={setIsWarping} />} />
              <Route path="/marketplace" element={<MarketplaceView />} />
              <Route path="/biblioteca" element={<PrivateRoute><LibraryView /></PrivateRoute>} />
              <Route path="/login" element={<LoginView />} />
              <Route path="/dashboard" element={<PrivateRoute><div className="h-screen flex items-center justify-center text-7xl font-black italic uppercase">Syncing_User_Profile...</div></PrivateRoute>} />
            </Routes>
          </AnimatePresence>

          <footer className="py-40 border-t border-white/5 text-center relative z-10 bg-black/40">
            <div className="text-9xl md:text-[300px] font-black tracking-tighter mb-12 italic text-slate-900 select-none uppercase opacity-10">PromptForge</div>
            <p className="text-slate-800 text-[12px] font-bold uppercase tracking-[2em]">Build_the_Future_with_IA</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}