'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronRight
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const steamId = searchParams.get('steamId');

  const [faceitName, setFaceitName] = useState('');
  const [status, setStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [playerData, setPlayerData] = useState<any>(null);

  // Redirecționăm dacă nu avem SteamID (securitate de bază)
  useEffect(() => {
    if (!steamId) router.push('/login');
  }, [steamId]);

  const handleValidateFaceit = async () => {
    if (!faceitName) return;
    setStatus('validating');
    setErrorMsg('');

    try {
      // 1. Apelăm un API route intern care verifică Faceit-ul (pentru a ascunde API KEY-ul)
      const res = await fetch(`/api/validate-faceit?nickname=${faceitName}&steamId=${steamId}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Profile not found");
      }

      setPlayerData(data.player);
      setStatus('success');

      // 2. După 2 secunde de succes, îl trimitem la profilul nou creat
      setTimeout(() => {
        router.push(`/profile/${data.player.faceit_id}`);
      }, 2500);

    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      
      <div className="max-w-xl w-full">
        {/* PROGRESS INDICATOR */}
        <div className="flex gap-2 mb-12 justify-center">
          <div className="h-1 w-12 bg-[#ffeb00]"></div>
          <div className={`h-1 w-12 ${status === 'success' ? 'bg-[#ffeb00]' : 'bg-white/10'}`}></div>
          <div className="h-1 w-12 bg-white/10"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0a0a0a] border border-white/5 p-10 relative overflow-hidden"
        >
          {/* DECORATIVE TERMINAL LINES */}
          <div className="absolute top-0 left-0 w-full h-1 bg-[#ffeb00]"></div>
          
          <h1 className="text-4xl font-[1000] uppercase italic tracking-tighter mb-2">
            Finalize <span className="text-[#ffeb00]">Enlistment</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-10">
            Phase 02: Skill Verification
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                Faceit Nickname
              </label>
              <div className="relative">
                <input 
                  type="text"
                  value={faceitName}
                  onChange={(e) => setFaceitName(e.target.value)}
                  placeholder="Ex: Modo_CS"
                  className="w-full bg-black border border-white/10 p-5 font-black uppercase italic tracking-tight focus:border-[#ffeb00] outline-none transition-all"
                  disabled={status === 'validating' || status === 'success'}
                />
                <AnimatePresence>
                  {status === 'validating' && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Loader2 className="animate-spin text-[#ffeb00]" />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {status === 'error' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-red-500 bg-red-500/5 p-4 border border-red-500/20">
                <AlertCircle size={18} />
                <span className="text-[10px] font-black uppercase">{errorMsg}</span>
              </motion.div>
            )}

            {status === 'success' && playerData && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#ffeb00] p-6 text-black">
                <div className="flex items-center gap-4">
                  <CheckCircle2 size={32} />
                  <div>
                    <p className="font-black uppercase italic leading-none">Identity Verified</p>
                    <p className="text-[10px] font-bold uppercase mt-1">Found: {playerData.nickname} | {playerData.current_elo} ELO</p>
                  </div>
                </div>
              </motion.div>
            )}

            <button 
              onClick={handleValidateFaceit}
              disabled={status === 'validating' || status === 'success' || !faceitName}
              className={`w-full py-5 font-[1000] uppercase italic flex items-center justify-center gap-3 transition-all ${
                status === 'success' 
                ? 'bg-green-500 text-black' 
                : 'bg-[#ffeb00] text-black hover:bg-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {status === 'success' ? 'Synchronizing Dossier...' : 'Validate Profile'}
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="mt-10 flex gap-6 border-t border-white/5 pt-8 opacity-40">
             <div className="flex items-center gap-2">
                <Crosshair size={14} />
                <span className="text-[8px] font-black uppercase">Stat Indexing</span>
             </div>
             <div className="flex items-center gap-2">
                <TrendingUp size={14} />
                <span className="text-[8px] font-black uppercase">Career Launch</span>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
