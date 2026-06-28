export default function WorldCupCard({ compact }) {
  return (
    <div className={`relative overflow-hidden rounded-xl ${compact ? 'w-full' : 'min-w-[260px] w-[260px]'} shrink-0`}>
      {/* Geometric green background */}
      <div className="h-48 bg-gradient-to-br from-[#4c7c0c] via-[#558414] to-[#3a6309] relative flex items-center justify-center">
        {/* Triangle pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 200" preserveAspectRatio="none">
          <polygon points="0,0 40,0 20,30" fill="white" />
          <polygon points="50,0 90,0 70,30" fill="white" />
          <polygon points="100,0 140,0 120,30" fill="white" />
          <polygon points="150,0 190,0 170,30" fill="white" />
          <polygon points="200,0 240,0 220,30" fill="white" />
          <polygon points="10,35 50,35 30,65" fill="white" />
          <polygon points="60,35 100,35 80,65" fill="white" />
          <polygon points="110,35 150,35 130,65" fill="white" />
          <polygon points="160,35 200,35 180,65" fill="white" />
          <polygon points="-20,70 20,70 0,100" fill="white" />
          <polygon points="30,70 70,70 50,100" fill="white" />
          <polygon points="80,70 120,70 100,100" fill="white" />
          <polygon points="130,70 170,70 150,100" fill="white" />
          <polygon points="180,70 220,70 200,100" fill="white" />
        </svg>
        {/* Trophy */}
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 text-yellow-400 mb-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-white font-extrabold text-lg tracking-widest">WORLD CUP</span>
        </div>
        {/* Heart icon */}
        <svg className="absolute top-3 right-3 w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      {/* Bottom band */}
      <div className="bg-black/70 text-white text-sm font-semibold py-3 px-4">
        Copa Mundial de Fútbol
      </div>
    </div>
  );
}
