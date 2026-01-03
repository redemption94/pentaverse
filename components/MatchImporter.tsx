'use client';

import React, { useState } from 'react';
import { Plus, Link as LinkIcon, Loader2 } from 'lucide-react';

export default function MatchImporter({ steamId }: { steamId: string }) {
  const [rawLink, setRawLink] = useState('');
  const [map, setMap] = useState('DE_TRAIN');
  const [score, setScore] = useState({ team: 13, enemy: 0 });
  const [loading, setLoading] = useState(false);

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
      
      const data = await res.json();
      if (data.success) {
        window.location.reload();
      } else {
        alert("Eroare: " + data.error);
      }
    } catch (e) {
      alert("Eroare de conexiune la server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#ffeb00]/30 p-8 mb-12 shadow-[0_0_40px_rgba(255,235,0,0.05)]">
      <h3 className="text-[10px] font-black uppercase text-[#ffeb00] tracking-[0.4em] italic mb-8">Import Official Mission Intel</h3>
      <div className="space-y-6">
        <input 
          type="text" 
          placeholder="Paste steam:// link or .bz2 link" 
          value={rawLink}
          onChange={(e) => setRawLink(e.target.value)}
          className="w-full bg-black border border-white/10 p-4 text-[10px] font-mono outline-none focus:border-[#ffeb00] text-gray-300"
        />
        <div className="grid grid-cols-2 gap-4">
          <select value={map} onChange={(e) => setMap(e.target.value)} className="bg-black border border-white/10 p-4 text-[10px] font-black uppercase">
            <option value="DE_TRAIN">Train</option>
            <option value="DE_MIRAGE">Mirage</option>
            <option value="DE_ANCIENT">Ancient</option>
          </select>
          <div className="flex gap-2 items-center bg-black border border-white/10 p-2">
            <input type="number" value={score.team} onChange={(e) => setScore({...score, team: parseInt(e.target.value)})} className="w-full bg-transparent text-center font-black" />
            <span>:</span>
            <input type="number" value={score.enemy} onChange={(e) => setScore({...score, enemy: parseInt(e.target.value)})} className="w-full bg-transparent text-center font-black" />
          </div>
        </div>
        <button onClick={handleImport} disabled={loading} className="w-full bg-[#ffeb00] text-black font-[1000] uppercase italic py-5 text-xs">
          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Verify & Import Match"}
        </button>
      </div>
    </div>
  );
}
