const BRANDS = [
  { name: 'Coca-Cola', className: 'font-script text-[#E4002B]' },
  { name: 'Pepsi', className: 'font-display italic font-black text-[#0057B8]' },
  { name: 'Sprite', className: 'font-display italic font-extrabold text-[#008B47]' },
  { name: 'Fanta', className: 'font-display font-black text-[#F7941E]' },
  { name: '5 Alive', className: 'font-display font-bold text-[#F5C400]' },
  { name: 'Maltina', className: 'font-display font-extrabold text-[#7B3F00]' },
]

export default function Brands() {
  return (
    <section className="border-y border-t3navy/8 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.24em] text-t3navy/40">
          We stock all your favourites
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {BRANDS.map((b) => (
            <span
              key={b.name}
              className={`text-2xl opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:text-3xl ${b.className}`}
            >
              {b.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
