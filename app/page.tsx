'use client'; // Aceasta TREBUIE să fie prima linie

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { 
  Bell, Trophy, Zap, ChevronRight, BarChart3, 
  Users, Target, TrendingUp, TrendingDown, Shield 
} from 'lucide-react';

// Inițializare Supabase (Direct în client pentru acest stadiu)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ESLProPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Preluăm jucătorii
      const { data: playersData } = await supabase
        .from('players')
        .select('*')
        .order('current_elo', { ascending: false });

      // Preluăm istoricul de ieri pentru diff
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
      
      {/* --- ESL BRANDED NAV --- */}
      <nav className="h-20 border-b-2 border-[#1a1a1a] bg-black sticky top-0 z-50 px-6">
        <div className="max-w-[1400px] mx-auto h-full flex justify-between items-center">
          <div className="flex items-center gap-10">
            <div className="text-3xl font-[1000] italic tracking-tighter flex items-center">
              <span className="bg-[#ffeb00] text-black px-3 py-1 esl-slash leading-none mr-2">PENTA</span>
              <span>VERSE</span>
            </div>
          </div>
          <button className="bg-[#ffeb00] text-black font-[1000] uppercase text-[11px] px-8 py-3 skew-x-[-15deg] hover:bg-white transition-all group shadow-[0_0_15px_rgba(255,235,0,0.1)]">
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
                The Elite <br /> <span className="text-[#ffeb00]">Rankings</span>
              </h1>
              <p className="text-gray-500 max-w-md font-bold uppercase text-xs tracking-widest leading-relaxed">
                Platforma oficială de monitorizare a performanței pentru jucătorii de top din România.
              </p>
            </motion.div>
          </div>
          <div className="lg:col-span-4 grid grid-rows-2 gap-1 p-1">
             <div className="bg-black/40 p-8 flex flex-col justify-end">
                <BarChart3 className="text-[#ffeb00] mb-4" size={32} />
                <p className="text-3xl font-[1000] italic uppercase leading-none">Live Sync</p>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-2 tracking-[0.3em]">Faceit API Active</p>
             </div>
             <div className="bg-black/40 p-8 flex flex-col justify-end">
                <Users className="text-[#ffeb00] mb-4" size={32} />
                <p className="text-3xl font-[1000] italic uppercase leading-none">{players.length} Players</p>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-2 tracking-[0.3em]">Tracked Community</p>
             </div>
          </div>
        </div>

        {/* --- LEADERBOARD --- */}
        <section className="bg-[#111] border border-[#1a1a1a] shadow-2xl">
          <div className="p-8 border-b border-[#1a1a1a] flex justify-between items-center">
            <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter flex items-center gap-4">
               <Target size={28} className="text-[#ffeb00]" /> 
               National Ranking <span className="text-gray-600">/ 2026</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/50 text-[10px] font-[1000] uppercase text-gray-500 tracking-[0.25em] border-b border-[#1a1a1a]">
                  <th className="p-6 text-center w-24">Pos</th>
                  <th className="p-6">Competitor</th>
                  <th className="p-6 text-center">Elo Rating</th>
                  <th className="p-6 text-center">24h</th>
                  <th className="p-6 text-right">Alert</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {loading ? (
                    <tr><td colSpan={5} className="p-20 text-center text-gray-600 font-black uppercase italic tracking-widest animate-pulse">Loading Database...</td></tr>
                  ) : (
                    players.map((p, i) => (
                      <motion.tr 
                        key={p.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group border-b border-[#1a1a1a] hover:bg-white/[0.02] transition-all"
                      >
                        <td className="p-6 text-center">
                          <span className={`text-xl font-[1000] italic ${i < 3 ? 'text-[#ffeb00]' : 'text-gray-700'}`}>
                            {i + 1}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#222] border-2 border-white/5 relative group-hover:border-[#ffeb00]/50 transition-all">
                               <img src={p.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${p.nickname}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0" alt="" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-lg font-[1000] uppercase italic tracking-tighter group-hover:text-[#ffeb00] transition-colors">{p.nickname}</p>
                                {p.is_verified && <Shield size={14} className="text-[#ffeb00] fill-[#ffeb00]/20" />}
                              </div>
                              <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Romania Elite Division</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-center">
                           <div className="inline-block bg-black px-4 py-2 border border-[#2a2a2a] font-mono text-xl font-[1000] italic text-[#ffeb00]">
                              {p.current_elo}
                           </div>
                        </td>
                        <td className="p-6 text-center">
                           <div className={`flex items-center justify-center gap-1 font-black italic ${p.diff > 0 ? 'text-[#ffeb00]' : p.diff < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                              {p.diff > 0 ? <TrendingUp size={16}/> : p.diff < 0 ? <TrendingDown size={16}/> : null}
                              {p.diff === 0 ? '---' : p.diff > 0 ? `+${p.diff}` : p.diff}
                           </div>
                        </td>
                        <td className="p-6 text-right">
                           <button className="text-gray-700 hover:text-[#ffeb00] transition-colors">
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
         <div className="text-3xl font-[1000] italic opacity-20 mb-4 tracking-tighter">
            PENTA<span className="text-[#ffeb00]">VERSE</span>
         </div>
         <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em]">
           &copy; 2026 Competitive Infrastructure Romania
         </p>
      </footer>
    </div>
  );
}
