import { useEffect, useState } from 'react'

const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'Drinks', href: '#drinks' },
  { label: 'Bulk Deals', href: '#bulk' },
  { label: 'How It Works', href: '#how' },
  { label: 'Book Now', href: '#book' },
]

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#home" className="flex items-center gap-2.5" aria-label="T3 Superstore home">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-t3red font-display text-lg font-black tracking-tight text-white shadow-sm">
        T3
      </span>
      <span
        className={`font-display text-xl font-extrabold tracking-tight ${
          dark ? 'text-white' : 'text-t3navy'
        }`}
      >
        Superstore
      </span>
    </a>
  )
}

type HeaderProps = {
  onOpenCatalog?: () => void
}

export default function Header({ onOpenCatalog }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 shadow-[0_1px_0_0_rgba(14,31,61,0.08),0_8px_24px_-12px_rgba(14,31,61,0.25)] backdrop-blur'
          : 'bg-white/80 backdrop-blur'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-t3navy/70 transition-colors hover:bg-t3red-50 hover:text-t3red"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {onOpenCatalog ? (
            <button
              type="button"
              onClick={onOpenCatalog}
              className="hidden min-h-[44px] items-center gap-2 rounded-full bg-t3red px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.03] active:scale-95 sm:inline-flex"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Browse Drinks</span>
            </button>
          ) : (
            <a
              href="#drinks"
              className="hidden min-h-[44px] items-center gap-2 rounded-full bg-t3red px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.03] active:scale-95 sm:inline-flex"
            >
              <span>Browse Drinks</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-11 w-11 place-items-center rounded-full text-t3navy transition-colors hover:bg-t3navy/5 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h10" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-t3navy/5 bg-white transition-[max-height] duration-300 lg:hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <nav className="flex flex-col px-4 py-3" aria-label="Mobile">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex min-h-[48px] items-center rounded-xl px-4 text-base font-semibold text-t3navy transition-colors hover:bg-t3red-50 hover:text-t3red"
            >
              {item.label}
            </a>
          ))}
          {onOpenCatalog ? (
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onOpenCatalog()
              }}
              className="mt-2 flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-t3red px-4 text-base font-bold text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Browse Drinks</span>
            </button>
          ) : (
            <a
              href="#drinks"
              onClick={() => setOpen(false)}
              className="mt-2 flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-t3red px-4 text-base font-bold text-white"
            >
              <span>Browse Drinks</span>
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}

export function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}
