'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Activity,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

function OnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const steamId = searchParams.get('steamId');

  const [status, setStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Sincronizare automată la încărcarea paginii
  useEffect(() => {
    if (!steamId) {
      router.push('/login');
      return;
    }
    handleSteamSync();
  }, [steamId]);

  const handleSteamSync = async () => {
    setStatus('syncing');
    try {
      const res = await fetch(`/api/validate-steam?steamId=${steamId}`);
      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      setStatus('success');
      // Redirecționăm către profil folosind SteamID
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
        className="bg-[#0a0a0a] border border-white/5 p-10 md:p-14 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-[#ffeb00]"></div>
        
        <header className="mb-12 text-center">
          <div className="inline-block p-4 bg-[#ffeb00] mb-6 esl-slash">
            <Activity size={32} className="text-black" />
          </div>
          <h1 className="text-4xl font-[1000] uppercase italic tracking-tighter leading-none mb-3">
            Steam <span className="text-[#ffeb00]">Intel Sync</span>
          </h1>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.4em]">
            Extracting CS2 Combat Data
          </p>
        </header>

        <div className="space-y-8">
          <div className="bg-white/[0.02] border border-white/5 p-8 text-center relative">
            <AnimatePresence mode="wait">
              {status === 'syncing' && (
                <motion.div key="sync" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-4">
                  <Loader2 className="animate-spin text-[#ffeb00] mx-auto mb-4" size={40} />
                  <p className="text-xs font-bold uppercase tracking-widest text-[#ffeb00] animate-pulse">
                    Scanning Valve Databases...
                  </p>
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
                  <CheckCircle2 className="text-green-500 mx-auto mb-4" size={48} />
                  <p className="text-sm font-[1000] uppercase italic">Dossier Generated</p>
                  <p className="text-[9px] text-gray-500 uppercase mt-2">Redirecting to Career Dashboard</p>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
                  <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                  <p className="text-xs font-black uppercase text-red-500 mb-2">Sync Interrupted</p>
                  <p className="text-[10px] text-gray-400 uppercase leading-relaxed max-w-xs mx-auto">
                    {errorMsg}. Make sure your "Game Details" are set to <strong>PUBLIC</strong> in Steam Privacy Settings.
                  </p>
                  <button onClick={handleSteamSync} className="mt-6 text-[10px] font-black uppercase underline text-[#ffeb00]">Retry Link</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-8 border-t border-white/5 pt-8 opacity-20">
           <span className="text-[8px] font-black uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={12}/> Anti-Cheat Verified</span>
           <span className="text-[8px] font-black uppercase tracking-widest flex items-center gap-2"><Zap size={12}/> Skill Matrix Active</span>
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
