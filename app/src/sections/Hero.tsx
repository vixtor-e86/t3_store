type HeroProps = {
  onOpenCatalog: () => void
}

export default function Hero({ onOpenCatalog }: HeroProps) {
  return (
    <section id="home" className="relative isolate overflow-hidden bg-paper">
      {/* Background image & gradient overlay for both mobile and desktop */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/hero.jpg"
          alt="T3 Superstore beverage warehouse and wholesale crates"
          className="h-full w-full object-cover object-[70%_center] sm:object-[65%_center] contrast-[1.06] brightness-[1.02]"
          loading="eager"
        />
        {/* Responsive contrast gradient: subtle vertical wash on mobile, horizontal fade on desktop */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/94 via-white/82 to-paper/95 sm:bg-gradient-to-r sm:from-white/95 sm:via-white/55 sm:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-paper to-transparent" />
      </div>

      <div className="mx-auto flex min-h-[88svh] sm:min-h-[92svh] max-w-7xl flex-col justify-center px-4 pb-14 pt-24 sm:pb-24 sm:pt-32 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Badges container */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-t3red/20 bg-white/95 px-2.5 py-1 text-[9.5px] sm:text-xs font-bold uppercase tracking-[0.11em] sm:tracking-[0.18em] text-t3red backdrop-blur shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-t3red" />
              Strictly Packs · Crates · Wholesale Supply
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-4 sm:mt-5 font-display text-[2.2rem] leading-[1.08] sm:text-6xl lg:text-7xl font-black tracking-tight text-t3navy">
            T3 Superstore
            <span className="mt-1 sm:mt-2 block text-t3red">Packs, Crates &amp; More.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3.5 sm:mt-6 max-w-xl text-sm sm:text-lg leading-relaxed text-t3navy/85 font-medium">
            Your trusted wholesale supplier for soft drinks, malt, energy and water.
            Sold strictly in full packs and crates with direct distributor pricing and fast delivery across Abuja.
          </p>

          {/* Primary Action Button: Browse Drinks to open dynamic catalog modal */}
          <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onOpenCatalog}
              className="w-full sm:w-auto inline-flex min-h-[50px] sm:min-h-[54px] items-center justify-center gap-2.5 rounded-full bg-t3red px-8 text-sm sm:text-base font-bold text-white shadow-[0_12px_30px_-10px_rgba(228,0,43,0.6)] transition-all hover:scale-[1.03] active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Browse Drinks Catalog</span>
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </button>
          </div>

          <p className="mt-5 sm:mt-8 font-script text-xl sm:text-3xl text-t3navy/70">
            Genuine distributor stock. Sold strictly in full packs and crates.
          </p>
        </div>
      </div>
    </section>
  )
}
