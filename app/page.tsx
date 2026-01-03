'use client'; // Activăm animațiile
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Trophy, Zap, ChevronRight, BarChart3, Users, Target } from 'lucide-react';

export default function ESLPage() {
  // Simulăm datele pentru a vedea designul imediat
  const players = [
    { rank: 1, name: 'iM_NAVI', elo: 3850, diff: +42, team: 'NAVI' },
    { rank: 2, name: 'Selly', elo: 3620, diff: -12, team: 'PENTA' },
    { rank: 3, name: 'w0nd3r', elo: 3410, diff: +5, team: 'PRO' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#fff] selection:bg-[#ffeb00] selection:text-black overflow-x-hidden">
      
      {/* --- BACKGROUND ORNAMENT --- */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#ffeb00]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

      {/* --- ESL PRO NAVIGATION --- */}
      <nav className="h-20 border-b-2 border-[#1a1a1a] bg-black/90 backdrop-blur-xl flex items-center px-6 sticky top-0 z-[100]">
        <div className="max-w-[1400px] mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-12">
            <div className="relative group cursor-pointer">
              <div className="text-3xl font-[1000] italic tracking-tighter flex items-center">
                <span className="bg-[#ffeb00] text-black px-3 py-1 esl-slash leading-none">PENTA</span>
                <span className="ml-2 tracking-[-0.1em]">VERSE</span>
              </div>
              <div className="absolute -bottom-1 left-0 w-0 h-1 bg-[#ffeb00] group-hover:w-full transition-all duration-300" />
            </div>
            <div className="hidden lg:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
              {['Rankings', 'Live Stats', 'Tournaments', 'Community'].map((link) => (
                <a key={link} href="#" className="hover:text-[#ffeb00] transition-colors">{link}</a>
              ))}
            </div>
          </div>
          <button className="relative px-8 py-3 bg-[#ffeb00] text-black font-[1000] uppercase text-[11px] tracking-widest skew-x-[-15deg] hover:bg-white transition-all shadow-[0_0_20px_rgba(255,235,0,0.2)]">
            <span className="inline-block skew-x-[15deg]">Connect Steam</span>
          </button>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 pt-16">
        
        {/* --- HEADER GRID --- */}
        <div className="grid lg:grid-cols-12 gap-1 px-1 mb-20">
          <div className="lg:col-span-8 bg-[#111] p-12 border-l-8 border-[#ffeb00] relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-[0.03] scale-150 rotate-12">
               <Trophy size={400} />
            </div>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <span className="inline-block bg-[#ffeb00] text-black text-[10px] font-black px-3 py-1 mb-6 uppercase skew-x-[-10deg]">
                Official RO Circuit 2026
              </span>
              <h1 className="text-6xl md:text-8xl font-[1000] uppercase italic leading-[0.85] tracking-tighter mb-8">
                The Home of <br /> <span className="text-[#ffeb00]">Romanian CS2</span>
              </h1>
              <div className="flex gap-4">
                <button className="bg-white text-black font-black uppercase text-[11px] px-8 py-4 flex items-center gap-3 hover:bg-[#ffeb00] transition-all">
                  View Rules <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
          <div className="lg:col-span-4 grid grid-rows-2 gap-1">
             <div className="bg-[#1a1a1a] p-8 flex flex-col justify-end border-b-4 border-white/5">
                <BarChart3 className="text-[#ffeb00] mb-4" size={32} />
                <p className="text-3xl font-[1000] italic uppercase leading-none">3,420 ELO</p>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-2">Average Pro Rating</p>
             </div>
             <div className="bg-[#1a1a1a] p-8 flex flex-col justify-end">
                <Users className="text-[#ffeb00] mb-4" size={32} />
                <p className="text-3xl font-[1000] italic uppercase leading-none">50 Active</p>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-2">Tracked Elite Players</p>
             </div>
          </div>
        </div>

        {/* --- PROFESSIONAL RANKING TABLE --- */}
        <section className="bg-[#111] rounded-sm border border-[#222] mb-32 relative">
          <div className="flex items-center justify-between p-8 border-b border-[#222]">
            <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter flex items-center gap-4">
               <Target className="text-[#ffeb00]" /> 
               World Ranking <span className="text-gray-600">/ Romania</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] border-b border-[#222]">
                  <th className="p-6 text-center w-24">Pos</th>
                  <th className="p-6">Player</th>
                  <th className="p-6">Organization</th>
                  <th className="p-6 text-center">ELO Rating</th>
                  <th className="p-6 text-right">Trending</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {players.map((p, i) => (
                    <motion.tr 
                      key={p.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group border-b border-[#1a1a1a] hover:bg-[#ffeb00]/[0.02] transition-all cursor-pointer"
                    >
                      <td className="p-6 text-center">
                        <span className={`text-xl font-[1000] italic ${i === 0 ? 'text-[#ffeb00]' : 'text-[#333]'}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#222] border border-white/5 group-hover:border-[#ffeb00]/30 transition-all p-1">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} className="w-full h-full grayscale group-hover:grayscale-0 transition-all" />
                          </div>
                          <div>
                            <p className="text-lg font-[1000] uppercase italic group-hover:text-[#ffeb00] transition-colors">{p.name}</p>
                            <div className="flex gap-2 mt-1">
                               <span className="text-[8px] bg-white/5 px-2 py-0.5 font-bold">RO</span>
                               <span className="text-[8px] bg-white/5 px-2 py-0.5 font-bold">PRO</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-[11px] font-black uppercase text-gray-500 tracking-widest">{p.team}</span>
                      </td>
                      <td className="p-6 text-center">
                         <div className="inline-block bg-[#1a1a1a] px-4 py-2 border border-[#333] font-mono text-xl font-black italic">
                            {p.elo}
                         </div>
                      </td>
                      <td className="p-6 text-right">
                         <div className={`inline-flex items-center gap-2 font-black italic ${p.diff > 0 ? 'text-[#ffeb00]' : 'text-red-600'}`}>
                            {p.diff > 0 ? '+' : ''}{p.diff}
                            {p.diff > 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                         </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* --- ESL STYLE FOOTER --- */}
      <footer className="bg-black py-20 border-t-2 border-[#1a1a1a]">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col items-center">
           <div className="text-4xl font-[1000] italic mb-8 opacity-20">
              PENTA<span className="text-[#ffeb00]">VERSE</span>
           </div>
           <div className="h-[2px] w-20 bg-[#ffeb00] mb-8" />
           <p className="text-[10px] font-black text-gray-600 tracking-[0.5em] uppercase">
             Competitive Analytics &copy; 2026 Romania
           </p>
        </div>
      </footer>
    </div>
  );
}
