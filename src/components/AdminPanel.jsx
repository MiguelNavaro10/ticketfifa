import { useStadium } from '../data/StadiumContext';

export default function AdminPanel({ onBack }) {
  const { sections, updateSection, regenerate8020 } = useStadium();

  const total = sections.length;
  const active = sections.filter(s => s.esta_activa).length;
  const pct = Math.round((active / total) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-extrabold text-gray-900">Administración del Estadio</h1>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Panel de control</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Disponibilidad:</span>
            <span className={`font-bold ${pct >= 80 ? 'text-green-600' : 'text-amber-600'}`}>{active}/{total} ({pct}%)</span>
          </div>
          <button
            onClick={regenerate8020}
            className="px-4 py-2 bg-[#4c7c0c] hover:bg-[#3d6309] text-white text-sm font-bold rounded-lg transition-colors"
          >
            Generar 80/20
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-6 py-4">
        {[100, 200, 300].map(level => {
          const secs = sections.filter(s => s.level === level);
          const act = secs.filter(s => s.esta_activa).length;
          return (
            <div key={level} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-xs text-gray-400 font-medium uppercase">Nivel {level}</div>
              <div className="text-2xl font-extrabold text-gray-900 mt-1">{act}/{secs.length}</div>
              <div className="text-xs text-gray-500">secciones activas</div>
              <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-[#A3E635] h-1.5 rounded-full transition-all" style={{ width: `${(act/secs.length)*100}%` }} />
              </div>
            </div>
          );
        })}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs text-gray-400 font-medium uppercase">Total secciones</div>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">{total}</div>
          <div className="text-xs text-gray-500">secciones configuradas</div>
        </div>
      </div>

      {/* Section table */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Sección</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nivel</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Categoría</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Precio Base ($)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Capacidad</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Disponibles</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Activa</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Destacado</th>
                </tr>
              </thead>
              <tbody>
                {sections.map(s => (
                  <tr key={s.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${!s.esta_activa ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3 font-bold text-gray-800">{s.id}</td>
                    <td className="px-4 py-3 text-gray-600">{s.level}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600">
                        {s.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={s.precio_base}
                        onChange={(e) => updateSection(s.id, { precio_base: Math.max(0, Number(e.target.value)) })}
                        className="w-20 px-2 py-1 border border-gray-200 rounded text-sm text-gray-800 focus:outline-none focus:border-blue-400"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-600">{s.capacidad_total}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={s.asientos_disponibles}
                        onChange={(e) => updateSection(s.id, { asientos_disponibles: Math.max(0, Number(e.target.value)) })}
                        className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-gray-800 focus:outline-none focus:border-blue-400"
                        disabled={!s.esta_activa}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={s.esta_activa}
                          onChange={(e) => updateSection(s.id, {
                            esta_activa: e.target.checked,
                            asientos_disponibles: e.target.checked ? Math.max(1, s.asientos_disponibles || 1) : 0,
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4c7c0c]"></div>
                      </label>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={s.icono_destacado}
                        onChange={(e) => updateSection(s.id, { icono_destacado: e.target.value })}
                        className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-700 focus:outline-none focus:border-blue-400"
                      >
                        <option value="none">Ninguno</option>
                        <option value="fire">🔥 Fuego</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-400 text-center">
          Los cambios se reflejan automáticamente en el mapa del estadio.
        </div>
      </div>
    </div>
  );
}
