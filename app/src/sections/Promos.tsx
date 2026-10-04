const PROMOS = [
  {
    id: 'bulk',
    bg: 'bg-t3red',
    eyebrow: 'Shops · Parties · Events',
    title: 'Special Bulk Prices',
    text: 'Buying by the crate? Talk to us. The more you book, the better the deal: wholesale reseller pricing available on every drink.',
    image: '/images/promo-bulk.jpg',
    alt: 'Crates of soft drinks stacked for bulk orders',
  },
  {
    id: 'supply',
    bg: 'bg-t3blue',
    eyebrow: 'Retail · Wholesale',
    title: 'Quality Drinks. Reliable Supply.',
    text: 'Genuine factory stock, always sealed in full packs and crates. We keep the shelves full so your business never runs dry.',
    image: '/images/promo-delivery.jpg',
    alt: 'Beverage packs and crates ready for delivery',
  },
]

export default function Promos() {
  return (
    <section id="bulk" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {PROMOS.map((p) => (
          <article
            key={p.id}
            className={`group relative overflow-hidden rounded-3xl ${p.bg} text-white`}
          >
            <div className="relative z-10 flex h-full flex-col justify-center p-8 sm:p-10 lg:max-w-[62%]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">
                  {p.eyebrow}
                </p>
                <h3 className="mt-3 font-display text-3xl font-black leading-tight sm:text-4xl">
                  {p.title}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/85 sm:text-base">
                  {p.text}
                </p>
              </div>
            </div>
            <img
              src={p.image}
              alt={p.alt}
              loading="lazy"
              className="absolute inset-y-0 right-0 hidden h-full w-[46%] object-cover [mask-image:linear-gradient(to_right,transparent,black_35%)] sm:block lg:w-[42%]"
            />
          </article>
        ))}
      </div>
    </section>
  )
}
