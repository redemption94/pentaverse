import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { Trophy, Clock, Activity, BarChart3, Heart, ShieldCheck } from 'lucide-react';
import MatchHistoryList from '../../../components/MatchHistoryList';
import MatchImporter from '../../../components/MatchImporter';

export const dynamic = 'force-dynamic';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function ProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const steamId = params.id;

  const { data: player } = await supabase
    .from('players')
    .select(`*, matches:matches(*, match_players(*))`)
    .eq('steam_id', steamId)
    .single();

  if (!player) return notFound();

  const sortedMatches = (player.matches || []).sort((a: any, b: any) => 
    new Date(b.match_timestamp).getTime() - new Date(a.match_timestamp).getTime()
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* HEADER SECTION */}
      <header className="h-[400px] bg-black border-b border-white/5 relative flex items-end pb-16 px-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-end gap-10 relative z-10">
          <div className="w-44 h-44 border-4 border-[#ffeb00] bg-black shadow-[0_0_50px_rgba(255,235,0,0.2)]">
            <img src={player.avatar_url} className="w-full h-full object-cover grayscale" alt="" />
          </div>
          <div className="flex-1">
            <h1 className="text-7xl font-[1000] uppercase italic tracking-tighter leading-none mb-4">{player.nickname}</h1>
            <div className="flex gap-8 text-gray-500 text-[10px] font-black uppercase tracking-widest">
               <span className="flex items-center gap-2 text-white"><Trophy size={14} className="text-[#ffeb00]"/> Scout Rating: {player.penta_scout_score}</span>
               <span className="flex items-center gap-2 font-mono">Dossier: {player.steam_id}</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-12 py-20 grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          {/* MATCH IMPORTER */}
          <MatchImporter steamId={steamId} />

          {/* MATCH LIST */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-600 mb-10 flex items-center gap-3">
              <Activity size={16} className="text-[#ffeb00]" /> Mission Intelligence Archive
            </h3>
            <MatchHistoryList initialMatches={sortedMatches} playerSteamId={steamId} />
          </section>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-8">
           <div className="bg-[#ffeb00] p-10 text-black shadow-[0_0_60px_rgba(255,235,0,0.1)]">
              <Heart size={36} className="mb-8 fill-black" />
              <h3 className="text-3xl font-[1000] uppercase italic leading-none mb-6">Sponsor Career</h3>
              <button className="w-full bg-black text-[#ffeb00] py-5 font-black uppercase italic text-xs hover:bg-white transition-all shadow-xl">
                Initialize Funding
              </button>
           </div>
           <div className="bg-[#0a0a0a] border border-white/5 p-8 flex items-center gap-4 text-green-500">
              <ShieldCheck size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Integritate Verificată</span>
           </div>
        </aside>
      </main>
    </div>
  );
}
