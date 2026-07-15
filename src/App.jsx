import React, { Suspense, useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Preload, Float, MeshTransmissionMaterial, PerspectiveCamera, Text, Box } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Sparkles, Zap, ShieldCheck, ArrowRight, ShoppingCart, Search, 
  User, LogOut, Crown, Star, Download, ChevronRight, 
  Lock, Rocket, Globe, Radar, Activity, Target, Radio, Cpu, 
  Library, Box as BoxIcon, Mail, Heart, FileText, Settings, Eye, KeyRound
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

// --- [ 1. COMPONENTES 3D SUPREMOS ] ---

function StarField() {
  const ref = useRef();
  const [positions] = useState(() => {
    const p = new Float32Array(25000 * 3);
    for (let i = 0; i < 25000; i++) p[i] = (Math.random() - 0.5) * 30;
    return p;
  });
  useFrame((state, delta) => {
    ref.current.position.z += delta * 0.2;
    if (ref.current.position.z > 15) ref.current.position.z = 0;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.mouse.y * 0.2, 0.05);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, state.mouse.x * 0.2, 0.05);
  });
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#ffffff" size={0.008} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

// Silueta 3D de Producto Digital (Cubo de Datos)
function DigitalProduct3D() {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.5;
    meshRef.current.rotation.z = t * 0.2;
    meshRef.current.position.y = Math.sin(t) * 0.2;
  });
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <MeshTransmissionMaterial 
          backside samples={10} thickness={1} chromaticAberration={0.5}
          anisotropy={0.3} distortion={0.5} color="#7C3AED" transmission={1}
        />
        {/* Rejilla interna del producto */}
        <Box args={[1.8, 1.8, 1.8]}>
          <meshStandardMaterial color="#22d3ee" wireframe transparent opacity={0.2} />
        </Box>
      </mesh>
    </Float>
  );
}

const Background3D = () => (
  <div className="fixed inset-0 z-0 bg-[#000105]">
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Suspense fallback={null}><StarField /></Suspense>
    </Canvas>
  </div>
);

// --- [ 2. DISEÑO HUD Y LAYOUT ] ---

const AppNavbar = () => {
  const { user, login } = useAuth();
  return (
    <nav className="fixed top-0 w-full z-[100] h-24 flex items-center px-10 border-b border-white/5 backdrop-blur-xl bg-black/20">
      <div className="max-w-[1800px] mx-auto w-full flex justify-between items-center text-white font-black italic tracking-tighter">
        <Link to="/" className="text-3xl flex items-center gap-4 uppercase"><div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-cyan-400 rounded-2xl shadow-[0_0_30px_rgba(124,58,237,0.5)]" />PromptForge</Link>
        <div className="hidden md:flex gap-16 text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">
          <Link to="/" className="hover:text-white transition-all">Command_Center</Link>
          <Link to="/marketplace" className="hover:text-purple-400 transition-all">Market_Archive</Link>
          <Link to="/biblioteca" className="hover:text-cyan-400 transition-all">Private_Vault</Link>
        </div>
        {user ? (
          <Link to="/dashboard" className="w-14 h-14 rounded-3xl border-2 border-purple-500 overflow-hidden hover:scale-110 transition-transform shadow-2xl shadow-purple-500/20"><img src={user.photoURL} alt="p" /></Link>
        ) : (
          <button onClick={login} className="bg-white text-black px-12 py-3 rounded-full text-[10px] font-black hover:bg-purple-600 hover:text-white transition-all shadow-xl uppercase tracking-widest">Login_VIP</button>
        )}
      </div>
    </nav>
  );
};

// --- [ 3. VISTAS PRINCIPALES ] ---

const HomeView = () => {
  const navigate = useNavigate();
  return (
    <div className="relative w-full">
      {/* SECCIÓN 1: HERO SUPREMO CON 3D REAL */}
      <section className="h-screen w-full flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#7C3AED" />
            <DigitalProduct3D />
          </Canvas>
        </div>
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="z-10 mt-32">
          <h1 className="text-8xl md:text-[250px] font-black tracking-tighter leading-[0.75] text-white italic select-none uppercase drop-shadow-[0_0_50px_rgba(124,58,237,0.3)]">
            FORJA TU <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-white to-cyan-400 pr-12">IMPERIO.</span>
          </h1>

          {/* REDES SOCIALES PREMIUM INICIO */}
          <div className="flex flex-wrap justify-center gap-6 mt-16 mb-20">
            <SocialPill icon={<FaInstagram/>} label="Instagram" color="hover:bg-pink-600" />
            <SocialPill icon={<FaTiktok/>} label="TikTok" color="hover:bg-slate-800" />
            <SocialPill icon={<FaTwitter/>} label="X.com" color="hover:bg-blue-500" />
            <SocialPill icon={<FaDiscord/>} label="Discord" color="hover:bg-indigo-600" />
            <SocialPill icon={<FaGithub/>} label="GitHub" color="hover:bg-slate-700" />
          </div>

          <button 
            onClick={() => navigate('/marketplace')}
            className="bg-white text-black font-black px-24 py-10 rounded-[3rem] shadow-[0_0_100px_rgba(255,255,255,0.2)] hover:bg-purple-600 hover:text-white transition-all duration-700 uppercase text-xs tracking-[1em] active:scale-95"
          >
            ENTRAR_A_LA_DATAFORJA
          </button>
        </motion.div>
      </section>

      {/* SECCIÓN 2: TELEMETRÍA (LLENA EL ESPACIO) */}
      <section className="py-64 px-10 bg-black/40 backdrop-blur-3xl border-y border-white/5 relative z-10 w-full">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <HUDCard icon={<Cpu/>} label="AI_Processor" value="v.4.2.0" desc="Sincronización neuronal de prompts activa." />
          <HUDCard icon={<Radar/>} label="Live_Scanning" value="Searching" desc="Monitorizando mercados digitales en tiempo real." />
          <HUDCard icon={<ShieldCheck/>} label="Vault_Security" value="Encrypted" desc="Tus métodos protegidos por cifrado cuántico." />
          <HUDCard icon={<Globe/>} label="Global_Network" value="Connected" desc="Acceso desde cualquier terminal del planeta." />
        </div>
      </section>
    </div>
  );
};

const HUDCard = ({ icon, label, value, desc }) => (
  <div className="p-12 rounded-[4rem] bg-white/[0.02] border border-white/5 flex flex-col gap-6 hover:border-purple-500/50 transition-all group">
    <div className="flex justify-between items-center border-b border-white/5 pb-6">
      <div className="text-purple-400 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-xs font-black text-cyan-400 uppercase tracking-widest">{value}</div>
    </div>
    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">{label}</div>
    <p className="text-slate-400 text-sm font-medium leading-loose">{desc}</p>
  </div>
);

const SocialPill = ({ icon, label, color }) => (
  <motion.a href="#" whileHover={{ y: -10 }} className={`flex items-center gap-4 px-10 py-5 bg-white/5 border border-white/10 rounded-3xl transition-all ${color} group backdrop-blur-3xl shadow-2xl`}>
    <span className="text-2xl group-hover:scale-125 transition-transform">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover:text-white">{label}</span>
  </motion.a>
);

const MarketplaceView = () => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const { user, login } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "product"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  return (
    <div className="pt-44 pb-40 px-10 relative z-10 max-w-[1800px] mx-auto min-h-screen text-white">
      <header className="mb-32 space-y-16">
        <h2 className="text-9xl md:text-[200px] font-black tracking-tighter uppercase italic leading-none opacity-20 select-none absolute top-0 left-0">Archive</h2>
        <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-none relative">Data_Market</h2>
        
        {/* BUSCADOR PROFESIONAL MARKETPLACE */}
        <div className="relative max-w-4xl group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-500 transition-colors" size={32} />
          <input 
            type="text" 
            placeholder="ACCESS_NUCLEUS_DATA_MARKET..." 
            className="w-full bg-white/[0.03] border border-white/10 p-12 pl-28 rounded-[3.5rem] outline-none focus:border-purple-500 text-white font-black text-3xl backdrop-blur-3xl transition-all shadow-2xl"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).map((p) => (
          <motion.div key={p.id} whileHover={{ y: -20, rotateX: 5 }} style={{ transformStyle: 'preserve-3d' }} className="p-10 rounded-[5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:border-purple-500/50 transition-all duration-700 shadow-2xl">
            <img src={p.image} className="h-72 w-full object-cover rounded-[3.5rem] mb-10 border border-white/5" alt="p" />
            <h3 className="font-black text-3xl mb-6 italic uppercase tracking-tighter">{p.name}</h3>
            <div className="flex justify-between items-center border-t border-white/5 pt-10">
              <span className="text-5xl font-black text-purple-400 tracking-tighter">${p.price}</span>
              <button className="p-8 bg-white text-black rounded-3xl hover:bg-purple-600 hover:text-white transition-all shadow-2xl active:scale-90"><ShoppingCart size={32}/></button>
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
    <div className="pt-44 pb-40 px-10 relative z-10 max-w-[1800px] mx-auto min-h-screen text-white">
      <header className="mb-32 space-y-16 text-center md:text-left">
        <h2 className="text-9xl md:text-[200px] font-black tracking-tighter uppercase italic leading-none opacity-20 select-none absolute top-0 left-0">Secure</h2>
        <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-none relative">Private_Vault</h2>
        
        {/* BUSCADOR PROFESIONAL BIBLIOTECA */}
        <div className="relative max-w-4xl group mx-auto md:mx-0">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={32} />
          <input 
            type="text" 
            placeholder="SEARCH_MY_VAULT..." 
            className="w-full bg-white/[0.03] border border-white/10 p-12 pl-28 rounded-[3.5rem] outline-none focus:border-cyan-400 text-white font-black text-3xl backdrop-blur-3xl transition-all shadow-2xl"
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
                <div>
                  <h4 className="font-black text-3xl uppercase tracking-tighter">{p.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[1em] mt-4">Verified_Ownership</p>
                </div>
              </div>
              <button onClick={() => p.downloadUrl ? window.open(p.downloadUrl) : alert("Sin link.")} className="p-10 bg-white/5 hover:bg-cyan-500 rounded-[2rem] transition-all shadow-xl text-white"><Download size={40}/></button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="p-32 rounded-[5rem] bg-white/[0.01] border border-white/5 border-dashed text-center opacity-10"><BoxIcon className="mx-auto mb-10" size={120} /><p className="font-black uppercase tracking-[1em] text-4xl">Vault_Empty</p></div>
      )}
    </div>
  );
};

const LoginPortal = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (user) navigate('/dashboard'); }, [user]);
  return (
    <div className="h-screen flex items-center justify-center relative z-[200] px-6 text-white overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" />
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl p-24 rounded-[6rem] bg-[#020617]/40 border border-white/10 backdrop-blur-3xl text-center shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        <div className="w-32 h-32 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-[2.5rem] mx-auto mb-16 flex items-center justify-center shadow-[0_0_50px_rgba(124,58,237,0.4)] animate-glow"><Lock size={60} className="text-white"/></div>
        <h2 className="text-8xl font-black italic uppercase mb-6 tracking-tighter">Identity_Gate</h2>
        <p className="text-slate-500 font-bold uppercase text-xs tracking-[1em] mb-20 italic">Authentication_Required_v.4.0</p>
        <button onClick={login} className="w-full py-12 bg-white text-black font-black rounded-full shadow-[0_0_80px_rgba(255,255,255,0.1)] hover:bg-purple-600 hover:text-white transition-all uppercase tracking-[1em] text-sm active:scale-95">Authorize_Session</button>
      </motion.div>
    </div>
  );
};

// --- [ 4. ESTRUCTURA APP ] ---

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  const [isWarping, setIsWarping] = useState(false);
  const { user, login, logout, isAdmin } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#000105] text-white selection:bg-cyan-500/40 overflow-x-hidden font-sans relative">
          <Background3D isWarping={isWarping} />
          <AppNavbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeView onWarp={setIsWarping} />} />
              <Route path="/marketplace" element={<MarketplaceView />} />
              <Route path="/biblioteca" element={<PrivateRoute><LibraryView /></PrivateRoute>} />
              <Route path="/login" element={<LoginPortal />} />
              <Route path="/dashboard" element={<PrivateRoute><div className="h-screen flex flex-col items-center justify-center font-black text-[120px] italic uppercase text-white tracking-tighter">Sync_Profile<button onClick={logout} className="text-red-500 text-xs mt-10 tracking-[1em] uppercase">Terminate_Access</button></div></PrivateRoute>} />
            </Routes>
          </AnimatePresence>
          <footer className="py-64 border-t border-white/5 text-center relative z-10 bg-black/80 backdrop-blur-3xl uppercase">
            <div className="text-[12px] font-black tracking-[2em] text-slate-700 mb-12">PromptForge_Official_Nucleus</div>
            <div className="flex justify-center gap-12 text-slate-500 hover:text-white transition-colors opacity-30 hover:opacity-100">
               <FaInstagram size={30}/><FaDiscord size={30}/><FaGithub size={30}/><FaTwitter size={30}/><FaYoutube size={30}/>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}