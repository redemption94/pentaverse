import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { 
  Target, Zap, Shield, Heart, Share2, 
  BarChart3, Globe, ExternalLink, Award, Clock
} from 'lucide-react';

// Forțăm regenerarea paginii la fiecare accesare
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ProfilePage({ params }: { params: { id: string } }) {
  // 1. Extragem datele jucătorului folosind faceit_id din URL
  const { data: player, error } = await supabase
    .from('players')
    .select('*')
    .eq('faceit_id', params.id)
    .single();

  if (error || !player) {
    return notFound();
  }

  // Calculăm procentajul pentru sponsorship goal
  const goal = player.sponsorship_goal || 1000;
  const current = player.current_funding || 0;
  const progress = Math.min((current / goal) * 100, 100);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* --- DESIGN HEADER --- */}
      <div className="relative h-80 bg-black border-b border-[#ffeb00]/20 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 h-full flex items-end pb-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-end w-full">
            <div className="w-44 h-44 bg-black border-4 border-[#ffeb00] shadow-[0_0_40px_rgba(255,235,0,0.15)] shrink-0">
              <img 
                src={player.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${player.nickname}`} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#ffeb00] text-black text-[9px] font-black px-3 py-1 uppercase italic">Verified Talent</span>
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Asset ID: {player.faceit_id.slice(0,8)}</span>
              </div>
              <h1 className="text-7xl font-[1000] uppercase italic tracking-tighter leading-[0.8] mb-2">
                {player.nickname}
              </h1>
            </div>
            <div className="flex gap-4 mb-2">
               <button className="bg-white/5 border border-white/10 p-4 hover:bg-[#ffeb00] hover:text-black transition-all">
                  <Share2 size={20} />
               </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* COLOANA STÂNGA: ANALYTICS */}
        <div className="lg:col-span-2 space-y-12">
          <section className="bg-[#0a0a0a] border border-white/5 p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:text-[#ffeb00] transition-colors">
              <BarChart3 size={120} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 mb-10 flex items-center gap-3">
              <div className="w-8 h-[1px] bg-[#ffeb00]"></div> Performance Matrix
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Faceit Elo</p>
                <p className="text-4xl font-[1000] italic text-[#ffeb00]">{player.current_elo}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Avg K/D</p>
                <p className="text-4xl font-[1000] italic">{player.avg_kd}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase mb-2">HS Rate</p>
                <p className="text-4xl font-[1000] italic">{player.headshot_pct}%</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Scout Score</p>
                <p className="text-4xl font-[1000] italic text-blue-500">{player.penta_scout_score}</p>
              </div>
            </div>
          </section>

          <section className="bg-[#0a0a0a] border border-white/5 p-10">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 mb-6">Career Mission</h3>
            <p className="text-xl font-medium italic text-gray-400 leading-relaxed border-l-2 border-[#ffeb00] pl-8">
              {player.bio || "Acest jucător nu și-a setat încă descrierea carierei. Datele de performanță indică un potențial ridicat pentru recrutare pro."}
            </p>
          </section>
        </div>

        {/* COLOANA DREAPTĂ: SPONSORSHIP */}
        <aside className="space-y-8">
          <div className="bg-[#ffeb00] p-10 text-black relative overflow-hidden">
            <div className="relative z-10">
              <Heart size={32} className="mb-6 fill-black" />
              <h3 className="text-3xl font-[1000] uppercase italic leading-none mb-2">Sponsor Career</h3>
              <p className="text-[10px] font-black uppercase tracking-wider mb-10 opacity-60">Help this talent reach the next major</p>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between font-black text-[10px] uppercase tracking-tighter">
                  <span>Funding Progress</span>
                  <span>{current}€ / {goal}€</span>
                </div>
                <div className="h-3 bg-black/10 w-full overflow-hidden">
                  <div 
                    className="h-full bg-black shadow-[0_0_20px_rgba(0,0,0,0.3)]" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <button className="w-full bg-black text-[#ffeb00] py-5 font-[1000] uppercase italic text-xs hover:bg-white hover:text-black transition-all border-b-4 border-black/20">
                Send Support
              </button>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10">
               <Award size={180} />
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 p-8">
            <h4 className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-6">Verification Data</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] bg-black p-4 border border-white/5">
                <span className="flex items-center gap-2 font-bold uppercase"><Globe size={14} className="text-[#ffeb00]" /> Steam ID</span>
                <span className="text-gray-500 font-mono">{player.steam_id?.slice(0, 12)}...</span>
              </div>
              <div className="flex items-center justify-between text-[10px] bg-black p-4 border border-white/5">
                <span className="flex items-center gap-2 font-bold uppercase"><Zap size={14} className="text-[#ffeb00]" /> Faceit</span>
                <span className="text-green-500 font-black italic">ACTIVE</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
