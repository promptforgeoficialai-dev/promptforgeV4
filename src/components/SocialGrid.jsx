import React from 'react';
import { motion } from 'framer-motion';
// Usamos iconos de FontAwesome que son 100% seguros
import { 
  FaInstagram, 
  FaTiktok, 
  FaFacebookF, 
  FaYoutube, 
  FaTwitter, // Cambiado de FaXTwitter a FaTwitter para evitar el error
  FaDiscord, 
  FaGithub, 
  FaTelegramPlane, 
  FaWhatsapp 
} from "react-icons/fa";

const SocialGrid = () => {
  const socials = [
    { icon: <FaInstagram />, name: 'Instagram', color: 'hover:text-pink-500' },
    { icon: <FaTiktok />, name: 'TikTok', color: 'hover:text-white' },
    { icon: <FaTwitter />, name: 'Twitter', color: 'hover:text-blue-400' },
    { icon: <FaDiscord />, name: 'Discord', color: 'hover:text-indigo-500' },
    { icon: <FaWhatsapp />, name: 'WhatsApp', color: 'hover:text-green-500' },
    { icon: <FaTelegramPlane />, name: 'Telegram', color: 'hover:text-blue-400' },
    { icon: <FaGithub />, name: 'GitHub', color: 'hover:text-purple-400' },
    { icon: <FaYoutube />, name: 'YouTube', color: 'hover:text-red-500' },
  ];

  return (
    <section className="py-32 px-6 relative z-10 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-black tracking-tighter mb-16"
        >
          ÚNETE A LA <span className="text-purple-500 italic">RED DE FORJADORES.</span>
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {socials.map((soc, i) => (
            <motion.a
              key={i}
              href="#"
              whileHover={{ y: -10, scale: 1.05 }}
              className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl flex flex-col items-center gap-4 transition-all group hover:border-purple-500/40 shadow-2xl"
            >
              <div className={`text-4xl text-slate-500 transition-colors duration-500 ${soc.color}`}>
                {soc.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 group-hover:text-white transition-colors">
                {soc.name}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialGrid;