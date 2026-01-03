import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { 
  Target, Zap, Clock, BarChart3, Heart, 
  ShieldCheck, Crosshair, Map as MapIcon, Award, Activity
} from 'lucide-react';

export const dynamic = 'force-dynamic';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function ProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { data: player, error } = await supabase.from('players').select('*').eq('steam_id', params.id).single();

  if (error || !player) return notFound();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ffeb00] selection:text-black font-sans">
      
      {/* HEADER CA ÎN ESL */}
      <div className="h-[450px] bg-black border-b border-white/5 relative flex items-end pb-16 px-6 md:px-12">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="flex flex-col md:flex-row items-center md:items-end gap-10 relative z-10 w-full max-w-7xl mx-auto">
          <div className="w-48 h-48 border-4 border-[#ffeb00] bg-black shadow-[0_0_50px_rgba(255,235,0,0.1)]">
            <img src={player.avatar_url} className="w-full h-full object-cover grayscale" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <span className="bg-[#ffeb00] text-black text-[10px] font-[1000] px-3 py-1 uppercase italic skew-x-[-12deg]">Live Combat Asset</span>
              <span className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">ID: {player.steam_id}</span>
            </div>
            <h1 className="text-7xl md:text-8xl font-[1000] uppercase italic tracking-tighter leading-none mb-4">{player.nickname}</h1>
            <div className="flex items-center justify-center md:justify-start gap-6 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
               <span className="flex items-center gap-2"><Clock size={14}/> {player.recent_playtime_2weeks}h Last 2 Weeks</span>
               <span className="flex items-center gap-2 text-[#ffeb00]"><Zap size={14}/> Scout Score: {player.penta_scout_score}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-20 grid lg:grid-cols-3 gap-16">
        
        {/* COLOANA STÂNGA: INTEL & LAST MATCH */}
        <div className="lg:col-span-2 space-y-16">
          
          {/* --- ULTIMUL MECI (THE INTEL CORE) --- */}
          <section className="bg-[#0a0a0a] border border-white/5 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#ffeb00]"></div>
            <div className="p-10">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 mb-10 flex items-center gap-3">
                <Activity size={16} className="text-[#ffeb00]" /> Last Mission Report
              </h3>
              
              <div className="grid md:grid-cols-4 gap-8 items-center">
                <div className="col-span-1">
                   <p className="text-[9px] font-black text-gray-500 uppercase mb-2">Deployed Map</p>
                   <p className="text-xl font-black italic uppercase flex items-center gap-2">
                      <MapIcon size={18} className="text-[#ffeb00]" /> {player.last_match_map || "DE_ANUBIS"}
                   </p>
                </div>
                <div className="bg-white/5 p-6 border border-white/5 text-center">
                   <p className="text-[9px] font-black text-gray-500 uppercase mb-2">Combat Score</p>
                   <p className="text-3xl font-[1000] italic">{player.last_match_score || "13-10"}</p>
                   <span className={`text-[8px] font-black uppercase ${player.last_match_result === 'WIN' ? 'text-green-500' : 'text-red-500'}`}>
                      Mission {player.last_match_result || "SUCCESS"}
                   </span>
                </div>
                <div className="text-center">
                   <p className="text-[9px] font-black text-gray-500 uppercase mb-2">Kills / Deaths</p>
                   <p className="text-3xl font-[1000] italic text-[#ffeb00]">{player.last_match_kills} / {player.last_match_deaths}</p>
                </div>
                <div className="text-center">
                   <p className="text-[9px] font-black text-gray-500 uppercase mb-2">MVPs</p>
                   <div className="flex justify-center gap-1">
                      {Array.from({length: player.last_match_mvps || 3}).map((_, i) => (
                        <Award key={i} size={16} className="text-[#ffeb00]" />
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* PERFORMANCE TRENDS */}
          <div className="grid grid-cols-2 gap-1">
            <div className="bg-[#0a0a0a] p-10 border border-white/5">
              <p className="text-[9px] text-gray-600 uppercase font-black mb-4 flex items-center gap-2"><Target size={12}/> Career K/D</p>
              <p className="text-5xl font-[1000] italic">{player.avg_kd || "1.15"}</p>
            </div>
            <div className="bg-[#0a0a0a] p-10 border border-white/5">
              <p className="text-[9px] text-gray-600 uppercase font-black mb-4 flex items-center gap-2"><Crosshair size={12}/> HS Precision</p>
              <p className="text-5xl font-[1000] italic text-[#ffeb00]">{player.headshot_pct || "45"}%</p>
            </div>
          </div>
        </div>

        {/* COLOANA DREAPTĂ: SPONSORSHIP */}
        <aside className="space-y-8">
          <div className="bg-[#ffeb00] p-10 text-black shadow-[0_0_60px_rgba(255,235,0,0.1)]">
            <Heart size={36} className="mb-8 fill-black" />
            <h3 className="text-3xl font-[1000] uppercase italic leading-none mb-3">Sponsor Player</h3>
            <p className="text-[10px] font-black uppercase tracking-wider mb-10 opacity-60 italic">Fuel the professional transition</p>
            <button className="w-full bg-black text-[#ffeb00] py-5 font-[1000] uppercase italic text-xs hover:bg-white transition-all">
              Initialize Support
            </button>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 p-8">
            <h4 className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] mb-4">Integrity Status</h4>
            <div className="flex items-center gap-3 bg-green-500/10 p-4 border border-green-500/20 text-green-500">
               <ShieldCheck size={18} />
               <span className="text-[10px] font-[1000] uppercase">VAC Clean / Verified Account</span>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}
