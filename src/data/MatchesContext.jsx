import { createContext, useContext, useState, useCallback } from 'react';
import { generateInitialSections, apply8020 } from './stadiumData';

const TEAMS = [
  "Alemania", "Arabia Saudí", "Argelia", "Argentina", "Australia", "Austria",
  "Bélgica", "Bosnia y Herzegovina", "Brasil", "Cabo Verde", "Canadá", "Catar",
  "Chequia", "Colombia", "Corea del Sur", "Côte d'Ivoire", "Croacia", "Curazao",
  "Ecuador", "Egipto", "Escocia", "España", "Estados Unidos", "Francia", "Ghana",
  "Haití", "Inglaterra", "Irak", "Irán", "Japón", "Jordania", "Marruecos",
  "México", "Noruega", "Nueva Zelanda", "Países Bajos", "Panamá", "Paraguay",
  "Por Determinar",   "Portugal", "Rep. Dem. del Congo", "Senegal", "Sudáfrica", "Suecia",
  "Costa de Marfil",
  "Suiza", "Túnez", "Turquía", "Uruguay", "Uzbekistán",
];

const LOCATIONS = [
  "Kansas City, MO, US", "Arlington, TX, US", "Houston, TX, US",
  "Atlanta, GA, US", "Monterrey, MX", "Toronto, CA",
  "Inglewood, CA, US", "Philadelphia, PA, US", "Zapopan, MX",
  "Ciudad de México, MX", "East Rutherford, NJ, US", "Miami, FL, US",
  "Santa Clara, CA, US", "Seattle, WA, US", "Foxborough, MA, US", "Vancouver, CA",
];

const LOCATION_STADIUM = {
  "Kansas City, MO, US": "GEHA Field at Arrowhead Stadium",
  "Arlington, TX, US": "AT&T Stadium",
  "Houston, TX, US": "Reliant / NRG Stadium",
  "Atlanta, GA, US": "Mercedes-Benz Stadium",
  "Monterrey, MX": "Estadio BBVA Bancomer",
  "Toronto, CA": "BMO Field",
  "Inglewood, CA, US": "SoFi Stadium",
  "Philadelphia, PA, US": "Lincoln Financial Field",
  "Zapopan, MX": "Estadio Akron",
  "Ciudad de México, MX": "Estadio Azteca",
  "East Rutherford, NJ, US": "MetLife Stadium",
  "Miami, FL, US": "Hard Rock Stadium",
  "Santa Clara, CA, US": "Levi's Stadium",
  "Seattle, WA, US": "Lumen Field",
  "Foxborough, MA, US": "Gillette Stadium",
  "Vancouver, CA": "BC Place Stadium",
};

const TEAM_FLAGS = {
  "Alemania": "🇩🇪", "Arabia Saudí": "🇸🇦", "Argelia": "🇩🇿",
  "Argentina": "🇦🇷", "Australia": "🇦🇺", "Austria": "🇦🇹",
  "Bélgica": "🇧🇪", "Bosnia y Herzegovina": "🇧🇦", "Brasil": "🇧🇷",
  "Cabo Verde": "🇨🇻", "Canadá": "🇨🇦", "Catar": "🇶🇦",
  "Chequia": "🇨🇿", "Colombia": "🇨🇴", "Corea del Sur": "🇰🇷",
  "Côte d'Ivoire": "🇨🇮", "Croacia": "🇭🇷", "Curazao": "🇨🇼",
  "Ecuador": "🇪🇨", "Egipto": "🇪🇬",
  "Escocia": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "España": "🇪🇸", "Estados Unidos": "🇺🇸", "Francia": "🇫🇷",
  "Ghana": "🇬🇭", "Haití": "🇭🇹", "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Irak": "🇮🇶", "Irán": "🇮🇷", "Japón": "🇯🇵",
  "Jordania": "🇯🇴", "Marruecos": "🇲🇦", "México": "🇲🇽",
  "Noruega": "🇳🇴", "Nueva Zelanda": "🇳🇿", "Países Bajos": "🇳🇱",
  "Panamá": "🇵🇦", "Paraguay": "🇵🇾", "Por Determinar": "❓",
  "Portugal": "🇵🇹",
  "Rep. Dem. del Congo": "🇨🇩", "Senegal": "🇸🇳",
  "Sudáfrica": "🇿🇦", "Suecia": "🇸🇪", "Suiza": "🇨🇭",
  "Costa de Marfil": "🇨🇮",
  "Túnez": "🇹🇳", "Turquía": "🇹🇷", "Uruguay": "🇺🇾", "Uzbekistán": "🇺🇿",
};

const FLAG_CODES = {
  "Alemania": "de", "Arabia Saudí": "sa", "Argelia": "dz",
  "Argentina": "ar", "Australia": "au", "Austria": "at",
  "Bélgica": "be", "Bosnia y Herzegovina": "ba", "Brasil": "br",
  "Cabo Verde": "cv", "Canadá": "ca", "Catar": "qa",
  "Chequia": "cz", "Colombia": "co", "Corea del Sur": "kr",
  "Côte d'Ivoire": "ci", "Croacia": "hr", "Curazao": "cw",
  "Ecuador": "ec", "Egipto": "eg",
  "Escocia": "", "España": "es", "Estados Unidos": "us", "Francia": "fr",
  "Ghana": "gh", "Haití": "ht", "Inglaterra": "",
  "Irak": "iq", "Irán": "ir", "Japón": "jp",
  "Jordania": "jo", "Marruecos": "ma", "México": "mx",
  "Noruega": "no", "Nueva Zelanda": "nz", "Países Bajos": "nl",
  "Panamá": "pa", "Paraguay": "py", "Por Determinar": "",
  "Portugal": "pt",
  "Rep. Dem. del Congo": "cd", "Senegal": "sn",
  "Sudáfrica": "za", "Suecia": "se", "Suiza": "ch",
  "Costa de Marfil": "ci",
  "Túnez": "tn", "Turquía": "tr", "Uruguay": "uy", "Uzbekistán": "uz",
};

export function Flag({ team, className = "inline-block w-5 h-4 align-middle" }) {
  const code = FLAG_CODES[team];
  if (code) {
    return <img src={`https://flagcdn.com/24x18/${code}.png`} alt={team} className={className} />;
  }
  return <span className={className}>{TEAM_FLAGS[team] || ''}</span>;
}

function generate80pct() {
  return apply8020(generateInitialSections());
}

function generate1500Sections() {
  return apply8020(generateInitialSections()).map(s => ({
    ...s,
    precio_base: 1500,
  }));
}

function autoDeactivatePastMatches(matches) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return matches.map(m => {
    const matchDate = new Date(m.date + 'T12:00:00').getTime();
    if (matchDate < today) {
      return {
        ...m,
        asientosEstadio: m.asientosEstadio.map(s => ({
          ...s,
          esta_activa: false,
          asientos_disponibles: 0,
        }))
      };
    }
    return m;
  });
}

const DEFAULT_MATCHES = [
  { id: 'm1', home: "Marruecos", away: "Haití", date: "2026-06-24", time: "18:00", location: "Atlanta, GA, US", totalTickets: 71000, phase: "Partido 50 - C", asientosEstadio: generate80pct() },
  { id: 'm2', home: "Escocia", away: "Brasil", date: "2026-06-24", time: "18:00", location: "Miami, FL, US", totalTickets: 65000, phase: "Partido 49 - C", asientosEstadio: generate80pct() },
  { id: 'm3', home: "Chequia", away: "México", date: "2026-06-24", time: "19:00", location: "Ciudad de México, MX", totalTickets: 87000, phase: "Partido 53 - A", asientosEstadio: generate80pct() },
  { id: 'm4', home: "Sudáfrica", away: "Corea del Sur", date: "2026-06-24", time: "19:00", location: "Monterrey, MX", totalTickets: 53500, phase: "Partido 54 - A", asientosEstadio: generate80pct() },
  { id: 'm5', home: "Curazao", away: "Côte d'Ivoire", date: "2026-06-25", time: "16:00", location: "Philadelphia, PA, US", totalTickets: 69000, phase: "Partido 55 - E", asientosEstadio: generate80pct() },
  { id: 'm6', home: "Ecuador", away: "Alemania", date: "2026-06-25", time: "16:00", location: "East Rutherford, NJ, US", totalTickets: 82500, phase: "Partido 56 - E", asientosEstadio: generate80pct() },
  { id: 'm7', home: "Japón", away: "Suecia", date: "2026-06-25", time: "18:00", location: "Arlington, TX, US", totalTickets: 80000, phase: "Partido 57 - F", asientosEstadio: generate80pct() },
  { id: 'm8', home: "Túnez", away: "Países Bajos", date: "2026-06-25", time: "18:00", location: "Kansas City, MO, US", totalTickets: 76000, phase: "Partido 58 - F", asientosEstadio: generate80pct() },
  { id: 'm9', home: "Paraguay", away: "Australia", date: "2026-06-25", time: "19:00", location: "Santa Clara, CA, US", totalTickets: 68500, phase: "Partido 60 - D", asientosEstadio: generate80pct() },
  { id: 'm10', home: "Turquía", away: "Estados Unidos", date: "2026-06-25", time: "19:00", location: "Inglewood, CA, US", totalTickets: 70000, phase: "Partido 59 - D", asientosEstadio: generate80pct() },
  { id: 'm11', home: "Senegal", away: "Irak", date: "2026-06-26", time: "15:00", location: "Toronto, CA", totalTickets: 40000, phase: "Partido 62 - I", asientosEstadio: generate80pct() },
  { id: 'm12', home: "Noruega", away: "Francia", date: "2026-06-26", time: "15:00", location: "Foxborough, MA, US", totalTickets: 65000, phase: "Partido 61 - I", asientosEstadio: generate80pct() },
  { id: 'm13', home: "Uruguay", away: "España", date: "2026-06-26", time: "18:00", location: "Zapopan, MX", totalTickets: 49000, phase: "Partido 66 - H", asientosEstadio: generate80pct() },
  { id: 'm14', home: "Cabo Verde", away: "Arabia Saudí", date: "2026-06-26", time: "19:00", location: "Houston, TX, US", totalTickets: 72000, phase: "Partido 65 - H", asientosEstadio: generate80pct() },
  { id: 'm15', home: "Nueva Zelanda", away: "Bélgica", date: "2026-06-26", time: "20:00", location: "Vancouver, CA", totalTickets: 54500, phase: "Partido 64 - G", asientosEstadio: generate80pct() },
  { id: 'm16', home: "Egipto", away: "Irán", date: "2026-06-26", time: "20:00", location: "Seattle, WA, US", totalTickets: 69000, phase: "Partido 63 - G", asientosEstadio: generate80pct() },
  { id: 'm17', home: "Croacia", away: "Ghana", date: "2026-06-27", time: "17:00", location: "Philadelphia, PA, US", totalTickets: 69000, phase: "Partido 68 - L", asientosEstadio: generate80pct() },
  { id: 'm18', home: "Panamá", away: "Inglaterra", date: "2026-06-27", time: "17:00", location: "East Rutherford, NJ, US", totalTickets: 82500, phase: "Partido 67 - L", asientosEstadio: generate80pct() },
  { id: 'm19', home: "Rep. Dem. del Congo", away: "Uzbekistán", date: "2026-06-27", time: "19:30", location: "Atlanta, GA, US", totalTickets: 71000, phase: "Partido 72 - K", asientosEstadio: generate80pct() },
  { id: 'm20', home: "Colombia", away: "Portugal", date: "2026-06-27", time: "19:30", location: "Miami, FL, US", totalTickets: 65000, phase: "Partido 71 - K", asientosEstadio: generate80pct() },
  { id: 'm21', home: "Jordania", away: "Argentina", date: "2026-06-27", time: "21:00", location: "Arlington, TX, US", totalTickets: 80000, phase: "Partido 70 - J", asientosEstadio: generate80pct() },
  { id: 'm22', home: "Argelia", away: "Austria", date: "2026-06-27", time: "21:00", location: "Kansas City, MO, US", totalTickets: 76000, phase: "Partido 69 - J", asientosEstadio: generate80pct() },
  { id: 'm23', home: "Sudáfrica", away: "Canadá", date: "2026-06-28", time: "15:00", location: "Inglewood, CA, US", totalTickets: 70000, phase: "Partido 73 - 16avos", asientosEstadio: generate1500Sections() },
  { id: 'm24', home: "Brasil", away: "Japón", date: "2026-06-29", time: "13:00", location: "Houston, TX, US", totalTickets: 72000, phase: "Partido 76 - 16avos", asientosEstadio: generate1500Sections() },
  { id: 'm25', home: "Alemania", away: "Paraguay", date: "2026-06-29", time: "16:30", location: "Foxborough, MA, US", totalTickets: 65000, phase: "Partido 74 - 16avos", asientosEstadio: generate1500Sections() },
  { id: 'm26', home: "Países Bajos", away: "Marruecos", date: "2026-06-29", time: "21:00", location: "Monterrey, MX", totalTickets: 53500, phase: "Partido 75 - 16avos", asientosEstadio: generate1500Sections() },
  { id: 'm27', home: "Costa de Marfil", away: "Noruega", date: "2026-06-30", time: "13:00", location: "Arlington, TX, US", totalTickets: 80000, phase: "Partido 78 - 16avos", asientosEstadio: generate1500Sections() },
  { id: 'm28', home: "Francia", away: "Suecia", date: "2026-06-30", time: "17:00", location: "East Rutherford, NJ, US", totalTickets: 82500, phase: "Partido 77 - 16avos", asientosEstadio: generate1500Sections() },
  { id: 'm29', home: "México", away: "Ecuador", date: "2026-06-30", time: "19:00", location: "Ciudad de México, MX", totalTickets: 87000, phase: "Partido 79 - 16avos", asientosEstadio: generate1500Sections() },
  { id: 'm30', home: "Inglaterra", away: "Rep. Dem. del Congo", date: "2026-07-01", time: "12:00", location: "Atlanta, GA, US", totalTickets: 71000, phase: "Partido 80 - 16avos", asientosEstadio: generate1500Sections() },
  { id: 'm31', home: "Bélgica", away: "Senegal", date: "2026-07-01", time: "13:00", location: "Seattle, WA, US", totalTickets: 69000, phase: "Partido 82 - 16avos", asientosEstadio: generate1500Sections() },
  { id: 'm32', home: "Estados Unidos", away: "Bosnia y Herzegovina", date: "2026-07-01", time: "20:00", location: "Santa Clara, CA, US", totalTickets: 68500, phase: "Partido 81 - 16avos", asientosEstadio: generate1500Sections() },
  { id: 'm33', home: "España", away: "Austria", date: "2026-07-02", time: "12:00", location: "Inglewood, CA, US", totalTickets: 70000, phase: "Partido 84 - 16avos", asientosEstadio: generate1500Sections() },
  { id: 'm34', home: "Portugal", away: "Croacia", date: "2026-07-02", time: "19:00", location: "Toronto, CA", totalTickets: 40000, phase: "Partido 83 - 16avos", asientosEstadio: generate1500Sections() },
  { id: 'm35', home: "Suiza", away: "Argelia", date: "2026-07-02", time: "20:00", location: "Vancouver, CA", totalTickets: 54500, phase: "Partido 85 - 16avos", asientosEstadio: generate1500Sections() },
  { id: 'm36', home: "Argentina", away: "Cabo Verde", date: "2026-07-03", time: "18:00", location: "Miami, FL, US", totalTickets: 65000, phase: "Partido 88 - 16avos", asientosEstadio: generate1500Sections() },
  { id: 'm37', home: "Australia", away: "Egipto", date: "2026-07-03", time: "15:00", location: "Arlington, TX, US", totalTickets: 80000, phase: "Partido 86 - 16avos", asientosEstadio: generate1500Sections() },
  { id: 'm38', home: "Colombia", away: "Ghana", date: "2026-07-03", time: "21:00", location: "Kansas City, MO, US", totalTickets: 76000, phase: "Partido 87 - 16avos", asientosEstadio: generate1500Sections() },
];

const MatchesContext = createContext();

const STORAGE_KEY = '_d7k_v2';

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

function saveState(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (_) {}
}

export function MatchesProvider({ children }) {
  const [matches, setMatches] = useState(() => autoDeactivatePastMatches(loadSaved() || DEFAULT_MATCHES));

  const persist = useCallback((fn) => {
    setMatches(prev => {
      const next = fn(prev);
      saveState(next);
      return next;
    });
  }, []);

  const addMatch = useCallback((m) => {
    const asientosEstadio = generate80pct();
    persist(prev => [...prev, { ...m, id: 'm' + Date.now(), asientosEstadio }]);
  }, [persist]);

  const deleteMatch = useCallback((id) => {
    persist(prev => prev.filter(m => m.id !== id));
  }, [persist]);

  const updateMatch = useCallback((id, updates) => {
    persist(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, [persist]);

  const updateMatchSection = useCallback((matchId, sectionId, updates) => {
    persist(prev => prev.map(m => {
      if (m.id !== matchId) return m;
      return {
        ...m,
        asientosEstadio: m.asientosEstadio.map(s =>
          s.id === sectionId ? { ...s, ...updates } : s
        ),
      };
    }));
  }, [persist]);

  const regenMatchAvailability = useCallback((matchId) => {
    persist(prev => prev.map(m => {
      if (m.id !== matchId) return m;
      const sections = apply8020(m.asientosEstadio || []);
      return { ...m, asientosEstadio: sections };
    }));
  }, [persist]);

  return (
    <MatchesContext.Provider value={{ matches, addMatch, deleteMatch, updateMatch, updateMatchSection, regenMatchAvailability, TEAMS, LOCATIONS, LOCATION_STADIUM, TEAM_FLAGS }}>
      {children}
    </MatchesContext.Provider>
  );
}

export function useMatches() {
  const ctx = useContext(MatchesContext);
  if (!ctx) throw new Error('useMatches must be used within MatchesProvider');
  return ctx;
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  const days = ['DOM','LUN','MAR','MIE','JUE','VIE','SAB'];
  return {
    month: months[d.getMonth()],
    day: String(d.getDate()).padStart(2, '0'),
    weekday: days[d.getDay()],
  };
}
