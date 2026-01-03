'use client';

import React, { useState } from 'react';
import { Plus, Hash, Loader2 } from 'lucide-react';

export default function MatchImporter({ steamId }: { steamId: string }) {
  const [code, setCode] = useState('');
  const [map, setMap] = useState('DE_TRAIN');
  const [score, setScore] = useState({ team: 13, enemy: 0 });
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/import-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          steamId, 
          sharingCode: code, 
          mapName: map,
          teamScore: score.team,
          enemyScore: score.enemy
        }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      alert("Eroare la import");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#ffeb00]/20 p-8 mb-12">
      <h3 className="text-[10px] font-black uppercase text-[#ffeb00] mb-6 tracking-widest italic">Manual Match Deployment</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input 
          type="text" placeholder="CSGO-XXXXX..." value={code}
          onChange={(e) => setCode(e.target.value)}
          className="bg-black border border-white/10 p-4 text-xs font-mono outline-none focus:border-[#ffeb00]"
        />
        <select 
          value={map} onChange={(e) => setMap(e.target.value)}
          className="bg-black border border-white/10 p-4 text-xs uppercase font-black"
        >
          <option value="DE_TRAIN">Train</option>
          <option value="DE_MIRAGE">Mirage</option>
          <option value="DE_ANCIENT">Ancient</option>
          <option value="DE_INFERNO">Inferno</option>
        </select>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex gap-2 items-center">
          <input type="number" value={score.team} onChange={(e) => setScore({...score, team: parseInt(e.target.value)})} className="w-16 bg-black border border-white/10 p-2 text-center font-black" />
          <span className="text-gray-600">:</span>
          <input type="number" value={score.enemy} onChange={(e) => setScore({...score, enemy: parseInt(e.target.value)})} className="w-16 bg-black border border-white/10 p-2 text-center font-black" />
        </div>
        
        <button 
          onClick={handleImport} disabled={loading}
          className="flex-1 bg-[#ffeb00] text-black font-black uppercase italic py-4 text-xs hover:bg-white"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Verify & Import Match"}
        </button>
      </div>
    </div>
  );
}
