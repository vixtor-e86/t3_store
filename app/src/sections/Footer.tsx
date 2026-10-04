import {
  BOOKING_EMAIL,
  BUSINESS_ADDRESS,
  BUSINESS_HOURS,
  PHONE_DISPLAY_2,
  PHONE_NUMBER_2,
  WHATSAPP_DISPLAY,
  buildWhatsAppLink,
} from '@/config'
import { Logo, WhatsAppIcon } from './Header'
export default function Footer() {
  return (
    <footer className="bg-t3navy-900 text-white" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="mx-auto max-w-7xl border-t border-white/10 px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Your neighbourhood superstore for drinks in packs and crates:
              wholesale prices, constant supply, quick delivery.
            </p>
            <p className="mt-4 font-script text-2xl text-white/50">Refreshing drinks, always.</p>
          </div>

          <div>
            <h4 className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-white/40">
              Explore
            </h4>
            <ul className="mt-4 space-y-1">
              {[
                ['Home', '#home'],
                ['Drinks', '#drinks'],
                ['Bulk Deals', '#bulk'],
                ['How It Works', '#how'],
                ['Book Now', '#book'],
                ['Store Admin (Prices)', '/admin'],
              ].map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="inline-flex min-h-[40px] items-center text-sm font-semibold text-white/70 transition-colors hover:text-t3red-100"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-white/40">
              Contact
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <a
                  href={buildWhatsAppLink('Hello T3 Superstore!')}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-[40px] items-center gap-2.5 transition-colors hover:text-white"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0 text-[#25D366]" />
                  <span>WhatsApp: {WHATSAPP_DISPLAY}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${PHONE_NUMBER_2}`}
                  className="flex min-h-[40px] items-center gap-2.5 transition-colors hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-t3red-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>Tel: {PHONE_DISPLAY_2}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BOOKING_EMAIL}`}
                  className="flex min-h-[40px] items-center gap-2.5 transition-colors hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-t3red-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 6L2 7" />
                  </svg>
                  <span>{BOOKING_EMAIL}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" className="mt-1 h-4 w-4 shrink-0 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{BUSINESS_ADDRESS}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" className="mt-1 h-4 w-4 shrink-0 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span>{BUSINESS_HOURS}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-white/40">
              Bookings
            </h4>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              All bookings are taken directly on WhatsApp or by call. No
              account needed. Tap any Book button and your order reaches us
              instantly.
            </p>
            <a
              href="#book"
              className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-t3red px-6 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
            >
              Start a booking
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} T3 Superstore. All rights reserved.</p>
          <p>Packs · Crates · More</p>
        </div>
      </div>
    </footer>
  )
}
