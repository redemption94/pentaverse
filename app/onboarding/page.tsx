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
  
  const [authCode, setAuthCode] = useState('');
  const [matchToken, setMatchToken] = useState('');

  useEffect(() => {
    if (!steamId) router.push('/login');
  }, [steamId, router]);

  const handleSteamSync = async () => {
    setStatus('syncing');
    setErrorMsg('');
    try {
      const res = await fetch(`/api/validate-steam?steamId=${steamId}&authCode=${authCode}&matchToken=${matchToken}`);
      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      setStatus('success');
      setTimeout(() => {
        router.push(`/profile/${steamId}`);
      }, 2000);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="max-w-xl w-full relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0a] border border-white/5 p-8 md:p-12 shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-[#ffeb00]"></div>
        
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-[1000] uppercase italic tracking-tighter mb-2">
            Steam <span className="text-[#ffeb00]">Sync</span>
          </h1>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.4em]">Finalize Account Verification</p>
        </header>

        <div className="space-y-6">
          <div className="bg-white/5 p-6 border border-white/10">
            <h4 className="text-[10px] font-black uppercase text-[#ffeb00] mb-4 flex items-center gap-2 italic">
              <Lock size={12} /> Pro Verification Codes (Optional)
            </h4>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Authentication Code"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                className="w-full bg-black border border-white/10 p-4 text-xs font-mono focus:border-[#ffeb00] outline-none"
              />
              <input 
                type="text" 
                placeholder="Match Token"
                value={matchToken}
                onChange={(e) => setMatchToken(e.target.value)}
                className="w-full bg-black border border-white/10 p-4 text-xs font-mono focus:border-[#ffeb00] outline-none"
              />
            </div>
          </div>

          <div className="text-center">
            <AnimatePresence mode="wait">
              {status === 'idle' || status === 'error' ? (
                <div className="space-y-4">
                  {status === 'error' && (
                    <div className="flex items-center gap-3 text-red-500 bg-red-500/10 p-4 border border-red-500/20 mb-4">
                      <AlertCircle size={18} />
                      <p className="text-[10px] font-black uppercase">{errorMsg}</p>
                    </div>
                  )}
                  <button 
                    onClick={handleSteamSync}
                    className="w-full py-5 bg-[#ffeb00] text-black font-[1000] uppercase italic text-sm flex items-center justify-center gap-3 skew-x-[-10deg]"
                  >
                    <span className="skew-x-[10deg]">Sync Profile</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              ) : status === 'syncing' ? (
                <div className="py-6">
                  <Loader2 className="animate-spin text-[#ffeb00] mx-auto mb-4" size={32} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#ffeb00]">Accessing Valve Network...</p>
                </div>
              ) : (
                <div className="py-6 text-green-500">
                  <CheckCircle2 size={40} className="mx-auto mb-4" />
                  <p className="text-sm font-[1000] uppercase italic">Dossier Secured</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <Suspense fallback={<Loader2 className="animate-spin text-[#ffeb00]" />}>
        <OnboardingContent />
      </Suspense>
    </div>
  );
}
