'use client';

import React, { useState } from 'react';
import { Plus, Hash, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function MatchImporter({ steamId }: { steamId: string }) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleImport = async () => {
    if (!code.includes('CSGO-')) return setMsg("Codul trebuie să fie formatul CSGO-XXXXX");
    
    setStatus('loading');
    try {
      const res = await fetch('/api/import-match', {
        method: 'POST',
        body: JSON.stringify({ steamId, sharingCode: code }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      
      if (!data.success) throw new Error(data.error);

      setStatus('success');
      setMsg("Meci importat cu succes! Reîncarcă pagina.");
      setCode('');
    } catch (err: any) {
      setStatus('error');
      setMsg(err.message);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#ffeb00]/20 p-8 mb-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
         <Hash size={80} />
      </div>

      <h3 className="text-xs font-[1000] uppercase tracking-[0.4em] text-[#ffeb00] mb-6 flex items-center gap-2">
         <Plus size={14} /> Import Official Match Intel
      </h3>

      <div className="flex flex-col md:flex-row gap-4">
        <input 
          type="text" 
          placeholder="CSGO-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="flex-1 bg-black border border-white/10 p-4 text-xs font-mono text-[#ffeb00] outline-none focus:border-[#ffeb00] transition-all"
        />
        <button 
          onClick={handleImport}
          disabled={status === 'loading'}
          className="bg-[#ffeb00] text-black px-8 py-4 font-[1000] uppercase italic text-xs hover:bg-white transition-all disabled:opacity-50"
        >
          {status === 'loading' ? <Loader2 className="animate-spin" /> : "Verify & Enlist"}
        </button>
      </div>

      {msg && (
        <div className={`mt-4 text-[10px] font-black uppercase flex items-center gap-2 ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
          {status === 'error' ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
          {msg}
        </div>
      )}

      <p className="mt-4 text-[8px] text-gray-600 uppercase tracking-widest leading-relaxed">
        Găsești codul în CS2: <span className="text-gray-400">Watch Tab &gt; Your Matches &gt; Copy Share Code</span>. 
        Meciurile importate manual trec printr-un proces de verificare a integrității.
      </p>
    </div>
  );
}
