'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { 
  Target, Zap, TrendingUp, Shield, BarChart3, 
  MousePointer2, Search, Crosshair, Award, Users 
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ScoutingDashboard() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScoutingData() {
      const { data } = await supabase
        .from('players')
        .select('*')
        .order('penta_scout_score', { ascending: false });
      
      setPlayers(data || []);
      setLoading(false);
    }
    fetchScoutingData();
  }, []);

  // Categorii filtrate pentru scouting
  const topScouts = players.slice(0, 3);
  const aimGods = [...players].sort((a, b) => b.headshot_pct - a.headshot_pct).slice(0, 4);
  const efficiencyKings = [...players].sort((a, b) => (b.current_elo / (b.playtime_hours || 1)) - (a.current_elo / (a.playtime_hours || 1))).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ffeb00] selection:text-black">
      
      {/* --- ESL STYLE NAVIGATION --- */}
      <nav className="h-20 border-b border-[#1a1a1a] bg-black/95 backdrop-blur-md sticky top-0 z-[100] px-6">
        <div className="max-w-[1400px] mx-auto h-full flex justify-between items-center">
          <div className="flex items-center gap-12">
            <div className="text-3xl font-[1000] italic tracking-tighter flex items-center">
              <span className="bg-[#ffeb00] text-black px-3 py-1 esl-slash leading-none mr-2">PENTA</span>
              <span className="text-white">VERSE</span>
            </div>
            <div className="hidden lg:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              <span className="text-[#ffeb00] border-b border-[#ffeb00] pb-1 cursor-pointer">Scouting Radar</span>
              <span className="hover:text-white cursor-pointer transition-colors">Team Finder</span>
              <span className="hover:text-white cursor-pointer transition-colors">PRO Analysis</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-white/5 border border-white/10 p-2 hover:bg-[#ffeb00] hover:text-black transition-all">
              <Search size={18} />
            </button>
            <button className="bg-[#ffeb00] text-black font-black uppercase text-[10px] px-6 py-2.5 skew-x-[-12deg] hover:bg-white transition-all">
              <span className="inline-block skew-x-[12deg]">Claim Identity</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 py-12">
        
        {/* --- HERO: THE RADAR TOP 3 --- */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffeb00] mb-2">High Potential Analysis</h2>
              <h1 className="text-5xl font-[1000] uppercase italic tracking-tighter">The Radar <span className="text-gray-700">/ Top Potential</span></h1>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-black text-gray-500 uppercase">Algorithm: V2.4 Scouting</p>
              <p className="text-xs font-bold text-green-500 uppercase italic">Live Romania Data Feed</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-1">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-64 bg-[#111] animate-pulse" />)
            ) : (
              topScouts.map((p, i) => (
                <motion.div 
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="bg-[#111] p-8 border-l-4 border-[#ffeb00] group relative overflow-hidden cursor-pointer"
                >
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Target size={160} />
                  </div>
                  <span className="text-4xl font-[1000] italic text-white/10 absolute top-4 right-6">0{i+1}</span>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-black border border-white/10 p-1">
                      <img src={p.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${p.nickname}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-[1000] uppercase italic leading-none group-hover:text-[#ffeb00] transition-colors">{p.nickname}</h3>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-2">Scout Score: <span className="text-white">{p.penta_scout_score}</span></p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                    <div>
                      <p className="text-[8px] font-black text-gray-600 uppercase">Average K/D</p>
                      <p className="text-xl font-black italic">{p.avg_kd || '0.00'}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-gray-600 uppercase">Win Rate</p>
                      <p className="text-xl font-black italic">{p.win_rate_pct}%</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* --- SPECIALIZED SCOUTING GRIDS --- */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          
          {/* CATEGORY: AIM GODS */}
          <section>
            <h3 className="flex items-center gap-3 text-xl font-[1000] uppercase italic mb-8 border-b-2 border-[#ffeb00] pb-4 w-fit">
              <Crosshair className="text-[#ffeb00]" /> Precision Units <span className="text-gray-700 ml-2">/ HS%</span>
            </h3>
            <div className="space-y-2">
              {aimGods.map((p, i) => (
                <div key={p.id} className="bg-[#111] p-4 flex justify-between items-center border border-white/5 hover:border-white/20 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-gray-700">0{i+1}</span>
                    <p className="font-black uppercase italic text-sm">{p.nickname}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-gray-600 uppercase">Headshot Ratio</p>
                    <p className="text-lg font-[1000] italic text-[#ffeb00]">{p.headshot_pct}%</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CATEGORY: EFFICIENCY */}
          <section>
            <h3 className="flex items-center gap-3 text-xl font-[1000] uppercase italic mb-8 border-b-2 border-[#ffeb00] pb-4 w-fit">
              <Zap className="text-[#ffeb00]" /> Efficiency Kings <span className="text-gray-700 ml-2">/ Talent</span>
            </h3>
            <div className="space-y-2">
              {efficiencyKings.map((p, i) => (
                <div key={p.id} className="bg-[#111] p-4 flex justify-between items-center border border-white/5 hover:border-white/20 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-gray-700">0{i+1}</span>
                    <div>
                      <p className="font-black uppercase italic text-sm">{p.nickname}</p>
                      <p className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter">{p.playtime_hours} Hours Played</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-gray-600 uppercase">ELO Per Hour</p>
                    <p className="text-lg font-[1000] italic text-blue-400">{(p.current_elo / (p.playtime_hours || 1)).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* --- FULL RO SCOUTING DATABASE --- */}
        <section className="bg-[#111] border border-white/5">
          <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
            <h2 className="text-xl font-[1000] uppercase italic tracking-tighter flex items-center gap-3">
              <Users size={20} className="text-[#ffeb00]" /> Romanian Scouting Database
            </h2>
            <div className="flex gap-2">
               <span className="text-[9px] bg-white/5 px-3 py-1 font-black uppercase tracking-widest text-gray-500 border border-white/5 italic">Total Tracked: {players.length}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-[9px] font-black uppercase text-gray-600 tracking-widest border-b border-white/5">
                  <th className="p-6">Competitor</th>
                  <th className="p-6 text-center">Elo</th>
                  <th className="p-6 text-center">K/D Ratio</th>
                  <th className="p-6 text-center">Scout Score</th>
                  <th className="p-6 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {players.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                         <div className="w-8 h-8 bg-black border border-white/10 overflow-hidden">
                           <img src={p.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${p.nickname}`} className="w-full h-full grayscale group-hover:grayscale-0" />
                         </div>
                         <p className="font-black uppercase italic text-sm group-hover:text-[#ffeb00] transition-colors">{p.nickname}</p>
                      </div>
                    </td>
                    <td className="p-6 text-center font-mono font-black text-gray-400">{p.current_elo}</td>
                    <td className="p-6 text-center">
                      <span className={`font-black italic ${p.avg_kd > 1.2 ? 'text-green-500' : 'text-white'}`}>{p.avg_kd}</span>
                    </td>
                    <td className="p-6 text-center">
                      <span className="bg-[#ffeb00]/10 text-[#ffeb00] px-3 py-1 text-xs font-black italic">{p.penta_scout_score}</span>
                    </td>
                    <td className="p-6 text-right">
                       <button className="text-gray-700 hover:text-white">
                          <MousePointer2 size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      
      {/* ESL STYLE FOOTER */}
      <footer className="bg-black py-20 border-t border-[#1a1a1a] px-6 text-center">
         <p className="text-[10px] font-[1000] uppercase tracking-[0.5em] text-gray-700">PENTA VERSE // RO Scouting Infrastructure 2026</p>
      </footer>
    </div>
  );
}
