'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Lock, 
  ChevronLeft, 
  Gamepad2 
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  
  // Funcția de redirecționare către fluxul de autentificare Steam
  const handleSteamLogin = () => {
    // Redirecționăm utilizatorul către ruta API care inițiază OpenID
    window.location.href = '/api/auth/steam';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center px-6 relative overflow-hidden font-sans">
      
      {/* --- ELEMENTE DECORATIVE DE FUNDAL --- */}
      {/* Linie superioară luminoasă tip ESL */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#ffeb00] shadow-[0_0_20px_rgba(255,235,0,0.4)]" />
      
      {/* Pattern de scanlines subtil pentru aspectul de terminal */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {/* Glow central */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ffeb00]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* --- BUTON BACK --- */}
      <Link 
        href="/" 
        className="absolute top-8 left-6 md:left-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-[#ffeb00] transition-colors group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Radar
      </Link>

      {/* --- CARDUL DE LOGIN --- */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-[#0a0a0a] border border-white/5 p-8 md:p-12 relative z-10 shadow-2xl"
      >
        {/* Logo Recrutare */}
        <div className="flex justify-center mb-10">
           <div className="relative">
              <div className="bg-[#ffeb00] p-5 esl-slash relative z-10">
                 <ShieldCheck size={42} className="text-black" />
              </div>
              {/* Efect de umbră/dublură pentru logo */}
              <div className="absolute -inset-1 bg-[#ffeb00]/20 blur-xl rounded-full" />
           </div>
        </div>

        {/* Titlu și Subtitlu */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-[1000] uppercase italic tracking-tighter leading-none mb-3">
            Identity <span className="text-[#ffeb00]">Check</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="h-[1px] w-8 bg-gray-800" />
            <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.4em] whitespace-nowrap">
              Enlist in the Pro Pathway
            </p>
            <span className="h-[1px] w-8 bg-gray-800" />
          </div>
        </div>

        {/* --- OPȚIUNI DE CONECTARE --- */}
        <div className="space-y-4">
          
          {/* STEAM CONNECT (ACTIV) */}
          <button 
            onClick={handleSteamLogin}
            className="w-full bg-[#111] hover:bg-white hover:text-black py-5 px-6 flex items-center justify-between group transition-all duration-300 border-l-4 border-[#ffeb00] relative overflow-hidden"
          >
            <div className="flex items-center gap-5 relative z-10">
               <div className="p-2 bg-black/50 rounded-sm group-hover:bg-black/10 transition-colors">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg" 
                    className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all" 
                    alt="Steam" 
                  />
               </div>
               <div className="text-left">
                  <span className="block font-[1000] uppercase italic text-sm tracking-tight leading-none">Connect with Steam</span>
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-1 group-hover:text-black/60 transition-colors">Initial verification stage</span>
               </div>
            </div>
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform relative z-10" />
          </button>

          {/* FACEIT VERIFICATION (LOCKED) */}
          <div className="relative group">
            <button 
              disabled
              className="w-full bg-white/[0.02] py-5 px-6 flex items-center justify-between opacity-40 cursor-not-allowed border-l-4 border-gray-800"
            >
              <div className="flex items-center gap-5">
                 <div className="p-2 bg-black/50 rounded-sm">
                    <Zap size={24} className="text-gray-600" />
                 </div>
                 <div className="text-left">
                    <span className="block font-[1000] uppercase italic text-sm tracking-tight leading-none">Faceit Stats Sync</span>
                    <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">Requires Steam link first</span>
                 </div>
              </div>
              <Lock size={16} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* --- FOOTER CARD --- */}
        <div className="mt-12 pt-8 border-t border-white/5">
           <div className="flex items-start gap-4 text-gray-600">
              <Gamepad2 size={24} className="shrink-0 opacity-50" />
              <p className="text-[9px] font-bold uppercase leading-relaxed tracking-wider">
                Prin conectare, ești de acord ca <span className="text-gray-400">Pentaverse</span> să indexeze statisticile tale Faceit și Steam pentru a crea un dosar public de scouting. 
                <br /><br />
                <span className="text-[#ffeb00]/40">Identitatea ta va fi verificată oficial în baza de date națională.</span>
              </p>
           </div>
        </div>
      </motion.div>

      {/* --- DECORAȚIUNE TEXT FUNDAL --- */}
      <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 opacity-[0.02] text-[18vw] font-[1000] italic tracking-tighter pointer-events-none select-none whitespace-nowrap">
        PENTAVERSE RECRUIT
      </div>

    </div>
  );
}
