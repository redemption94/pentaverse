'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Users, 
  Map as MapIcon, 
  Award, 
  Calendar, 
  Clock, 
  ShieldCheck,
  Play
} from 'lucide-react';

interface MatchPlayer {
  steam_id: string;
  nickname: string;
  team: 'SIDE_A' | 'SIDE_B';
  kills: number;
  deaths: number;
  mvps: number;
  avatar_url: string;
}

interface Match {
  match_id: string;
  map_name: string;
  team_score: number;
  enemy_score: number;
  result: 'WIN' | 'LOSS' | 'TIE';
  game_mode: string;
  match_timestamp: string;
  demo_url?: string;
  video_url?: string;
  match_players: MatchPlayer[];
}

export default function MatchHistoryList({ 
  initialMatches, 
  playerSteamId 
}: { 
  initialMatches: Match[], 
  playerSteamId: string 
}) {
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  if (!initialMatches || initialMatches.length === 0) {
    return (
      <div className="p-20 border border-dashed border-white/5 text-center bg-[#0a0a0a]/50">
         <p className="text-xs font-black uppercase tracking-[0.5em] text-gray-700">
           No Combat Data Recovered From Archives
         </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {initialMatches.map((match) => {
        const isExpanded = expandedMatch === match.match_id;
        const matchDate = new Date(match.match_timestamp);
        
        return (
          <div 
            key={match.match_id} 
            className={`bg-[#0a0a0a] border transition-all duration-300 overflow-hidden ${
              isExpanded ? 'border-[#ffeb00]/40 shadow-[0_0_40px_rgba(255,235,0,0.05)]' : 'border-white/5'
            }`}
          >
            {/* --- MATCH SUMMARY (HEADER) --- */}
            <div 
              onClick={() => setExpandedMatch(isExpanded ? null : match.match_id)}
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] group"
            >
              <div className="flex items-center gap-8">
                {/* Result Indicator */}
                <div className={`w-1.5 h-12 ${
                  match.result === 'WIN' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 
                  match.result === 'TIE' ? 'bg-gray-500' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                }`} />
                
                <div>
                  <div className="flex items-center gap-3 mb-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-black text-white uppercase flex items-center gap-1 tracking-tighter">
                      <Calendar size={10} /> {matchDate.toLocaleDateString('ro-RO')}
                    </span>
                    <span className="text-[8px] font-black text-white uppercase flex items-center gap-1 tracking-tighter">
                      <Clock size={10} /> {matchDate.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-2xl font-[1000] uppercase italic leading-none tracking-tighter">
                    {match.map_name?.replace('de_', '') || 'ANCIENT'}
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-3xl font-[1000] italic leading-none">
                  {match.team_score} <span className="text-gray-700 mx-1">:</span> {match.enemy_score}
                </p>
                <span className="text-[9px] font-black uppercase text-gray-600 tracking-[0.3em]">
                  {match.game_mode || 'PREMIER'}
                </span>
              </div>

              <div className="flex items-center gap-8">
                 <div className="text-right hidden md:block">
                    <p className="text-[9px] font-black text-gray-600 uppercase mb-1">Impact Score</p>
                    {/* Căutăm statisticile userului curent în acest meci */}
                    {match.match_players?.filter(p => p.steam_id === playerSteamId).map(p => (
                      <p key={p.steam_id} className="text-xl font-[1000] italic text-[#ffeb00] leading-none">
                        {p.kills}K / {p.deaths}D
                      </p>
                    ))}
                 </div>
                 <div className={`p-2 transition-colors ${isExpanded ? 'bg-[#ffeb00] text-black' : 'bg-white/5 text-gray-500'}`}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                 </div>
              </div>
            </div>

            {/* --- DETALII EXTINSE (LINEUPS & TEAMS) --- */}
            {isExpanded && (
              <div className="p-10 border-t border-white/5 bg-gradient-to-b from-black/60 to-black animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="grid md:grid-cols-2 gap-16">
                  
                  {/* SQUAD A (FRIENDLY) */}
                  <div>
                    <div className="flex justify-between items-end mb-8 border-b border-green-500/20 pb-3">
                       <h4 className="text-[11px] font-[1000] uppercase text-green-500 flex items-center gap-2 tracking-[0.2em]">
                          <Users size={14}/> Friendly Lineup
                       </h4>
                       <span className="text-[10px] font-black text-white/20 italic tracking-widest">
                         SIDE A SCORE: {match.team_score}
                       </span>
                    </div>
                    <div className="space-y-1.5">
                      {match.match_players?.filter(p => p.team === 'SIDE_A').map((p) => (
                        <div 
                          key={p.steam_id} 
                          className={`flex justify-between items-center p-4 transition-all ${
                            p.steam_id === playerSteamId 
                            ? 'bg-[#ffeb00]/10 border-l-4 border-[#ffeb00] shadow-[inset_0_0_20px_rgba(255,235,0,0.05)]' 
                            : 'bg-white/[0.03] border-l-2 border-white/5'
                          }`}
                        >
                           <div className="flex items-center gap-4">
                              <div className="w-8 h-8 bg-black border border-white/10 grayscale overflow-hidden shrink-0">
                                 {p.avatar_url && <img src={p.avatar_url} className="w-full h-full object-cover" alt="" />}
                              </div>
                              <span className={`text-sm font-bold tracking-tight ${p.steam_id === playerSteamId ? 'text-[#ffeb00]' : 'text-gray-300'}`}>
                                {p.nickname} {p.steam_id === playerSteamId && <span className="text-[8px] font-black ml-1">(YOU)</span>}
                              </span>
                           </div>
                           <div className="flex gap-6 text-[11px] font-black italic">
                              <div className="flex flex-col items-end">
                                <span className="text-white leading-none">{p.kills}</span>
                                <span className="text-[7px] text-gray-600 uppercase">Kills</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-white/40 leading-none">{p.deaths}</span>
                                <span className="text-[7px] text-gray-600 uppercase">Deaths</span>
                              </div>
                              {p.mvps > 0 && (
                                <div className="flex flex-col items-end text-[#ffeb00]">
                                  <Award size={10} className="mb-0.5" />
                                  <span className="text-[7px] font-black uppercase">MVP x{p.mvps}</span>
                                </div>
                              )}
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SQUAD B (OPPONENTS) */}
                  <div>
                    <div className="flex justify-between items-end mb-8 border-b border-red-500/20 pb-3">
                       <h4 className="text-[11px] font-[1000] uppercase text-red-500 flex items-center gap-2 tracking-[0.2em]">
                          <Users size={14}/> Enemy Intelligence
                       </h4>
                       <span className="text-[10px] font-black text-white/20 italic tracking-widest">
                         SIDE B SCORE: {match.enemy_score}
                       </span>
                    </div>
                    <div className="space-y-1.5">
                      {match.match_players?.filter(p => p.team === 'SIDE_B').map((p) => (
                        <div key={p.steam_id} className="flex justify-between items-center p-4 bg-white/[0.02] border-l-2 border-white/5 hover:bg-white/[0.05] transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="w-8 h-8 bg-black border border-white/10 opacity-30 shrink-0">
                                 {p.avatar_url && <img src={p.avatar_url} className="w-full h-full object-cover" alt="" />}
                              </div>
                              <span className="text-sm font-bold text-gray-400">{p.nickname}</span>
                           </div>
                           <div className="flex gap-6 text-[11px] font-black italic">
                              <div className="flex flex-col items-end">
                                <span className="text-white/40 leading-none">{p.kills}</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-white/20 leading-none">{p.deaths}</span>
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* --- MISSION FOOTAGE & DOWNLOADS --- */}
                <div className="mt-14 pt-8 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
                   <div className="flex items-center gap-5">
                      <div className="bg-[#ffeb00]/5 p-4 border border-[#ffeb00]/10 shadow-[0_0_20px_rgba(255,235,0,0.02)]">
                         <ShieldCheck size={24} className="text-[#ffeb00]" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1.5">Data Integrity</p>
                         <p className="text-[11px] font-bold text-white uppercase italic">Verified Mission - Valve MatchID: {match.match_id.slice(0,10)}...</p>
                      </div>
                   </div>
                   
                   <div className="flex gap-4 w-full lg:w-auto">
                     {match.demo_url ? (
                       <a 
                         href={match.demo_url}
                         className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-white text-black px-10 py-5 font-[1000] uppercase italic text-[11px] hover:bg-[#ffeb00] transition-all"
                       >
                         <Download size={16} /> Get Official Demo
                       </a>
                     ) : (
                       <div className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-white/5 text-gray-600 px-10 py-5 font-[1000] uppercase italic text-[11px] border border-white/5 cursor-not-allowed">
                          <Download size={16} /> Demo Unavailable
                       </div>
                     )}

                     <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 border border-white/10 px-10 py-5 font-[1000] uppercase italic text-[11px] text-gray-500 hover:bg-white/5 transition-all cursor-not-allowed">
                        <Play size={16} /> Watch Replay
                     </button>
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
