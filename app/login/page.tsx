'use client';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, ArrowRight, Lock } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LoginPage() {
  
  const handleSteamLogin = async () => {
    // Steam folosește OpenID. În 2026, cea mai sigură metodă este via Supabase Auth Helpers
    // sau un redirect către un API de autentificare Steam.
    console.log("Redirecting to Steam OpenID...");
    // window.location.href = '/api/auth/steam';
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-6 relative overflow-hidden">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#ffeb00] shadow-[0_0_20px_#ffeb00]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ffeb00]/5 via-transparent to-transparent" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#0a0a0a] border border-white/5 p-10 relative z-10"
      >
        <div className="flex justify-center mb-8">
           <div className="bg-[#ffeb00] p-4 esl-slash">
              <ShieldCheck size={40} className="text-black" />
           </div>
        </div>

        <h1 className="text-4xl font-[1000] uppercase italic tracking-tighter text-center mb-2">
          Identity <span className="text-[#ffeb00]">Check</span>
        </h1>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] text-center mb-10">
          Enlist in the Pro Pathway
        </p>

        <div className="space-y-4">
          <button 
            onClick={handleSteamLogin}
            className="w-full bg-[#1a1a1a] hover:bg-white hover:text-black py-5 px-6 flex items-center justify-between group transition-all duration-300 border-l-4 border-[#ffeb00]"
          >
            <div className="flex items-center gap-4">
               <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg" className="w-6 h-6 grayscale group-hover:grayscale-0" alt="Steam" />
               <span className="font-black uppercase italic text-sm tracking-tight">Connect with Steam</span>
            </div>
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>

          <button 
            disabled
            className="w-full bg-white/5 py-5 px-6 flex items-center justify-between opacity-50 cursor-not-allowed border-l-4 border-gray-800"
          >
            <div className="flex items-center gap-4">
               <Zap size={22} className="text-gray-600" />
               <span className="font-black uppercase italic text-sm tracking-tight">Faceit Verification</span>
            </div>
            <Lock size={16} className="text-gray-600" />
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
           <p className="text-[9px] text-gray-600 font-bold uppercase leading-relaxed text-center">
             By connecting, you authorize Pentaverse to index your competitive stats and create your public scouting dossier.
           </p>
        </div>
      </motion.div>

      {/* FOOTER DECOR */}
      <div className="absolute bottom-10 opacity-10 text-[120px] font-[1000] italic tracking-tighter pointer-events-none select-none">
        PENTAVERSE
      </div>
    </div>
  );
}
