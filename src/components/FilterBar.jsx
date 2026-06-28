export default function FilterBar() {
  const filters = [
    { label: "Cheney", icon: true },
    { label: "Todas las fechas" },
    { label: "Todos los tipos" },
    { label: "Deportes" },
    { label: "Conciertos" },
    { label: "Teatro" },
  ];

  return (
    <div className="bg-gray-100 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex gap-3 overflow-x-auto">
        {filters.map((f, i) => (
          <button
            key={i}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full border border-gray-300 bg-white text-sm text-gray-700 whitespace-nowrap hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            {f.icon && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
