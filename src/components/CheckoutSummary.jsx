import { useState } from 'react';
import { useMatches, formatDate, Flag } from '../data/MatchesContext';

export default function CheckoutSummary({ match, section, qty: initialQty, onBack, onProceed }) {
  const { TEAM_FLAGS, LOCATION_STADIUM } = useMatches();
  const [qty, setQty] = useState(initialQty || 1);
  const [slideIndex, setSlideIndex] = useState(0);

  const fd = match ? formatDate(match.date) : null;
  const total = section ? qty * section.precio_base : 0;

  const slides = match ? [
    `https://images.unsplash.com/photo-1574629810360-3ef6e6e7f500?w=800&h=500&fit=crop`,
    `https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=500&fit=crop`,
    `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop`,
  ] : [];

  if (!match || !section) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No se ha seleccionado ninguna sección.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-4 shrink-0">
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
            <Flag team={match.home} /> {match.home} vs {match.away} <Flag team={match.away} />
          </div>
          <div className="text-xs text-gray-500 truncate">
            {fd ? `${fd.day} ${fd.month} ${fd.weekday}` : ''} &bull; {match.time || ''} &bull; {LOCATION_STADIUM[match.location] || ''}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-[60%] overflow-y-auto p-4 md:p-6 space-y-6">
          <div className="relative rounded-2xl overflow-hidden bg-black">
            <img src={slides[slideIndex]} alt="Vista desde el estadio"
              className="w-full h-[200px] sm:h-[320px] object-cover" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, i) => (
                <button key={i} onClick={() => setSlideIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === slideIndex ? 'bg-white w-4' : 'bg-white/50'}`} />
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Sección {section.id}</h1>
            <p className="text-sm text-gray-500 mt-1">{qty} {qty === 1 ? 'entrada' : 'entradas'} &middot; Asientos juntos</p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold">
            Tiene una alta demanda
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0 mt-0.5">🔥</span>
              <div>
                <p className="text-sm font-bold text-gray-900">Popular</p>
                <p className="text-xs text-gray-500">Se ha vendido un total de 17 entradas en la última hora.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0 mt-0.5">👁️</span>
              <div>
                <p className="text-sm font-bold text-gray-900">Vista sin obstáculos</p>
                <p className="text-xs text-gray-500">Desde este sector tendrás una visión completa del campo.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0 mt-0.5">👥</span>
              <div>
                <p className="text-sm font-bold text-gray-900">Los asientos estarán juntos</p>
                <p className="text-xs text-gray-500">Todas las entradas de tu grupo estarán ubicadas en la misma fila.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[40%] border-t md:border-t-0 md:border-l border-gray-200 p-4 md:p-6 bg-white">
          <div className="sticky top-6 space-y-5">
            <h2 className="text-lg font-extrabold text-gray-900">Resumen de la compra</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Precio de la entrada:</span>
                <span>{qty} &times; {section.precio_base.toLocaleString()} US$</span>
              </div>
              <div className="flex justify-between text-2xl font-extrabold text-gray-900">
                <span>Precio total:</span>
                <span>{total.toLocaleString()} US$</span>
              </div>
              <button className="text-blue-600 text-xs font-medium hover:underline">Desglose de precios</button>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Cantidad</label>
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-white text-sm text-gray-800 appearance-none cursor-pointer focus:outline-none focus:border-blue-400">
                {[1, 2, 3, 4].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'entrada' : 'entradas'}</option>
                ))}
              </select>
            </div>

            <button onClick={() => onProceed(qty)}
              className="w-full py-3.5 rounded-xl bg-[#4c7c0c] hover:bg-[#3d6309] text-white font-bold text-base transition-colors">
              Confirmar cantidad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
