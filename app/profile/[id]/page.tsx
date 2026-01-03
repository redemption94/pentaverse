import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { 
  Target, Zap, Shield, Heart, Share2, 
  Clock, BarChart3, Award, Flame, User, CheckCircle2
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const steamId = params.id;

  const { data: player, error } = await supabase
    .from('players')
    .select('*')
    .eq('steam_id', steamId)
    .single();

  if (error || !player) return notFound();

  // Logică Sponsorship
  const goal = player.sponsorship_goal || 1000;
  const current = player.current_funding || 0;
  const progress = Math.min((current / goal) * 100, 100);

  // Verificăm dacă are Pro Verification (dacă a pus auth code)
  const isProVerified = !!player.steam_auth_code;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ffeb00] selection:text-black">
      
      {/* HEADER: PLAYER IDENTITY */}
      <div className="relative h-[450px] bg-black border-b border-white/5 overflow-hidden flex items-end">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 w-full pb-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-10 items-end">
            <div className="w-48 h-48 bg-black border-4 border-[#ffeb00] shadow-[0_0_50px_rgba(255,235,0,0.1)] shrink-0 relative">
              <img src={player.avatar_url} className="w-full h-full object-cover grayscale" alt="" />
              {isProVerified && (
                <div className="absolute -top-4 -right-4 bg-[#ffeb00] p-2 text-black shadow-xl rotate-12">
                   <Shield size={20} fill="currentColor" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <span className={`text-[10px] font-[1000] px-3 py-1 uppercase italic skew-x-[-12deg] ${isProVerified ? 'bg-[#ffeb00] text-black' : 'bg-white/10 text-gray-400'}`}>
                  <span className="inline-block skew-x-[12deg]">
                    {isProVerified ? 'PRO VERIFIED DATA' : 'BASIC STEAM DATA'}
                  </span>
                </span>
                <span className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">ID: {player.steam_id}</span>
              </div>
              <h1 className="text-8xl font-[1000] uppercase italic tracking-tighter leading-[0.8] mb-4">
                {player.nickname}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* LEFT: ANALYTICS */}
        <div className="lg:col-span-2 space-y-16">
          <section>
             <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-600 mb-10 flex items-center gap-4">
                <BarChart3 size={16} className="text-[#ffeb00]" /> Steam Combat Statistics
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                <div className="bg-[#0a0a0a] p-10 border border-white/5">
                   <p className="text-[10px] font-black text-gray-500 uppercase mb-4">Grind (Hours)</p>
                   <p className="text-4xl font-[1000] italic"><Clock className="inline mr-2 text-[#ffeb00]" size={24}/>{player.playtime_hours}</p>
                </div>
                <div className="bg-[#0a0a0a] p-10 border border-white/5">
                   <p className="text-[10px] font-black text-gray-500 uppercase mb-4">K/D Ratio</p>
                   <p className="text-4xl font-[1000] italic text-green-500"><Zap className="inline mr-2" size={24}/>{player.avg_kd}</p>
                </div>
                <div className="bg-[#0a0a0a] p-10 border border-white/5">
                   <p className="text-[10px] font-black text-gray-500 uppercase mb-4">HS Precision</p>
                   <p className="text-4xl font-[1000] italic"><Target className="inline mr-2 text-[#ffeb00]" size={24}/>{player.headshot_pct}%</p>
                </div>
             </div>
          </section>

          <section className="bg-[#0a0a0a] p-10 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
               <Award size={150} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 mb-8 flex items-center gap-2">
              <User size={14} /> Career Mission
            </h3>
            <p className="text-2xl font-medium italic text-gray-400 leading-relaxed border-l-4 border-[#ffeb00] pl-10">
              {player.bio || "Jucător înrolat în Pentaverse. Acest profil utilizează exclusiv date verificate prin Steam API pentru a evalua potențialul de scouting."}
            </p>
          </section>
        </div>

        {/* RIGHT: SPONSORSHIP */}
        <aside className="space-y-8">
          <div className="bg-[#ffeb00] p-10 text-black shadow-[0_0_60px_rgba(255,235,0,0.1)]">
            <Heart size={36} className="mb-8 fill-black" />
            <h3 className="text-3xl font-[1000] uppercase italic leading-none mb-3">Sponsor Player</h3>
            <p className="text-[10px] font-black uppercase tracking-wider mb-10 opacity-60 italic text-right">Fuel the professional transition</p>
            
            <div className="space-y-4 mb-10">
              <div className="flex justify-between font-black text-[11px] uppercase italic">
                <span>Goal Progress</span>
                <span>{current}€ / {goal}€</span>
              </div>
              <div className="h-4 bg-black/10 w-full overflow-hidden border border-black/5">
                <div 
                  className="h-full bg-black shadow-[0_0_20px_rgba(0,0,0,0.3)]" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <button className="w-full bg-black text-[#ffeb00] py-5 font-[1000] uppercase italic text-xs hover:bg-white hover:text-black transition-all border-b-4 border-black/20">
              Back This Talent
            </button>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 p-8 group">
            <div className="flex items-center gap-3 mb-6">
               <Flame size={16} className="text-[#ffeb00]" />
               <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Scout Rating</h4>
            </div>
            <p className="text-5xl font-[1000] italic leading-none mb-2 group-hover:text-[#ffeb00] transition-colors">{player.penta_scout_score}</p>
            <p className="text-[9px] font-bold text-gray-600 uppercase">Algorithm V3 (Combat Weighted)</p>
          </div>
        </aside>

      </main>
    </div>
  );
}
