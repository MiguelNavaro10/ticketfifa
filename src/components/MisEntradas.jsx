import { useAuth } from '../data/AuthContext';
import { usePurchases } from '../data/PurchasesContext';
import { useMatches } from '../data/MatchesContext';
import { formatDate } from '../data/MatchesContext';

function QRPlaceholder({ data }) {
  const hash = data.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const cells = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = (hash + r * 13 + c * 7) % 3 !== 0;
      cells.push({ r, c, val });
    }
  }
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill="white" rx="4" />
      {cells.map(({ r, c, val }) => (
        <rect key={`${r}-${c}`} x={c * 11 + 5} y={r * 11 + 5} width={9} height={9}
          fill={val ? '#1e3a5f' : 'white'} rx="1" />
      ))}
      <rect x={7} y={7} width={20} height={20} fill="none" stroke="#1e3a5f" strokeWidth="2" rx="2" />
      <rect x={73} y={7} width={20} height={20} fill="none" stroke="#1e3a5f" strokeWidth="2" rx="2" />
      <rect x={7} y={73} width={20} height={20} fill="none" stroke="#1e3a5f" strokeWidth="2" rx="2" />
    </svg>
  );
}

function FlagBar({ country }) {
  const colors = {
    'Argentina': { bars: ['#75aadb','#ffffff','#75aadb'] },
    'Brasil': { bars: ['#009739','#ffdf00','#009739','#002776'] },
    'Francia': { bars: ['#0055a4','#ffffff','#ef4135'] },
    'Inglaterra': { bars: ['#ffffff','#cf142b','#ffffff'] },
    'Portugal': { bars: ['#006600','#ff0000'] },
    'España': { bars: ['#ffc400','#ffc400','#c60b1e'] },
    'Alemania': { bars: ['#000000','#dd0000','#ffcc00'] },
    'Países Bajos': { bars: ['#c8102e','#ffffff','#21468b'] },
    'Italia': { bars: ['#009246','#ffffff','#ce2b37'] },
    'EE. UU.': { bars: ['#b22234','#ffffff','#b22234'] },
    'México': { bars: ['#006341','#ffffff','#c8102e'] },
    'Canadá': { bars: ['#ff0000','#ffffff','#ff0000'] },
    'Uruguay': { bars: ['#ffffff','#0038a8','#ffffff'] },
    'Colombia': { bars: ['#ffcc00','#003893','#ce1126'] },
    'Chile': { bars: ['#ffffff','#0039a6','#d52b1e'] },
    'Perú': { bars: ['#ffffff','#d91023','#ffffff'] },
    'Japón': { bars: ['#ffffff','#bc002d','#ffffff'] },
    'Corea del Sur': { bars: ['#ffffff','#c60c30','#ffffff','#003478'] },
    'Australia': { bars: ['#00008b','#ff0000','#ffffff'] },
    'Marruecos': { bars: ['#c1272d','#000000','#c1272d'] },
    'Senegal': { bars: ['#00853f','#ffdf00','#e31b23'] },
    'Costa de Marfil': { bars: ['#f77f00','#ffffff','#009e60'] },
    'Nigeria': { bars: ['#008751','#ffffff','#008751'] },
    'Egipto': { bars: ['#ce1126','#ffffff','#000000'] },
    'Túnez': { bars: ['#e70013','#ffffff','#e70013'] },
    'Camerún': { bars: ['#007a5e','#ce1126','#ffdf00'] },
    'Ghana': { bars: ['#ce1126','#ffdf00','#006b3f','#000000'] },
    'Arabia Saudita': { bars: ['#006c35','#ffffff','#006c35'] },
    'Irán': { bars: ['#239f40','#ffffff','#da0000'] },
    'Irak': { bars: ['#ce1126','#ffffff','#000000'] },
    'Qatar': { bars: ['#8d1b3d','#ffffff','#8d1b3d'] },
    'Emiratos Árabes Unidos': { bars: ['#009e00','#ffffff','#000000'] },
    'Croacia': { bars: ['#ffffff','#c8102e','#ffffff','#c8102e'] },
    'Serbia': { bars: ['#c6363c','#ffffff','#0c4076'] },
    'Suiza': { bars: ['#ff0000','#ffffff','#ff0000'] },
    'Dinamarca': { bars: ['#c8102e','#ffffff','#c8102e'] },
    'Suecia': { bars: ['#005b99','#ffcc00','#005b99'] },
    'Noruega': { bars: ['#ba0c2f','#ffffff','#ba0c2f','#ffffff','#ba0c2f'] },
    'Polonia': { bars: ['#ffffff','#dc143c','#ffffff'] },
    'Ucrania': { bars: ['#0057b7','#ffdd00'] },
    'Bélgica': { bars: ['#000000','#ffdf00','#ce1126'] },
    'República Checa': { bars: ['#ffffff','#d7141a','#11457e'] },
    'Hungría': { bars: ['#ce1126','#ffffff','#008751'] },
    'Austria': { bars: ['#ce1126','#ffffff','#ce1126'] },
    'Turquía': { bars: ['#e30a17','#ffffff','#e30a17'] },
    'Escocia': { bars: ['#005eb8','#ffffff','#005eb8'] },
    'Gales': { bars: ['#ffffff','#cf142b','#ffffff','#cf142b'] },
    'Paraguay': { bars: ['#ce1126','#ffffff','#0038a8'] },
    'Ecuador': { bars: ['#ffdf00','#0038a8','#ce1126'] },
  };
  const flag = colors[country];
  if (!flag) return <span className="text-lg">{country[0]}</span>;
  return (
    <div className="w-12 h-8 rounded overflow-hidden shadow-sm flex">
      {flag.bars.map((color, i) => (
        <div key={i} className="flex-1" style={{ backgroundColor: color }} />
      ))}
    </div>
  );
}

function TicketCard({ purchase }) {
  const { match, section, qty, total } = purchase;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {/* Header gradient + QR */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 px-6 py-5 flex flex-col items-center">
        <div className="w-20 h-20 bg-white rounded-xl p-1.5 shadow-lg mb-2">
          <QRPlaceholder data={purchase.id + match.id} />
        </div>
        <div className="bg-blue-600/80 px-4 py-0.5 rounded-full mt-1">
          <span className="text-[10px] font-extrabold text-white tracking-widest">FIFA™</span>
        </div>
      </div>

      {/* Date / Time */}
      <div className="text-center pt-4 pb-1">
        <span className="font-bold text-gray-900 text-sm">{match.date} | {match.time}</span>
      </div>

      {/* Location */}
      <div className="text-center pb-3">
        <span className="text-xs text-gray-500">{match.location}</span>
      </div>

      {/* Divider */}
      <div className="mx-6 border-t border-gray-100" />

      {/* Teams */}
      <div className="flex items-center justify-center gap-4 py-4">
        <div className="flex flex-col items-center gap-1.5">
          <FlagBar country={match.home} />
          <span className="text-xs font-bold text-gray-900">{match.home}</span>
        </div>
        <span className="text-sm font-bold text-gray-400">VS</span>
        <div className="flex flex-col items-center gap-1.5">
          <FlagBar country={match.away} />
          <span className="text-xs font-bold text-gray-900">{match.away}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 border-t border-gray-100" />

      {/* Category + Seat */}
      <div className="text-center py-3">
        <div className="font-bold text-gray-900 text-sm">Sección {section.id} — Nivel {section.tier}</div>
        <div className="text-[11px] text-gray-400 mt-0.5">{qty} {qty === 1 ? 'entrada' : 'entradas'} &middot; {(total / qty).toLocaleString()} US$ c/u</div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 py-2 mt-auto">
        <span className="block text-center text-[10px] font-extrabold text-white tracking-widest">FIFA™</span>
      </div>
    </div>
  );
}

export default function MisEntradas({ onBack }) {
  const { user } = useAuth();
  const { purchases } = usePurchases();
  const { TEAM_FLAGS } = useMatches();

  const approvedTickets = purchases.filter(p => p.status === 'approved' && p.user?.id === user?.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-500">Inicia sesión para ver tus entradas.</p>
          <button onClick={onBack} className="text-sm text-blue-600 font-medium hover:underline">Volver</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-4">
        <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-extrabold text-gray-900">Mis Entradas</h1>
        {approvedTickets.length > 0 && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{approvedTickets.length} {approvedTickets.length === 1 ? 'entrada' : 'entradas'}</span>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {approvedTickets.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">No tienes entradas aprobadas aún.</p>
            <p className="text-gray-400 text-xs mt-1">Cuando el administrador apruebe tu compra, aparecerá aquí.</p>
            <button onClick={onBack} className="mt-4 px-5 py-2 rounded-xl bg-[#4c7c0c] hover:bg-[#3d6309] text-white text-sm font-bold">
              Explorar partidos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {approvedTickets.map(p => (
              <TicketCard key={p.id} purchase={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
