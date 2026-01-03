import { Bell, Award, TrendingUp, UserCheck } from 'lucide-react';

export default async function HomePage() {
  // Aici vom prelua datele din Supabase în pasul următor
  const samplePlayers = [
    { id: 1, nickname: 'iM_NAVI', elo: 3850, diff: +42, verified: true },
    { id: 2, nickname: 'Selly', elo: 3420, diff: -15, verified: false },
    // ... restul jucătorilor
  ];

  return (
    <div className="min-h-screen bg-penta-black text-white font-sans">
      {/* Header / Nav */}
      <nav className="border-b border-penta-border bg-penta-dark/80 backdrop-blur-md sticky top-0 z-50 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-black italic tracking-tighter uppercase">
            PENTA<span className="text-penta-gold text-transparent bg-clip-text bg-gradient-to-r from-penta-yellow to-penta-gold">VERSE</span>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-penta-yellow to-penta-gold text-black px-4 py-2 rounded-md font-bold text-sm hover:opacity-90 transition-all uppercase tracking-tight">
            <UserCheck size={18} /> Revendică Profil
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        {/* Hero Section */}
        <section className="py-12 border-l-2 border-penta-gold pl-6 mb-12">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">Elite CS2 România</h1>
          <p className="text-gray-400 font-medium italic uppercase text-sm tracking-widest">Monitorizare performanță live / Faceit Elo</p>
        </section>

        {/* Tabel Clasament */}
        <div className="bg-penta-dark border border-penta-border rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#111] text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-penta-border">
                <th className="p-6">#</th>
                <th className="p-6">Jucător</th>
                <th className="p-6">Elo</th>
                <th className="p-6">Evoluție 24h</th>
                <th className="p-6 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-penta-border">
              {samplePlayers.map((player, index) => (
                <tr key={player.id} className="hover:bg-penta-yellow/5 transition-colors group">
                  <td className="p-6 font-mono text-gray-500">{(index + 1).toString().padStart(2, '0')}</td>
                  <td className="p-6 flex items-center gap-3">
                    <span className={`font-bold text-lg ${player.verified ? 'text-penta-gold' : 'text-white'}`}>
                      {player.nickname}
                    </span>
                    {player.verified && <Award size={16} className="text-penta-gold" />}
                  </td>
                  <td className="p-6 font-mono font-bold tracking-tight">{player.elo}</td>
                  <td className={`p-6 font-bold ${player.diff > 0 ? 'text-green-400' : 'text-red-500'}`}>
                    {player.diff > 0 ? `+${player.diff}` : player.diff}
                  </td>
                  <td className="p-6 text-right">
                    <button className="p-2 hover:bg-penta-gold/10 rounded-full transition-all group-hover:text-penta-yellow text-gray-600">
                      <Bell size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="mt-20 border-t border-penta-border py-8 text-center text-[10px] text-gray-600 uppercase tracking-widest font-bold">
        &copy; 2026 Pentaverse România | Partener Comunitate CS2
      </footer>
    </div>
  );
}
