import { createClient } from '@supabase/supabase-js';
import { Bell, UserCheck, TrendingUp, TrendingDown, ChevronRight, Share2, Info } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function HomePage() {
  const { data: players } = await supabase.from('players').select('*').order('current_elo', { ascending: false });

  return (
    <div className="min-h-screen bg-[#111] text-white">
      
      {/* --- TOP BAR (ESL STYLE) --- */}
      <nav className="h-16 border-b border-[#2a2a2a] bg-black flex items-center px-4 md:px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-[900] italic tracking-tighter flex items-center">
              <span className="bg-[#ffeb00] text-black px-2 py-0.5 esl-slash mr-1">PENTA</span>
              <span className="text-white">VERSE</span>
            </div>
            <div className="hidden md:flex gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-400">
              <a href="#" className="hover:text-[#ffeb00] text-[#ffeb00]">Rankings</a>
              <a href="#" className="hover:text-[#ffeb00]">Tournaments</a>
              <a href="#" className="hover:text-[#ffeb00]">Community</a>
            </div>
          </div>
          <button className="bg-[#ffeb00] text-black text-[10px] font-[900] uppercase px-6 py-2 skew-x-[-12deg] hover:bg-white transition-colors">
            <span className="inline-block skew-x-[12deg]">Claim Profile</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        
        {/* --- HERO / STICKER AREA --- */}
        <div className="relative mb-16 overflow-hidden rounded-sm bg-[#1a1a1a] border-l-4 border-[#ffeb00] p-8 md:p-12">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#ffeb00] text-black text-[9px] font-black px-2 py-0.5 uppercase">Season 2026</span>
              <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">CS2 Romania</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-[900] uppercase italic leading-[0.9] mb-6">
              The Path to <br /> 
              <span className="text-[#ffeb00]">Penta Mastery</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base mb-8 max-w-md font-medium">
              Monitorizează evoluția celor mai buni jucători de CS2 din România. Date extrase în timp real din Faceit Pro League.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#222] skew-x-[-20deg] translate-x-20 hidden lg:block opacity-50"></div>
        </div>

        {/* --- LEADERBOARD SECTION --- */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-[900] uppercase italic flex items-center gap-3">
                <span className="w-8 h-1 bg-[#ffeb00]"></span> National Rankings
              </h2>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-[#2a2a2a] hover:bg-[#ffeb00] hover:text-black transition-all">
                <Share2 size={16} />
              </button>
              <button className="p-2 bg-[#2a2a2a] hover:bg-[#ffeb00] hover:text-black transition-all text-[10px] font-bold uppercase px-4 flex items-center gap-2">
                <Info size={14} /> Rules
              </button>
            </div>
          </div>

          <div className="esl-card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase text-gray-500 font-black border-b border-[#2a2a2a] bg-[#1a1a1a]">
                  <th className="p-5 w-20 text-center">#</th>
                  <th className="p-5">Player Name</th>
                  <th className="p-5 text-center">Faceit Elo</th>
                  <th className="p-5 text-center hidden md:table-cell">24H Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {players?.map((player, index) => (
                  <tr key={player.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-5 text-center">
                      <span className={`text-sm font-[900] italic ${index < 3 ? 'text-[#ffeb00]' : 'text-gray-600'}`}>
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <img src={player.avatar_url || '/default-avatar.png'} className="w-10 h-10 border border-[#2a2a2a]" />
                        <div>
                          <p className="font-[900] uppercase italic tracking-tighter text-base group-hover:text-[#ffeb00] transition-colors">
                            {player.nickname}
                          </p>
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">PRO DIVISION</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span className="font-mono font-black text-white text-lg">{player.current_elo}</span>
                    </td>
                    <td className="p-5 text-center hidden md:table-cell">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black rounded-full border border-[#2a2a2a]">
                        <TrendingUp size={12} className="text-green-500" />
                        <span className="text-[10px] font-black text-white">+12</span>
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <button className="text-gray-500 hover:text-[#ffeb00] transition-colors p-2">
                        <Bell size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* --- FOOTER (ESL STYLE) --- */}
      <footer className="bg-black border-t border-[#2a2a2a] py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-black italic opacity-50">
            PENTA<span className="text-[#ffeb00]">VERSE</span>
          </div>
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.4em]">
            Parteneriat Comunitate CS2 România &copy; 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
