export type CatalogItem = {
  id: string
  name: string
  brand: 'Coca-Cola' | 'Pepsi (Seven-Up)' | 'Water & Energy'
  category: '50cl Glass Bottle' | '50cl PET' | '35cl PET' | 'Cans & Special'
  pack: 'Crate of 12' | 'Pack of 12' | 'Crate of 24' | 'Pack of 24' | 'Refill Bottle'
  price: number
}

export const FULL_CATALOG: CatalogItem[] = [
  // ─────────────────────────────────────────────────────────────
  // Coca-Cola · 50cl Glass Bottle (Crate of 12)
  // ─────────────────────────────────────────────────────────────
  { id: 'coke-glass-50', name: 'Coca-Cola', brand: 'Coca-Cola', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 4800 },
  { id: 'fanta-orange-glass-50', name: 'Fanta Orange', brand: 'Coca-Cola', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 4500 },
  { id: 'fanta-lemon-glass-50', name: 'Fanta Lemon', brand: 'Coca-Cola', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 4500 },
  { id: 'fanta-pineapple-glass-50', name: 'Fanta Pineapple', brand: 'Coca-Cola', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 4500 },
  { id: 'sprite-glass-50', name: 'Sprite', brand: 'Coca-Cola', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 4500 },
  { id: 'schweppes-chapman-glass-50', name: 'Schweppes Chapman', brand: 'Coca-Cola', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 5200 },
  { id: 'schweppes-tonic-glass-50', name: 'Schweppes Tonic Water', brand: 'Coca-Cola', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 5200 },
  { id: 'schweppes-soda-glass-50', name: 'Schweppes Soda Water', brand: 'Coca-Cola', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 5000 },
  { id: 'schweppes-ginger-glass-50', name: 'Schweppes Ginger Ale', brand: 'Coca-Cola', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 5200 },
  { id: 'krest-bitter-lemon-glass-50', name: 'Krest Bitter Lemon', brand: 'Coca-Cola', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 4800 },

  // ─────────────────────────────────────────────────────────────
  // Coca-Cola · 50cl PET (Pack of 12)
  // ─────────────────────────────────────────────────────────────
  { id: 'coke-pet-50', name: 'Coca-Cola', brand: 'Coca-Cola', category: '50cl PET', pack: 'Pack of 12', price: 6000 },
  { id: 'coke-zero-pet-50', name: 'Coca-Cola Zero Sugar', brand: 'Coca-Cola', category: '50cl PET', pack: 'Pack of 12', price: 6000 },
  { id: 'fanta-orange-pet-50', name: 'Fanta Orange', brand: 'Coca-Cola', category: '50cl PET', pack: 'Pack of 12', price: 5800 },
  { id: 'fanta-lemon-pet-50', name: 'Fanta Lemon', brand: 'Coca-Cola', category: '50cl PET', pack: 'Pack of 12', price: 5800 },
  { id: 'fanta-pineapple-pet-50', name: 'Fanta Pineapple', brand: 'Coca-Cola', category: '50cl PET', pack: 'Pack of 12', price: 5800 },
  { id: 'sprite-pet-50', name: 'Sprite', brand: 'Coca-Cola', category: '50cl PET', pack: 'Pack of 12', price: 5800 },
  { id: 'schweppes-chapman-pet-50', name: 'Schweppes Chapman', brand: 'Coca-Cola', category: '50cl PET', pack: 'Pack of 12', price: 6500 },

  // ─────────────────────────────────────────────────────────────
  // Coca-Cola · 35cl PET (Pack of 12)
  // ─────────────────────────────────────────────────────────────
  { id: 'coke-pet-35', name: 'Coca-Cola', brand: 'Coca-Cola', category: '35cl PET', pack: 'Pack of 12', price: 4200 },
  { id: 'coke-zero-pet-35', name: 'Coca-Cola Zero Sugar', brand: 'Coca-Cola', category: '35cl PET', pack: 'Pack of 12', price: 4200 },
  { id: 'fanta-orange-pet-35', name: 'Fanta Orange', brand: 'Coca-Cola', category: '35cl PET', pack: 'Pack of 12', price: 4000 },
  { id: 'fanta-lemon-pet-35', name: 'Fanta Lemon', brand: 'Coca-Cola', category: '35cl PET', pack: 'Pack of 12', price: 4000 },
  { id: 'fanta-pineapple-pet-35', name: 'Fanta Pineapple', brand: 'Coca-Cola', category: '35cl PET', pack: 'Pack of 12', price: 4000 },
  { id: 'sprite-pet-35', name: 'Sprite', brand: 'Coca-Cola', category: '35cl PET', pack: 'Pack of 12', price: 4000 },

  // ─────────────────────────────────────────────────────────────
  // Pepsi (Seven-Up Bottling Company) · 50cl Glass Bottle (Crate of 12)
  // ─────────────────────────────────────────────────────────────
  { id: 'pepsi-glass-50', name: 'Pepsi', brand: 'Pepsi (Seven-Up)', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 4500 },
  { id: '7up-glass-50', name: '7UP', brand: 'Pepsi (Seven-Up)', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 4500 },
  { id: 'mirinda-orange-glass-50', name: 'Mirinda Orange', brand: 'Pepsi (Seven-Up)', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 4300 },
  { id: 'mirinda-apple-glass-50', name: 'Mirinda Apple', brand: 'Pepsi (Seven-Up)', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 4300 },
  { id: 'mirinda-fruity-glass-50', name: 'Mirinda Fruity', brand: 'Pepsi (Seven-Up)', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 4300 },
  { id: 'mountain-dew-glass-50', name: 'Mountain Dew', brand: 'Pepsi (Seven-Up)', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 4800 },
  { id: 'teem-glass-50', name: 'Teem', brand: 'Pepsi (Seven-Up)', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 4300 },
  { id: 'evervess-tonic-glass-50', name: 'Evervess Tonic Water', brand: 'Pepsi (Seven-Up)', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 5000 },
  { id: 'evervess-soda-glass-50', name: 'Evervess Soda Water', brand: 'Pepsi (Seven-Up)', category: '50cl Glass Bottle', pack: 'Crate of 12', price: 4800 },

  // ─────────────────────────────────────────────────────────────
  // Pepsi (Seven-Up Bottling Company) · 50cl PET (Pack of 12)
  // ─────────────────────────────────────────────────────────────
  { id: 'pepsi-pet-50', name: 'Pepsi', brand: 'Pepsi (Seven-Up)', category: '50cl PET', pack: 'Pack of 12', price: 5500 },
  { id: 'pepsi-black-pet-50', name: 'Pepsi Black', brand: 'Pepsi (Seven-Up)', category: '50cl PET', pack: 'Pack of 12', price: 5500 },
  { id: '7up-pet-50', name: '7UP', brand: 'Pepsi (Seven-Up)', category: '50cl PET', pack: 'Pack of 12', price: 5500 },
  { id: 'mirinda-orange-pet-50', name: 'Mirinda Orange', brand: 'Pepsi (Seven-Up)', category: '50cl PET', pack: 'Pack of 12', price: 5300 },
  { id: 'mirinda-apple-pet-50', name: 'Mirinda Apple', brand: 'Pepsi (Seven-Up)', category: '50cl PET', pack: 'Pack of 12', price: 5300 },
  { id: 'mirinda-fruity-pet-50', name: 'Mirinda Fruity', brand: 'Pepsi (Seven-Up)', category: '50cl PET', pack: 'Pack of 12', price: 5300 },
  { id: 'mountain-dew-pet-50', name: 'Mountain Dew', brand: 'Pepsi (Seven-Up)', category: '50cl PET', pack: 'Pack of 12', price: 5600 },

  // ─────────────────────────────────────────────────────────────
  // Pepsi (Seven-Up Bottling Company) · 35cl PET (Pack of 12)
  // ─────────────────────────────────────────────────────────────
  { id: 'pepsi-pet-35', name: 'Pepsi', brand: 'Pepsi (Seven-Up)', category: '35cl PET', pack: 'Pack of 12', price: 3800 },
  { id: 'pepsi-black-pet-35', name: 'Pepsi Black', brand: 'Pepsi (Seven-Up)', category: '35cl PET', pack: 'Pack of 12', price: 3800 },
  { id: '7up-pet-35', name: '7UP', brand: 'Pepsi (Seven-Up)', category: '35cl PET', pack: 'Pack of 12', price: 3800 },
  { id: 'mirinda-orange-pet-35', name: 'Mirinda Orange', brand: 'Pepsi (Seven-Up)', category: '35cl PET', pack: 'Pack of 12', price: 3600 },
  { id: 'mirinda-apple-pet-35', name: 'Mirinda Apple', brand: 'Pepsi (Seven-Up)', category: '35cl PET', pack: 'Pack of 12', price: 3600 },
  { id: 'mirinda-fruity-pet-35', name: 'Mirinda Fruity', brand: 'Pepsi (Seven-Up)', category: '35cl PET', pack: 'Pack of 12', price: 3600 },
  { id: 'mountain-dew-pet-35', name: 'Mountain Dew', brand: 'Pepsi (Seven-Up)', category: '35cl PET', pack: 'Pack of 12', price: 3900 },

  // ─────────────────────────────────────────────────────────────
  // Energy, Water & Dairy
  // ─────────────────────────────────────────────────────────────
  { id: 'fearless-pet', name: 'Fearless Energy Drink', brand: 'Water & Energy', category: '50cl PET', pack: 'Pack of 12', price: 6500 },
  { id: 'maltina-can-24', name: 'Maltina Classic', brand: 'Water & Energy', category: 'Cans & Special', pack: 'Pack of 24', price: 14500 },
  { id: 'cway-water-75', name: 'CWAY Table Water (75cl)', brand: 'Water & Energy', category: 'Cans & Special', pack: 'Pack of 12', price: 2500 },
  { id: 'cway-nutri-milk-50', name: 'CWAY Nutri-Milk Apple (500ml)', brand: 'Water & Energy', category: '50cl PET', pack: 'Pack of 12', price: 7500 },
  { id: 'cway-dispenser-19l', name: 'CWAY Dispenser Water (19L)', brand: 'Water & Energy', category: 'Cans & Special', pack: 'Refill Bottle', price: 1800 },
]

export const BRANDS = ['All', 'Coca-Cola', 'Pepsi (Seven-Up)', 'Water & Energy'] as const
export const CATEGORY_TYPES = ['All', '50cl Glass Bottle', '50cl PET', '35cl PET'] as const
