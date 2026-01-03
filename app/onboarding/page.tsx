'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Crosshair, 
  TrendingUp,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function OnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Extragem SteamID-ul primit de la callback-ul de login
  const steamId = searchParams.get('steamId');

  const [faceitName, setFaceitName] = useState('');
  const [status, setStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [playerData, setPlayerData] = useState<any>(null);

  // Securitate: Dacă nu există SteamID, trimitem utilizatorul înapoi la login
  useEffect(() => {
    if (!steamId) {
      router.push('/login');
    }
  }, [steamId, router]);

  const handleValidateFaceit = async () => {
    if (!faceitName) return;
    setStatus('validating');
    setErrorMsg('');

    try {
      // Apelăm API-ul de validare creat anterior
      const res = await fetch(`/api/validate-faceit?nickname=${faceitName}&steamId=${steamId}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Profile not found on Faceit");
      }

      setPlayerData(data.player);
      setStatus('success');

      // Redirecționare critică: folosim FACEIT_ID pentru a evita mismatch-ul de profile
      setTimeout(() => {
        router.push(`/profile/${data.player.faceit_id}`);
      }, 2500);

    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="max-w-xl w-full relative z-10">
      {/* INDICATOR DE PROGRES */}
      <div className="flex gap-3 mb-12 justify-center">
        <div className="h-1.5 w-16 bg-[#ffeb00] shadow-[0_0_10px_#ffeb00]"></div>
        <motion.div 
          animate={{ backgroundColor: status === 'success' ? '#ffeb00' : 'rgba(255,255,255,0.1)' }}
          className="h-1.5 w-16 shadow-[0_0_10px_rgba(255,235,0,0.2)]"
        ></motion.div>
        <div className="h-1.5 w-16 bg-white/10"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0a] border border-white/5 p-8 md:p-12 relative overflow-hidden shadow-2xl"
      >
        {/* DESIGN ELEMENTS */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#ffeb00]"></div>
        <div className="absolute -right-20 -top-20 opacity-[0.02] pointer-events-none">
           <Zap size={300} />
        </div>
        
        <header className="mb-10">
          <h1 className="text-4xl font-[1000] uppercase italic tracking-tighter leading-none mb-3">
            Finalize <span className="text-[#ffeb00]">Enlistment</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#ffeb00] animate-pulse"></div>
            <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.4em]">
              Phase 02: Skill Verification (RO Only)
            </p>
          </div>
        </header>

        <div className="space-y-8">
          {/* INPUT FIELD */}
          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
              Faceit Nickname / Identity
            </label>
            <div className="relative group">
              <input 
                type="text"
                value={faceitName}
                onChange={(e) => setFaceitName(e.target.value)}
                placeholder="Ex: Modo_CS"
                className="w-full bg-black border border-white/10 p-6 font-[1000] uppercase italic tracking-tight text-xl focus:border-[#ffeb00] outline-none transition-all placeholder:text-gray-800"
                disabled={status === 'validating' || status === 'success'}
              />
              <AnimatePresence>
                {status === 'validating' && (
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    <span className="text-[8px] font-black text-[#ffeb00] uppercase animate-pulse">Scanning Hub...</span>
                    <Loader2 className="animate-spin text-[#ffeb00]" size={20} />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ERROR DISPLAY */}
          <AnimatePresence>
            {status === 'error' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="flex items-center gap-4 text-red-500 bg-red-500/5 p-5 border-l-4 border-red-500"
              >
                <ShieldAlert size={24} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Validation Failure</p>
                  <p className="text-xs font-bold italic">{errorMsg}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SUCCESS DISPLAY */}
          <AnimatePresence>
            {status === 'success' && playerData && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="bg-[#ffeb00] p-6 text-black relative"
              >
                <div className="flex items-center gap-5 relative z-10">
                  <div className="bg-black p-2">
                    <CheckCircle2 size={28} className="text-[#ffeb00]" />
                  </div>
                  <div>
                    <p className="font-[1000] uppercase italic leading-none text-xl">{playerData.nickname}</p>
                    <p className="text-[10px] font-black uppercase mt-1 tracking-wider">
                      Target Found: {playerData.current_elo} ELO | Level 10
                    </p>
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10">
                   <CheckCircle2 size={80} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ACTION BUTTON */}
          <button 
            onClick={handleValidateFaceit}
            disabled={status === 'validating' || status === 'success' || !faceitName}
            className={`w-full py-6 font-[1000] uppercase italic text-sm flex items-center justify-center gap-4 transition-all skew-x-[-10deg] ${
              status === 'success' 
              ? 'bg-green-600 text-white' 
              : 'bg-[#ffeb00] text-black hover:bg-white'
            } disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            <span className="skew-x-[10deg] flex items-center gap-3">
              {status === 'success' ? 'Generating Career Dossier...' : 'Validate & Sync Profile'}
              <ChevronRight size={20} />
            </span>
          </button>
        </div>

        {/* TERMINAL FOOTER */}
        <div className="mt-12 flex justify-between items-center border-t border-white/5 pt-8">
           <div className="flex gap-6 opacity-30">
              <div className="flex items-center gap-2">
                 <Crosshair size={14} />
                 <span className="text-[8px] font-black uppercase tracking-widest">Live API</span>
              </div>
              <div className="flex items-center gap-2">
                 <TrendingUp size={14} />
                 <span className="text-[8px] font-black uppercase tracking-widest">Auto-Scout</span>
              </div>
           </div>
           <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest">ID: {steamId?.slice(0, 8)}...</p>
        </div>
      </motion.div>
    </div>
  );
}

// COMPONENTA EXPORTATĂ CU SUSPENSE
export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ffeb00]/5 via-transparent to-transparent opacity-50" />
      
      <Suspense fallback={
        <div className="flex flex-col items-center gap-6 relative z-10">
          <div className="w-16 h-16 border-4 border-[#ffeb00]/20 border-t-[#ffeb00] rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 animate-pulse">
            Accessing Secure Database...
          </p>
        </div>
      }>
        <OnboardingContent />
      </Suspense>

      <div className="absolute bottom-10 opacity-[0.02] text-[15vw] font-[1000] italic pointer-events-none select-none">
        ENLISTMENT
      </div>
    </div>
  );
}
