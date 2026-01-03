import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { 
  Target, Zap, Clock, BarChart3, Heart, 
  ShieldCheck, Trophy, Activity 
} from 'lucide-react';
import MatchHistoryList from '@/components/MatchHistoryList';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const steamId = params.id;

  // Extragem datele jucătorului ȘI toate meciurile cu jucătorii aferenți (Join)
  const { data: player, error: playerError } = await supabase
    .from('players')
    .select(`
      *,
      matches:matches(
        *,
        match_players(*)
      )
    `)
    .eq('steam_id', steamId)
    .single();

  if (playerError || !player) return notFound();

  // Sortăm meciurile după data cea mai recentă
  const sortedMatches = player.matches?.sort((a: any, b: any) => 
    new Date(b.match_timestamp).getTime() - new Date(a.match_timestamp).getTime()
  ) || [];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ffeb00] selection:text-black font-sans">
      
      {/* HEADER: PLAYER IDENTITY */}
      <div className="h-[400px] bg-black border-b border-white/5 relative flex items-end pb-16 px-6 md:px-12">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-end gap-10 relative z-10">
          <div className="w-44 h-44 border-4 border-[#ffeb00] bg-black shadow-[0_0_50px_rgba(255,235,0,0.15)]">
            <img src={player.avatar_url} className="w-full h-full object-cover grayscale" alt={player.nickname} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#ffeb00] text-black text-[10px] font-[1000] px-3 py-1 uppercase italic skew-x-[-12deg]">
                Active Combat Asset
              </span>
              <span className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">ID: {player.steam_id}</span>
            </div>
            <h1 className="text-7xl md:text-8xl font-[1000] uppercase italic tracking-tighter leading-none mb-4">
              {player.nickname}
            </h1>
            <div className="flex gap-8 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
               <span className="flex items-center gap-2"><Clock size={14} className="text-[#ffeb00]"/> {player.playtime_hours}h Total Grind</span>
               <span className="flex items-center gap-2 text-white"><Trophy size={14} className="text-[#ffeb00]"/> Scout Score: {player.penta_scout_score}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-20 grid lg:grid-cols-3 gap-16">
        
        {/* LEFT COLUMN: MATCH ARCHIVE (INTERACTIVE) */}
        <div className="lg:col-span-2 space-y-12">
          <section>
             <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-600 mb-10 flex items-center gap-3">
                <Activity size={16} className="text-[#ffeb00]" /> Mission Intelligence Archive
             </h3>
             
             {/* PASĂM DATELE CĂTRE COMPONENTA DE CLIENT */}
             <MatchHistoryList initialMatches={sortedMatches} playerSteamId={steamId} />
          </section>

          <section className="bg-[#0a0a0a] p-10 border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5"><BarChart3 size={120} /></div>
             <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 mb-6 font-black uppercase">Career Dossier</h3>
             <p className="text-2xl font-medium italic text-gray-400 leading-relaxed border-l-4 border-[#ffeb00] pl-10">
               {player.bio || "Acest profil utilizează Inteligența Steam pentru a monitoriza performanța în timp real. Toate datele de meci sunt extrase direct din Game Coordinator."}
             </p>
          </section>
        </div>

        {/* RIGHT COLUMN: SPONSORSHIP & INTEGRITY */}
        <aside className="space-y-8">
           <div className="bg-[#ffeb00] p-10 text-black shadow-[0_0_60px_rgba(255,235,0,0.1)]">
              <Heart size={36} className="mb-8 fill-black" />
              <h3 className="text-3xl font-[1000] uppercase italic leading-none mb-6">Sponsor Career</h3>
              <p className="text-[10px] font-black uppercase tracking-widest mb-10 opacity-60 italic">
                Help this asset reach the professional circuit.
              </p>
              <button className="w-full bg-black text-[#ffeb00] py-5 font-[1000] uppercase italic text-xs hover:bg-white transition-all shadow-xl">
                Initialize Support
              </button>
           </div>
           
           <div className="bg-[#0a0a0a] border border-white/5 p-8">
              <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4">Integrity Status</h4>
              <div className="flex items-center gap-3 text-green-500 bg-green-500/5 p-4 border border-green-500/20">
                 <ShieldCheck size={20} />
                 <span className="text-[10px] font-[1000] uppercase tracking-tighter">VAC Secure / Trusted Account</span>
              </div>
           </div>
        </aside>

      </main>
    </div>
  );
}
