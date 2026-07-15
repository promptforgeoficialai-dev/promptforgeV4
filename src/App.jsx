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
  Library, Box, Eye, Mail, Heart, FileText, Settings, Wifi, Binary, Gauge
} from 'lucide-react';
import { 
  FaInstagram, FaTiktok, FaTwitter, FaDiscord, 
  FaYoutube, FaGithub, FaTelegramPlane, FaWhatsapp, FaLinkedinIn 
} from "react-icons/fa";

// CONTEXTO Y FIREBASE
import { AuthProvider, useAuth } from './context/AuthContext';
import { db } from './firebase/config';
import { collection, onSnapshot, query, orderBy, doc, setDoc, arrayUnion } from 'firebase/firestore';

// --- [ 1. EL MOTOR ESPACIAL 3D ] ---

function StarField({ speed = 0.05 }) {
  const ref = useRef();
  const [positions] = useState(() => {
    const p = new Float32Array(25000 * 3);
    for (let i = 0; i < 25000; i++) p[i] = (Math.random() - 0.5) * 25;
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

const SpaceBackground = ({ isWarping }) => (
  <div className="fixed inset-0 z-0 bg-[#000105]">
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Suspense fallback={null}><StarField speed={isWarping ? 5 : 0.08} /></Suspense>
    </Canvas>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#000105] opacity-90" />
  </div>
);

// --- [ 2. COMPONENTES HUD HD (PARA QUE NO SE VEA POBRE) ] ---

const HUD_Telemetry = () => (
  <div className="fixed inset-0 pointer-events-none z-50 hidden xl:block p-10 font-black italic">
    {/* Esquinas de Scanner */}
    <div className="absolute top-10 left-10 w-32 h-32 border-t-2 border-l-2 border-purple-500/20 rounded-tl-[3rem]" />
    <div className="absolute top-10 right-10 w-32 h-32 border-t-2 border-r-2 border-purple-500/20 rounded-tr-[3rem]" />
    <div className="absolute bottom-10 left-10 w-32 h-32 border-b-2 border-l-2 border-cyan-500/20 rounded-bl-[3rem]" />
    <div className="absolute bottom-10 right-10 w-32 h-32 border-b-2 border-r-2 border-cyan-500/20 rounded-br-[3rem]" />

    {/* Datos laterales izq */}
    <div className="absolute top-1/4 left-10 space-y-6">
      <HUD_SmallCard label="Neural_Load" value="98.2%" color="text-purple-400" icon={<Activity size={10}/>} />
      <HUD_SmallCard label="Sync_Status" value="Linked" color="text-cyan-400" icon={<Wifi size={10}/>} />
      <HUD_SmallCard label="Core_Temp" value="24°C" color="text-emerald-400" icon={<Gauge size={10}/>} />
    </div>

    {/* Datos laterales der */}
    <div className="absolute top-1/4 right-10 space-y-6 text-right">
       <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
          <div className="text-[7px] tracking-[0.4em] text-slate-500 mb-2">SYSTEM_LOGS</div>
          <div className="text-[8px] text-cyan-500/50 space-y-1">
             <p className="animate-pulse">{'>'} INITIATING_V4_CORE...</p>
             <p className="animate-pulse delay-75">{'>'} ENCRYPTING_VAULT...</p>
             <p className="animate-pulse delay-150">{'>'} READY_TO_FORGE</p>
          </div>
       </div>
    </div>
  </div>
);

const HUD_SmallCard = ({ label, value, color, icon }) => (
  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl w-40 backdrop-blur-md">
    <div className="text-[7px] tracking-[0.5em] text-slate-500 uppercase mb-1">{label}</div>
    <div className={`flex items-center gap-2 text-[10px] font-black ${color}`}>{icon} {value}</div>
  </div>
);

// --- [ 3. VISTA HOME: CABINA DE MANDO ] ---

const HomeView = ({ onWarp }) => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="z-10">
        <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-400 text-[10px] font-black uppercase tracking-[0.8em] backdrop-blur-xl mb-12">
          <Binary size={14} className="animate-pulse" /> PromptForge_Terminal_v.4.0
        </motion.div>
        
        <h1 className="text-8xl md:text-[240px] font-black tracking-tighter leading-[0.75] text-white italic mb-16 select-none uppercase">
          FORJA TU <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-white to-cyan-400 pr-12">IMPERIO.</span>
        </h1>

        {/* REDES SOCIALES EN HOME (NO POBRES) */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          <SocialPill icon={<FaInstagram/>} label="Instagram" link="#" color="hover:text-pink-500" />
          <SocialPill icon={<FaTiktok/>} label="TikTok" link="#" color="hover:text-white" />
          <SocialPill icon={<FaTwitter/>} label="X.com" link="#" color="hover:text-blue-400" />
          <SocialPill icon={<FaDiscord/>} label="Discord" link="#" color="hover:text-indigo-500" />
          <SocialPill icon={<FaGithub/>} label="GitHub" link="#" color="hover:text-purple-400" />
        </div>

        <button 
          onClick={() => { onWarp(true); setTimeout(() => { navigate('/marketplace'); onWarp(false); }, 1000); }}
          className="bg-white text-black font-black px-24 py-10 rounded-[3rem] shadow-[0_0_100px_rgba(255,255,255,0.2)] hover:bg-purple-600 hover:text-white transition-all duration-700 uppercase text-xs tracking-[0.6em] active:scale-95"
        >
          INICIAR_WARP_DRIVE
        </button>
      </div>
    </motion.div>
  );
};

const SocialPill = ({ icon, label, link, color }) => (
  <motion.a href={link} target="_blank" whileHover={{ y: -5 }} className={`flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl transition-all ${color} backdrop-blur-xl group`}>
    <span className="text-xl group-hover:scale-125 transition-transform">{icon}</span>
    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">{label}</span>
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
    alert("¡Adquirido exitosamente!");
  };

  return (
    <div className="pt-40 pb-40 px-10 relative z-10 max-w-[1600px] mx-auto min-h-screen">
      <header className="mb-24 space-y-12">
        <h2 className="text-7xl md:text-[150px] font-black text-white tracking-tighter italic uppercase leading-none">Market_<span className="text-purple-600">Archive.</span></h2>
        <div className="relative max-w-3xl">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600" size={28} />
          <input 
            type="text" 
            placeholder="ACCESS_NUCLEUS_DATABASE..." 
            className="w-full bg-white/[0.03] border border-white/10 p-10 pl-24 rounded-[3rem] outline-none focus:border-purple-500 text-white font-black text-2xl backdrop-blur-3xl transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).map((p) => (
          <motion.div key={p.id} whileHover={{ y: -10 }} className="group p-8 rounded-[4rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:border-purple-500/50 transition-all shadow-2xl">
            <img src={p.image} className="h-64 w-full object-cover rounded-[3rem] mb-8 border border-white/5 grayscale group-hover:grayscale-0 transition-all duration-700" alt="p" />
            <h3 className="font-black text-white text-xl mb-4 italic uppercase">{p.name}</h3>
            <div className="flex justify-between items-center pt-6 border-t border-white/5">
              <span className="text-3xl font-black text-purple-400">${p.price}</span>
              <button onClick={() => handleBuy(p)} className="p-5 bg-white text-black hover:bg-purple-600 hover:text-white rounded-2xl transition-all shadow-xl"><ShoppingCart size={24}/></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- [ 5. BIBLIOTECA / BÓVEDA: CON BUSCADOR ] ---

const LibraryView = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState('');
  useEffect(() => { if (user) return onSnapshot(doc(db, "users", user.uid), (d) => setPurchases(d.data()?.purchases || [])); }, [user]);

  return (
    <div className="pt-40 pb-40 px-10 relative z-10 max-w-7xl mx-auto min-h-screen text-white">
      <header className="mb-24 space-y-12">
        <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-none text-white">Mi_<span className="text-purple-600">Bóveda.</span></h2>
        <div className="relative max-w-2xl">
           <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600" size={24} />
           <input 
            type="text" 
            placeholder="SEARCH_MY_VAULT..." 
            className="w-full bg-white/[0.03] border border-white/10 p-8 pl-20 rounded-[2.5rem] outline-none focus:border-purple-500 text-white font-black text-xl backdrop-blur-3xl transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {purchases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {purchases.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).map((p, i) => (
            <div key={i} className="p-12 rounded-[4rem] bg-slate-900/40 border border-white/5 flex items-center justify-between group hover:border-purple-500/50 transition-all shadow-2xl">
              <div className="flex gap-6 items-center">
                <img src={p.image} className="w-24 h-24 rounded-3xl object-cover shadow-2xl border border-white/10" alt="p" />
                <div>
                  <h4 className="font-black text-xl uppercase tracking-tighter">{p.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2"><ShieldCheck size={12} className="text-green-500"/> Authenticated_Method</p>
                </div>
              </div>
              <button onClick={() => p.downloadUrl ? window.open(p.downloadUrl) : alert("Sin link.")} className="p-6 bg-white/5 hover:bg-purple-600 rounded-3xl transition-all shadow-xl text-white"><Download size={28}/></button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-32 rounded-[5rem] bg-white/[0.01] border border-white/5 border-dashed text-center opacity-30"><Box className="mx-auto mb-8" size={80} /><p className="font-black uppercase tracking-widest text-xl">Bóveda_Vacía</p></div>
      )}
    </div>
  );
};

// --- [ 6. LOGIN: DISEÑO INDEPENDIENTE PREMIUM ] ---

const LoginView = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (user) navigate('/dashboard'); }, [user]);

  return (
    <div className="h-screen flex items-center justify-center relative z-50 px-6 text-white">
      {/* Luz ambiental exclusiva de login */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" />

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl p-24 rounded-[6rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-scan" />
        
        <div className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-3xl mx-auto mb-16 flex items-center justify-center shadow-2xl ring-4 ring-purple-500/20"><Lock size={40} className="text-white"/></div>
        <h2 className="text-7xl font-black italic uppercase mb-8 tracking-tighter">Access_VIP</h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.5em] mb-16">Initializing_Auth_Protocol_v4.2</p>
        
        <button onClick={login} className="w-full py-10 bg-white text-black font-black rounded-full shadow-2xl uppercase tracking-[1em] text-xs hover:bg-purple-600 hover:text-white transition-all active:scale-95 group">
           Authorize_Me
        </button>
        
        <p className="mt-16 text-[8px] font-bold text-slate-700 uppercase tracking-widest leading-loose">Encriptación RSA-4096 activada. Tu sesión se mantendrá persistente en esta terminal hasta que sea terminada manualmente.</p>
      </motion.div>
    </div>
  );
};

// --- [ 7. ESTRUCTURA APP PRINCIPAL ] ---

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
          <SpaceBackground isWarping={isWarping} />
          <HUD_Telemetry />
          
          <nav className="fixed top-0 w-full z-[100] h-24 flex items-center px-10 border-b border-white/5 backdrop-blur-xl bg-black/10">
            <div className="max-w-[1800px] mx-auto w-full flex justify-between items-center text-white">
              <Link to="/" className="text-3xl font-black italic tracking-tighter flex items-center gap-4 uppercase tracking-tighter"><div className="w-10 h-10 bg-purple-600 rounded-xl shadow-lg" />PromptForge</Link>
              <div className="hidden md:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                <Link to="/" className="hover:text-white transition-all">Home_Command</Link>
                <Link to="/marketplace" className="hover:text-purple-400 transition-all">Market_Data</Link>
                <Link to="/biblioteca" className="hover:text-cyan-400 transition-all">Private_Vault</Link>
              </div>
              <div className="flex items-center gap-6">
                {user ? <Link to="/dashboard" className="w-14 h-14 rounded-3xl border-2 border-purple-500 overflow-hidden shadow-2xl hover:scale-110 transition-transform"><img src={user.photoURL} alt="p" /></Link> : <button onClick={login} className="bg-white text-black px-10 py-3 rounded-full text-[10px] font-black shadow-xl uppercase">VIP</button>}
              </div>
            </div>
          </nav>

          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeView onWarp={setIsWarping} />} />
              <Route path="/marketplace" element={<MarketplaceView />} />
              <Route path="/biblioteca" element={<PrivateRoute><LibraryView /></PrivateRoute>} />
              <Route path="/login" element={<LoginView />} />
              <Route path="/dashboard" element={<PrivateRoute><div className="h-screen flex flex-col items-center justify-center font-black text-8xl italic uppercase text-white uppercase tracking-tighter">Syncing_Profile<p className="text-sm text-slate-500 mt-10 tracking-[1em]">Dashboard_Online</p></div></PrivateRoute>} />
            </Routes>
          </AnimatePresence>

          <footer className="py-64 border-t border-white/5 text-center relative z-10 bg-black/80 backdrop-blur-3xl">
            <div className="text-9xl md:text-[300px] font-black tracking-tighter mb-12 italic text-slate-900 select-none uppercase opacity-10">PromptForge</div>
            <p className="text-slate-800 text-[12px] font-bold uppercase tracking-[2em]">Build_the_Future_with_IA</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}