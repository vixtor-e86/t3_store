const PROMOS = [
  {
    id: 'bulk',
    bg: 'bg-gradient-to-br from-t3red via-[#C40024] to-[#8B0018]',
    eyebrow: 'Shops · Parties · Events',
    title: 'Special Bulk Prices',
    text: 'Buying by the crate? Talk to us. The more you book, the better the deal: wholesale reseller pricing available on every drink.',
    image: '/images/promo-bulk.jpg',
    alt: 'Crates of soft drinks stacked for bulk orders',
  },
  {
    id: 'supply',
    bg: 'bg-gradient-to-br from-t3blue via-[#004799] to-[#002F6C]',
    eyebrow: 'Retail · Wholesale',
    title: 'Quality Drinks. Reliable Supply.',
    text: 'Genuine factory stock, always sealed in full packs and crates. We keep the shelves full so your business never runs dry.',
    image: '/images/promo-delivery.jpg',
    alt: 'Beverage packs and crates ready for delivery',
  },
]

export default function Promos() {
  return (
    <section id="bulk" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 sm:py-14 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
        {PROMOS.map((p) => (
          <article
            key={p.id}
            className={`group relative overflow-hidden rounded-3xl ${p.bg} text-white shadow-lg`}
          >
            {/* Background Image: visible on both mobile and desktop */}
            <div className="absolute inset-0 sm:left-auto sm:right-0 sm:w-[46%] lg:w-[44%]">
              <img
                src={p.image}
                alt={p.alt}
                loading="lazy"
                className="h-full w-full object-cover object-center opacity-30 transition-transform duration-500 group-hover:scale-105 sm:opacity-90 sm:[mask-image:linear-gradient(to_right,transparent,black_40%)]"
              />
              {/* Mobile gradient to ensure 100% text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent sm:hidden" />
            </div>

            {/* Card Content */}
            <div className="relative z-10 flex min-h-[220px] sm:min-h-[260px] flex-col justify-center p-6 sm:p-10 lg:max-w-[62%]">
              <div>
                <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
                  {p.eyebrow}
                </span>
                <h3 className="mt-3 font-display text-2xl font-black leading-tight sm:text-4xl text-white">
                  {p.title}
                </h3>
                <p className="mt-2.5 sm:mt-4 max-w-sm text-sm leading-relaxed text-white/90 sm:text-base font-medium">
                  {p.text}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
