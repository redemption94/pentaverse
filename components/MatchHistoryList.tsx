'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download, Play, Users, Map as MapIcon } from 'lucide-react';

export default function MatchHistoryList({ initialMatches }: { initialMatches: any[] }) {
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {initialMatches.map((match) => (
        <div key={match.match_id} className="bg-[#0a0a0a] border border-white/5 overflow-hidden transition-all">
          {/* BARĂ REZUMAT MECI */}
          <div 
            onClick={() => setExpandedMatch(expandedMatch === match.match_id ? null : match.match_id)}
            className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
          >
            <div className="flex items-center gap-6">
              <div className={`w-1 h-10 ${match.result === 'WIN' ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase">{new Date(match.match_timestamp).toLocaleString('ro-RO')}</p>
                <p className="text-xl font-[1000] uppercase italic">{match.map_name.replace('de_', '')}</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-2xl font-black italic">{match.team_score} : {match.enemy_score}</p>
              <span className="text-[8px] font-black uppercase tracking-tighter text-gray-500">{match.game_mode}</span>
            </div>

            <div className="flex items-center gap-4">
               {match.demo_url && <Download size={16} className="text-gray-600" />}
               {expandedMatch === match.match_id ? <ChevronUp /> : <ChevronDown />}
            </div>
          </div>

          {/* DETALII MECI (LINEUPS) */}
          {expandedMatch === match.match_id && (
            <div className="p-8 border-t border-white/5 bg-black/40 animate-in fade-in slide-in-from-top-2">
              <div className="grid md:grid-cols-2 gap-12">
                {/* ECHIPA A */}
                <div>
                  <h4 className="text-[9px] font-black uppercase text-green-500 mb-4 tracking-widest flex items-center gap-2">
                    <Users size={12}/> Friendly Forces
                  </h4>
                  <div className="space-y-2">
                    {match.match_players.filter((p: any) => p.team === 'SIDE_A').map((p: any) => (
                      <div key={p.steam_id} className="flex justify-between items-center bg-white/5 p-3 border-l-2 border-green-500">
                        <span className="text-xs font-bold">{p.nickname}</span>
                        <span className="text-xs font-black italic text-[#ffeb00]">{p.kills} Kills</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ECHIPA B */}
                <div>
                  <h4 className="text-[9px] font-black uppercase text-red-500 mb-4 tracking-widest flex items-center gap-2">
                    <Users size={12}/> Opposing Intel
                  </h4>
                  <div className="space-y-2">
                    {match.match_players.filter((p: any) => p.team === 'SIDE_B').map((p: any) => (
                      <div key={p.steam_id} className="flex justify-between items-center bg-white/5 p-3 border-l-2 border-red-500/50">
                        <span className="text-xs font-bold">{p.nickname}</span>
                        <span className="text-xs font-black italic">{p.kills} Kills</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* VIDEO / DEMO CTA */}
              <div className="mt-10 pt-6 border-t border-white/5 flex justify-center gap-6">
                <a 
                  href={match.demo_url} 
                  className="flex items-center gap-3 bg-[#ffeb00] text-black px-6 py-3 font-[1000] uppercase italic text-[10px] hover:bg-white transition-all"
                >
                  <Download size={14} /> Download Mission Demo
                </a>
                <button className="flex items-center gap-3 border border-white/10 px-6 py-3 font-[1000] uppercase italic text-[10px] hover:bg-white/5 opacity-50 cursor-not-allowed">
                  <Play size={14} /> Render Highlights (Coming Soon)
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
