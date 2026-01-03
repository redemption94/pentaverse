import { createClient } from '@supabase/supabase-js';
import { 
  Bell, 
  Award, 
  UserCheck, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap, 
  Trophy,
  ShieldCheck
} from 'lucide-react';

// Inițializare Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function HomePage() {
  // 1. Preluăm jucătorii din Supabase ordonați după Elo
  const { data: players } = await supabase
    .from('players')
    .select('*')
    .order('current_elo', { ascending: false });

  // 2. Preluăm istoricul de ieri pentru a calcula diferența (24h)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const { data: history } = await supabase
    .from('elo_history')
    .select('player_id, elo_value')
    .eq('recorded_at', yesterdayStr);

  // Mapăm datele pentru a calcula diferența de Elo live
  const playersWithDiff = players?.map(player => {
    const pastEntry = history?.find(h => h.player_id === player.id);
    const diff = pastEntry ? player.current_elo - pastEntry.elo_value : 0;
    return { ...player, diff };
  });

  return (
    <div className="min-h-screen text-white pb-24 md:pb-10 selection:bg-[#F6C85E] selection:text-black">
      
      {/* --- NAVBAR FUTURISTIC --- */}
      <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#DE9B35] to-[#F6C85E] rounded-br-2xl rotate-12 flex items-center justify-center shadow-[0_0_20px_rgba(222,155,51,0.3)]">
              <Zap size={22} className="text-black -rotate-12 fill-black" />
            </div>
            <span className="text-2xl font-black italic tracking-tighter uppercase">
              PENTA<span className="text-[#DE9B35] drop-shadow-[0_0_10px_rgba(222,155,53,0.5)]">VERSE</span>
            </span>
          </div>
          
          <button className="flex items-center gap-2 bg-white/5 hover:bg-[#DE9B35] hover:text-black border border-white/10 px-4 py-2 rounded-full font-bold text-xs uppercase transition-all duration-300 group">
            <UserCheck size={16} className="group-hover:scale-110" />
            <span className="hidden sm:inline">Claim Profile</span>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 pt-8">
        
        {/* --- HERO STATS (MOBILE OPTIMIZED) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#111] to-black p-6 rounded-2xl border border-white/5 group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Trophy size={80} />
            </div>
            <p className="text-[10px] uppercase font-black text-[#DE9B35] tracking-[0.3em] mb-1">Top Player</p>
            <h3 className="text-2xl font-black italic uppercase truncate">{playersWithDiff?.[0]?.nickname || '---'}</h3>
            <p className="text-xs text-gray-500 font-bold mt-1">ELO: {playersWithDiff?.[0]?.current_elo || 0}</p>
          </div>

          <div className="hidden md:flex flex-col justify-center bg-white/5 p-6 rounded-2xl border border-white/5">
            <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.3em] mb-1">Region</p>
            <h3 className="text-xl font-black italic uppercase flex items-center gap-2">
              Romania <span className="text-xs bg-white/10 px-2 py-0.5 rounded italic">EU Central</span>
            </h3>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
            <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.3em] mb-1">Active Tracked</p>
            <h3 className="text-xl font-black italic uppercase">{playersWithDiff?.length || 0} PROS</h3>
          </div>
        </div>

        {/* --- LEADERBOARD TABLE --- */}
        <div className="bg-[#0A0A0A]/80 backdrop-blur-sm rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h2 className="flex items-center gap-3 font-black uppercase tracking-tight italic text-lg">
              <Target size={24} className="text-[#DE9B35]" /> 
              Leaderboard <span className="text-[#DE9B35]">Premier</span>
            </h2>
            <div className="flex items-center gap-2">
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-black text-gray-500 tracking-widest uppercase">Live Sync</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase text-gray-500 font-black bg-white/[0.01]">
                  <th className="p-5 text-center w-16">Rank</th>
                  <th className="p-5">Player</th>
                  <th className="p-5 text-center">Elo</th>
                  <th className="p-5 text-center hidden sm:table-cell">24h Change</th>
                  <th className="p-5 text-right">Alert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {playersWithDiff?.map((player, index) => (
                  <tr key={player.id} className="hover:bg-[#DE9B35]/5 transition-all duration-200 group">
                    <td className="p-5 text-center">
                      <span className={`font-mono text-sm font-black italic ${index === 0 ? 'text-[#F6C85E]' : 'text-gray-600'}`}>
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <img 
                            src={player.avatar_url || 'https://via.placeholder.com/100'} 
                            className="w-10 h-10 rounded-xl border border-white/10 object-cover" 
                            alt={player.nickname} 
                          />
                          {player.is_verified && (
                            <div className="absolute -top-1 -right-1 bg-[#DE9B35] text-black rounded-full p-0.5 shadow-lg">
                              <ShieldCheck size={12} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className={`font-black uppercase tracking-tight leading-none text-sm md:text-base ${player.is_verified ? 'text-[#DE9B35]' : 'text-white'}`}>
                            {player.nickname}
                          </p>
                          <p className="text-[9px] text-gray-600 font-black uppercase mt-1 tracking-widest hidden md:block">
                            {player.is_verified ? 'Pentaverse Verified' : 'Community Member'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <div className="inline-block px-3 py-1 bg-white/5 rounded-lg border border-white/5 font-mono font-black text-[#F6C85E] shadow-inner">
                        {player.current_elo}
                      </div>
                    </td>
                    <td className="p-5 text-center hidden sm:table-cell">
                      <div className={`flex items-center justify-center gap-1 font-black text-xs ${player.diff > 0 ? 'text-green-400' : player.diff < 0 ? 'text-red-500' : 'text-gray-700'}`}>
                        {player.diff > 0 ? <TrendingUp size={14} /> : player.diff < 0 ? <TrendingDown size={14} /> : null}
                        {player.diff === 0 ? '---' : player.diff > 0 ? `+${player.diff}` : player.diff}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <button className="p-2.5 bg-white/5 hover:bg-[#DE9B35]/20 rounded-xl transition-all border border-transparent hover:border-[#DE9B35]/30 group">
                        <Bell size={18} className="text-gray-500 group-hover:text-[#F6C85E] group-hover:scale-110" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- MOBILE BOTTOM NAV --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl border-t border-white/10 p-4 flex justify-around items-center z-[60]">
         <div className="flex flex-col items-center gap-1 text-[#DE9B35]">
           <Target size={20} className="drop-shadow-[0_0_8px_rgba(222,155,53,0.5)]" />
           <span className="text-[8px] uppercase font-black tracking-widest">Rank</span>
         </div>
         <div className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
           <Zap size={20} />
           <span className="text-[8px] uppercase font-black tracking-widest">Live</span>
         </div>
         <div className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
           <Trophy size={20} />
           <span className="text-[8px] uppercase font-black tracking-widest">Cups</span>
         </div>
      </div>

    </div>
  );
}
