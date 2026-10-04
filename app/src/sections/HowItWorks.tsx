const STEPS = [
  {
    n: '01',
    title: 'Pick your packs',
    text: 'Browse the packs and crates above and choose what you need: any brand, any mix.',
  },
  {
    n: '02',
    title: 'Book in one tap',
    text: 'Send your booking straight to our WhatsApp or Gmail. We reply fast to confirm price and availability.',
  },
  {
    n: '03',
    title: 'We deliver',
    text: 'Full packs and crates delivered straight to your door, shop or event venue, same day within Abuja.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.24em] text-t3red">
          How It Works
        </p>
        <h2 className="mt-2 text-center font-display text-3xl font-black tracking-tight text-t3navy sm:text-4xl">
          Booking takes less than a minute
        </h2>

        <div className="relative mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* connector line (desktop) */}
          <div className="absolute left-[16%] right-[16%] top-8 hidden border-t-2 border-dashed border-t3navy/15 sm:block" aria-hidden="true" />
          {STEPS.map((s) => (
            <div key={s.n} className="relative text-center">
              <div className="relative z-10 mx-auto grid h-16 w-16 place-items-center rounded-full bg-t3navy font-display text-lg font-black text-white ring-8 ring-white">
                {s.n}
              </div>
              <h3 className="mt-5 font-display text-xl font-extrabold text-t3navy">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-t3navy/60">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
