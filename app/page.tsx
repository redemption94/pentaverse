'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { 
  Bell, Trophy, Zap, ChevronRight, BarChart3, 
  Users, Target, TrendingUp, TrendingDown, Shield,
  Clock // Iconiță nouă pentru ore
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ESLProPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: playersData } = await supabase
        .from('players')
        .select('*') // Acum tragem și playtime_hours automat
        .order('current_elo', { ascending: false });

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const { data: historyData } = await supabase
        .from('elo_history')
        .select('player_id, elo_value')
        .eq('recorded_at', yesterdayStr);

      const finalData = playersData?.map(p => {
        const hist = historyData?.find(h => h.player_id === p.id);
        return { ...p, diff: hist ? p.current_elo - hist.elo_value : 0 };
      });

      setPlayers(finalData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-[#ffeb00] selection:text-black font-sans tracking-tight">
      
      {/* --- NAVBAR --- */}
      <nav className="h-20 border-b-2 border-[#1a1a1a] bg-black sticky top-0 z-50 px-6">
        <div className="max-w-[1400px] mx-auto h-full flex justify-between items-center">
          <div className="flex items-center gap-10">
            <div className="text-3xl font-[1000] italic tracking-tighter flex items-center">
              <span className="bg-[#ffeb00] text-black px-3 py-1 esl-slash leading-none mr-2">PENTA</span>
              <span>VERSE</span>
            </div>
          </div>
          <button className="bg-[#ffeb00] text-black font-[1000] uppercase text-[11px] px-8 py-3 skew-x-[-15deg] hover:bg-white transition-all group">
            <span className="inline-block skew-x-[15deg]">Claim Profile</span>
          </button>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 py-12">
        
        {/* --- DYNAMIC HEADER --- */}
        <div className="grid lg:grid-cols-12 gap-1 mb-20 bg-[#111] border-l-[12px] border-[#ffeb00]">
          <div className="lg:col-span-8 p-10 md:p-16">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <span className="inline-block bg-[#ffeb00] text-black text-[10px] font-black px-3 py-1 mb-6 uppercase tracking-widest skew-x-[-10deg]">
                CS2 Romania Pro Circuit
              </span>
              <h1 className="text-6xl md:text-8xl font-[1000] uppercase italic leading-[0.85] tracking-tighter mb-8">
                Elite <span className="text-[#ffeb00]">Analytics</span>
              </h1>
              <p className="text-gray-500 max-w-md font-bold uppercase text-[10px] tracking-[0.2em] leading-relaxed">
                Combinăm datele competitive Faceit cu istoricul de activitate Steam pentru cel mai precis ranking național.
              </p>
            </motion.div>
          </div>
          <div className="lg:col-span-4 grid grid-rows-2 gap-1 p-1">
             <div className="bg-black/40 p-8 flex flex-col justify-end border-b border-white/5">
                <Clock className="text-[#ffeb00] mb-4" size={28} />
                <p className="text-2xl font-[1000] italic uppercase leading-none">Playtime Tracking</p>
                <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mt-2">Steam Web API Integrated</p>
             </div>
             <div className="bg-black/40 p-8 flex flex-col justify-end">
                <BarChart3 className="text-[#ffeb00] mb-4" size={28} />
                <p className="text-2xl font-[1000] italic uppercase leading-none">Live ELO</p>
                <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mt-2">Faceit Data Feed</p>
             </div>
          </div>
        </div>

        {/* --- LEADERBOARD --- */}
        <section className="bg-[#111] border border-[#1a1a1a] shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-[#1a1a1a] flex justify-between items-center bg-white/[0.01]">
            <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter flex items-center gap-4">
               <Target size={28} className="text-[#ffeb00]" /> 
               PRO RANKING <span className="text-gray-700">/ CS2</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/50 text-[10px] font-[1000] uppercase text-gray-500 tracking-[0.25em] border-b border-[#1a1a1a]">
                  <th className="p-6 text-center w-20">#</th>
                  <th className="p-6">Competitor</th>
                  <th className="p-6 text-center">Faceit Elo</th>
                  <th className="p-6 text-center">CS2 Hours</th>
                  <th className="p-6 text-center hidden md:table-cell">24h Status</th>
                  <th className="p-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {loading ? (
                    <tr><td colSpan={6} className="p-24 text-center text-gray-700 font-black uppercase italic tracking-[0.5em] animate-pulse">Synchronizing Data Systems...</td></tr>
                  ) : (
                    players.map((p, i) => (
                      <motion.tr 
                        key={p.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="group border-b border-[#1a1a1a] hover:bg-white/[0.03] transition-all"
                      >
                        <td className="p-6 text-center font-mono font-[1000] italic text-gray-700 group-hover:text-[#ffeb00]">
                          {(i + 1).toString().padStart(2, '0')}
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-[#222] border border-white/10 overflow-hidden relative group-hover:border-[#ffeb00]/40 transition-all">
                               <img src={p.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${p.nickname}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-110" alt="" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-base font-[1000] uppercase italic tracking-tighter group-hover:text-[#ffeb00] transition-colors">{p.nickname}</p>
                                {p.is_verified && <Shield size={14} className="text-[#ffeb00] fill-[#ffeb00]/20" />}
                              </div>
                              <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest mt-0.5">National Pro Division</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-center">
                           <div className="inline-block bg-[#1a1a1a] px-4 py-1 border border-[#2a2a2a] font-mono text-lg font-[1000] italic text-white group-hover:text-[#ffeb00]">
                              {p.current_elo}
                           </div>
                        </td>
                        <td className="p-6 text-center">
                           <div className="flex flex-col items-center">
                              <span className="font-mono text-sm font-black text-gray-400">
                                {p.playtime_hours > 0 ? `${p.playtime_hours.toLocaleString()}h` : 'PRIVATE'}
                              </span>
                              <div className="w-12 h-[2px] bg-[#2a2a2a] mt-1 relative overflow-hidden">
                                 <div className="absolute top-0 left-0 h-full bg-[#ffeb00]/20 w-full animate-shimmer" />
                              </div>
                           </div>
                        </td>
                        <td className="p-6 text-center hidden md:table-cell">
                           <div className={`flex items-center justify-center gap-1 font-black italic text-xs ${p.diff > 0 ? 'text-[#ffeb00]' : p.diff < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                              {p.diff > 0 ? <TrendingUp size={14}/> : p.diff < 0 ? <TrendingDown size={14}/> : null}
                              {p.diff === 0 ? '--' : p.diff > 0 ? `+${p.diff}` : p.diff}
                           </div>
                        </td>
                        <td className="p-6 text-right">
                           <button className="text-gray-700 hover:text-[#ffeb00] transition-all p-2 hover:bg-[#ffeb00]/5 rounded-lg">
                              <Bell size={20} />
                           </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="bg-black py-20 border-t-2 border-[#1a1a1a] text-center">
         <div className="text-2xl font-[1000] italic opacity-10 mb-4 tracking-tighter uppercase">
            PENTA<span className="text-[#ffeb00]">VERSE</span> // 2026
         </div>
      </footer>
    </div>
  );
}
