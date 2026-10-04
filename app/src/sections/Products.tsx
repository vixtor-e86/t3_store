import { PRODUCTS, formatNaira } from '@/config'
import { useDrinks } from '@/lib/drinksStore'

type Props = {
  onOpenCatalog: () => void
}

export default function Products({ onOpenCatalog }: Props) {
  const { drinks } = useDrinks()

  return (
    <section id="drinks" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-t3red">
            Our Drinks
          </p>
          <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-t3navy sm:text-4xl">
            Packs &amp; crates, ready to book
          </h2>
          <p className="mt-1 text-sm text-t3navy/60">
            Wholesale and retail drink packs in stock for fast delivery across Abuja.
          </p>
        </div>

        {/* Action Button to open dynamic catalog modal */}
        <button
          type="button"
          onClick={onOpenCatalog}
          className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full bg-t3red px-6 py-2.5 text-sm font-bold text-white shadow-[0_10px_25px_-5px_rgba(228,0,43,0.5)] transition-all hover:scale-[1.03] active:scale-95 sm:self-end"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span>Check Out All Available Products</span>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </button>
      </div>

      {/* Hardcoded Showcase Grid: prices dynamically synced from the catalog list */}
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((p) => {
          const matched = drinks.find((d) => d.id === p.id)
          const livePrice = matched ? matched.price : p.price
          const isAvailable = matched ? matched.isAvailable : true

          return (
            <article
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-t3navy/8 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(14,31,61,0.3)]"
            >
              <div className="relative aspect-square overflow-hidden bg-[#F1EFEA]">
                <img
                  src={p.image}
                  alt={`${p.name} (${p.size})`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {!isAvailable && (
                  <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                    Sold Out
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-extrabold text-t3navy">{p.name}</h3>
                <p className="mt-0.5 text-sm text-t3navy/55">{p.size}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="font-display text-xl font-black text-t3red">
                    {formatNaira(livePrice)}
                  </p>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      isAvailable ? 'text-t3navy/40' : 'text-red-500'
                    }`}
                  >
                    {isAvailable ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Prominent Bottom Banner to open full catalog */}
      <div className="mt-10 rounded-3xl border border-t3navy/10 bg-gradient-to-r from-t3navy-900 to-t3navy p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-2xl sm:text-3xl font-black">
            Looking for more flavours or pack sizes?
          </h3>
          <p className="mt-1 text-sm text-white/70 max-w-xl">
            Browse our full wholesale list of soft drinks, crates, PET packs, water, and energy drinks with dynamic live pricing.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCatalog}
          className="shrink-0 inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-full bg-t3red px-8 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.03] active:scale-95"
        >
          <span>Check Out All Available Products</span>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-t3navy/50">
        Prices are per pack/crate and may change with market rates. We always
        confirm the final price on WhatsApp before delivery.
      </p>
    </section>
  )
}
