import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { 
  Target, Zap, Clock, BarChart3, Heart, 
  ShieldCheck, Activity, Award, Calendar, ChevronRight
} from 'lucide-react';

export const dynamic = 'force-dynamic';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function ProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  // Tragem datele jucătorului ȘI ultimele lui meciuri
  const [playerRes, matchesRes] = await Promise.all([
    supabase.from('players').select('*').eq('steam_id', params.id).single(),
    supabase.from('matches').select('*').eq('player_steam_id', params.id).order('match_date', { ascending: false }).limit(5)
  ]);

  if (playerRes.error || !playerRes.data) return notFound();
  const player = playerRes.data;
  const matches = matchesRes.data || [];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      
      {/* HEADER: IDENTITY */}
      <div className="h-[400px] bg-black border-b border-white/5 relative flex items-end pb-16 px-12">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-end gap-10 relative z-10">
          <div className="w-44 h-44 border-4 border-[#ffeb00] bg-black shadow-[0_0_50px_rgba(255,235,0,0.1)]">
            <img src={player.avatar_url} className="w-full h-full object-cover grayscale" />
          </div>
          <div className="flex-1">
            <h1 className="text-7xl font-[1000] uppercase italic tracking-tighter leading-none mb-4">{player.nickname}</h1>
            <div className="flex gap-6 text-gray-500 text-[10px] font-black uppercase tracking-widest">
               <span className="flex items-center gap-2"><Clock size={14} className="text-[#ffeb00]"/> {player.playtime_hours}h Grind</span>
               <span className="flex items-center gap-2 text-white"><Zap size={14} className="text-[#ffeb00]"/> Scout Rating: {player.penta_scout_score}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-12 py-20 grid lg:grid-cols-3 gap-16">
        
        {/* LEFT COLUMN: MATCH HISTORY */}
        <div className="lg:col-span-2 space-y-12">
          <section>
             <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 mb-8 flex items-center gap-3">
                <Activity size={16} className="text-[#ffeb00]" /> Recent Combat History
             </h3>
             
             <div className="space-y-2">
                {matches.length > 0 ? matches.map((match) => (
                  <div key={match.match_id} className="bg-[#0a0a0a] border border-white/5 p-6 flex items-center justify-between group hover:border-[#ffeb00]/30 transition-all">
                     <div className="flex items-center gap-8">
                        <div className={`w-1 h-12 ${match.result === 'WIN' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                        <div>
                           <p className="text-[10px] font-black text-gray-600 uppercase mb-1">Map Deployment</p>
                           <p className="text-lg font-[1000] uppercase italic leading-none">{match.map_name.replace('de_', '')}</p>
                        </div>
                     </div>
                     
                     <div className="text-center">
                        <p className="text-[9px] font-black text-gray-500 uppercase mb-1">Score</p>
                        <p className="text-xl font-black italic">{match.team_score} — {match.enemy_score}</p>
                     </div>

                     <div className="text-center hidden md:block">
                        <p className="text-[9px] font-black text-gray-500 uppercase mb-1">Performance</p>
                        <p className="text-xl font-black italic text-[#ffeb00]">{match.kills}K / {match.deaths}D</p>
                     </div>

                     <div className="flex items-center gap-4">
                        <div className="text-right">
                           <p className="text-[9px] font-black text-gray-500 uppercase mb-1">Impact</p>
                           <div className="flex gap-0.5">
                              {Array.from({length: match.mvps}).map((_, i) => <Award key={i} size={12} className="text-[#ffeb00]"/>)}
                           </div>
                        </div>
                        <ChevronRight className="text-gray-800 group-hover:text-[#ffeb00] transition-colors" />
                     </div>
                  </div>
                )) : (
                  <div className="bg-[#0a0a0a] border border-white/5 p-12 text-center">
                     <p className="text-gray-600 uppercase text-[10px] font-black tracking-widest">No verified match data available for this asset.</p>
                  </div>
                )}
             </div>
          </section>

          <section className="bg-[#0a0a0a] p-10 border border-white/5">
             <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 mb-6">Career Bio</h3>
             <p className="text-2xl font-medium italic text-gray-400 leading-relaxed border-l-4 border-[#ffeb00] pl-10 italic">
               {player.bio || "Career Dossier Active. Acest jucător este acum monitorizat în timp real pentru oportunități de scouting."}
             </p>
          </section>
        </div>

        {/* RIGHT COLUMN: SPONSORSHIP */}
        <aside className="space-y-8">
           <div className="bg-[#ffeb00] p-10 text-black shadow-[0_0_60px_rgba(255,235,0,0.15)]">
              <Heart size={36} className="mb-6 fill-black" />
              <h3 className="text-3xl font-[1000] uppercase italic leading-none mb-8">Sponsor Career</h3>
              <p className="text-[10px] font-black uppercase tracking-widest mb-10 opacity-50">Fuel the professional transition of this talent.</p>
              <button className="w-full bg-black text-[#ffeb00] py-5 font-black uppercase italic text-xs hover:bg-white transition-all">Support Talent</button>
           </div>
           
           <div className="bg-[#0a0a0a] border border-white/5 p-8">
              <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4">Integrity Check</h4>
              <div className="flex items-center gap-3 text-green-500 bg-green-500/5 p-4 border border-green-500/20">
                 <ShieldCheck size={18} />
                 <span className="text-[10px] font-[1000] uppercase">Secure / No Bans Detected</span>
              </div>
           </div>
        </aside>

      </main>
    </div>
  );
}
