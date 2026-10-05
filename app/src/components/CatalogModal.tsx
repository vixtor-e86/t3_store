import { useMemo, useState, useEffect } from 'react'
import { useDrinks, itemMatchesCategory, type DrinkItem } from '@/lib/drinksStore'
import {
  WHATSAPP_NUMBER,
  formatNaira,
} from '@/config'
import { WhatsAppIcon } from '@/sections/Header'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const CATEGORY_FILTERS = [
  'All Drinks',
  'PET Bottles',
  'Glass Bottles',
  'Cans',
  'Table Water',
] as const

export default function CatalogModal({ isOpen, onClose }: Props) {
  const { drinks } = useDrinks()

  const [selectedCategory, setSelectedCategory] = useState<string>('All Drinks')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<Record<string, number>>({})

  // Customer info for booking
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [customerNote, setCustomerNote] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Filtered items with intelligent keyword-based category matching and multi-token search
  const filteredItems = useMemo(() => {
    return drinks.filter((item) => {
      // If turned off in admin, do not show in catalog
      if (item.isAvailable === false) return false

      // Intelligent keyword-based category matching
      if (!itemMatchesCategory(item, selectedCategory)) {
        return false
      }

      // Multi-word search across name, size and category
      if (search.trim()) {
        const queryTokens = search.toLowerCase().trim().split(/\s+/)
        const fullItemText = `${item.name} ${item.size} ${item.category || ''}`.toLowerCase()
        const matchesAll = queryTokens.every((token) => fullItemText.includes(token))
        if (!matchesAll) return false
      }

      return true
    })
  }, [drinks, selectedCategory, search])

  // Calculations
  const { totalCount, totalPrice, selectedItemsList } = useMemo(() => {
    let count = 0
    let price = 0
    const list: { item: DrinkItem; qty: number; lineTotal: number }[] = []

    for (const item of drinks) {
      const qty = cart[item.id] ?? 0
      if (qty > 0) {
        count += qty
        const lineTotal = item.price * qty
        price += lineTotal
        list.push({ item, qty, lineTotal })
      }
    }
    return { totalCount: count, totalPrice: price, selectedItemsList: list }
  }, [drinks, cart])

  // Cart operations
  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] ?? 0
      const next = current + delta
      if (next <= 0) {
        const copy = { ...prev }
        delete copy[id]
        return copy
      }
      return { ...prev, [id]: next }
    })
  }

  const setExactQty = (id: string, val: number) => {
    setCart((prev) => {
      if (val <= 0) {
        const copy = { ...prev }
        delete copy[id]
        return copy
      }
      return { ...prev, [id]: val }
    })
  }

  const clearCart = () => setCart({})

  // Format WhatsApp message
  const handleSendWhatsApp = () => {
    if (selectedItemsList.length === 0) return

    const lines: string[] = []
    lines.push('NEW BOOKING: T3 SUPERSTORE')
    lines.push('==============================')
    if (customerName.trim()) lines.push(`Name: ${customerName.trim()}`)
    if (customerPhone.trim()) lines.push(`Phone: ${customerPhone.trim()}`)
    if (customerAddress.trim()) lines.push(`Delivery Address: ${customerAddress.trim()}`)
    if (customerNote.trim()) lines.push(`Note: ${customerNote.trim()}`)
    if (customerName || customerPhone || customerAddress || customerNote) {
      lines.push('------------------------------')
    }
    lines.push('ORDER ITEMS:')
    for (const { item, qty, lineTotal } of selectedItemsList) {
      lines.push(`• ${qty}x ${item.name} (${item.size}) : ${formatNaira(lineTotal)}`)
    }
    lines.push('==============================')
    lines.push(`TOTAL ESTIMATED: ${formatNaira(totalPrice)}`)
    lines.push(`TOTAL QUANTITY: ${totalCount} ${totalCount === 1 ? 'pack/crate' : 'packs/crates'}`)
    lines.push('==============================')
    lines.push('Please confirm availability and delivery time. Thank you!')

    const message = lines.join('\n')
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-t3navy-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container: Fullscreen on mobile, rounded modal on tablet/desktop */}
      <div className="relative flex h-[100dvh] sm:h-[92vh] w-full max-w-5xl flex-col overflow-hidden sm:rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-t3navy/10 bg-white px-4 py-3 sm:px-8 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 sm:h-7 sm:w-7 shrink-0 place-items-center rounded-lg bg-t3red font-display text-[11px] sm:text-xs font-black text-white">
                  T3
                </span>
                <h2 id="modal-title" className="truncate font-display text-lg sm:text-2xl font-black text-t3navy">
                  All Drinks Catalog &amp; Order
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-t3navy/60 hidden sm:block">
                Pick drinks, set quantities, and send directly to our WhatsApp.
              </p>
            </div>
            <button
              onClick={onClose}
              className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-full bg-t3navy/5 text-t3navy transition-colors hover:bg-t3navy/15 hover:text-t3red"
              aria-label="Close catalog"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search bar & simple filter pills */}
          <div className="mt-3 flex flex-col gap-2.5">
            <div className="relative">
              <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-t3navy/40" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search any drink (e.g. Coke, Water, 50cl)..."
                className="w-full rounded-2xl border border-t3navy/15 bg-paper/60 py-2 sm:py-2.5 pl-9 sm:pl-10 pr-4 text-xs sm:text-sm text-t3navy placeholder:text-t3navy/40 focus:border-t3red focus:bg-white focus:outline-none focus:ring-2 focus:ring-t3red/20"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-t3navy/40 hover:text-t3navy"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Container type filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] sm:text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-t3navy text-white shadow-sm'
                      : 'bg-t3navy/5 text-t3navy/70 hover:bg-t3navy/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Products Grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 bg-[#FAF8F5]">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-base sm:text-lg font-bold text-t3navy/50">
                No drinks found matching your search.
              </p>
              <button
                onClick={() => {
                  setSearch('')
                  setSelectedCategory('All Drinks')
                }}
                className="mt-3 rounded-full bg-t3navy px-4 py-2 text-xs font-bold text-white hover:bg-t3red"
              >
                Show all drinks
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 sm:gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => {
                const qty = cart[item.id] ?? 0
                return (
                  <div
                    key={item.id}
                    className={`flex flex-col justify-between rounded-2xl border p-3.5 sm:p-4 transition-all ${
                      qty > 0
                        ? 'border-t3red/40 bg-t3red-50/25 shadow-sm'
                        : 'border-t3navy/10 bg-white hover:border-t3navy/25'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-display text-sm sm:text-base font-extrabold text-t3navy leading-tight">
                            {item.name}
                          </h4>
                          <p className="text-[11px] sm:text-xs text-t3navy/55 font-medium mt-0.5">
                            {item.size}
                          </p>
                        </div>
                        <span className="shrink-0 font-display text-base sm:text-lg font-black text-t3red">
                          {formatNaira(item.price)}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Selector / Add button */}
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-t3navy/5">
                      {qty === 0 ? (
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="flex w-full min-h-[38px] items-center justify-center gap-1.5 rounded-xl bg-t3navy/5 py-1.5 text-xs font-bold text-t3navy transition-all hover:bg-t3red hover:text-white active:scale-95"
                        >
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 5v14m-7-7h14" />
                          </svg>
                          <span>Add to Order</span>
                        </button>
                      ) : (
                        <div className="flex w-full items-center justify-between">
                          <span className="text-xs font-black text-t3red">
                            {formatNaira(item.price * qty)}
                          </span>
                          <div className="flex items-center gap-1 bg-t3navy rounded-xl p-0.5 text-white">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="grid h-7 w-7 place-items-center rounded-lg hover:bg-white/20 active:scale-95 transition-all text-sm font-bold"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={qty}
                              onChange={(e) => setExactQty(item.id, parseInt(e.target.value) || 0)}
                              className="w-8 bg-transparent text-center text-xs font-black text-white focus:outline-none"
                            />
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="grid h-7 w-7 place-items-center rounded-lg hover:bg-white/20 active:scale-95 transition-all text-sm font-bold"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Sticky Bottom Order Bar (Optimized for Mobile with Safe Area Padding) */}
        <div className="border-t border-t3navy/10 bg-white p-3 sm:p-5 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.08)] pb-[max(12px,env(safe-area-inset-bottom))]">
          {/* Customer details toggle */}
          {totalCount > 0 && (
            <div className="mb-2.5">
              <button
                type="button"
                onClick={() => setShowDetails((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-bold text-t3navy/70 hover:text-t3navy"
              >
                <span>{showDetails ? '▼ Hide Delivery Details' : '▶ Add Name & Address (Optional)'}</span>
                {!showDetails && (customerName || customerAddress) && (
                  <span className="rounded bg-t3navy/10 px-1.5 py-0.5 text-[10px] text-t3navy font-bold">
                    ✓ Info entered
                  </span>
                )}
              </button>

              {showDetails && (
                <div className="mt-2 grid grid-cols-1 gap-2 rounded-2xl border border-t3navy/10 bg-paper/60 p-2.5 sm:grid-cols-4">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Name"
                    className="rounded-xl border border-t3navy/15 bg-white px-3 py-1.5 text-xs text-t3navy placeholder:text-t3navy/40 focus:outline-none focus:ring-1 focus:ring-t3red"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Phone number"
                    className="rounded-xl border border-t3navy/15 bg-white px-3 py-1.5 text-xs text-t3navy placeholder:text-t3navy/40 focus:outline-none focus:ring-1 focus:ring-t3red"
                  />
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Delivery address in Abuja"
                    className="rounded-xl border border-t3navy/15 bg-white px-3 py-1.5 text-xs text-t3navy placeholder:text-t3navy/40 focus:outline-none focus:ring-1 focus:ring-t3red"
                  />
                  <input
                    type="text"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="Note / instructions (optional)"
                    className="rounded-xl border border-t3navy/15 bg-white px-3 py-1.5 text-xs text-t3navy placeholder:text-t3navy/40 focus:outline-none focus:ring-1 focus:ring-t3red"
                  />
                </div>
              )}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[10px] sm:text-xs font-bold uppercase tracking-wider text-t3navy/50">
                Total ({totalCount} {totalCount === 1 ? 'pack' : 'packs'})
              </p>
              <div className="flex items-baseline gap-2">
                <p className="font-display text-xl sm:text-2xl font-black text-t3navy">
                  {formatNaira(totalPrice)}
                </p>
                {totalCount > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-[11px] font-semibold text-t3navy/40 underline hover:text-t3red"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="hidden sm:inline-flex min-h-[44px] items-center justify-center rounded-full border border-t3navy/15 px-4 text-xs font-bold text-t3navy transition-colors hover:bg-t3navy/5"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                disabled={totalCount === 0}
                className={`flex min-h-[44px] sm:min-h-[48px] items-center justify-center gap-2 rounded-full px-5 sm:px-7 text-xs sm:text-sm font-bold text-white transition-all shadow-md ${
                  totalCount > 0
                    ? 'bg-[#25D366] hover:bg-[#20ba5a] active:scale-95'
                    : 'bg-t3navy/30 cursor-not-allowed'
                }`}
              >
                <WhatsAppIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>
                  {totalCount > 0
                    ? `Send Order (${formatNaira(totalPrice)})`
                    : 'Pick Drinks to Order'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
