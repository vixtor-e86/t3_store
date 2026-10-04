// ─── T3 Drinks Store & Management ───────────────────────────────────────────
// Central data store for drinks and prices.
// Drinks can be added, updated, or immediately turned OFF so they don't sit on the catalog.
// Supports local caching + Vercel Serverless/Database API synchronization.

import { useState, useEffect, useCallback } from 'react'

export interface DrinkItem {
  id: string
  name: string
  size: string
  price: number
  isAvailable: boolean // true = visible in customer catalog, false = turned off/hidden
  category?: 'PET Bottles' | 'Glass Bottles' | 'Cans & Water' | 'Other Drinks'
  image?: string
}

export const DEFAULT_DRINKS: DrinkItem[] = [
  // ─── Core & Showcase Drinks ───────────────────────────────────────────────
  { id: 'cola-crate', name: 'Coca-Cola Glass Crate', size: '50cl Glass · Crate of 24', price: 12000, category: 'Glass Bottles', isAvailable: true, image: '/images/product-cola-crate.jpg' },
  { id: 'cola-pet', name: 'Coca-Cola', size: '50cl PET · Pack of 12', price: 6500, category: 'PET Bottles', isAvailable: true, image: '/images/product-cola-pet.jpg' },
  { id: 'pepsi', name: 'Pepsi', size: '50cl PET · Pack of 12', price: 6200, category: 'PET Bottles', isAvailable: true, image: '/images/product-blue-pet.jpg' },
  { id: 'fearless', name: 'Fearless Energy Drink', size: '500ml PET · Pack of 12', price: 6500, category: 'PET Bottles', isAvailable: true, image: '/images/product-fearless.jpg' },
  { id: 'maltina-can', name: 'Maltina Classic', size: '33cl Can · Pack of 24', price: 14500, category: 'Cans & Water', isAvailable: true, image: '/images/product-maltina-can.jpg' },
  { id: 'cway-water', name: 'CWAY Table Water', size: '75cl PET · Pack of 12', price: 2500, category: 'Cans & Water', isAvailable: true, image: '/images/product-cway-water.jpg' },
  { id: 'nutri-milk', name: 'CWAY Nutri-Milk Apple', size: '500ml · Pack of 12', price: 7500, category: 'PET Bottles', isAvailable: true, image: '/images/product-nutri-milk.jpg' },
  { id: 'cway-dispenser', name: 'CWAY Dispenser Water', size: '19 Litres · Refill Bottle', price: 1800, category: 'Cans & Water', isAvailable: true, image: '/images/product-cway-dispenser.jpg' },

  // ─── Glass Bottles (Crates) ────────────────────────────────────────────────
  { id: 'fanta-orange-glass-50', name: 'Fanta Orange', size: '50cl Glass · Crate of 12', price: 4500, category: 'Glass Bottles', isAvailable: true },
  { id: 'fanta-lemon-glass-50', name: 'Fanta Lemon', size: '50cl Glass · Crate of 12', price: 4500, category: 'Glass Bottles', isAvailable: true },
  { id: 'fanta-pineapple-glass-50', name: 'Fanta Pineapple', size: '50cl Glass · Crate of 12', price: 4500, category: 'Glass Bottles', isAvailable: true },
  { id: 'sprite-glass-50', name: 'Sprite', size: '50cl Glass · Crate of 12', price: 4500, category: 'Glass Bottles', isAvailable: true },
  { id: 'schweppes-chapman-glass-50', name: 'Schweppes Chapman', size: '50cl Glass · Crate of 12', price: 5200, category: 'Glass Bottles', isAvailable: true },
  { id: 'schweppes-tonic-glass-50', name: 'Schweppes Tonic Water', size: '50cl Glass · Crate of 12', price: 5200, category: 'Glass Bottles', isAvailable: true },
  { id: 'schweppes-soda-glass-50', name: 'Schweppes Soda Water', size: '50cl Glass · Crate of 12', price: 5000, category: 'Glass Bottles', isAvailable: true },
  { id: 'schweppes-ginger-glass-50', name: 'Schweppes Ginger Ale', size: '50cl Glass · Crate of 12', price: 5200, category: 'Glass Bottles', isAvailable: true },
  { id: 'krest-bitter-lemon-glass-50', name: 'Krest Bitter Lemon', size: '50cl Glass · Crate of 12', price: 4800, category: 'Glass Bottles', isAvailable: true },
  { id: '7up-glass-50', name: '7UP', size: '50cl Glass · Crate of 12', price: 4500, category: 'Glass Bottles', isAvailable: true },
  { id: 'mirinda-orange-glass-50', name: 'Mirinda Orange', size: '50cl Glass · Crate of 12', price: 4300, category: 'Glass Bottles', isAvailable: true },
  { id: 'mirinda-apple-glass-50', name: 'Mirinda Apple', size: '50cl Glass · Crate of 12', price: 4300, category: 'Glass Bottles', isAvailable: true },
  { id: 'mirinda-fruity-glass-50', name: 'Mirinda Fruity', size: '50cl Glass · Crate of 12', price: 4300, category: 'Glass Bottles', isAvailable: true },
  { id: 'mountain-dew-glass-50', name: 'Mountain Dew', size: '50cl Glass · Crate of 12', price: 4800, category: 'Glass Bottles', isAvailable: true },
  { id: 'teem-glass-50', name: 'Teem Bitter Lemon', size: '50cl Glass · Crate of 12', price: 4300, category: 'Glass Bottles', isAvailable: true },
  { id: 'evervess-tonic-glass-50', name: 'Evervess Tonic Water', size: '50cl Glass · Crate of 12', price: 5000, category: 'Glass Bottles', isAvailable: true },
  { id: 'evervess-soda-glass-50', name: 'Evervess Soda Water', size: '50cl Glass · Crate of 12', price: 4800, category: 'Glass Bottles', isAvailable: true },

  // ─── 50cl PET Bottles (Packs) ──────────────────────────────────────────────
  { id: 'coke-zero-pet-50', name: 'Coca-Cola Zero Sugar', size: '50cl PET · Pack of 12', price: 6000, category: 'PET Bottles', isAvailable: true },
  { id: 'fanta-orange-pet-50', name: 'Fanta Orange', size: '50cl PET · Pack of 12', price: 5800, category: 'PET Bottles', isAvailable: true },
  { id: 'fanta-lemon-pet-50', name: 'Fanta Lemon', size: '50cl PET · Pack of 12', price: 5800, category: 'PET Bottles', isAvailable: true },
  { id: 'fanta-pineapple-pet-50', name: 'Fanta Pineapple', size: '50cl PET · Pack of 12', price: 5800, category: 'PET Bottles', isAvailable: true },
  { id: 'sprite-pet-50', name: 'Sprite', size: '50cl PET · Pack of 12', price: 5800, category: 'PET Bottles', isAvailable: true },
  { id: 'schweppes-chapman-pet-50', name: 'Schweppes Chapman', size: '50cl PET · Pack of 12', price: 6500, category: 'PET Bottles', isAvailable: true },
  { id: 'pepsi-black-pet-50', name: 'Pepsi Black Zero', size: '50cl PET · Pack of 12', price: 5500, category: 'PET Bottles', isAvailable: true },
  { id: '7up-pet-50', name: '7UP', size: '50cl PET · Pack of 12', price: 5500, category: 'PET Bottles', isAvailable: true },
  { id: 'mirinda-orange-pet-50', name: 'Mirinda Orange', size: '50cl PET · Pack of 12', price: 5300, category: 'PET Bottles', isAvailable: true },
  { id: 'mirinda-apple-pet-50', name: 'Mirinda Apple', size: '50cl PET · Pack of 12', price: 5300, category: 'PET Bottles', isAvailable: true },
  { id: 'mirinda-fruity-pet-50', name: 'Mirinda Fruity', size: '50cl PET · Pack of 12', price: 5300, category: 'PET Bottles', isAvailable: true },
  { id: 'mountain-dew-pet-50', name: 'Mountain Dew', size: '50cl PET · Pack of 12', price: 5600, category: 'PET Bottles', isAvailable: true },

  // ─── 35cl PET Bottles (Packs) ──────────────────────────────────────────────
  { id: 'coke-pet-35', name: 'Coca-Cola', size: '35cl PET · Pack of 12', price: 4200, category: 'PET Bottles', isAvailable: true },
  { id: 'coke-zero-pet-35', name: 'Coca-Cola Zero Sugar', size: '35cl PET · Pack of 12', price: 4200, category: 'PET Bottles', isAvailable: true },
  { id: 'fanta-orange-pet-35', name: 'Fanta Orange', size: '35cl PET · Pack of 12', price: 4000, category: 'PET Bottles', isAvailable: true },
  { id: 'fanta-lemon-pet-35', name: 'Fanta Lemon', size: '35cl PET · Pack of 12', price: 4000, category: 'PET Bottles', isAvailable: true },
  { id: 'fanta-pineapple-pet-35', name: 'Fanta Pineapple', size: '35cl PET · Pack of 12', price: 4000, category: 'PET Bottles', isAvailable: true },
  { id: 'sprite-pet-35', name: 'Sprite', size: '35cl PET · Pack of 12', price: 4000, category: 'PET Bottles', isAvailable: true },
  { id: 'pepsi-pet-35', name: 'Pepsi', size: '35cl PET · Pack of 12', price: 3800, category: 'PET Bottles', isAvailable: true },
  { id: 'pepsi-black-pet-35', name: 'Pepsi Black', size: '35cl PET · Pack of 12', price: 3800, category: 'PET Bottles', isAvailable: true },
  { id: '7up-pet-35', name: '7UP', size: '35cl PET · Pack of 12', price: 3800, category: 'PET Bottles', isAvailable: true },
  { id: 'mirinda-orange-pet-35', name: 'Mirinda Orange', size: '35cl PET · Pack of 12', price: 3600, category: 'PET Bottles', isAvailable: true },
  { id: 'mirinda-apple-pet-35', name: 'Mirinda Apple', size: '35cl PET · Pack of 12', price: 3600, category: 'PET Bottles', isAvailable: true },
  { id: 'mirinda-fruity-pet-35', name: 'Mirinda Fruity', size: '35cl PET · Pack of 12', price: 3600, category: 'PET Bottles', isAvailable: true },
  { id: 'mountain-dew-pet-35', name: 'Mountain Dew', size: '35cl PET · Pack of 12', price: 3900, category: 'PET Bottles', isAvailable: true },
]

const STORAGE_KEY = 't3_drinks_data_v3'
const CHANGE_EVENT = 't3-drinks-changed'

// ─── LocalStorage helpers ───────────────────────────────────────────────────

function getStoredDrinks(): DrinkItem[] {
  if (typeof window === 'undefined') return DEFAULT_DRINKS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DRINKS))
      return DEFAULT_DRINKS
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure each item has isAvailable flag
      return parsed.map((item) => ({
        ...item,
        isAvailable: item.isAvailable !== false,
      }))
    }
    return DEFAULT_DRINKS
  } catch (e) {
    console.error('Failed reading drinks from localStorage:', e)
    return DEFAULT_DRINKS
  }
}

function saveStoredDrinks(items: DrinkItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: items }))
  } catch (e) {
    console.error('Failed saving drinks to localStorage:', e)
  }
}

// ─── Async Vercel Database sync helper ──────────────────────────────────────

export interface CloudSyncResponse {
  success: boolean
  storage?: 'blob' | 'kv' | 'none' | 'error'
  url?: string
  message?: string
  warning?: string
  error?: string
}

async function syncWithVercelApi(items: DrinkItem[]): Promise<CloudSyncResponse> {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    })
    const data = await res.json()
    return {
      success: Boolean(data?.success),
      storage: data?.storage || (res.ok ? 'unknown' : 'error'),
      url: data?.url,
      message: data?.message,
      warning: data?.warning,
      error: data?.error,
    }
  } catch (err: any) {
    return {
      success: false,
      storage: 'error',
      error: err?.message || 'Network error syncing with server',
    }
  }
}

// ─── Main React Hook: useDrinks ─────────────────────────────────────────────

export function useDrinks() {
  const [drinks, setDrinks] = useState<DrinkItem[]>(getStoredDrinks)
  const [loading, setLoading] = useState(false)
  const [isSynced, setIsSynced] = useState(true)
  const [isCloudConnected, setIsCloudConnected] = useState<boolean | null>(null)
  const [storageType, setStorageType] = useState<'blob' | 'kv' | 'local_only' | 'checking'>('checking')
  const [lastSyncWarning, setLastSyncWarning] = useState<string | null>(null)

  // Diagnostics check for Vercel Blob / KV connection
  const checkCloudStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/products?check=1&t=${Date.now()}`, { cache: 'no-store' })
      if (!res.ok) {
        setIsCloudConnected(false)
        setStorageType('local_only')
        return
      }
      const data = await res.json()
      if (data?.blob?.connected) {
        setIsCloudConnected(true)
        setStorageType('blob')
        setLastSyncWarning(null)
      } else if (data?.storage === 'kv') {
        setIsCloudConnected(true)
        setStorageType('kv')
        setLastSyncWarning(null)
      } else {
        setIsCloudConnected(false)
        setStorageType('local_only')
        setLastSyncWarning(
          'Vercel Blob is not connected in your Vercel project settings. Changes are saved only locally.'
        )
      }
    } catch {
      setIsCloudConnected(false)
      setStorageType('local_only')
    }
  }, [])

  // Listen to cross-component or cross-tab changes & fetch on mount
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<DrinkItem[]>
      if (custom.detail) {
        setDrinks(custom.detail)
      } else {
        setDrinks(getStoredDrinks())
      }
    }

    const storageHandler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setDrinks(getStoredDrinks())
      }
    }

    window.addEventListener(CHANGE_EVENT, handler)
    window.addEventListener('storage', storageHandler)

    // Check cloud database status
    checkCloudStatus()

    // Fetch latest drinks from Vercel API on mount (cache-busted)
    setLoading(true)
    fetch(`/api/products?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((d: any) => ({
            ...d,
            isAvailable: d.isAvailable !== false,
          }))
          saveStoredDrinks(formatted)
          setDrinks(formatted)
        }
      })
      .catch(() => {
        // Silently use localStorage fallback
      })
      .finally(() => {
        setLoading(false)
      })

    return () => {
      window.removeEventListener(CHANGE_EVENT, handler)
      window.removeEventListener('storage', storageHandler)
    }
  }, [checkCloudStatus])

  // Persist update and sync
  const commit = useCallback(async (newDrinks: DrinkItem[]) => {
    setDrinks(newDrinks)
    saveStoredDrinks(newDrinks)
    const result = await syncWithVercelApi(newDrinks)
    if (result.success && (result.storage === 'blob' || result.storage === 'kv')) {
      setIsSynced(true)
      setIsCloudConnected(true)
      setStorageType(result.storage)
      setLastSyncWarning(null)
    } else {
      setIsSynced(false)
      setIsCloudConnected(false)
      setStorageType('local_only')
      setLastSyncWarning(
        result.warning || result.error || 'Saved locally only. Connect Vercel Blob for global mobile sync.'
      )
    }
    return result
  }, [])

  // Quick price update (ideal for mom!)
  const updatePrice = useCallback(
    (id: string, newPrice: number) => {
      const updated = drinks.map((d) =>
        d.id === id ? { ...d, price: Math.max(0, Math.round(newPrice)) } : d
      )
      return commit(updated)
    },
    [drinks, commit]
  )

  // Immediately turn ON / OFF a drink (if OFF, it does not sit on the catalog!)
  const toggleAvailability = useCallback(
    (id: string) => {
      const updated = drinks.map((d) =>
        d.id === id ? { ...d, isAvailable: !d.isAvailable } : d
      )
      return commit(updated)
    },
    [drinks, commit]
  )

  // Full item update (e.g. name, pack, price)
  const updateDrink = useCallback(
    (id: string, updates: Partial<DrinkItem>) => {
      const updated = drinks.map((d) => (d.id === id ? { ...d, ...updates } : d))
      return commit(updated)
    },
    [drinks, commit]
  )

  // Add a brand new drink (No pictures required!)
  const addDrink = useCallback(
    (item: { name: string; size: string; price: number; category?: string; isAvailable?: boolean }) => {
      const newId =
        item.name.toLowerCase().replace(/[^a-z0-9]/g, '-') +
        '-' +
        Date.now().toString(36)

      const newDrink: DrinkItem = {
        id: newId,
        name: item.name.trim(),
        size: item.size.trim(),
        price: Number(item.price) || 0,
        isAvailable: item.isAvailable ?? true,
        category: (item.category as any) || 'PET Bottles',
      }

      const updated = [newDrink, ...drinks]
      commit(updated)
      return newDrink
    },
    [drinks, commit]
  )

  // Delete a drink
  const deleteDrink = useCallback(
    (id: string) => {
      const updated = drinks.filter((d) => d.id !== id)
      return commit(updated)
    },
    [drinks, commit]
  )

  // Reset back to factory defaults
  const resetToDefaults = useCallback(() => {
    return commit(DEFAULT_DRINKS)
  }, [commit])

  return {
    drinks,
    loading,
    isSynced,
    isCloudConnected,
    storageType,
    lastSyncWarning,
    checkCloudStatus,
    updatePrice,
    toggleAvailability,
    updateDrink,
    addDrink,
    deleteDrink,
    resetToDefaults,
  }
}
