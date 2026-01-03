import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { Target, Zap, Clock, BarChart3, User, Heart } from 'lucide-react';

export const dynamic = 'force-dynamic';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function ProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { data: player, error } = await supabase.from('players').select('*').eq('steam_id', params.id).single();

  if (error || !player) return notFound();

  const progress = Math.min(((player.current_funding || 0) / (player.sponsorship_goal || 1000)) * 100, 100);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="h-80 bg-black border-b border-white/5 relative flex items-end pb-12 px-12">
        <div className="flex items-end gap-8 relative z-10">
          <div className="w-40 h-40 border-4 border-[#ffeb00] bg-black">
            <img src={player.avatar_url} className="w-full h-full object-cover grayscale" />
          </div>
          <div>
            <span className="bg-[#ffeb00] text-black text-[10px] font-black px-2 py-1 uppercase italic mb-4 inline-block">Steam Verified Dossier</span>
            <h1 className="text-7xl font-[1000] uppercase italic tracking-tighter leading-none">{player.nickname}</h1>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-12 py-20 grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          <div className="grid grid-cols-3 gap-1">
            <div className="bg-[#0a0a0a] p-10 border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-black mb-4">Grind (Hours)</p>
              <p className="text-4xl font-[1000] italic"><Clock className="inline text-[#ffeb00] mr-2" />{player.playtime_hours}</p>
            </div>
            <div className="bg-[#0a0a0a] p-10 border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-black mb-4">K/D Ratio</p>
              <p className="text-4xl font-[1000] italic text-green-500"><Zap className="inline mr-2" />{player.avg_kd}</p>
            </div>
            <div className="bg-[#0a0a0a] p-10 border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-black mb-4">Precision</p>
              <p className="text-4xl font-[1000] italic"><Target className="inline text-[#ffeb00] mr-2" />{player.headshot_pct}%</p>
            </div>
          </div>
          <div className="bg-[#0a0a0a] p-10 border border-white/5"><p className="text-2xl font-medium italic text-gray-400 border-l-4 border-[#ffeb00] pl-10">{player.bio || "Career Dossier Active."}</p></div>
        </div>

        <aside>
          <div className="bg-[#ffeb00] p-10 text-black">
            <Heart size={32} className="mb-6 fill-black" /><h3 className="text-3xl font-[1000] uppercase italic mb-8 leading-none">Sponsor Career</h3>
            <div className="h-3 bg-black/10 mb-8"><div className="h-full bg-black" style={{ width: `${progress}%` }}></div></div>
            <button className="w-full bg-black text-[#ffeb00] py-4 font-black uppercase italic text-xs">Send Support</button>
          </div>
        </aside>
      </main>
    </div>
  );
}
