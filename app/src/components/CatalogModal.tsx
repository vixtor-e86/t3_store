import { useMemo, useState, useEffect } from 'react'
import { useDrinks, type DrinkItem } from '@/lib/drinksStore'
import {
  WHATSAPP_NUMBER,
  formatNaira,
} from '@/config'
import { WhatsAppIcon } from '@/sections/Header'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const CATEGORY_FILTERS = ['All Drinks', 'PET Bottles', 'Glass Bottles', 'Cans & Water'] as const

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

  // Filtered items (all active drinks in one place, NO brand filtering)
  const filteredItems = useMemo(() => {
    return drinks.filter((item) => {
      // If turned off in admin, do not show in catalog
      if (item.isAvailable === false) return false

      if (selectedCategory !== 'All Drinks' && item.category && item.category !== selectedCategory) {
        return false
      }
      if (search.trim()) {
        const query = search.toLowerCase()
        const matchesName = item.name.toLowerCase().includes(query)
        const matchesSize = item.size.toLowerCase().includes(query)
        if (!matchesName && !matchesSize) return false
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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-t3navy-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative flex h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-t3navy/10 bg-white px-5 py-4 sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-t3red font-display text-xs font-black text-white">
                  T3
                </span>
                <h2 id="modal-title" className="font-display text-xl font-black text-t3navy sm:text-2xl">
                  All Available Drinks &amp; Wholesale Booking
                </h2>
              </div>
              <p className="mt-1 text-xs text-t3navy/60 sm:text-sm">
                All drinks in one place. Choose your quantities and book directly on WhatsApp.
              </p>
            </div>
            <button
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-full bg-t3navy/5 text-t3navy transition-colors hover:bg-t3navy/15 hover:text-t3red"
              aria-label="Close catalog"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search bar & simple filter pills */}
          <div className="mt-4 flex flex-col gap-3">
            <div className="relative">
              <svg viewBox="0 0 24 24" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-t3navy/40" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search any drink (e.g. Coke, Chapman, Water, Malt, PET, Crate)..."
                className="w-full rounded-2xl border border-t3navy/15 bg-paper/60 py-2.5 pl-10 pr-4 text-sm text-t3navy placeholder:text-t3navy/40 focus:border-t3red focus:bg-white focus:outline-none focus:ring-2 focus:ring-t3red/20"
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

            {/* Simple container type filters (No brand filters) */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-t3navy/40 mr-1 hidden sm:inline">
                Show:
              </span>
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
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

        {/* Scrollable Products Grid (All drinks in one clean place) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FAF8F5]">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-lg font-bold text-t3navy/50">
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
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => {
                const qty = cart[item.id] ?? 0
                return (
                  <div
                    key={item.id}
                    className={`flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                      qty > 0
                        ? 'border-t3red/40 bg-t3red-50/20 shadow-sm'
                        : 'border-t3navy/10 bg-white hover:border-t3navy/25'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-display text-base font-extrabold text-t3navy">
                            {item.name}
                          </h4>
                          <p className="text-xs text-t3navy/55 font-medium mt-0.5">
                            {item.size}
                          </p>
                        </div>
                        <span className="shrink-0 font-display text-base font-black text-t3red">
                          {formatNaira(item.price)}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Selector / Add button */}
                    <div className="mt-4 flex items-center justify-between pt-2.5 border-t border-t3navy/5">
                      {qty === 0 ? (
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-t3navy/5 py-2 text-xs font-bold text-t3navy transition-all hover:bg-t3red hover:text-white"
                        >
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 5v14m-7-7h14" />
                          </svg>
                          <span>Add to Order</span>
                        </button>
                      ) : (
                        <div className="flex w-full items-center justify-between">
                          <span className="text-xs font-bold text-t3red">
                            {formatNaira(item.price * qty)}
                          </span>
                          <div className="flex items-center gap-1 bg-t3navy rounded-xl p-0.5 text-white">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="grid h-6 w-6 place-items-center rounded-lg hover:bg-white/20 transition-colors"
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
                              className="grid h-6 w-6 place-items-center rounded-lg hover:bg-white/20 transition-colors"
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

        {/* Sticky Bottom Order Bar */}
        <div className="border-t border-t3navy/10 bg-white p-4 sm:p-5 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.08)]">
          {/* Customer details toggle */}
          {totalCount > 0 && (
            <div className="mb-3">
              <button
                type="button"
                onClick={() => setShowDetails((v) => !v)}
                className="flex items-center gap-2 text-xs font-bold text-t3navy/70 hover:text-t3navy"
              >
                <span>{showDetails ? '▼ Hide Delivery Details' : '▶ Add Delivery Info (Optional)'}</span>
                {!showDetails && (customerName || customerAddress) && (
                  <span className="rounded bg-t3navy/10 px-1.5 py-0.5 text-[10px] text-t3navy">
                    Info entered
                  </span>
                )}
              </button>

              {showDetails && (
                <div className="mt-3 grid grid-cols-1 gap-2.5 rounded-2xl border border-t3navy/10 bg-paper/60 p-3 sm:grid-cols-4">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Name"
                    className="rounded-xl border border-t3navy/15 bg-white px-3 py-2 text-xs text-t3navy placeholder:text-t3navy/40 focus:outline-none focus:ring-1 focus:ring-t3red"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Phone number"
                    className="rounded-xl border border-t3navy/15 bg-white px-3 py-2 text-xs text-t3navy placeholder:text-t3navy/40 focus:outline-none focus:ring-1 focus:ring-t3red"
                  />
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Delivery address"
                    className="rounded-xl border border-t3navy/15 bg-white px-3 py-2 text-xs text-t3navy placeholder:text-t3navy/40 focus:outline-none focus:ring-1 focus:ring-t3red"
                  />
                  <input
                    type="text"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="Notes / instructions"
                    className="rounded-xl border border-t3navy/15 bg-white px-3 py-2 text-xs text-t3navy placeholder:text-t3navy/40 focus:outline-none focus:ring-1 focus:ring-t3red"
                  />
                </div>
              )}
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between sm:justify-start sm:gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-t3navy/50">
                  Total Order ({totalCount} {totalCount === 1 ? 'item' : 'items'})
                </p>
                <p className="font-display text-2xl font-black text-t3navy sm:text-3xl">
                  {formatNaira(totalPrice)}
                </p>
              </div>

              {totalCount > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-semibold text-t3navy/50 underline hover:text-t3red"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="hidden sm:inline-flex min-h-[48px] items-center justify-center rounded-full border border-t3navy/15 px-5 text-sm font-bold text-t3navy transition-colors hover:bg-t3navy/5"
              >
                Back to Store
              </button>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                disabled={totalCount === 0}
                className={`flex flex-1 sm:flex-none min-h-[48px] items-center justify-center gap-2 rounded-full px-7 text-sm font-bold text-white transition-all shadow-md ${
                  totalCount > 0
                    ? 'bg-[#25D366] hover:bg-[#20ba5a] active:scale-95'
                    : 'bg-t3navy/30 cursor-not-allowed'
                }`}
              >
                <WhatsAppIcon className="h-5 w-5" />
                <span>
                  {totalCount > 0
                    ? `Send Order on WhatsApp (${formatNaira(totalPrice)})`
                    : 'Select Drinks to Order'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
