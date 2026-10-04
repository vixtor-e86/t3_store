type HeroProps = {
  onOpenCatalog: () => void
}

export default function Hero({ onOpenCatalog }: HeroProps) {
  return (
    <section id="home" className="relative isolate overflow-hidden">
      {/* Background image - Clear and vibrant */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/hero.jpg"
          alt="T3 Superstore beverage warehouse and wholesale crates"
          className="h-full w-full object-cover object-[65%_center] contrast-[1.06] brightness-[1.02]"
          loading="eager"
        />
        {/* Soft readability overlay: allows the background crates & drinks to be clearly seen */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/45 to-transparent sm:from-white/75 sm:via-white/25 sm:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-paper to-transparent" />
      </div>

      <div className="mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-center px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-t3red/20 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-t3red backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-t3red" />
            Strictly Packs · Crates · Wholesale Supply
          </span>

          <h1 className="mt-6 font-display text-[2.75rem] font-black leading-[0.95] tracking-tight text-t3navy sm:text-6xl lg:text-7xl">
            T3 Superstore
            <span className="mt-2 block text-t3red">Packs, Crates &amp; More.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-t3navy/70 sm:text-lg">
            Your trusted wholesale supplier for soft drinks, malt, energy and water.
            Sold strictly in full packs and crates with direct distributor pricing and fast delivery across Abuja.
          </p>

          {/* Primary Action Button: Browse Drinks to open dynamic catalog modal */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onOpenCatalog}
              className="inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full bg-t3red px-8 text-base font-bold text-white shadow-[0_12px_30px_-10px_rgba(228,0,43,0.6)] transition-all hover:scale-[1.03] active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Browse Drinks Catalog</span>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </button>
          </div>

          <p className="mt-8 font-script text-2xl text-t3navy/60 sm:text-3xl">
            Genuine distributor stock. Sold strictly in full packs and crates.
          </p>
        </div>
      </div>
    </section>
  )
}
