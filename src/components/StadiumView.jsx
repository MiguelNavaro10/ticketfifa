import { useState, useRef, useCallback } from 'react';
import { RINGS, getRingPolygon } from '../data/stadiumData';
import { useStadium } from '../data/StadiumContext';
import { useMatches, formatDate, Flag } from '../data/MatchesContext';

function getBadgeVariant(s) {
  if (!s.esta_activa || !s.showBadge) return null;
  return 'standard';
}

export default function StadiumView({ onBack, match, onUpdateSection, selectedSection: controlledSelected, onSelectSection, qty, onCheckout }) {
  const globalCtx = useStadium();
  const { TEAM_FLAGS, LOCATION_STADIUM } = useMatches();
  const sections = match ? match.asientosEstadio || [] : globalCtx.sections;
  const setSelectedSection = onSelectSection || (() => {});
  const selectedSection = controlledSelected ?? null;
  const [hoveredSection, setHoveredSection] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);

  const [scale, setScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragPan, setDragPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  const activeSections = sections.filter(s => s.esta_activa);
  const fd = match ? formatDate(match.date) : null;

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setScale(prev => Math.max(0.5, Math.min(5, prev + delta)));
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - dragPan.x, y: e.clientY - dragPan.y });
    }
  }, [dragPan]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setDragPan({ x: newX, y: newY });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setPanX(prev => prev + dragPan.x);
    setPanY(prev => prev + dragPan.y);
    setDragPan({ x: 0, y: 0 });
  }, [dragPan]);

  const zoomIn = () => setScale(prev => Math.min(5, prev + 0.3));
  const zoomOut = () => setScale(prev => Math.max(0.5, prev - 0.3));
  const resetView = () => { setScale(1); setPanX(0); setPanY(0); setDragPan({ x: 0, y: 0 }); };

  const totalTx = panX + dragPan.x;
  const totalTy = panY + dragPan.y;

  const handleSectionEnter = useCallback((s, e) => {
    if (!s.esta_activa) return;
    setHoveredSection(s.id);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const dx = Math.sin(s.badgeAngle * Math.PI / 180);
      const dy = -Math.cos(s.badgeAngle * Math.PI / 180);
      setTooltipPos({
        x: e.clientX - rect.left + dx * 60,
        y: e.clientY - rect.top + dy * 60 - 40,
        section: s.id,
      });
    }
  }, []);

  const handleSectionLeave = useCallback(() => {
    setHoveredSection(null);
    setTooltipPos(null);
  }, []);

  const handleSectionClick = useCallback((s) => {
    if (!s.esta_activa) return;
    onSelectSection(s.id === selectedSection?.id ? null : s);
  }, [selectedSection, onSelectSection]);

  const svgContent = (
    <g transform={`translate(${totalTx}, ${totalTy}) scale(${scale})`}
       style={{ transformOrigin: '400px 240px' }}>
      {[100, 200, 300].map(level => {
        const ring = RINGS[level];
        return (
          <g key={level}>
            <polygon points={getRingPolygon(ring.rxOuter, ring.ryOuter)} fill="none" stroke="#d1d5db" strokeWidth="0.6" />
            <polygon points={getRingPolygon(ring.rxInner, ring.ryInner)} fill="none" stroke="#d1d5db" strokeWidth="0.6" />
          </g>
        );
      })}
      <polygon points={getRingPolygon(65, 42)} fill="none" stroke="#d1d5db" strokeWidth="0.6" />

      {sections.map(s => {
        const isActive = s.esta_activa;
        const isSel = selectedSection?.id === s.id;
        const isHov = hoveredSection === s.id;
        let fill = '#F3F4F6';
        let stroke = '#E5E7EB';
        let cls = 'cursor-default';
        if (isActive) {
          fill = isSel ? '#7AC920' : isHov ? '#82C91E' : '#A3E635';
          stroke = '#FFFFFF';
          cls = 'cursor-pointer transition-all duration-100';
        }
        return (
          <path key={s.id} d={s.path} fill={fill} stroke={stroke}
            strokeWidth={isActive ? 0.6 : 0.4} className={cls}
            onMouseEnter={(e) => handleSectionEnter(s, e)}
            onMouseLeave={handleSectionLeave}
            onClick={() => handleSectionClick(s)}
          />
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

      {activeSections.map(s => {
        const variant = getBadgeVariant(s);
        if (!variant) return null;
        const dx = Math.sin(s.badgeAngle * Math.PI / 180);
        const dy = -Math.cos(s.badgeAngle * Math.PI / 180);
        const bx = s.cx + dx * 38;
        const by = s.cy + dy * 38;
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
  );

  return (
    <div className="min-h-screen bg-white flex flex-col select-none">
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-4">
        <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="w-7 h-7 rounded bg-[#4c7c0c] flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-gray-900 truncate">
            {match ? <><Flag team={match.home} /> {match.home} vs {match.away} <Flag team={match.away} /></> : 'Estadio'}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {match ? `${fd.day} ${fd.month} ${fd.weekday}  •  ${match.time || ''}  •  ${match.phase || ''}  •  ${LOCATION_STADIUM[match.location] || ''}` : ''}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-[65%] h-[50vh] md:h-[calc(100vh-57px)] relative bg-gray-100 overflow-hidden">
          <svg ref={svgRef} viewBox="0 0 800 480"
            className="w-full h-full"
            style={{ cursor: isDragging ? 'grabbing' : 'grab', display: 'block' }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {svgContent}
          </svg>
          <div className="absolute top-4 right-4 flex flex-col items-center bg-white rounded-xl shadow-md border border-gray-200 py-1.5 px-1 z-10">
            <button onClick={zoomIn} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-600 font-bold text-lg leading-none">+</button>
            <div className="w-5 h-px bg-gray-200 my-0.5" />
            <button onClick={zoomOut} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-600 font-bold text-lg leading-none">−</button>
            <div className="w-5 h-px bg-gray-200 my-0.5" />
            <button onClick={resetView} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-400" title="Restablecer">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
              </svg>
            </button>
          </div>
          {hoveredSection && tooltipPos && (
            <div className="absolute z-20 pointer-events-none" style={{ left: tooltipPos.x, top: tooltipPos.y, transform: 'translate(-50%, -100%)' }}>
              <div className="bg-gray-900 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">Buscar en esta zona</div>
              <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-gray-900 mx-auto" />
            </div>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <span className="text-[11px] text-gray-400 bg-white/90 px-4 py-1.5 rounded-full shadow-sm">
              {selectedSection ? `Mostrando solo Sección ${selectedSection.id}` : 'Haz clic en una sección verde para ver asientos disponibles'}
            </span>
          </div>
        </div>
        <div className="w-full md:w-[35%] border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
          <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
            <span className="font-bold text-gray-900">
              {selectedSection
                ? `Sección ${selectedSection.id}`
                : `${activeSections.length} secciones disponibles`
              }
            </span>
            {selectedSection && (
              <button onClick={() => onSelectSection(null)}
                className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                Mostrar todas
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3 max-h-[50vh] md:max-h-none">
            {(selectedSection ? activeSections.filter(s => s.id === selectedSection.id) : activeSections).length > 0
              ? (selectedSection ? activeSections.filter(s => s.id === selectedSection.id) : activeSections).map(s => (
              <div key={s.id} onClick={() => onSelectSection(s.id === selectedSection?.id ? null : s)}
                className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 hover:border-gray-300 hover:shadow-sm cursor-pointer">
                <div className="w-[80px] h-[60px] rounded-lg shrink-0 overflow-hidden bg-gradient-to-br from-gray-800 via-gray-600 to-gray-700 flex items-center justify-center relative">
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#1b5e20] to-transparent" />
                  <div className="absolute bottom-[30%] left-[15%] right-[15%] h-[2px] bg-white/30" />
                  <div className="relative text-white/60 text-[10px] font-bold">{s.id}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-gray-900">Sección {s.id}</div>
                  <div className="text-xs text-gray-500 mb-1.5">Nivel {s.tier}</div>
                  <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${s.asientos_disponibles > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-500'}`}>
                    {s.asientos_disponibles > 0 ? `Quedan ${s.asientos_disponibles}` : 'Agotado'}
                  </span>
                </div>
                <div className="text-right shrink-0 min-w-[70px]">
                  <div className="text-lg font-extrabold text-gray-900">{s.precio_base.toLocaleString()}$</div>
                  <div className="text-[10px] text-gray-400">c/u</div>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-gray-400 text-sm">
                {selectedSection ? 'Esta sección no tiene asientos disponibles' : 'No hay secciones disponibles'}
              </div>
            )}
            {selectedSection && activeSections.find(s => s.id === selectedSection.id) && (
              <button onClick={onCheckout}
                className="w-full py-3 rounded-xl bg-[#4c7c0c] hover:bg-[#3d6309] text-white font-bold text-sm transition-colors">
                Comprar — {qty} {qty === 1 ? 'entrada' : 'entradas'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}