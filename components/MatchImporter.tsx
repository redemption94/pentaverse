'use client';

import React, { useState } from 'react';
import { Plus, Link as LinkIcon, Loader2, CheckCircle2 } from 'lucide-react';

export default function MatchImporter({ steamId }: { steamId: string }) {
  const [rawLink, setRawLink] = useState('');
  const [map, setMap] = useState('DE_TRAIN');
  const [score, setScore] = useState({ team: 13, enemy: 0 });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImport = async () => {
    if (!rawLink) return;
    setLoading(true);
    try {
      const res = await fetch('/api/import-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          steamId, 
          rawLink, 
          mapName: map,
          teamScore: score.team,
          enemyScore: score.enemy
        }),
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (e) {
      alert("Eroare la procesarea link-ului.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#ffeb00]/30 p-8 mb-12 shadow-[0_0_40px_rgba(255,235,0,0.05)]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[10px] font-black uppercase text-[#ffeb00] tracking-[0.4em] italic flex items-center gap-2">
          <Plus size={14} /> Import Official Mission Intel
        </h3>
        {success && <CheckCircle2 className="text-green-500 animate-bounce" size={20} />}
      </div>
      
      <div className="space-y-6">
        {/* INPUT PENTRU LINK-UL LUNG */}
        <div>
          <label className="text-[8px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Paste Steam Share Link</label>
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={16} />
            <input 
              type="text" 
              placeholder="steam://rungame/730/..." 
              value={rawLink}
              onChange={(e) => setRawLink(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 pl-12 text-[10px] font-mono outline-none focus:border-[#ffeb00] text-gray-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-[8px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Map Location</label>
            <select 
              value={map} onChange={(e) => setMap(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 text-[10px] uppercase font-black outline-none appearance-none cursor-pointer"
            >
              <option value="DE_TRAIN">Train</option>
              <option value="DE_MIRAGE">Mirage</option>
              <option value="DE_ANUBIS">Anubis</option>
              <option value="DE_ANCIENT">Ancient</option>
              <option value="DE_INFERNO">Inferno</option>
              <option value="DE_NUKE">Nuke</option>
            </select>
          </div>
          
          <div>
            <label className="text-[8px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Final Score</label>
            <div className="flex gap-2 items-center bg-black border border-white/10 p-3.5">
              <input type="number" value={score.team} onChange={(e) => setScore({...score, team: parseInt(e.target.value)})} className="w-full bg-transparent text-center font-black text-lg outline-none" />
              <span className="text-gray-700 font-bold">:</span>
              <input type="number" value={score.enemy} onChange={(e) => setScore({...score, enemy: parseInt(e.target.value)})} className="w-full bg-transparent text-center font-black text-lg outline-none" />
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleImport} 
          disabled={loading || !rawLink}
          className="w-full bg-[#ffeb00] text-black font-[1000] uppercase italic py-5 text-xs hover:bg-white transition-all disabled:opacity-20 flex items-center justify-center gap-3"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Verify & Synchronize Combat Data"}
        </button>
      </div>
    </div>
  );
}
