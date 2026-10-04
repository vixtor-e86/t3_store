const ITEMS = [
  'Packs & Crates Only',
  'Wholesale & Bulk Prices',
  'Same-Day Delivery Abuja',
  'Parties & Events Covered',
  'Direct Distributor Supply',
  'Strictly Full Packs',
]

export default function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center whitespace-nowrap">
          <span className="px-6 font-display text-sm font-extrabold uppercase tracking-[0.2em] text-white sm:text-base">
            {item}
          </span>
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white/70" aria-hidden="true">
            <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
          </svg>
        </span>
      ))}
    </div>
  )

  return (
    <div className="relative overflow-hidden bg-t3red py-3.5" aria-hidden="true">
      <div className="flex w-max animate-marquee">
        {row}
        {row}
      </div>
    </div>
  )
}
