'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Zap, CheckCircle2, AlertCircle, Loader2, 
  Activity, ChevronRight, ShieldCheck, Lock, ExternalLink 
} from 'lucide-react';

function OnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const steamId = searchParams.get('steamId');

  const [status, setStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  
  // State pentru Steam Pro Data
  const [authCode, setAuthCode] = useState('');
  const [matchToken, setMatchToken] = useState('');

  useEffect(() => {
    if (!steamId) {
      router.push('/login');
    }
  }, [steamId, router]);

  const handleSteamSync = async () => {
    setStatus('syncing');
    try {
      // Trimitem și codurile de autentificare către API
      const res = await fetch(`/api/validate-steam?steamId=${steamId}&authCode=${authCode}&matchToken=${matchToken}`);
      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      setStatus('success');
      setTimeout(() => {
        router.push(`/profile/${steamId}`);
      }, 2500);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || "Failed to sync Steam Intel");
    }
  };

  return (
    <div className="max-w-xl w-full relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0a] border border-white/5 p-8 md:p-12 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-[#ffeb00]"></div>
        
        <header className="mb-10 text-center">
          <div className="inline-block p-4 bg-[#ffeb00] mb-6 esl-slash">
            <Activity size={32} className="text-black" />
          </div>
          <h1 className="text-4xl font-[1000] uppercase italic tracking-tighter leading-none mb-3">
            Steam <span className="text-[#ffeb00]">Intel Sync</span>
          </h1>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.4em]">
            Step 02: Verification & Combat Stats
          </p>
        </header>

        <div className="space-y-6">
          {/* SECȚIUNE PRO VERIFICATION (OPTIONAL) */}
          <div className="bg-white/5 p-6 border border-white/10">
            <h4 className="text-[10px] font-black uppercase text-[#ffeb00] mb-4 flex items-center gap-2">
              <Lock size={12} /> Pro Stats Verification (Optional)
            </h4>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Game Authentication Code"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                className="w-full bg-black border border-white/10 p-4 text-xs font-mono focus:border-[#ffeb00] outline-none transition-all"
                disabled={status === 'syncing' || status === 'success'}
              />
              <input 
                type="text" 
                placeholder="Latest Match Token"
                value={matchToken}
                onChange={(e) => setMatchToken(e.target.value)}
                className="w-full bg-black border border-white/10 p-4 text-xs font-mono focus:border-[#ffeb00] outline-none transition-all"
                disabled={status === 'syncing' || status === 'success'}
              />
            </div>
            <a 
              href="https://steamcommunity.com/my/gamedata/730/?tab=authenticationcode" 
              target="_blank" 
              className="text-[8px] font-black text-gray-500 uppercase mt-4 flex items-center gap-1 hover:text-white transition-colors"
            >
              Get your codes from Steam <ExternalLink size={10} />
            </a>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-6 text-center">
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <button 
                  onClick={handleSteamSync}
                  className="w-full py-5 bg-[#ffeb00] text-black font-[1000] uppercase italic text-sm flex items-center justify-center gap-3 hover:bg-white transition-all skew-x-[-10deg]"
                >
                  <span className="skew-x-[10deg]">Initiate Final Sync</span>
                  <ChevronRight size={18} />
                </button>
              )}

              {status === 'syncing' && (
                <div className="py-2">
                  <Loader2 className="animate-spin text-[#ffeb00] mx-auto mb-4" size={32} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#ffeb00] animate-pulse">
                    Analyzing Valve Combat History...
                  </p>
                </div>
              )}

              {status === 'success' && (
                <div className="py-2">
                  <CheckCircle2 className="text-green-500 mx-auto mb-4" size={40} />
                  <p className="text-sm font-[1000] uppercase italic">Dossier Finalized</p>
                </div>
              )}

              {status === 'error' && (
                <div className="py-2">
                  <AlertCircle className="text-red-500 mx-auto mb-3" size={32} />
                  <p className="text-[10px] font-black uppercase text-red-500 mb-4">{errorMsg}</p>
                  <button onClick={() => setStatus('idle')} className="text-[10px] font-black uppercase underline">Back</button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-10 flex justify-center gap-8 border-t border-white/5 pt-8 opacity-20">
           <span className="text-[8px] font-black uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={12}/> CS2 Verified</span>
           <span className="text-[8px] font-black uppercase tracking-widest flex items-center gap-2"><Zap size={12}/> Skill Radar Active</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6">
      <Suspense fallback={<Loader2 className="animate-spin text-[#ffeb00]" size={40} />}>
        <OnboardingContent />
      </Suspense>
    </div>
  );
}
