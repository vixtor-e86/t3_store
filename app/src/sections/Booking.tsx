import { useState } from 'react'
import {
  buildGmailLink,
  buildWhatsAppLink,
  formatNaira,
} from '@/config'
import { useDrinks, type DrinkItem } from '@/lib/drinksStore'
import { WhatsAppIcon } from './Header'

export default function Booking({ prefill }: { prefill: DrinkItem | null }) {
  const { drinks } = useDrinks()

  // Only show active, available drinks in the dropdown
  const availableDrinks = drinks.filter((d) => d.isAvailable !== false)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [productId, setProductId] = useState<string>('')
  const [qty, setQty] = useState(1)
  const [note, setNote] = useState('')

  // Determine selected product
  const activeProduct =
    availableDrinks.find((d) => d.id === (productId || prefill?.id)) ||
    availableDrinks[0]

  const unitPrice = activeProduct?.price || 0
  const total = unitPrice * Math.max(1, qty)

  // Message builder for WhatsApp and Email
  const messageLines = [
    `NEW BOOKING: T3 SUPERSTORE`,
    `==============================`,
    `• Customer Name: ${name.trim() || 'N/A'}`,
    `• Phone: ${phone.trim() || 'N/A'}`,
    `• Delivery Address: ${address.trim() || 'To be confirmed'}`,
    `------------------------------`,
    `ORDER DETAILS:`,
    `• Product: ${activeProduct ? `${activeProduct.name} (${activeProduct.size})` : 'Custom Order'}`,
    `• Quantity: ${qty} ${qty === 1 ? 'pack/crate' : 'packs/crates'}`,
    `• Unit Price: ${formatNaira(unitPrice)}`,
    `• Estimated Total: ${formatNaira(total)}`,
    note.trim() ? `• Notes / Instructions: ${note.trim()}` : null,
    `==============================`,
    `Please confirm drink availability and delivery time. Thank you!`,
  ].filter((l): l is string => l !== null)

  const message = messageLines.join('\n')
  const whatsappHref = buildWhatsAppLink(message)
  const gmailHref = buildGmailLink(
    `Drinks Order: ${name.trim() || 'New Booking'} (${formatNaira(total)})`,
    message
  )

  const inputCls =
    'w-full min-h-[48px] rounded-xl border border-t3navy/15 bg-white px-4 text-base text-t3navy outline-none transition-colors placeholder:text-t3navy/35 focus:border-t3red focus:ring-2 focus:ring-t3red/20'

  return (
    <section id="book" className="scroll-mt-24 bg-t3navy-900">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        {/* Copy */}
        <div className="text-white">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-t3red-100/70">
            Place a Booking
          </p>
          <h2 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            Tell us what you need.
            <span className="block text-t3red">We handle the rest.</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
            Pick your drink pack from our full catalog list, enter your delivery address, and place your order directly via WhatsApp or Gmail.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              'Direct distributor wholesale pricing',
              'Quick response and fast Abuja delivery',
              'Pay on delivery or by bank transfer',
            ].map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-white/80">
                <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-t3red" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {point}
              </li>
            ))}
          </ul>

          <p className="mt-8 font-script text-3xl text-white/60">
            Full packs, wholesale prices, zero stress.
          </p>
        </div>

        {/* Form */}
        <form
          className="rounded-3xl bg-white p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] sm:p-8"
          onSubmit={(e) => e.preventDefault()}
        >
          <h3 className="font-display text-xl font-extrabold text-t3navy">Direct Booking Form</h3>
          <p className="mt-1 text-sm text-t3navy/55">
            Choose to complete your booking on WhatsApp or send via Gmail.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Customer Name */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-t3navy">Your Name *</span>
              <input
                className={inputCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Okafor"
                autoComplete="name"
              />
            </label>

            {/* Phone Number */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-t3navy">Phone / WhatsApp *</span>
              <input
                className={inputCls}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0812 345 6789"
                inputMode="tel"
                autoComplete="tel"
              />
            </label>

            {/* Delivery Address */}
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-t3navy">Delivery Address *</span>
              <input
                className={inputCls}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. House 4, Lugbe Estate, Airport Road, Abuja"
              />
            </label>

            {/* Product Dropdown: Filled with all available catalog drinks */}
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-t3navy">Select Drink Pack *</span>
              <select
                className={inputCls}
                value={activeProduct?.id || ''}
                onChange={(e) => setProductId(e.target.value)}
              >
                {availableDrinks.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.size}) — {formatNaira(item.price)}
                  </option>
                ))}
              </select>
            </label>

            {/* Quantity */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-t3navy">Quantity (Packs / Crates)</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-t3navy/15 text-xl font-bold text-t3navy transition-colors hover:border-t3navy/40"
                >
                  −
                </button>
                <input
                  className={`${inputCls} text-center`}
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                />
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-t3navy/15 text-xl font-bold text-t3navy transition-colors hover:border-t3navy/40"
                >
                  +
                </button>
              </div>
            </label>

            {/* Estimated Total */}
            <div className="flex items-end">
              <div className="w-full rounded-xl bg-t3red-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-t3navy/50">
                  Estimated Total
                </p>
                <p className="font-display text-2xl font-black text-t3red">
                  {formatNaira(total)}
                </p>
              </div>
            </div>

            {/* Optional Note */}
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-t3navy">
                Special Delivery Notes <span className="font-normal text-t3navy/40">(optional)</span>
              </span>
              <textarea
                className={`${inputCls} min-h-[72px] resize-y py-2.5 text-sm`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Preferred delivery time, landmarks, or special requests…"
              />
            </label>
          </div>

          {/* Action Buttons: WhatsApp and Gmail */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 text-base font-bold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-95"
            >
              <WhatsAppIcon className="h-5 w-5" />
              <span>Book via WhatsApp</span>
            </a>
            <a
              href={gmailHref}
              className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-t3navy px-6 text-base font-bold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-t3red-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 6L2 7" />
              </svg>
              <span>Book via Gmail</span>
            </a>
          </div>
          <p className="mt-4 text-center text-xs text-t3navy/45">
            Opens WhatsApp or Gmail with your order summary pre-filled. Just tap send!
          </p>
        </form>
      </div>
    </section>
  )
}
