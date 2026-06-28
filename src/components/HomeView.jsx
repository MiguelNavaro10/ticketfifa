import { useMemo } from 'react';
import SearchBar from './SearchBar';
import { useMatches, formatDate, Flag } from '../data/MatchesContext';

const POPULAR = [
  { title: "Copa Mundial de Fútbol (General)", subtitle: "", bg: "bg-gradient-to-br from-emerald-600 via-green-500 to-teal-600" },
  { title: "Partido Inaugural - Estadio Azteca", subtitle: "11 jun.", bg: "bg-gradient-to-br from-amber-700 via-yellow-600 to-orange-700" },
  { title: "Pases VIP & Hospitalidad FWC", subtitle: "Todo el torneo", bg: "bg-gradient-to-br from-slate-700 via-gray-600 to-zinc-700" },
  { title: "La Gran Final - MetLife Stadium", subtitle: "19 jul.", bg: "bg-gradient-to-br from-yellow-600 via-amber-500 to-orange-600" },
];

export default function HomeView({ onSelectWorldCup, onSearch }) {
  const { matches, LOCATION_STADIUM } = useMatches();

  const groupedByDate = useMemo(() => {
    const groups = {};
    matches.forEach(m => {
      if (!groups[m.date]) groups[m.date] = [];
      groups[m.date].push(m);
    });
    const sorted = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
    return sorted.slice(0, 8);
  }, [matches]);

  return (
    <div>
      <SearchBar onSearch={onSearch} />

      {/* Eventos populares */}
      <section className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3 sm:mb-4">Eventos populares</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
          {POPULAR.map((ev, i) => (
            <button key={i} onClick={onSelectWorldCup} className="min-w-[240px] w-[240px] shrink-0 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left">
              <div className={`h-36 ${ev.bg} flex flex-col items-center justify-center relative`}>
                <svg className="absolute top-3 right-3 w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 200 200" preserveAspectRatio="none">
                  <polygon points="0,0 40,0 20,30" fill="white" />
                  <polygon points="50,0 90,0 70,30" fill="white" />
                  <polygon points="100,0 140,0 120,30" fill="white" />
                  <polygon points="150,0 190,0 170,30" fill="white" />
                </svg>
                <svg className="w-8 h-8 text-yellow-400 mb-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-white font-extrabold text-sm text-center px-4 leading-tight">{ev.title}</span>
                {ev.subtitle && <span className="text-white/80 text-xs mt-1">{ev.subtitle}</span>}
              </div>
              <div className="bg-white p-3 border border-t-0 border-gray-200 rounded-b-xl">
                <p className="font-semibold text-sm text-gray-800">{ev.title}</p>
                {ev.subtitle && <p className="text-xs text-gray-500">{ev.subtitle}</p>}
              </div>
            </button>
          ))}
          <button onClick={onSelectWorldCup} className="min-w-[240px] w-[240px] shrink-0 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left">
            <div className="h-36 rounded-xl overflow-hidden bg-gradient-to-br from-[#4c7c0c] via-[#558414] to-[#3a6309] relative flex flex-col items-center justify-center">
              <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 200 200" preserveAspectRatio="none">
                <polygon points="0,0 40,0 20,30" fill="white" />
                <polygon points="50,0 90,0 70,30" fill="white" />
                <polygon points="100,0 140,0 120,30" fill="white" />
                <polygon points="150,0 190,0 170,30" fill="white" />
              </svg>
              <svg className="w-10 h-10 text-yellow-400 mb-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-white font-extrabold text-sm tracking-widest">WORLD CUP</span>
            </div>
            <div className="bg-white p-3 border border-t-0 border-gray-200 rounded-b-xl">
              <p className="font-semibold text-sm text-gray-800">Copa Mundial de Fútbol</p>
              <p className="text-xs text-gray-500">Todo el torneo</p>
            </div>
          </button>
        </div>
      </section>

      {/* Copa Mundial 2026 - Partidos dinámicos */}
      <section className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Copa Mundial 2026</h2>
          <button onClick={onSelectWorldCup} className="text-sm font-medium text-blue-600 hover:text-blue-800">Ver todos los partidos</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {groupedByDate.map(([date, dayMatches]) => {
            const f = formatDate(date);
            return (
              <div key={date} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="font-bold text-sm text-gray-700">{f.weekday} {f.day} {f.month}</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {dayMatches.slice(0, 3).map(m => (
                    <div key={m.id} className="px-4 py-3 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                          <Flag team={m.home} className="w-4 h-3 inline-block align-middle" />
                          <span className="text-xs font-bold text-gray-700 truncate">{m.home}</span>
                          <span className="text-[9px] text-gray-400">v</span>
                          <Flag team={m.away} className="w-4 h-3 inline-block align-middle" />
                          <span className="text-xs font-bold text-gray-700 truncate">{m.away}</span>
                        </div>
                        <div className="text-[10px] text-gray-500">{m.time} - {m.location}</div>
                        <div className="text-[10px] text-gray-400 truncate">{LOCATION_STADIUM[m.location]}</div>
                      </div>
                    </div>
                  ))}
                  {dayMatches.length > 3 && (
                    <div className="px-4 py-2 text-center text-[10px] text-gray-400">
                      +{dayMatches.length - 3} más
                    </div>
                  )}
                </div>
                <button onClick={onSelectWorldCup} className="w-full py-2.5 bg-[#111827] text-white text-sm font-medium hover:bg-gray-900 transition-colors">
                  Ver todos
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Banner de Fidelización */}
      <section className="max-w-7xl mx-auto px-4 pb-6 sm:pb-8">
        <div className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 rounded-full bg-[#1ED760] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.99 12.87c-.16.26-.51.37-.77.21-2.1-1.28-4.74-1.57-7.87-.86-.34.08-.67-.13-.75-.47-.08-.34.13-.67.47-.75 3.48-.78 6.44-.45 8.82 1.01.26.16.37.51.21.77zm1.06-2.43c-.2.32-.61.44-.93.24-2.4-1.47-6.07-1.9-8.92-1.04-.38.11-.78-.1-.9-.48-.11-.38.1-.78.48-.9 3.27-.97 7.36-.49 10.11 1.21.33.19.44.6.25.93zm.1-2.54c-2.87-1.7-7.62-1.86-10.36-1.03-.43.13-.88-.11-1.01-.54-.13-.43.11-.88.54-1.01 3.2-.97 8.52-.79 11.85 1.2.39.23.52.73.29 1.12-.23.39-.73.52-1.12.29z" />
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Conecta tu cuenta y sincroniza tus himnos favoritos.</p>
              <p className="text-gray-400 text-xs">Descubre eventos en las ciudades que visitas</p>
            </div>
          </div>
          <button onClick={onSelectWorldCup} className="px-6 py-2.5 rounded-full bg-[#1ED760] text-black text-sm font-bold hover:bg-[#1fdf64] transition-colors shrink-0">
            Conectar cuenta
          </button>
        </div>
      </section>
    </div>
  );
}
