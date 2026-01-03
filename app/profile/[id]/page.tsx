import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { 
  Target, Zap, Clock, BarChart3, Heart, 
  ShieldCheck, Trophy, Activity 
} from 'lucide-react';
import MatchHistoryList from '../../../components/MatchHistoryList';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const steamId = params.id;

  // Interogăm Jucătorul + Cele mai recente 10 meciuri (JOIN cu jucătorii din meci)
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

  // Sortăm meciurile astfel încât cel mai recent să fie primul (DESC)
  // Și limităm la ultimele 10
  const sortedMatches = (player.matches || [])
    .sort((a: any, b: any) => 
      new Date(b.match_timestamp).getTime() - new Date(a.match_timestamp).getTime()
    )
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ffeb00] selection:text-black">
      <header className="h-[400px] bg-black border-b border-white/5 relative flex items-end pb-16 px-12">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-end gap-10 relative z-10">
          <div className="w-44 h-44 border-4 border-[#ffeb00] bg-black">
            <img src={player.avatar_url} className="w-full h-full object-cover grayscale" alt="" />
          </div>
          <div className="flex-1">
            <h1 className="text-7xl font-[1000] uppercase italic tracking-tighter leading-none mb-4">{player.nickname}</h1>
            <div className="flex gap-8 text-gray-500 text-[10px] font-black uppercase tracking-widest">
               <span className="flex items-center gap-2 text-white"><Trophy size={14} className="text-[#ffeb00]"/> Scout Rating: {player.penta_scout_score}</span>
               <span className="flex items-center gap-2"><Clock size={14}/> Dossier: {player.steam_id}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-12 py-20 grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <section>
             <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-600 mb-10 flex items-center gap-3">
                <Activity size={16} className="text-[#ffeb00]" /> Recent Mission Intelligence (Last 10 Matches)
             </h3>
             <MatchHistoryList initialMatches={sortedMatches} playerSteamId={steamId} />
          </section>
        </div>

        <aside className="space-y-8">
           <div className="bg-[#ffeb00] p-10 text-black">
              <Heart size={36} className="mb-8 fill-black" />
              <h3 className="text-3xl font-[1000] uppercase italic leading-none mb-6">Sponsor Career</h3>
              <button className="w-full bg-black text-[#ffeb00] py-5 font-black uppercase italic text-xs hover:bg-white transition-all">Support Talent</button>
           </div>
        </aside>
      </main>
    </div>
  );
}
