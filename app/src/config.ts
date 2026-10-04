// ─── T3 Superstore business configuration ───────────────────────────────────
// WHATSAPP_NUMBER: country code + number, digits only (no +, spaces or dashes).

export const WHATSAPP_NUMBER = '2348063817772'
export const WHATSAPP_DISPLAY = '08063817772'
export const PHONE_NUMBER_2 = '07086277334'
export const PHONE_DISPLAY_2 = '07086277334'
export const BOOKING_EMAIL = 't3superstore@gmail.com'
export const BUSINESS_ADDRESS =
  'Timber Market by Leisure Court Estate, Behind Aco Estate, Sabon Lugbe, Airport Road, Abuja.'
export const BUSINESS_HOURS = 'Mon - Sat : 8:00am - 8:00pm'

export type Product = {
  id: string
  name: string
  size: string
  price: number
  category: 'Soft Drinks' | 'Energy & Malt' | 'Water & Dairy'
  image: string
  tag?: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'cola-crate',
    name: 'Coca-Cola Glass Crate',
    size: '50cl Glass · Crate of 24',
    price: 12000,
    category: 'Soft Drinks',
    image: '/images/product-cola-crate.jpg',
    tag: 'Popular',
  },
  {
    id: 'cola-pet',
    name: 'Coca-Cola',
    size: '50cl PET · Pack of 12',
    price: 6500,
    category: 'Soft Drinks',
    image: '/images/product-cola-pet.jpg',
    tag: 'Bestseller',
  },
  {
    id: 'pepsi',
    name: 'Pepsi',
    size: '50cl PET · Pack of 12',
    price: 6200,
    category: 'Soft Drinks',
    image: '/images/product-blue-pet.jpg',
  },
  {
    id: 'fearless',
    name: 'Fearless Energy Drink',
    size: '500ml PET · Pack of 12',
    price: 6500,
    category: 'Energy & Malt',
    image: '/images/product-fearless.jpg',
  },
  {
    id: 'maltina-can',
    name: 'Maltina Classic',
    size: '33cl Can · Pack of 24',
    price: 14500,
    category: 'Energy & Malt',
    image: '/images/product-maltina-can.jpg',
    tag: 'Favorite',
  },
  {
    id: 'cway-water',
    name: 'CWAY Table Water',
    size: '75cl PET · Pack of 12',
    price: 2500,
    category: 'Water & Dairy',
    image: '/images/product-cway-water.jpg',
  },
  {
    id: 'nutri-milk',
    name: 'CWAY Nutri-Milk Apple',
    size: '500ml · Pack of 12',
    price: 7500,
    category: 'Water & Dairy',
    image: '/images/product-nutri-milk.jpg',
  },
  {
    id: 'cway-dispenser',
    name: 'CWAY Dispenser Water',
    size: '19 Litres · Refill Bottle',
    price: 1800,
    category: 'Water & Dairy',
    image: '/images/product-cway-dispenser.jpg',
  },
]

export const CATEGORIES = ['All', 'Soft Drinks', 'Energy & Malt', 'Water & Dairy'] as const

export const formatNaira = (n: number) => '₦' + n.toLocaleString('en-NG')

// ─── Booking link builders ──────────────────────────────────────────────────

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function buildGmailLink(subject: string, body: string) {
  return `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`
}

export function productBookingMessage(p: Product, qty = 1) {
  return [
    `Hello T3 Superstore! 👋`,
    ``,
    `I'd like to place a booking:`,
    `• Product: ${p.name} (${p.size})`,
    `• Quantity: ${qty}`,
    `• Unit price: ${formatNaira(p.price)}`,
    `• Total: ${formatNaira(p.price * qty)}`,
    ``,
    `Please confirm availability and delivery. Thank you!`,
  ].join('\n')
}
