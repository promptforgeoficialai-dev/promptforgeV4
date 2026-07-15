import React, { Suspense, useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Preload, Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Sparkles, Zap, ShieldCheck, ArrowRight, ShoppingCart, Search, 
  User, LogOut, Crown, Star, Download, ChevronRight, 
  Lock, Rocket, Globe, Radar, Activity, Target, Radio, Cpu, 
  Box, Eye, Mail, Heart, FileText, Settings, Terminal, MousePointer2
} from 'lucide-react';
import { 
  FaInstagram, FaTiktok, FaTwitter, FaDiscord, 
  FaYoutube, FaGithub, FaTelegramPlane, FaWhatsapp, FaLinkedinIn 
} from "react-icons/fa";

// CONTEXTO Y FIREBASE
import { AuthProvider, useAuth } from './context/AuthContext';
import { db } from './firebase/config';
import { collection, onSnapshot, query, orderBy, doc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

// --- [ 1. MOTOR 3D SUPREMO: ESPACIO Y PRODUCTO ] ---

function StarField() {
  const ref = useRef();
  const [positions] = useState(() => {
    const p = new Float32Array(20000 * 3);
    for (let i = 0; i < 20000; i++) p[i] = (Math.random() - 0.5) * 25;
    return p;
  });
  useFrame((state, delta) => {
    ref.current.position.z += delta * 0.15;
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

function FloatingProduct() {
  const mesh = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.x = Math.cos(t / 4) / 2;
    mesh.current.rotation.y = Math.sin(t / 4) / 2;
  });
  return (
    <Float speed={5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={mesh}>
        <torusKnotGeometry args={[1.2, 0.4, 256, 32]} />
        <MeshTransmissionMaterial backside samples={10} thickness={1} chromaticAberration={0.5} color="#7C3AED" transmission={1} />
      </mesh>
    </Float>
  );
}

const Global3D = () => (
  <div className="fixed inset-0 z-0 bg-[#000105]">
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Suspense fallback={null}><StarField /></Suspense>
    </Canvas>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000105_100%)] opacity-80" />
  </div>
);

// --- [ 2. COMPONENTES HUD (CABINA DE MANDO) ] ---

const HUD_Layer = () => (
  <div className="fixed inset-0 pointer-events-none z-50 hidden xl:block p-10 font-black italic">
    <div className="absolute top-10 left-10 w-32 h-32 border-t-2 border-l-2 border-purple-500/30 rounded-tl-[3rem]" />
    <div className="absolute top-10 right-10 w-32 h-32 border-t-2 border-r-2 border-purple-500/30 rounded-tr-[3rem]" />
    <div className="absolute top-1/2 left-10 -translate-y-1/2 space-y-6">
       <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md w-48">
          <div className="text-[7px] tracking-[0.4em] text-slate-500 mb-2 uppercase">Neural_Sync</div>
          <div className="flex items-center gap-3 text-cyan-400 text-[10px]"> <Activity size={14}/> STABLE_V.4 </div>
       </div>
       <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md w-48">
          <div className="text-[7px] tracking-[0.4em] text-slate-500 mb-2 uppercase">Core_Data</div>
          <div className="flex items-center gap-3 text-purple-500 text-[10px]"> <Cpu size={14}/> OPTIMIZED </div>
       </div>
    </div>
  </div>
);

// --- [ 3. VISTAS PRINCIPALES ] ---

const HomeView = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}><Suspense fallback={null}><FloatingProduct /></Suspense></Canvas>
      </div>

      <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-7xl md:text-[200px] font-black tracking-tighter leading-[0.8] text-white italic select-none uppercase mb-16">
            FORJA EL <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-white to-cyan-400 pr-12 drop-shadow-[0_0_50px_rgba(124,58,237,0.5)]">FUTURO.</span>
          </h1>
          
          {/* REDES SOCIALES INTEGRADAS EN EL INICIO (NO POBRES) */}
          <div className="flex flex-wrap justify-center gap-6 mb-20">
            <SocialBtn icon={<FaInstagram/>} label="Instagram" link="#" color="hover:text-pink-500" />
            <SocialBtn icon={<FaTiktok/>} label="TikTok" link="#" color="hover:text-white" />
            <SocialBtn icon={<FaTwitter/>} label="X.com" link="#" color="hover:text-cyan-400" />
            <SocialBtn icon={<FaDiscord/>} label="Discord" link="#" color="hover:text-indigo-500" />
            <SocialBtn icon={<FaGithub/>} label="GitHub" link="#" color="hover:text-purple-400" />
          </div>

          <button onClick={() => navigate('/marketplace')} className="bg-white text-black font-black px-24 py-10 rounded-[3rem] shadow-[0_0_100px_rgba(255,255,255,0.2)] hover:bg-purple-600 hover:text-white transition-all duration-700 uppercase text-xs tracking-[1em] active:scale-95">
            INICIAR_PROTOCOLO_MERCADO
          </button>
        </motion.div>
      </section>
    </div>
  );
};

const SocialBtn = ({ icon, label, link, color }) => (
  <motion.a href={link} target="_blank" whileHover={{ y: -10, scale: 1.1 }} className={`flex flex-col items-center gap-3 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl transition-all duration-500 ${color} group`}>
    <div className="text-4xl text-slate-500 group-hover:text-current transition-colors">{icon}</div>
    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 group-hover:text-white">{label}</span>
  </motion.a>
);

const MarketplaceView = () => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const { user, login } = useAuth();
  const [favs, setFavs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "product"), orderBy("createdAt", "desc"));
    const unsubProducts = onSnapshot(q, (snapshot) => setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    if (user) {
      const unsubUser = onSnapshot(doc(db, "users", user.uid), (d) => setFavs(d.data()?.favorites || []));
      return () => { unsubProducts(); unsubUser(); };
    }
    return () => unsubProducts();
  }, [user]);

  const toggleFav = async (p) => {
    if (!user) return login();
    const userRef = doc(db, "users", user.uid);
    const isFav = favs.some(f => f.id === p.id);
    await setDoc(userRef, { favorites: isFav ? arrayRemove(p) : arrayUnion(p) }, { merge: true });
  };

  return (
    <div className="pt-40 pb-40 px-10 relative z-10 max-w-[1600px] mx-auto min-h-screen">
      <header className="mb-24 space-y-16">
        <h2 className="text-7xl md:text-[150px] font-black text-white tracking-tighter italic uppercase leading-none opacity-20 select-none absolute top-0 left-0">Archive</h2>
        <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter italic uppercase relative">Data_Market</h2>
        
        {/* BUSCADOR PROFESIONAL MARKETPLACE */}
        <div className="relative max-w-4xl">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600" size={32} />
          <input 
            type="text" 
            placeholder="ACCESS_NUCLEUS_DATA_MARKET..." 
            className="w-full bg-white/[0.03] border border-white/10 p-12 pl-28 rounded-[3.5rem] outline-none focus:border-purple-500 text-white font-black text-3xl backdrop-blur-3xl transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 text-white">
        {products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).map((p) => (
          <motion.div key={p.id} whileHover={{ y: -15 }} className="group p-10 rounded-[5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:border-purple-500/50 transition-all shadow-2xl relative">
            <button onClick={() => toggleFav(p)} className="absolute top-12 right-12 z-20 hover:scale-125 transition-transform">
              <Heart size={28} fill={favs.some(f => f.id === p.id) ? "#ef4444" : "none"} className={favs.some(f => f.id === p.id) ? "text-red-500" : "text-slate-500"} />
            </button>
            <img src={p.image} className="h-72 w-full object-cover rounded-[3.5rem] mb-10 shadow-2xl" alt="p" />
            <h3 className="font-black text-3xl mb-6 italic uppercase tracking-tighter">{p.name}</h3>
            <div className="flex justify-between items-center border-t border-white/5 pt-10">
              <span className="text-5xl font-black text-purple-400 tracking-tighter">${p.price}</span>
              <button onClick={() => alert("Transacción iniciada")} className="p-8 bg-white text-black rounded-3xl hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-90"><ShoppingCart size={32}/></button>
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
      <header className="mb-24 space-y-12">
        <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-none">Mi_<span className="text-purple-500">Bóveda.</span></h2>
        
        {/* BUSCADOR PROFESIONAL BIBLIOTECA */}
        <div className="relative max-w-4xl">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600" size={32} />
          <input 
            type="text" 
            placeholder="SEARCH_MY_VAULT..." 
            className="w-full bg-white/[0.03] border border-white/10 p-12 pl-28 rounded-[3.5rem] outline-none focus:border-cyan-400 text-white font-black text-3xl backdrop-blur-3xl transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {purchases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {purchases.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).map((p, i) => (
            <motion.div key={i} whileHover={{ y: -15 }} className="p-12 rounded-[5rem] bg-slate-900/60 border border-white/5 flex items-center justify-between group hover:border-cyan-500/50 transition-all shadow-2xl backdrop-blur-xl">
              <div className="flex gap-10 items-center text-white">
                <img src={p.image} className="w-32 h-32 rounded-[2.5rem] object-cover shadow-2xl border border-white/10" alt="p" />
                <h4 className="font-black text-3xl uppercase tracking-tighter">{p.name}</h4>
              </div>
              <button onClick={() => p.downloadUrl ? window.open(p.downloadUrl) : alert("Sin link.")} className="p-10 bg-white/5 hover:bg-cyan-500 rounded-[2rem] transition-all shadow-xl text-white"><Download size={40}/></button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="p-32 rounded-[5rem] bg-white/[0.01] border border-white/5 border-dashed text-center opacity-10"><Box className="mx-auto mb-10" size={120} /><p className="font-black uppercase tracking-[1em] text-4xl">Vault_Empty</p></div>
      )}
    </div>
  );
};

// --- [ 4. LOGIN: PORTAL DE ACCESO SUPREMO ] ---

const LoginPortal = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (user) navigate('/dashboard'); }, [user]);

  return (
    <div className="h-screen flex items-center justify-center relative z-[200] px-6 text-white overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" />
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-4xl p-24 rounded-[6rem] bg-[#020617]/40 border border-white/10 backdrop-blur-3xl text-center shadow-2xl relative overflow-hidden">
        <div className="w-32 h-32 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-[2.5rem] mx-auto mb-16 flex items-center justify-center shadow-2xl ring-4 ring-purple-500/20"><Lock size={60} className="text-white"/></div>
        <h2 className="text-8xl font-black italic uppercase mb-6 tracking-tighter leading-none">Security_Gate</h2>
        <p className="text-slate-500 font-bold uppercase text-xs tracking-[1em] mb-20 italic">Authentication_Required_v.4.0</p>
        <button onClick={login} className="w-full py-12 bg-white text-black font-black rounded-full shadow-[0_0_80px_rgba(255,255,255,0.1)] hover:bg-purple-600 hover:text-white transition-all uppercase tracking-[1em] text-sm active:scale-95 group">Authorize_Identity</button>
        <p className="mt-16 text-[8px] font-black text-slate-700 uppercase tracking-[1em]">Encriptación cuántica AES-512 activa</p>
      </motion.div>
    </div>
  );
};

// --- [ 5. ESTRUCTURA APP MAESTRA ] ---

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  const { user, login, logout } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#000105] text-white selection:bg-cyan-500/40 overflow-x-hidden font-sans relative">
          <Global3D />
          <HUD_Layer />
          
          <nav className="fixed top-0 w-full z-[100] h-24 flex items-center px-10 border-b border-white/5 backdrop-blur-xl bg-black/10">
            <div className="max-w-[1800px] mx-auto w-full flex justify-between items-center text-white font-black italic tracking-tighter">
              <Link to="/" className="text-3xl flex items-center gap-4 uppercase tracking-tighter"><div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-cyan-400 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.5)]" />PromptForge</Link>
              <div className="hidden md:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                <Link to="/" className="hover:text-white transition-all">Home_Central</Link>
                <Link to="/marketplace" className="hover:text-purple-400 transition-all">Data_Market</Link>
                <Link to="/biblioteca" className="hover:text-cyan-400 transition-all">My_Vault</Link>
              </div>
              <div className="flex items-center gap-6">
                {user ? <Link to="/dashboard" className="w-14 h-14 rounded-3xl border-2 border-purple-500 overflow-hidden hover:scale-110 transition-transform shadow-2xl shadow-purple-500/20"><img src={user.photoURL} alt="p" /></Link> : <button onClick={login} className="bg-white text-black px-10 py-3 rounded-full text-[10px] font-black shadow-[0_0_30px_rgba(255,255,255,0.2)] uppercase">VIP</button>}
              </div>
            </div>
          </nav>

          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/marketplace" element={<MarketplaceView />} />
              <Route path="/biblioteca" element={<PrivateRoute><LibraryView /></PrivateRoute>} />
              <Route path="/login" element={<LoginPortal />} />
              <Route path="/dashboard" element={<PrivateRoute><div className="h-screen flex flex-col items-center justify-center font-black text-8xl italic uppercase text-white tracking-tighter">Profile_Sync<button onClick={logout} className="text-red-500 text-xs mt-10 tracking-[1em] uppercase">Terminate_Session</button></div></PrivateRoute>} />
            </Routes>
          </AnimatePresence>

          <footer className="py-64 border-t border-white/5 text-center relative z-10 bg-black/80 backdrop-blur-3xl uppercase">
            <div className="text-[12px] font-black tracking-[2em] text-slate-700 mb-12 italic">Official_PromptForge_Terminal</div>
            <div className="flex justify-center gap-12 text-slate-500 hover:text-white transition-colors opacity-30 hover:opacity-100">
               <FaInstagram size={32}/><FaDiscord size={32}/><FaGithub size={32}/><FaTwitter size={32}/><FaYoutube size={32}/>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}