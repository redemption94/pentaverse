'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { Zap, CheckCircle2, AlertCircle, Loader2, Activity, ChevronRight, Lock, ExternalLink } from 'lucide-react';

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

  const handleSync = async () => {
    setStatus('syncing');
    try {
      const res = await fetch(`/api/validate-steam?steamId=${steamId}&authCode=${authCode}&matchToken=${matchToken}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setStatus('success');
      setTimeout(() => router.push(`/profile/${steamId}`), 2000);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="max-w-xl w-full p-8 bg-[#0a0a0a] border border-white/5 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#ffeb00]"></div>
      <header className="text-center mb-10">
        <h1 className="text-4xl font-[1000] uppercase italic italic mb-2">Steam <span className="text-[#ffeb00]">Sync</span></h1>
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Phase 02: Finalizing Intel</p>
      </header>

      <div className="space-y-6">
        <div className="bg-white/5 p-6 border border-white/10">
          <h4 className="text-[10px] font-black uppercase text-[#ffeb00] mb-4 flex items-center gap-2">
            <Lock size={12} /> Steam Pro Codes (Optional)
          </h4>
          <input 
            type="text" placeholder="Authentication Code" value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            className="w-full bg-black border border-white/10 p-4 text-xs font-mono mb-3 outline-none focus:border-[#ffeb00]"
          />
          <input 
            type="text" placeholder="Match Token" value={matchToken}
            onChange={(e) => setMatchToken(e.target.value)}
            className="w-full bg-black border border-white/10 p-4 text-xs font-mono outline-none focus:border-[#ffeb00]"
          />
          <a href="https://steamcommunity.com/my/gamedata/730/?tab=authenticationcode" target="_blank" className="text-[8px] text-gray-500 uppercase mt-4 block underline">Get codes from Steam</a>
        </div>

        <div className="text-center">
          <AnimatePresence mode="wait">
            {status === 'idle' || status === 'error' ? (
              <div className="space-y-4">
                {status === 'error' && <p className="text-red-500 text-[10px] font-black uppercase">{errorMsg}</p>}
                <button onClick={handleSync} className="w-full py-5 bg-[#ffeb00] text-black font-[1000] uppercase italic text-sm skew-x-[-10deg]">
                  <span className="skew-x-[10deg] flex items-center justify-center gap-2">Sincronizează Profilul <ChevronRight size={18}/></span>
                </button>
              </div>
            ) : status === 'syncing' ? (
              <div className="py-6"><Loader2 className="animate-spin text-[#ffeb00] mx-auto mb-4" /><p className="text-[10px] font-black uppercase">Analyzing Valve Data...</p></div>
            ) : (
              <div className="py-6 text-green-500"><CheckCircle2 className="mx-auto mb-2" /><p className="text-sm font-black italic uppercase">Sync Complete</p></div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <Suspense fallback={<Loader2 className="animate-spin text-[#ffeb00]" />}><OnboardingContent /></Suspense>
    </div>
  );
}
