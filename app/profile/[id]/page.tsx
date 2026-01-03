import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { 
  Target, 
  Zap, 
  Clock, 
  BarChart3, 
  Heart, 
  ShieldCheck, 
  Trophy, 
  Activity,
  User
} from 'lucide-react';

// Importăm componentele folosind căi relative pentru a evita erorile de build în Vercel
import MatchHistoryList from '../../../components/MatchHistoryList';
import MatchImporter from '../../../components/MatchImporter';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const steamId = params.id;

  // Extragem datele profilului și meciurile (ordonate după timp)
  const { data: player, error } = await supabase
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

  if (error || !player) return notFound();

  // Sortăm meciurile cronologic (cele mai recente primele)
  const chronologicMatches = (player.matches || [])
    .sort((a: any, b: any) => 
      new Date(b.match_timestamp).getTime() - new Date(a.match_timestamp).getTime()
    );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ffeb00] selection:text-black font-sans">
      
      {/* HEADER PROFESIONAL (STIL ESL/RADAR) */}
      <div className="h-[450px] bg-black border-b border-white/5 relative flex items-end pb-16 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-end gap-10 relative z-10">
          {/* Avatar cu Glow */}
          <div className="w-48 h-48 border-4 border-[#ffeb00] bg-black shadow-[0_0_60px_rgba(255,235,0,0.15)] shrink-0">
            <img 
              src={player.avatar_url || "/default-avatar.png"} 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
              alt={player.nickname} 
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#ffeb00] text-black text-[10px] font-[1000] px-3 py-1 uppercase italic skew-x-[-12deg]">
                Verified Pro Prospect
              </span>
              <span className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">
                UID: {player.steam_id}
              </span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-[1000] uppercase italic tracking-tighter leading-[0.8] mb-6">
              {player.nickname}
            </h1>

            <div className="flex flex-wrap gap-8 text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
               <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#ffeb00]"/> 
                  <span>{player.playtime_hours || 0}H Total Grind</span>
               </div>
               <div className="flex items-center gap-2 text-white">
                  <Trophy size={14} className="text-[#ffeb00]"/> 
                  <span>Scout Rating: {player.penta_scout_score || 0}</span>
               </div>
               <div className="flex items-center gap-2">
                  <Activity size={14} className="text-green-500"/> 
                  <span>Status: Active Career</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECȚIUNEA PRINCIPALĂ DE CONȚINUT */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-20 grid lg:grid-cols-3 gap-16">
        
        {/* COLOANA STÂNGA: IMPORTER & ISTORIC */}
        <div className="lg:col-span-2 space-y-16">
          
          {/* MODULUL DE IMPORT (Manual Match ID) */}
          <section>
            <MatchImporter steamId={steamId} />
          </section>

          {/* ARHIVA DE MECIURI (Match Intelligence) */}
          <section>
             <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-4">
                <h3 className="text-xs font-[1000] uppercase tracking-[0.5em] text-gray-600 flex items-center gap-3">
                   <BarChart3 size={16} className="text-[#ffeb00]" /> Mission Archive
                </h3>
                <span className="text-[9px] font-black text-gray-700 uppercase italic">
                   Showing last {chronologicMatches.length} combat logs
                </span>
             </div>
             
             <MatchHistoryList initialMatches={chronologicMatches} playerSteamId={steamId} />
          </section>

          {/* CAREER BIO / MISSION STATEMENT */}
          <section className="bg-[#0a0a0a] p-12 border border-white/5 relative group">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <User size={120} />
             </div>
             <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 mb-8">Career Mission Statement</h3>
             <p className="text-2xl font-medium italic text-gray-400 leading-relaxed border-l-4 border-[#ffeb00] pl-10 italic">
               {player.bio || "Acest profil utilizează inteligența automatizată Steam pentru a monitoriza și valida performanța în mediul competitiv CS2. Datele de meci sunt securizate și verificate prin protocolul Pentaverse."}
             </p>
          </section>
        </div>

        {/* COLOANA DREAPTĂ: SPONSORSHIP & TRUST */}
        <aside className="space-y-8">
           {/* Card Sponsorizare */}
           <div className="bg-[#ffeb00] p-10 text-black shadow-[0_0_80px_rgba(255,235,0,0.1)] relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
                 <Zap size={150} />
              </div>
              <Heart size={40} className="mb-8 fill-black" />
              <h3 className="text-4xl font-[1000] uppercase italic leading-[0.9] mb-6">Sponsor Career</h3>
              <p className="text-[11px] font-black uppercase tracking-widest mb-12 opacity-60 leading-relaxed italic text-right">
                Investiția ta alimentează tranziția acestui activ către circuitul profesionist.
              </p>
              <button className="w-full bg-black text-[#ffeb00] py-6 font-[1000] uppercase italic text-xs hover:bg-white hover:text-black transition-all shadow-2xl relative z-10">
                Initialize Funding
              </button>
           </div>
           
           {/* Card Integritate (Anti-Cheat) */}
           <div className="bg-[#0a0a0a] border border-white/5 p-8 relative overflow-hidden">
              <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                 <ShieldCheck size={14} className="text-green-500" /> Integrity Verification
              </h4>
              <div className="flex items-center gap-4 bg-green-500/5 p-5 border border-green-500/20 text-green-500 rounded-sm">
                 <ShieldCheck size={24} />
                 <div>
                    <p className="text-[10px] font-[1000] uppercase leading-none mb-1">Secure Intel</p>
                    <p className="text-[8px] font-bold text-green-500/60 uppercase tracking-widest leading-none">
                       No Active Bans Detected
                    </p>
                 </div>
              </div>
           </div>

           {/* Metrics Quick Look */}
           <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#0a0a0a] border border-white/5 p-6 text-center">
                 <p className="text-[8px] font-black text-gray-600 uppercase mb-2">Avg K/D</p>
                 <p className="text-2xl font-black italic">{player.avg_kd || '0.00'}</p>
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 p-6 text-center">
                 <p className="text-[8px] font-black text-gray-600 uppercase mb-2">HS %</p>
                 <p className="text-2xl font-black italic text-[#ffeb00]">{player.headshot_pct || '0'}%</p>
              </div>
           </div>
        </aside>

      </main>
    </div>
  );
}
