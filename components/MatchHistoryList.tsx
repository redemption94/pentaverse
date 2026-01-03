'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Users, Award, Calendar, Clock } from 'lucide-react';

interface MatchHistoryProps {
  initialMatches: any[];
  playerSteamId: string;
}

export default function MatchHistoryList({ initialMatches, playerSteamId }: MatchHistoryProps) {
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {initialMatches.map((match) => {
        const isExpanded = expandedMatch === match.match_id;
        const date = new Date(match.match_timestamp);
        
        return (
          <div key={match.match_id} className={`bg-[#0a0a0a] border ${isExpanded ? 'border-[#ffeb00]/40' : 'border-white/5'}`}>
            <div 
              onClick={() => setExpandedMatch(isExpanded ? null : match.match_id)}
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-6">
                <div className={`w-1.5 h-12 ${match.result === 'WIN' ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <div className="flex gap-2 text-[8px] font-black text-gray-600 uppercase mb-1 tracking-tighter">
                    <Calendar size={10} /> {date.toLocaleDateString('ro-RO')}
                    <Clock size={10} className="ml-2" /> {date.toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <p className="text-xl font-[1000] uppercase italic tracking-tighter leading-none">{match.map_name.replace('de_', '')}</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-2xl font-[1000] italic">{match.team_score} : {match.enemy_score}</p>
                <span className="text-[9px] font-black uppercase text-gray-700">{match.game_mode}</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                  <p className="text-[9px] font-black text-gray-600 uppercase mb-1 tracking-widest">Your Impact</p>
                  {match.match_players?.filter((p: any) => p.steam_id === playerSteamId).map((p: any) => (
                    <p key={p.steam_id} className="text-lg font-black italic text-[#ffeb00]">{p.kills}K / {p.deaths}D</p>
                  ))}
                </div>
                {isExpanded ? <ChevronUp size={20} className="text-[#ffeb00]" /> : <ChevronDown size={20} className="text-gray-600" />}
              </div>
            </div>

            {isExpanded && (
              <div className="p-10 border-t border-white/5 bg-black/40 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid md:grid-cols-2 gap-12">
                  {/* TEAM A */}
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-green-500 mb-6 flex items-center gap-2 tracking-[0.2em]">Friendly Forces</h4>
                    <div className="space-y-1.5">
                      {match.match_players?.filter((p: any) => p.team === 'SIDE_A').map((p: any) => (
                        <div key={p.steam_id} className={`flex justify-between p-3 ${p.steam_id === playerSteamId ? 'bg-[#ffeb00]/10 border-l-2 border-[#ffeb00]' : 'bg-white/5 opacity-80'}`}>
                          <span className="text-xs font-bold">{p.nickname}</span>
                          <div className="flex gap-4 font-black italic text-[10px]">
                             <span className="text-white">{p.kills}K</span>
                             <span className="text-white/40">{p.deaths}D</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* TEAM B */}
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-red-500 mb-6 flex items-center gap-2 tracking-[0.2em]">Opposing Intel</h4>
                    <div className="space-y-1.5">
                      {match.match_players?.filter((p: any) => p.team === 'SIDE_B').map((p: any) => (
                        <div key={p.steam_id} className="flex justify-between p-3 bg-white/[0.02] border-l border-white/5">
                          <span className="text-xs font-bold opacity-60">{p.nickname}</span>
                          <span className="text-[10px] font-black italic opacity-30">{p.kills}K / {p.deaths}D</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
