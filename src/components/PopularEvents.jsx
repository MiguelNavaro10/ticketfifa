import WorldCupCard from './WorldCupCard';

export default function PopularEvents({ onSelectWorldCup }) {
  const events = [
    { title: "Concierto Rock Fest", subtitle: "Estadio Nacional", bg: "bg-gradient-to-br from-purple-500 to-pink-500" },
    { title: "Final Champions League", subtitle: "Wembley Stadium", bg: "bg-gradient-to-br from-blue-600 to-indigo-700" },
    { title: "Concierto Pop Star", subtitle: "Madison Square Garden", bg: "bg-gradient-to-br from-orange-400 to-red-500" },
    { title: "Super Bowl LVIII", subtitle: "Allegiant Stadium", bg: "bg-gradient-to-br from-yellow-500 to-orange-600" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Eventos Populares</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
        {/* World Cup Card */}
        <div className="cursor-pointer" onClick={onSelectWorldCup}><WorldCupCard /></div>

        {/* Regular event cards */}
        {events.map((ev, i) => (
          <div key={i} className="min-w-[200px] w-[200px] shrink-0 rounded-xl overflow-hidden shadow-sm">
            <div className={`h-32 ${ev.bg} flex items-center justify-center relative`}>
              <span className="text-white font-bold text-center px-2 text-sm">{ev.title}</span>
              <svg className="absolute top-3 right-3 w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="bg-white p-3 border border-t-0 border-gray-200 rounded-b-xl">
              <p className="font-semibold text-sm text-gray-800">{ev.title}</p>
              <p className="text-xs text-gray-500">{ev.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
