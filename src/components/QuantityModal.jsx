import { useState } from 'react';

export default function QuantityModal({ isOpen, onClose, onContinue }) {
  const [qty, setQty] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 transform transition-all duration-300 scale-100">
        {/* Title */}
        <h2 className="text-xl font-extrabold text-gray-900 text-center mb-5">¿Cuántas entradas?</h2>

        {/* Select */}
        <div className="relative mb-5">
          <select
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-full px-4 py-3.5 rounded-xl border border-gray-300 bg-white text-base text-gray-800 appearance-none cursor-pointer focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n} className="py-2">
                {n} {n === 1 ? 'entrada' : 'entradas'}
              </option>
            ))}
          </select>
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Continue button */}
        <button
          onClick={() => onContinue(qty)}
          className="w-full py-3.5 rounded-xl bg-[#4c7c0c] hover:bg-[#3d6309] text-white font-bold text-base transition-colors"
        >
          Continuar
        </button>

        {/* Info box */}
        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-xs font-bold text-blue-700">i</span>
          </div>
          <p className="text-xs text-blue-800 leading-relaxed">
            Según el organizador del evento, cada hogar tiene un límite de 4 entradas. Al superar ese límite, tu pedido podría ser cancelado.
          </p>
        </div>
      </div>
    </div>
  );
}
