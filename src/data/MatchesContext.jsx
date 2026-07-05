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
  "Houston, TX, US": "NRG Stadium",
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
  "Vancouver, CA": "BC Place",
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
  { id: 'm1', home: "Canadá", away: "Marruecos", date: "2026-07-04", time: "12:00", location: "Houston, TX, US", totalTickets: 72000, phase: "Cuartos de Final", asientosEstadio: generate1500Sections() },
  { id: 'm2', home: "Francia", away: "Paraguay", date: "2026-07-04", time: "16:00", location: "Philadelphia, PA, US", totalTickets: 69000, phase: "Cuartos de Final", asientosEstadio: generate1500Sections() },
  { id: 'm3', home: "Brasil", away: "Noruega", date: "2026-07-05", time: "15:00", location: "East Rutherford, NJ, US", totalTickets: 82500, phase: "Cuartos de Final", asientosEstadio: generate1500Sections() },
  { id: 'm4', home: "México", away: "Inglaterra", date: "2026-07-05", time: "19:00", location: "Ciudad de México, MX", totalTickets: 87000, phase: "Cuartos de Final", asientosEstadio: generate1500Sections() },
  { id: 'm5', home: "Portugal", away: "España", date: "2026-07-06", time: "14:00", location: "Arlington, TX, US", totalTickets: 80000, phase: "Cuartos de Final", asientosEstadio: generate1500Sections() },
  { id: 'm6', home: "Estados Unidos", away: "Bélgica", date: "2026-07-06", time: "19:00", location: "Seattle, WA, US", totalTickets: 69000, phase: "Cuartos de Final", asientosEstadio: generate1500Sections() },
  { id: 'm7', home: "Argentina", away: "Egipto", date: "2026-07-07", time: "11:00", location: "Atlanta, GA, US", totalTickets: 71000, phase: "Cuartos de Final", asientosEstadio: generate1500Sections() },
  { id: 'm8', home: "Suiza", away: "Colombia", date: "2026-07-07", time: "15:00", location: "Vancouver, CA", totalTickets: 54500, phase: "Cuartos de Final", asientosEstadio: generate1500Sections() },
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
