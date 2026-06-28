import { useState, useMemo } from 'react';
import { useMatches, formatDate, Flag } from '../data/MatchesContext';
import { useAuth } from '../data/AuthContext';

export default function EventListings({ searchTerm, onViewTickets, onHome }) {
  const { matches, LOCATIONS, TEAM_FLAGS, LOCATION_STADIUM } = useMatches();
  const { user } = useAuth();
  const [filterLocation, setFilterLocation] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showLocation, setShowLocation] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const allTeams = useMemo(() => {
    const s = new Set();
    matches.forEach(m => { s.add(m.home); s.add(m.away); });
    return [...s].sort();
  }, [matches]);

  const allDates = useMemo(() => {
    const s = new Set(matches.map(m => m.date));
    return [...s].sort();
  }, [matches]);

  const filtered = useMemo(() => {
    let result = matches;
    if (filterLocation) result = result.filter(m => m.location === filterLocation);
    if (filterTeam) result = result.filter(m => m.home === filterTeam || m.away === filterTeam);
    if (filterDate) result = result.filter(m => m.date === filterDate);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(m =>
        m.home.toLowerCase().includes(term) ||
        m.away.toLowerCase().includes(term) ||
        m.location.toLowerCase().includes(term) ||
        (LOCATION_STADIUM[m.location] || '').toLowerCase().includes(term)
      );
    }
    return result;
  }, [matches, filterLocation, filterTeam, filterDate, searchTerm]);

  function getUrgency(date) {
    if (date === today) return 'Hoy';
    const d = new Date(date + 'T12:00:00');
    const diff = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
    if (diff === 1) return 'Mañana';
    if (diff > 0 && diff <= 7) return `En ${diff} días`;
    return null;
  }

  function selectFilter(type, value) {
    if (type === 'location') { setFilterLocation(v => v === value ? '' : value); setShowLocation(false); }
    else if (type === 'team') { setFilterTeam(v => v === value ? '' : value); setShowTeam(false); }
    else if (type === 'date') { setFilterDate(v => v === value ? '' : value); setShowDate(false); }
  }

  const totalCount = matches.length;
  const viewerCount = (totalCount * 59743).toLocaleString();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900">Entradas para Copa Mundial de Fútbol</h1>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-600">
            <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            84,9 mil
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-sm text-blue-800">{viewerCount} personas vieron eventos de Copa Mundial de Fútbol en la última hora</span>
        </div>

        {/* Filters */}
        <div className="flex gap-2 sm:gap-3 flex-wrap mb-6 relative">
          <div className="relative">
            <button onClick={() => { setShowLocation(v => !v); setShowTeam(false); setShowDate(false); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm transition-colors ${filterLocation ? 'bg-[#4c7c0c] text-white border-[#4c7c0c]' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}>
              {filterLocation || 'Ubicación'}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showLocation && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto">
                {LOCATIONS.map(l => (
                  <button key={l} onClick={() => selectFilter('location', l)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${filterLocation === l ? 'font-bold text-[#4c7c0c]' : 'text-gray-700'}`}>{l}</button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => { setShowTeam(v => !v); setShowLocation(false); setShowDate(false); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm transition-colors ${filterTeam ? 'bg-[#4c7c0c] text-white border-[#4c7c0c]' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}>
              {filterTeam || 'Equipos'}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showTeam && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto">
                {allTeams.map(t => (
                  <button key={t} onClick={() => selectFilter('team', t)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${filterTeam === t ? 'font-bold text-[#4c7c0c]' : 'text-gray-700'}`}>
                    <Flag team={t} /> {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => { setShowDate(v => !v); setShowLocation(false); setShowTeam(false); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm transition-colors ${filterDate ? 'bg-[#4c7c0c] text-white border-[#4c7c0c]' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}>
              {filterDate ? formatDate(filterDate).day + ' ' + formatDate(filterDate).month : 'Todas las fechas'}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showDate && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto">
                {allDates.map(d => {
                  const f = formatDate(d);
                  return (
                    <button key={d} onClick={() => selectFilter('date', d)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${filterDate === d ? 'font-bold text-[#4c7c0c]' : 'text-gray-700'}`}>
                      {f.weekday} {f.day} {f.month} 2026
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {(filterLocation || filterTeam || filterDate || searchTerm) && (
            <button onClick={() => { setFilterLocation(''); setFilterTeam(''); setFilterDate(''); }}
              className="px-3 py-2 text-xs text-gray-500 hover:text-gray-700">
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Match list */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg font-medium mb-1">No hay partidos con esos filtros</p>
                <p className="text-sm">Prueba con otros filtros</p>
              </div>
            ) : (
              filtered.map(m => {
                const f = formatDate(m.date);
                const urgency = getUrgency(m.date);
                return (
                  <div key={m.id} className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:shadow-sm transition-shadow">
                    <div className="text-center min-w-[48px] sm:min-w-[60px]">
                      <div className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase">{f.month}</div>
                      <div className="text-xl sm:text-2xl font-extrabold text-gray-900">{f.day}</div>
                      <div className="text-[10px] sm:text-xs text-gray-500">{f.weekday}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                        <Flag team={m.home} className="w-5 h-4 inline-block align-middle" />
                        <span className="font-bold text-xs sm:text-sm text-gray-800 truncate">{m.home}</span>
                        <span className="text-[10px] sm:text-xs text-gray-400">contra</span>
                        <Flag team={m.away} className="w-5 h-4 inline-block align-middle" />
                        <span className="font-bold text-xs sm:text-sm text-gray-800 truncate">{m.away}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs text-gray-500 flex-wrap">
                        <span>{m.time}</span>
                        <span className="text-gray-300">•</span>
                        <span className="truncate">{m.phase || `Partido ${m.id}`}</span>
                        <span className="text-gray-300 hidden sm:inline">•</span>
                        <span className="truncate hidden sm:inline">{LOCATION_STADIUM[m.location]}</span>
                      </div>
                      <div className="flex gap-2 mt-1.5 sm:mt-2">
                        {urgency && <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] sm:text-xs font-medium">{urgency}</span>}
                      </div>
                    </div>
                    <button onClick={() => onViewTickets(m)}
                      className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all whitespace-nowrap shrink-0">
                      Ver entradas
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <div className="h-32 bg-gradient-to-br from-[#4c7c0c] via-[#558414] to-[#3a6309] relative flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 200 200" preserveAspectRatio="none">
                  <polygon points="0,0 40,0 20,30" fill="white" />
                  <polygon points="50,0 90,0 70,30" fill="white" />
                  <polygon points="100,0 140,0 120,30" fill="white" />
                  <polygon points="150,0 190,0 170,30" fill="white" />
                  <polygon points="10,35 50,35 30,65" fill="white" />
                  <polygon points="60,35 100,35 80,65" fill="white" />
                  <polygon points="110,35 150,35 130,65" fill="white" />
                  <polygon points="160,35 200,35 180,65" fill="white" />
                </svg>
                <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 text-yellow-400 mb-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-white font-extrabold text-sm tracking-widest">WORLD CUP</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">
                  La Copa Mundial de Fútbol es el torneo internacional de fútbol más prestigioso del mundo, organizado por la FIFA.
                </p>
                <a href="#" className="text-sm font-medium text-[#4c7c0c] hover:underline">Ver más</a>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="font-bold text-sm text-blue-900">Garantía de la plataforma</span>
              </div>
              <p className="text-xs text-blue-700 leading-relaxed">
                Todas las transacciones están protegidas. Garantizamos que las entradas son auténticas y se entregarán a tiempo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
