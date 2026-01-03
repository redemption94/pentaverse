import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { Trophy, Clock, Activity } from 'lucide-react';
import MatchHistoryList from '../../../components/MatchHistoryList';
import MatchImporter from '../../../components/MatchImporter';

export const dynamic = 'force-dynamic';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function ProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const steamId = params.id;

  const { data: player } = await supabase.from('players').select('*, matches:matches(*, match_players(*))').eq('steam_id', steamId).single();
  if (!player) return notFound();

  const sortedMatches = (player.matches || []).sort((a: any, b: any) => 
    new Date(b.match_timestamp).getTime() - new Date(a.match_timestamp).getTime()
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-10 mb-20">
        <div className="w-44 h-44 border-4 border-[#ffeb00]"><img src={player.avatar_url} className="w-full h-full grayscale" /></div>
        <div className="flex-1">
          <h1 className="text-7xl font-[1000] uppercase italic tracking-tighter mb-4">{player.nickname}</h1>
          <div className="flex gap-6 text-[10px] font-black uppercase text-gray-500">
            <span className="flex items-center gap-2"><Trophy size={14} className="text-[#ffeb00]"/> Score: {player.penta_scout_score}</span>
            <span className="flex items-center gap-2"><Clock size={14}/> {player.playtime_hours}H Grind</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <MatchImporter steamId={steamId} />
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-600 mb-8 flex items-center gap-3">
              <Activity size={16} className="text-[#ffeb00]" /> Mission Archive
            </h3>
            <MatchHistoryList initialMatches={sortedMatches} playerSteamId={steamId} />
          </section>
        </div>
      </main>
    </div>
  );
}
