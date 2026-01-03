import { createClient } from '@supabase/supabase-js';
import { Bell, Award, UserCheck, TrendingUp, TrendingDown } from 'lucide-react';

// Conectare la Supabase
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

  // 2. Preluăm istoricul de ieri pentru a calcula diferența (simplificat)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const { data: history } = await supabase
    .from('elo_history')
    .select('player_id, elo_value')
    .eq('recorded_at', yesterdayStr);

  // Mapăm datele pentru a calcula diferența de Elo
  const playersWithDiff = players?.map(player => {
    const pastEntry = history?.find(h => h.player_id === player.id);
    const diff = pastEntry ? player.current_elo - pastEntry.elo_value : 0;
    return { ...player, diff };
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navigație Pentaverse */}
      <nav className="border-b border-[#1A1A1A] bg-black/80 backdrop-blur-md sticky top-0 z-50 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-black italic tracking-tighter uppercase">
            PENTA<span className="text-[#DE9B35] bg-clip-text text-transparent bg-gradient-to-r from-[#F6C85E] to-[#DE9B35]">VERSE</span>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-[#F6C85E] to-[#DE9B35] text-black px-4 py-2 rounded-md font-bold text-xs uppercase hover:scale-105 transition-all">
            <UserCheck size={16} /> Login Steam
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <header className="py-10 border-l-2 border-[#DE9B35] pl-6 mb-10">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Leaderboard RO</h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-2">Date live via Faceit API • Actualizat zilnic</p>
        </header>

        {/* Tabelul de date */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#111] text-gray-600 text-[10px] uppercase font-bold tracking-widest border-b border-[#1A1A1A]">
                <th className="p-5">Poz.</th>
                <th className="p-5">Jucător</th>
                <th className="p-5 text-center">Elo actual</th>
                <th className="p-5 text-center">Evoluție (24h)</th>
                <th className="p-5 text-right">Notificări</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {playersWithDiff?.map((player, index) => (
                <tr key={player.id} className="hover:bg-[#F6C85E]/5 transition-colors group">
                  <td className="p-5 font-mono text-gray-600 text-sm">#{(index + 1).toString().padStart(2, '0')}</td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <img src={player.avatar_url || 'https://via.placeholder.com/40'} alt="avatar" className="w-8 h-8 rounded border border-[#1A1A1A]" />
                      <span className={`font-bold ${player.is_verified ? 'text-[#DE9B35]' : 'text-white'}`}>
                        {player.nickname}
                      </span>
                      {player.is_verified && <Award size={14} className="text-[#DE9B35]" />}
                    </div>
                  </td>
                  <td className="p-5 text-center font-mono font-bold">{player.current_elo}</td>
                  <td className="p-5 text-center">
                    <div className={`flex items-center justify-center gap-1 font-bold text-xs ${player.diff > 0 ? 'text-green-400' : player.diff < 0 ? 'text-red-500' : 'text-gray-600'}`}>
                      {player.diff > 0 ? <TrendingUp size={14} /> : player.diff < 0 ? <TrendingDown size={14} /> : null}
                      {player.diff === 0 ? '--' : player.diff > 0 ? `+${player.diff}` : player.diff}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <button className="p-2 text-gray-700 hover:text-[#F6C85E] transition-colors">
                      <Bell size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
