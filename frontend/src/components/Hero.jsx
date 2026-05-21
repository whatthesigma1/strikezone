export default function Hero() {
  return (
    <section className="min-h-screen grid grid-cols-1 md:grid-cols-2 pt-16 overflow-hidden relative">
      {/* Left */}
      <div className="flex flex-col justify-center px-10 md:px-20 py-20 relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#e8f216]/10 border border-[#e8f216]/30 px-3 py-1.5 mb-8 w-fit font-['Barlow_Condensed'] text-[11px] font-bold tracking-[0.2em] uppercase text-[#e8f216]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e8f216] animate-pulse" />
          Новый сезон 2025
        </div>

        {/* Title */}
        <h1 className="font-['Barlow_Condensed'] font-black uppercase text-white leading-[0.88] mb-8 text-[clamp(64px,7vw,108px)]">
          СНАРЯЖЕНИЕ<br />
          ДЛЯ<br />
          <span className="text-[#e8f216]">ПОБЕДЫ</span>
        </h1>

        <p className="text-[#6b7280] text-base leading-relaxed max-w-sm mb-12">
          Профессиональное пейнтбольное снаряжение от ведущих мировых брендов.
          Маркеры, маски, защита и аксессуары для любого уровня.
        </p>

        <div className="flex gap-4 items-center">
          <a
            href="#products"
            className="font-['Barlow_Condensed'] font-extrabold text-[15px] tracking-widest uppercase bg-[#e8f216] text-[#0a0a0a] px-9 py-3.5 hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(232,242,22,0.3)] transition-all"
            style={{ clipPath: 'polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)' }}
          >
            Смотреть товары
          </a>
          <a
            href="#categories"
            className="font-['Barlow_Condensed'] font-semibold text-[15px] tracking-widest uppercase border border-[#2a2d35] text-[#e8e8e8] px-8 py-3 hover:border-[#e8f216] hover:text-[#e8f216] transition-all"
          >
            Каталог
          </a>
        </div>

        {/* Stats */}
        <div className="flex gap-10 mt-14 pt-10 border-t border-[#2a2d35]">
          {[['500+', 'Товаров'], ['15K', 'Клиентов'], ['8 лет', 'На рынке']].map(([num, label]) => (
            <div key={label}>
              <div className="font-['Barlow_Condensed'] font-black text-[40px] text-[#e8f216] leading-none">{num}</div>
              <div className="text-[12px] text-[#6b7280] tracking-wider uppercase mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="hidden md:flex relative items-center justify-center overflow-hidden">
        {/* Pattern */}
        <div
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(232,242,22,0.015) 20px,rgba(232,242,22,0.015) 21px)',
          }}
        />
        {/* Glow */}
        <div
          className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle,rgba(232,242,22,0.12) 0%,transparent 70%)',
            top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          }}
        />
        {/* SVG Marker */}
        <div className="relative z-10 animate-[float_6s_ease-in-out_infinite]">
          <svg
            viewBox="0 0 400 400"
            className="w-[380px] max-w-[90%]"
            style={{ filter: 'drop-shadow(0 0 60px rgba(232,242,22,0.2))' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2a2d35" />
                <stop offset="100%" stopColor="#16181c" />
              </linearGradient>
              <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e8f216" />
                <stop offset="100%" stopColor="#c8d200" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <rect x="60" y="150" width="280" height="80" rx="12" fill="url(#bodyGrad)" stroke="#3a3d45" strokeWidth="1.5" />
            <rect x="280" y="165" width="100" height="28" rx="6" fill="#1a1c22" stroke="#3a3d45" strokeWidth="1.5" />
            <rect x="360" y="170" width="40" height="18" rx="3" fill="#111" stroke="#2a2d35" strokeWidth="1" />
            <ellipse cx="180" cy="138" rx="48" ry="52" fill="url(#bodyGrad)" stroke="#3a3d45" strokeWidth="1.5" />
            <ellipse cx="180" cy="135" rx="42" ry="44" fill="#0d0f14" />
            <line x1="152" y1="120" x2="208" y2="120" stroke="#e8f216" strokeWidth="1" opacity="0.4" />
            <rect x="130" y="200" width="60" height="90" rx="8" fill="url(#bodyGrad)" stroke="#3a3d45" strokeWidth="1.5" />
            <path d="M155 230 L165 230 L160 270 Z" fill="#e8f216" opacity="0.8" />
            <rect x="135" y="260" width="50" height="48" rx="10" fill="#1a1c22" stroke="#3a3d45" strokeWidth="1.5" />
            {[142,149,156,163,170,177].map((x) => (
              <line key={x} x1={x} y1="268" x2={x} y2="300" stroke="#2a2d35" strokeWidth="1" />
            ))}
            <rect x="80" y="170" width="180" height="8" rx="2" fill="url(#accentGrad)" opacity="0.8" />
            <circle cx="90" cy="230" r="22" fill="#1a1c22" stroke="#3a3d45" strokeWidth="1.5" />
            <circle cx="90" cy="230" r="14" fill="#111" stroke="#2a2d35" strokeWidth="1" />
            <circle cx="90" cy="230" r="6" fill="#e8f216" opacity="0.6" filter="url(#glow)" />
            <circle cx="50" cy="80" r="18" fill="#e8f216" opacity="0.9" filter="url(#glow)" />
            <circle cx="28" cy="100" r="12" fill="#ff3c2e" opacity="0.8" filter="url(#glow)" />
            <circle cx="350" cy="70" r="14" fill="#e8f216" opacity="0.5" filter="url(#glow)" />
          </svg>
        </div>
        {/* Diagonal stripe */}
        <div
          className="absolute bottom-0 left-[-40px] w-[120px] h-full bg-[#0a0a0a] z-20"
          style={{ clipPath: 'polygon(40px 0%,100% 0%,100% 100%,0% 100%)' }}
        />
      </div>
    </section>
  );
}
