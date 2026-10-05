// ─── T3 Drinks Store & Management ───────────────────────────────────────────
// Central data store for drinks and prices.
// Drinks can be added, updated, or immediately turned OFF so they don't sit on the catalog.
// Supports local caching + Vercel Serverless/Database API synchronization.

import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

export type DrinkCategory = 'PET Bottles' | 'Glass Bottles' | 'Cans' | 'Table Water' | 'Other Drinks'

export interface DrinkItem {
  id: string
  name: string
  size: string
  price: number
  isAvailable: boolean // true = visible in customer catalog, false = turned off/hidden
  category?: DrinkCategory | string
  image?: string
}

/**
 * Smart keyword-based categorizer for drinks.
 * Analyzes name, package size, and existing category to accurately assign category.
 * Explicitly guards against brand overlap (e.g. CWAY produces both Table Water and Nutri-Milk drinks).
 */
export function detectDrinkCategory(item: {
  name?: string
  size?: string
  category?: string
}): DrinkCategory {
  const text = `${item.name || ''} ${item.size || ''} ${item.category || ''}`.toLowerCase()

  // Guard: Drinks, Dairy, Juices, and Sodas (like CWAY Nutri-Milk, Nutri-Yo) are NEVER water
  const isFlavoredOrDairyOrSoda =
    text.includes('nutri') ||
    text.includes('milk') ||
    text.includes('yogurt') ||
    text.includes('yoghurt') ||
    text.includes('juice') ||
    text.includes('peach') ||
    text.includes('apple') ||
    text.includes('orange') ||
    text.includes('chapman') ||
    text.includes('cola') ||
    text.includes('pepsi') ||
    text.includes('fanta') ||
    text.includes('sprite') ||
    text.includes('malt') ||
    text.includes('energy') ||
    text.includes('fearless') ||
    text.includes('predator') ||
    text.includes('climax')

  // 1. Table Water: Requires explicit water keywords and NOT flavored drinks/dairy
  if (
    !isFlavoredOrDairyOrSoda &&
    (text.includes('water') ||
      text.includes('dispenser') ||
      text.includes('refill') ||
      text.includes('19 litre') ||
      text.includes('19l') ||
      text.includes('aquafina') ||
      text.includes('pure life'))
  ) {
    return 'Table Water'
  }

  // 2. Cans keywords (Maltina 33cl Can, Coke Can, 33 CL pack of 24, etc.)
  if (
    /\b(can|cans|tin|tins|canned)\b/i.test(text) ||
    /33\s*cl/i.test(text) ||
    /330\s*ml/i.test(text)
  ) {
    return 'Cans'
  }

  // 3. Glass Bottles / Crates keywords
  if (
    text.includes('glass') ||
    text.includes('crate') ||
    text.includes('rgb')
  ) {
    return 'Glass Bottles'
  }

  // 4. PET Bottles keywords (Plastic bottles, 50cl PET, 35cl, Nutri-Milk, etc.)
  if (
    text.includes('pet') ||
    text.includes('plastic') ||
    text.includes('50cl') ||
    text.includes('35cl') ||
    text.includes('500ml') ||
    text.includes('60cl') ||
    isFlavoredOrDairyOrSoda
  ) {
    return 'PET Bottles'
  }

  // Fallback check on existing category
  if (item.category === 'Glass Bottles') return 'Glass Bottles'
  if (item.category === 'Cans') return 'Cans'
  if (item.category === 'Table Water') return 'Table Water'
  if (item.category === 'PET Bottles') return 'PET Bottles'

  return 'PET Bottles'
}

/**
 * Checks whether an item matches a selected category filter.
 * Uses flexible keyword detection on item name and size so any user-added items
 * (e.g. "Mortina 33 CL back of 24", "J 1st table water", "seaway table water")
 * match automatically without requiring manual tag configuration.
 */
export function itemMatchesCategory(
  item: { name: string; size?: string; category?: string },
  selectedCategory: string
): boolean {
  if (!selectedCategory || selectedCategory === 'All Drinks' || selectedCategory === 'All') {
    return true
  }

  const text = `${item.name} ${item.size || ''} ${item.category || ''}`.toLowerCase()

  // Guard: Flavored drinks, juices, and dairy are not water (even if made by CWAY)
  const isFlavoredOrDairyOrSoda =
    text.includes('nutri') ||
    text.includes('milk') ||
    text.includes('yogurt') ||
    text.includes('yoghurt') ||
    text.includes('juice') ||
    text.includes('peach') ||
    text.includes('apple') ||
    text.includes('orange') ||
    text.includes('chapman') ||
    text.includes('cola') ||
    text.includes('pepsi') ||
    text.includes('fanta') ||
    text.includes('sprite') ||
    text.includes('malt') ||
    text.includes('energy') ||
    text.includes('fearless') ||
    text.includes('predator') ||
    text.includes('climax')

  // Match: Table Water
  if (selectedCategory === 'Table Water' || selectedCategory === 'Water') {
    if (isFlavoredOrDairyOrSoda) return false
    return (
      text.includes('water') ||
      text.includes('dispenser') ||
      text.includes('refill') ||
      text.includes('19 litre') ||
      text.includes('19l') ||
      text.includes('aquafina') ||
      text.includes('pure life') ||
      item.category === 'Table Water'
    )
  }

  // Match: Cans
  if (selectedCategory === 'Cans' || selectedCategory === 'Can') {
    return (
      /\b(can|cans|tin|tins|canned)\b/i.test(text) ||
      /33\s*cl/i.test(text) ||
      /330\s*ml/i.test(text) ||
      item.category === 'Cans'
    )
  }

  // Match: Glass Bottles
  if (
    selectedCategory === 'Glass Bottles' ||
    selectedCategory === 'Glass' ||
    selectedCategory === 'Crates'
  ) {
    return (
      text.includes('glass') ||
      text.includes('crate') ||
      text.includes('rgb') ||
      item.category === 'Glass Bottles'
    )
  }

  // Match: PET Bottles
  if (
    selectedCategory === 'PET Bottles' ||
    selectedCategory === 'PET' ||
    selectedCategory === 'Plastic'
  ) {
    // If it's explicitly Table Water, Can, or Glass, exclude from PET Bottles
    const isWater =
      !isFlavoredOrDairyOrSoda &&
      (text.includes('water') ||
        text.includes('dispenser') ||
        text.includes('refill') ||
        text.includes('19 litre') ||
        text.includes('19l') ||
        text.includes('aquafina') ||
        text.includes('pure life') ||
        item.category === 'Table Water')

    const isCan =
      /\b(can|cans|tin|tins|canned)\b/i.test(text) ||
      /33\s*cl/i.test(text) ||
      /330\s*ml/i.test(text) ||
      item.category === 'Cans'

    const isGlass =
      text.includes('glass') ||
      text.includes('crate') ||
      text.includes('rgb') ||
      item.category === 'Glass Bottles'

    if (isWater || isCan || isGlass) {
      return false
    }

    return true
  }

  // Fallback direct match
  return item.category?.toLowerCase() === selectedCategory.toLowerCase()
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

// ─── Supabase PostgreSQL Sync Helpers ───────────────────────────────────────

export interface CloudSyncResponse {
  success: boolean
  storage?: 'supabase' | 'blob' | 'kv' | 'none' | 'error'
  url?: string
  message?: string
  warning?: string
  error?: string
}

async function fetchSupabaseDrinks(): Promise<DrinkItem[] | null> {
  try {
    const { data, error } = await supabase
      .from('t3_drinks')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      return null
    }

    if (Array.isArray(data)) {
      if (data.length === 0) {
        // Table created but empty: auto-seed catalog into Supabase!
        await seedSupabaseDrinks(DEFAULT_DRINKS)
        return DEFAULT_DRINKS
      }
      return data.map((d: any) => ({
        id: String(d.id),
        name: String(d.name),
        size: String(d.size),
        price: Number(d.price) || 0,
        category: d.category || 'PET Bottles',
        image: d.image || undefined,
        isAvailable: d.is_available !== false,
      }))
    }
    return null
  } catch {
    return null
  }
}

async function seedSupabaseDrinks(items: DrinkItem[]) {
  try {
    const rows = items.map((item, index) => ({
      id: item.id,
      name: item.name,
      size: item.size,
      price: item.price,
      category: item.category || 'PET Bottles',
      image: item.image || null,
      is_available: item.isAvailable !== false,
      sort_order: index,
    }))
    await supabase.from('t3_drinks').upsert(rows, { onConflict: 'id' })
  } catch {
    // Seed error caught
  }
}

async function saveToSupabase(items: DrinkItem[]): Promise<boolean> {
  try {
    const rows = items.map((item, index) => ({
      id: item.id,
      name: item.name,
      size: item.size,
      price: item.price,
      category: item.category || 'PET Bottles',
      image: item.image || null,
      is_available: item.isAvailable !== false,
      sort_order: index,
      updated_at: new Date().toISOString(),
    }))
    const { error } = await supabase.from('t3_drinks').upsert(rows, { onConflict: 'id' })
    return !error
  } catch {
    return false
  }
}

async function syncWithVercelApi(items: DrinkItem[]): Promise<CloudSyncResponse> {
  // First try direct Supabase update (lightning fast!)
  const supabaseOk = await saveToSupabase(items)
  if (supabaseOk) {
    return {
      success: true,
      storage: 'supabase',
      message: 'Saved directly to Supabase PostgreSQL database!',
    }
  }

  // Backup: also send to serverless API
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

// In-flight shared fetch promise to prevent duplicate requests when multiple components mount
let sharedFetchPromise: Promise<DrinkItem[] | null> | null = null

async function loadLatestRemoteDrinks(): Promise<DrinkItem[] | null> {
  if (sharedFetchPromise) return sharedFetchPromise

  sharedFetchPromise = (async () => {
    try {
      const remote = await fetchSupabaseDrinks()
      if (remote && remote.length > 0) {
        return remote
      }
    } catch {
      // ignore
    }

    // Fallback to /api/products
    try {
      const res = await fetch(`/api/products?t=${Date.now()}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          return data.map((d: any) => ({
            ...d,
            isAvailable: d.isAvailable !== false,
          }))
        }
      }
    } catch {
      // ignore
    }
    return null
  })().finally(() => {
    // Keep cached briefly before allowing next refresh
    setTimeout(() => {
      sharedFetchPromise = null
    }, 4000)
  })

  return sharedFetchPromise
}

// ─── Main React Hook: useDrinks ─────────────────────────────────────────────

export function useDrinks() {
  const [drinks, setDrinks] = useState<DrinkItem[]>(getStoredDrinks)
  const [loading, setLoading] = useState(false)
  const [isSynced, setIsSynced] = useState(true)
  const [isCloudConnected, setIsCloudConnected] = useState<boolean | null>(true)
  const [storageType, setStorageType] = useState<
    'supabase' | 'blob' | 'kv' | 'table_missing' | 'local_only' | 'checking'
  >('supabase')
  const [lastSyncWarning, setLastSyncWarning] = useState<string | null>(null)

  // Diagnostics check for Supabase connection (non-blocking)
  const checkCloudStatus = useCallback(async () => {
    try {
      const { error } = await supabase.from('t3_drinks').select('id').limit(1)
      if (!error) {
        setIsCloudConnected(true)
        setStorageType('supabase')
        setLastSyncWarning(null)
      } else {
        setIsCloudConnected(false)
        setStorageType('local_only')
      }
    } catch {
      setIsCloudConnected(false)
      setStorageType('local_only')
    }
  }, [])

  // Listen to cross-component or cross-tab changes & fetch on mount
  useEffect(() => {
    let isMounted = true

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

    // Load latest data from Supabase in background
    setLoading(true)
    loadLatestRemoteDrinks()
      .then((remoteDrinks) => {
        if (!isMounted) return
        if (remoteDrinks && remoteDrinks.length > 0) {
          saveStoredDrinks(remoteDrinks)
          setDrinks(remoteDrinks)
          setIsCloudConnected(true)
          setStorageType('supabase')
        }
      })
      .catch(() => {
        // Safe silent catch
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
      window.removeEventListener(CHANGE_EVENT, handler)
      window.removeEventListener('storage', storageHandler)
    }
  }, [])

  // Persist update and sync
  const commit = useCallback(async (newDrinks: DrinkItem[]) => {
    setDrinks(newDrinks)
    saveStoredDrinks(newDrinks)
    const result = await syncWithVercelApi(newDrinks)
    if (result.success && (result.storage === 'supabase' || result.storage === 'blob' || result.storage === 'kv')) {
      setIsSynced(true)
      setIsCloudConnected(true)
      setStorageType(result.storage as any)
      setLastSyncWarning(null)
    } else {
      setIsSynced(false)
      setIsCloudConnected(false)
      setStorageType('local_only')
      setLastSyncWarning(
        result.warning || result.error || 'Saved locally only. Run the Supabase SQL script for global mobile sync.'
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
        category: (item.category as any) || detectDrinkCategory(item),
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
