import { useState, useRef, useCallback } from 'react';
import { useMatches, formatDate, Flag } from '../data/MatchesContext';
import { RINGS, getRingPolygon } from '../data/stadiumData';
import { useGlobalConfig } from '../data/GlobalConfigContext';
import { usePurchases } from '../data/PurchasesContext';

function AdminStadiumMap({ sections }) {
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [scale, setScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragPan, setDragPan] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const hw = useCallback((e) => {
    e.preventDefault();
    setScale(p => Math.max(0.5, Math.min(5, p + (e.deltaY > 0 ? -0.15 : 0.15))));
  }, []);

  const md = useCallback((e) => { if (e.button === 0) { setDragging(true); setDragStart({ x: e.clientX - dragPan.x, y: e.clientY - dragPan.y }); } }, [dragPan]);
  const mm = useCallback((e) => { if (dragging) setDragPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); }, [dragging, dragStart]);
  const mu = useCallback(() => { setDragging(false); setPanX(p => p + dragPan.x); setPanY(p => p + dragPan.y); setDragPan({ x: 0, y: 0 }); }, [dragPan]);

  const zi = () => setScale(p => Math.min(5, p + 0.3));
  const zo = () => setScale(p => Math.max(0.5, p - 0.3));
  const rv = () => { setScale(1); setPanX(0); setPanY(0); setDragPan({ x: 0, y: 0 }); };
  const tx = panX + dragPan.x, ty = panY + dragPan.y;

  const active = sections.filter(s => s.esta_activa);

  function badgeVariant(s) {
    return s.esta_activa && s.showBadge ? 'standard' : null;
  }

  return (
    <div className="w-full h-full relative overflow-hidden select-none">
      <svg ref={ref} viewBox="0 0 800 480"
        className="absolute inset-0 w-full h-full"
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
        onWheel={hw} onMouseDown={md} onMouseMove={mm} onMouseUp={mu} onMouseLeave={mu}
      >
        <g transform={`translate(${tx}, ${ty}) scale(${scale})`} style={{ transformOrigin: '400px 240px' }}>
          {[100, 200, 300].map(l => {
            const r = RINGS[l];
            return (
              <g key={l}>
                <polygon points={getRingPolygon(r.rxOuter, r.ryOuter)} fill="none" stroke="#d1d5db" strokeWidth="0.6" />
                <polygon points={getRingPolygon(r.rxInner, r.ryInner)} fill="none" stroke="#d1d5db" strokeWidth="0.6" />
              </g>
            );
          })}
          <polygon points={getRingPolygon(65, 42)} fill="none" stroke="#d1d5db" strokeWidth="0.6" />

          {sections.map(s => {
            const fill = s.esta_activa ? '#A3E635' : '#F3F4F6';
            const stroke = s.esta_activa ? '#FFFFFF' : '#E5E7EB';
            return (
              <path key={s.id} d={s.path} fill={fill} stroke={stroke} strokeWidth={0.6}
                className={s.esta_activa ? 'cursor-pointer' : 'cursor-default'} />
            );
          })}

          {sections.map(s => s.lines && s.lines.map((line, li) => (
            <line key={`${s.id}-l${li}`} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
              stroke="#d1d5db" strokeWidth="0.4" opacity="0.4" />
          )))}

          {sections.map(s => (
            <text key={`lb-${s.id}`} x={s.cx} y={s.cy + 2} textAnchor="middle"
              className={`text-[5.5px] font-extrabold pointer-events-none ${s.esta_activa ? 'fill-white' : 'fill-gray-400'}`}>
              {s.id}
            </text>
          ))}

          {active.map(s => {
            const v = badgeVariant(s);
            if (!v) return null;
            const dx = Math.sin(s.badgeAngle * Math.PI / 180);
            const dy = -Math.cos(s.badgeAngle * Math.PI / 180);
            const bx = s.cx + dx * 38, by = s.cy + dy * 38;
            return (
              <g key={`bg-${s.id}`} className="pointer-events-none">
                <rect x={bx - 35} y={by - 16} width={70} height={30} rx="10" fill="white"
                  stroke="#D93664" strokeWidth="1.2" className="drop-shadow-lg" />
                <text x={bx} y={by - 2} textAnchor="middle" className="text-[7px] fill-gray-900 font-extrabold">
                  {s.precio_base.toLocaleString()} $
                </text>
                <text x={bx} y={by + 9} textAnchor="middle" className="text-[5.5px] fill-[#D93664] font-bold">
                  Quedan {s.asientos_disponibles}
                </text>
              </g>
            );
          })}

          <rect x={345} y={208} width={110} height={64} rx="2" fill="#1b5e20" />
          <rect x={345} y={208} width={15.7} height={64} fill="#1e6322" opacity="0.3" />
          <rect x={376.4} y={208} width={15.7} height={64} fill="#1e6322" opacity="0.3" />
          <rect x={407.8} y={208} width={15.7} height={64} fill="#1e6322" opacity="0.3" />
          <rect x={439.2} y={208} width={15.8} height={64} fill="#1e6322" opacity="0.3" />
          <rect x={347} y={210} width={106} height={60} fill="none" stroke="white" strokeWidth="0.8" rx="1" />
          <line x1={400} y1={210} x2={400} y2={270} stroke="white" strokeWidth="0.8" />
          <circle cx={400} cy={240} r={12} fill="none" stroke="white" strokeWidth="0.6" />
          <circle cx={400} cy={240} r={1} fill="white" />
          <rect x={363} y={222} width={14} height={36} fill="none" stroke="white" strokeWidth="0.6" />
          <rect x={423} y={222} width={14} height={36} fill="none" stroke="white" strokeWidth="0.6" />
          <rect x={367} y={234} width={8} height={12} fill="none" stroke="white" strokeWidth="0.5" />
          <rect x={425} y={234} width={8} height={12} fill="none" stroke="white" strokeWidth="0.5" />
          <rect x={341} y={232} width={6} height={16} fill="none" stroke="white" strokeWidth="1" />
          <rect x={453} y={232} width={6} height={16} fill="none" stroke="white" strokeWidth="1" />
          <rect x={355} y={203} width={28} height={5} rx="1" fill="#9ca3af" />
          <text x={369} y={207} textAnchor="middle" className="text-[4px] font-bold fill-white">BENCH</text>
          <rect x={417} y={203} width={28} height={5} rx="1" fill="#9ca3af" />
          <text x={431} y={207} textAnchor="middle" className="text-[4px] font-bold fill-white">BENCH</text>

          <g transform="translate(20, 450)">
            <rect x="0" y="0" width="10" height="10" rx="2" fill="#A3E635" />
            <text x="14" y="8" className="text-[6px] fill-gray-500">Disponible</text>
            <rect x="80" y="0" width="10" height="10" rx="2" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="0.5" />
            <text x="94" y="8" className="text-[6px] fill-gray-500">Agotado</text>
          </g>

          <text x="8" y="14" className="text-[6px] fill-gray-300 font-medium">NIVEL 300</text>
          <text x="8" y="24" className="text-[6px] fill-gray-300 font-medium">NIVEL 200</text>
          <text x="8" y="34" className="text-[6px] fill-gray-300 font-medium">NIVEL 100</text>
        </g>
      </svg>

      <div className="absolute top-3 right-3 flex flex-col items-center bg-white rounded-xl shadow-md border border-gray-200 py-1 px-1 z-10">
        <button onClick={zi} className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-600 font-bold text-base leading-none">+</button>
        <div className="w-4 h-px bg-gray-200 my-0.5" />
        <button onClick={zo} className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-600 font-bold text-base leading-none">−</button>
        <div className="w-4 h-px bg-gray-200 my-0.5" />
        <button onClick={rv} className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-400" title="Restablecer">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function MatchesAdmin({ onBack }) {
  const { matches, addMatch, deleteMatch, updateMatch, updateMatchSection, regenMatchAvailability, TEAMS, LOCATIONS, LOCATION_STADIUM, TEAM_FLAGS } = useMatches();
  const { cryptoWallet, updateCryptoWallet, whatsappNum, updateWhatsappNum } = useGlobalConfig();
  const { purchases, approvePurchase, denyPurchase } = usePurchases();
  const pending = purchases.filter(p => p.status === 'pending');
  const approved = purchases.filter(p => p.status === 'approved');
  const [form, setForm] = useState({ home: '', away: '', date: '', time: '', location: '', totalTickets: 65000 });
  const [editingId, setEditingId] = useState(null);
  const [managingMatchId, setManagingMatchId] = useState(null);
  const managingMatch = managingMatchId ? matches.find(m => m.id === managingMatchId) : null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.home || !form.away || !form.date || !form.time || !form.location) return;
    if (form.home === form.away) { alert('Los equipos deben ser diferentes'); return; }
    const existing = matches.find(m => m.home === form.home && m.away === form.away && m.date === form.date);
    if (existing && existing.id !== editingId) { alert('Ya existe ese partido'); return; }
    if (editingId) {
      updateMatch(editingId, form);
      setEditingId(null);
    } else {
      addMatch(form);
    }
    setForm({ home: '', away: '', date: '', time: '', location: '', totalTickets: 65000 });
  }

  function handleEdit(m) {
    setForm({ home: m.home, away: m.away, date: m.date, time: m.time, location: m.location, totalTickets: m.totalTickets });
    setEditingId(m.id);
  }

  function handleCancel() {
    setForm({ home: '', away: '', date: '', time: '', location: '', totalTickets: 65000 });
    setEditingId(null);
  }

  const usedTeams = new Set();
  matches.forEach(m => { usedTeams.add(m.home); usedTeams.add(m.away); });
  const availableTeams = TEAMS.filter(t => !usedTeams.has(t) || t === form.home || t === form.away);

  // --- Seat management view ---
  if (managingMatch) {
    const m = managingMatch;
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
          <button onClick={() => setManagingMatchId(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-gray-900">
              <Flag team={m.home} /> {m.home} vs <Flag team={m.away} /> {m.away}
            </div>
            <div className="text-xs text-gray-500">
              {m.date} • {m.time} • {LOCATION_STADIUM[m.location]} ({m.location})
            </div>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            {(m.asientosEstadio || []).filter(s => s.esta_activa).length}/{(m.asientosEstadio || []).length} secciones activas
          </span>
        </div>

        <div className="flex flex-col md:flex-row" style={{ height: 'calc(100vh - 57px)' }}>
          <div className="w-full md:w-[55%] h-[40vh] md:h-full bg-gray-50 relative overflow-hidden">
            <AdminStadiumMap sections={m.asientosEstadio || []} />
          </div>
          <div className="w-full md:w-[45%] h-[60vh] md:h-full border-t md:border-t-0 md:border-l border-gray-200 bg-white flex flex-col overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900">Secciones del Estadio</h3>
              <button
                onClick={() => regenMatchAvailability(m.id)}
                className="px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Regenerar 80/20
              </button>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[500px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase">Sec</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase">Nivel</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase">Precio</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase">Disp.</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase">Activa</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase">Icono</th>
                </tr>
              </thead>
              <tbody>
                {(m.asientosEstadio || []).map(s => (
                  <tr key={s.id} className={`border-b border-gray-100 hover:bg-gray-50 ${!s.esta_activa ? 'opacity-50' : ''}`}>
                    <td className="px-3 py-2 font-bold text-gray-800">{s.id}</td>
                    <td className="px-3 py-2 text-gray-500">{s.tier}</td>
                    <td className="px-3 py-2">
                      <input type="number" value={s.precio_base}
                        onChange={(e) => updateMatchSection(m.id, s.id, { precio_base: Math.max(0, Number(e.target.value)) })}
                        className="w-16 px-1.5 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-400" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="number" value={s.asientos_disponibles}
                        onChange={(e) => updateMatchSection(m.id, s.id, { asientos_disponibles: Math.max(0, Number(e.target.value)) })}
                        className="w-12 px-1.5 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-400"
                        disabled={!s.esta_activa} />
                    </td>
                    <td className="px-3 py-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={s.esta_activa}
                          onChange={(e) => updateMatchSection(m.id, s.id, {
                            esta_activa: e.target.checked,
                            asientos_disponibles: e.target.checked ? Math.max(1, s.asientos_disponibles || 1) : 0,
                          })}
                          className="sr-only peer" />
                        <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[0.5px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#4c7c0c]"></div>
                      </label>
                    </td>
                    <td className="px-3 py-2">
                      <select value={s.icono_destacado}
                        onChange={(e) => updateMatchSection(m.id, s.id, { icono_destacado: e.target.value })}
                        className="px-1.5 py-1 border border-gray-200 rounded text-[10px] focus:outline-none focus:border-blue-400">
                        <option value="none">—</option>
                        <option value="fire">🔥</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-extrabold text-gray-900">Administración de Partidos</h1>
        </div>
        <span className="text-sm text-gray-500">{matches.length} partidos</span>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-gray-900">{editingId ? 'Editar Partido' : 'Nuevo Partido'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Equipo Local</label>
              <select value={form.home} onChange={e => setForm({...form, home: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" required>
                <option value="">Seleccionar...</option>
                {TEAMS.map(t => <option key={t} value={t} disabled={t === form.away}>{TEAM_FLAGS[t]} {t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Equipo Visitante</label>
              <select value={form.away} onChange={e => setForm({...form, away: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" required>
                <option value="">Seleccionar...</option>
                {TEAMS.map(t => <option key={t} value={t} disabled={t === form.home}>{TEAM_FLAGS[t]} {t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Fecha</label>
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Hora</label>
              <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Ubicación</label>
              <select value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" required>
                <option value="">Seleccionar...</option>
                {LOCATIONS.map(l => <option key={l} value={l}>{l} - {LOCATION_STADIUM[l]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Entradas Totales</label>
              <input type="number" value={form.totalTickets} onChange={e => setForm({...form, totalTickets: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" min="1000" required />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-5 py-2 bg-[#4c7c0c] hover:bg-[#3d6309] text-white text-sm font-bold rounded-lg">
              {editingId ? 'Guardar Cambios' : 'Añadir Partido'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg">
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Match List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Partidos ({matches.length})</h2>
          </div>
          {matches.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">No hay partidos. Añade uno arriba.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {matches.map(m => {
                const f = formatDate(m.date);
                return (
                  <div key={m.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50">
                    <div className="text-center min-w-[50px]">
                      <div className="text-[10px] font-semibold text-gray-500 uppercase">{f.month}</div>
                      <div className="text-lg font-extrabold text-gray-900">{f.day}</div>
                      <div className="text-[10px] text-gray-500">{f.weekday}</div>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <Flag team={m.home} className="w-5 h-4 inline-block align-middle" />
                      <span className="text-sm font-bold text-gray-800">{m.home}</span>
                      <span className="text-xs text-gray-400">vs</span>
                      <Flag team={m.away} className="w-5 h-4 inline-block align-middle" />
                      <span className="text-sm font-bold text-gray-800">{m.away}</span>
                      <span className="text-xs text-gray-400 ml-2">{m.time}</span>
                    </div>
                    <div className="text-xs text-gray-500">{m.location}</div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(m)} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600" title="Editar">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => setManagingMatchId(m.id)} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-green-700" title="Gestionar Asientos">
                        🏟️
                      </button>
                      <button onClick={() => deleteMatch(m.id)} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600" title="Eliminar">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Purchases */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">
              Solicitudes de Compra
              {pending.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">{pending.length}</span>
              )}
            </h2>
            <span className="text-xs text-gray-400">{approved.length} aprobadas</span>
          </div>
          {purchases.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">No hay solicitudes de compra.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {purchases.map(p => {
                const isPending = p.status === 'pending';
                return (
                  <div key={p.id} className={`px-6 py-4 ${isPending ? 'bg-amber-50/50' : p.status === 'approved' ? 'bg-green-50/50' : 'opacity-60'}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-bold text-gray-900">{p.match.home} vs {p.match.away}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            p.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            p.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {p.status === 'pending' ? 'Pendiente' : p.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Sección {p.section.id} &bull; {p.qty} {p.qty === 1 ? 'entrada' : 'entradas'} &bull; {p.total.toLocaleString()} US$
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {p.user.name} ({p.user.email}) &bull; {new Date(p.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {isPending && (
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => approvePurchase(p.id)}
                            className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors">
                            Aprobar
                          </button>
                          <button onClick={() => denyPurchase(p.id)}
                            className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium transition-colors">
                            Rechazar
                          </button>
                        </div>
                      )}
                      {p.status === 'approved' && (
                        <div className="shrink-0 text-xs text-green-600 font-bold flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Ticket generado
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Global Config */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Configuración Global del Sitio</h2>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Billetera Cripto (USDT/USDC)</label>
            <input type="text" value={cryptoWallet}
              onChange={e => updateCryptoWallet(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Número de WhatsApp (con código de país)</label>
            <input type="text" value={whatsappNum}
              onChange={e => updateWhatsappNum(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
          </div>
        </div>
      </div>
    </div>
  );
}