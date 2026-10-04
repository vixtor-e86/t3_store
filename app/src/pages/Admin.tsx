import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { useDrinks, type DrinkItem } from '@/lib/drinksStore'
import { formatNaira } from '@/config'

const COMMON_PACK_SIZES = [
  'Pack of 12',
  'Crate of 12',
  'Crate of 24',
  'Pack of 24',
  '50cl PET · Pack of 12',
  '35cl PET · Pack of 12',
  '50cl Glass · Crate of 12',
  'Refill Bottle',
]

const AUTH_STORAGE_KEY = 't3_admin_auth_session'

export default function Admin() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
  })
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const {
    drinks,
    updatePrice,
    toggleAvailability,
    updateDrink,
    addDrink,
    deleteDrink,
    resetToDefaults,
  } = useDrinks()

  const [search, setSearch] = useState('')
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'off'>('all')

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Quick Price Edit Modal
  const [editingPriceItem, setEditingPriceItem] = useState<DrinkItem | null>(null)
  const [tempPrice, setTempPrice] = useState<number>(0)

  // Add / Edit Drink Modal (No pictures, only Name, Size, and Price)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingDrink, setEditingDrink] = useState<DrinkItem | null>(null)
  const [formName, setFormName] = useState('')
  const [formSize, setFormSize] = useState('50cl PET · Pack of 12')
  const [formPrice, setFormPrice] = useState<number>(5000)

  // Filtered drinks list
  const filteredDrinks = useMemo(() => {
    return drinks.filter((d) => {
      if (filterMode === 'active' && !d.isAvailable) return false
      if (filterMode === 'off' && d.isAvailable) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchesName = d.name.toLowerCase().includes(q)
        const matchesSize = d.size.toLowerCase().includes(q)
        if (!matchesName && !matchesSize) return false
      }
      return true
    })
  }, [drinks, search, filterMode])

  // Summary counts
  const totalDrinks = drinks.length
  const activeCount = drinks.filter((d) => d.isAvailable).length
  const offCount = totalDrinks - activeCount

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setIsVerifying(true)

    const expectedPassword =
      (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ||
      'Temitope2023'

    if (passwordInput === expectedPassword) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true')
      setIsAuthenticated(true)
      setIsVerifying(false)
      showToast('Welcome to T3 Store Admin!')
      return
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem(AUTH_STORAGE_KEY, 'true')
        setIsAuthenticated(true)
        setIsVerifying(false)
        showToast('Welcome to T3 Store Admin!')
        return
      }
    } catch {
      // Offline fallback
    }

    setIsVerifying(false)
    setPasswordError('Incorrect password. Please verify and try again.')
  }

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setIsAuthenticated(false)
    setPasswordInput('')
    setPasswordError('')
    showToast('Logged out of Admin')
  }

  // Quick Price Handler
  const handleOpenPriceModal = (item: DrinkItem) => {
    setEditingPriceItem(item)
    setTempPrice(item.price)
  }

  const handleSavePrice = () => {
    if (editingPriceItem) {
      updatePrice(editingPriceItem.id, tempPrice)
      showToast(`Updated price for ${editingPriceItem.name} to ${formatNaira(tempPrice)}!`)
      setEditingPriceItem(null)
    }
  }

  // Open Add Drink
  const handleOpenAdd = () => {
    setEditingDrink(null)
    setFormName('')
    setFormSize('50cl PET · Pack of 12')
    setFormPrice(5000)
    setIsFormModalOpen(true)
  }

  // Open Edit Drink
  const handleOpenEdit = (item: DrinkItem) => {
    setEditingDrink(item)
    setFormName(item.name)
    setFormSize(item.size)
    setFormPrice(item.price)
    setIsFormModalOpen(true)
  }

  // Save Add / Edit
  const handleSaveDrink = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) {
      alert('Please enter a drink name.')
      return
    }

    if (editingDrink) {
      updateDrink(editingDrink.id, {
        name: formName.trim(),
        size: formSize.trim(),
        price: Number(formPrice) || 0,
      })
      showToast(`Updated ${formName}!`)
    } else {
      addDrink({
        name: formName.trim(),
        size: formSize.trim(),
        price: Number(formPrice) || 0,
        isAvailable: true,
      })
      showToast(`Added ${formName} to Catalog!`)
    }

    setIsFormModalOpen(false)
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LOGIN SCREEN
  // ──────────────────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-4 py-8 font-body text-t3navy">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-t3navy px-5 py-3.5 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-5">
            <span className="text-sm font-bold">{toastMessage}</span>
          </div>
        )}

        <div className="w-full max-w-md rounded-3xl border border-t3navy/10 bg-white p-6 sm:p-8 shadow-xl">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-2xl bg-t3red font-display text-lg sm:text-xl font-black text-white shadow-sm">
                T3
              </span>
              <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-t3navy">
                Superstore
              </span>
            </Link>

            <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-t3navy/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-t3navy/70">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-t3red" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Admin Authentication</span>
            </div>

            <h1 className="mt-3 font-display text-xl sm:text-2xl font-black text-t3navy">
              Store Manager Access
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-t3navy/60">
              Enter the administrator password to adjust drink prices and stock.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-t3navy/70">
                Admin Password
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full rounded-2xl border-2 border-t3navy/15 bg-paper/60 px-4 py-3 pr-12 text-sm font-semibold text-t3navy outline-none focus:border-t3red focus:bg-white focus:ring-4 focus:ring-t3red/10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-t3navy/40 hover:text-t3navy"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {passwordError && (
                <p className="mt-2 text-xs font-bold text-red-600 animate-in fade-in">
                  ✕ {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-t3red px-6 text-sm font-bold text-white shadow-md transition-all hover:bg-t3red/90 hover:scale-[1.01] active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>{isVerifying ? 'Verifying...' : 'Unlock Store Admin'}</span>
            </button>

            <div className="pt-2 text-center">
              <Link
                to="/"
                className="text-xs font-semibold text-t3navy/50 hover:text-t3navy underline"
              >
                ← Return to Customer Store
              </Link>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // ──────────────────────────────────────────────────────────────────────────
  // AUTHENTICATED ADMIN DASHBOARD
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F5F7FA] font-body text-t3navy pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-t3navy px-5 py-3.5 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#25D366] text-xs font-black text-white">
            ✓
          </span>
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header - Mobile Responsive */}
      <header className="sticky top-0 z-40 border-b border-t3navy/10 bg-white/95 backdrop-blur shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <span className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-xl bg-t3red font-display text-xs sm:text-sm font-black text-white">
                T3
              </span>
              <span className="font-display text-base sm:text-lg font-black tracking-tight text-t3navy">
                Admin
              </span>
            </Link>
            <span className="hidden sm:inline-block rounded-full bg-t3navy/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-t3navy">
              Price Manager
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <Link
              to="/"
              className="inline-flex items-center gap-1 rounded-full border border-t3navy/15 bg-white px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold text-t3navy transition-colors hover:bg-t3navy/5"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span className="hidden sm:inline">Store</span>
            </Link>

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1 rounded-full bg-[#25D366] px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition-transform hover:scale-[1.03] active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14m-7-7h14" />
              </svg>
              <span>+ Add Drink</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
              title="Log Out"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* Banner with Clear Instructions */}
        <div className="rounded-3xl border border-t3navy/8 bg-gradient-to-r from-t3navy to-t3navy-900 p-5 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/90">
                <span>🏪 T3 Store Admin</span>
                <span>•</span>
                <span>Simple Price Control</span>
              </div>
              <h1 className="mt-2 font-display text-xl sm:text-3xl font-black">
                Manage Prices &amp; Availability
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-white/75 max-w-xl">
                Tap <strong>&ldquo;Turn Off&rdquo;</strong> to remove any finished drink from the catalog. Tap any price to change it.
              </p>
            </div>

            {/* Quick Stats: Balanced 3-column grid on mobile */}
            <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-2.5 sm:self-center">
              <div className="rounded-2xl bg-white/10 p-2.5 sm:px-4 sm:py-2.5 backdrop-blur text-center">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/60">Total</p>
                <p className="font-display text-lg sm:text-2xl font-black text-white">{totalDrinks}</p>
              </div>
              <div className="rounded-2xl bg-[#25D366]/20 border border-[#25D366]/30 p-2.5 sm:px-4 sm:py-2.5 text-center">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#25D366]">Active</p>
                <p className="font-display text-lg sm:text-2xl font-black text-white">{activeCount}</p>
              </div>
              <div className={`rounded-2xl p-2.5 sm:px-4 sm:py-2.5 text-center ${offCount > 0 ? 'bg-red-500/20 border border-red-500/30' : 'bg-white/10'}`}>
                <p className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${offCount > 0 ? 'text-red-200' : 'text-white/60'}`}>Turned Off</p>
                <p className="font-display text-lg sm:text-2xl font-black text-white">{offCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-5 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-t3navy/40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drinks to adjust price..."
              className="w-full rounded-2xl border border-t3navy/15 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium text-t3navy placeholder:text-t3navy/40 shadow-sm focus:border-t3red focus:outline-none focus:ring-2 focus:ring-t3red/20"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-t3navy/40 hover:text-t3navy"
              >
                Clear
              </button>
            )}
          </div>

          {/* Visibility Filters (Horizontal swipe on phone) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
            <button
              onClick={() => setFilterMode('all')}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                filterMode === 'all'
                  ? 'bg-t3navy text-white shadow-sm'
                  : 'bg-white border border-t3navy/10 text-t3navy/70 hover:bg-t3navy/5'
              }`}
            >
              All ({totalDrinks})
            </button>
            <button
              onClick={() => setFilterMode('active')}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                filterMode === 'active'
                  ? 'bg-[#25D366] text-white shadow-sm'
                  : 'bg-white border border-t3navy/10 text-t3navy/70 hover:bg-t3navy/5'
              }`}
            >
              🟢 Visible ({activeCount})
            </button>
            <button
              onClick={() => setFilterMode('off')}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                filterMode === 'off'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-white border border-t3navy/10 text-t3navy/70 hover:bg-t3navy/5'
              }`}
            >
              🔴 Turned Off ({offCount})
            </button>
          </div>
        </div>

        {/* Clean Drinks List (Touch-Friendly Cards on Mobile) */}
        <div className="mt-4 sm:mt-6 overflow-hidden rounded-3xl border border-t3navy/10 bg-white shadow-sm">
          {filteredDrinks.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <p className="font-display text-base sm:text-lg font-bold text-t3navy/60">
                No drinks found matching &ldquo;{search}&rdquo;
              </p>
              <button
                onClick={() => {
                  setSearch('')
                  setFilterMode('all')
                }}
                className="mt-3 rounded-full bg-t3navy px-4 py-2 text-xs font-bold text-white hover:bg-t3red"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-t3navy/8">
              {filteredDrinks.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 sm:p-4 transition-colors ${
                    !item.isAvailable ? 'bg-red-50/30' : 'hover:bg-t3navy/2'
                  }`}
                >
                  <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                    {/* Row 1: Drink Name, Size & Hidden Badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display text-base sm:text-lg font-extrabold text-t3navy leading-tight">
                          {item.name}
                        </h3>
                        {!item.isAvailable && (
                          <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-red-700">
                            Hidden from Catalog
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-t3navy/60 mt-0.5">
                        {item.size}
                      </p>
                    </div>

                    {/* Row 2 on Mobile / Middle on Desktop: Price & Edit Price Button */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-t3navy/40 sm:text-right">
                          Selling Price
                        </p>
                        <p className="font-display text-lg sm:text-xl font-black text-t3red">
                          {formatNaira(item.price)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenPriceModal(item)}
                        className="inline-flex min-h-[38px] items-center gap-1 rounded-xl bg-t3navy/5 px-3 py-1.5 text-xs font-bold text-t3navy hover:bg-t3red hover:text-white active:scale-95 transition-all"
                        title="Change this price"
                      >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                        <span>Edit Price</span>
                      </button>
                    </div>

                    {/* Row 3 on Mobile / Right on Desktop: Availability Switch & Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 pt-2.5 sm:pt-0 border-t sm:border-0 border-t3navy/5">
                      {/* Big, thumb-friendly Turn Off / On Button */}
                      <button
                        type="button"
                        onClick={() => {
                          toggleAvailability(item.id)
                          showToast(
                            item.isAvailable
                              ? `Turned OFF ${item.name} (hidden from catalog)`
                              : `Turned ON ${item.name} (now visible on catalog)`
                          )
                        }}
                        className={`flex-1 sm:flex-none inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm active:scale-95 ${
                          item.isAvailable
                            ? 'bg-[#25D366] text-white hover:bg-red-500 hover:text-white'
                            : 'bg-red-100 text-red-700 hover:bg-[#25D366] hover:text-white'
                        }`}
                        title={
                          item.isAvailable
                            ? 'Click to turn OFF (customers will not see it in catalog)'
                            : 'Click to turn ON (customers can order it again)'
                        }
                      >
                        <span className={`h-2 w-2 rounded-full ${item.isAvailable ? 'bg-white' : 'bg-red-500'}`} />
                        <span>{item.isAvailable ? 'Available (On)' : 'Turned Off'}</span>
                      </button>

                      {/* Edit Details */}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="rounded-lg px-2.5 py-2 text-xs font-semibold text-t3navy/60 hover:bg-t3navy/5 hover:text-t3navy transition-colors"
                        title="Edit name and size"
                      >
                        Edit
                      </button>

                      {/* Delete Drink */}
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove ${item.name} from the store?`)) {
                            deleteDrink(item.id)
                            showToast(`Removed ${item.name}`)
                          }
                        }}
                        className="rounded-lg px-2.5 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                        title="Delete drink"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Factory Reset */}
        <div className="mt-8 sm:mt-12 rounded-3xl border border-t3navy/10 bg-white p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-display text-sm sm:text-base font-bold text-t3navy">
                Factory Reset &amp; Default Drinks
              </h3>
              <p className="mt-0.5 text-xs text-t3navy/60 max-w-xl">
                Restore the original list of drinks and prices anytime.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    'Are you sure you want to reset all drinks to factory defaults? Custom added drinks will be removed.'
                  )
                ) {
                  resetToDefaults()
                  showToast('Store reset to factory drinks!')
                }
              }}
              className="self-start sm:self-auto rounded-full border border-red-300 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
            >
              Reset to Factory List
            </button>
          </div>
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* QUICK PRICE EDIT MODAL                                              */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {editingPriceItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-t3navy-900/70 backdrop-blur-sm"
            onClick={() => setEditingPriceItem(null)}
          />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-t3navy/10">
              <h3 className="font-display text-lg sm:text-xl font-black text-t3navy">
                Change Price
              </h3>
              <button
                onClick={() => setEditingPriceItem(null)}
                className="grid h-8 w-8 place-items-center rounded-full text-t3navy/50 hover:bg-t3navy/5"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <p className="font-display text-base font-extrabold text-t3navy leading-tight">
                {editingPriceItem.name}
              </p>
              <p className="text-xs text-t3navy/60 mt-0.5">{editingPriceItem.size}</p>

              {/* Price input */}
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-t3navy/60">
                  New Selling Price (₦)
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display text-2xl font-black text-t3red">
                    ₦
                  </span>
                  <input
                    type="number"
                    step={100}
                    value={tempPrice || ''}
                    onChange={(e) => setTempPrice(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full rounded-2xl border-2 border-t3navy/20 bg-paper/60 py-3 pl-12 pr-4 font-display text-2xl font-black text-t3navy focus:border-t3red focus:bg-white focus:outline-none focus:ring-4 focus:ring-t3red/10"
                    autoFocus
                  />
                </div>
              </div>

              {/* Quick increment buttons */}
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {[
                  { label: '+₦100', val: 100 },
                  { label: '+₦200', val: 200 },
                  { label: '+₦500', val: 500 },
                  { label: '+₦1,000', val: 1000 },
                  { label: '-₦500', val: -500 },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    type="button"
                    onClick={() => setTempPrice((prev) => Math.max(0, prev + btn.val))}
                    className="rounded-full border border-t3navy/15 bg-white px-2.5 py-1 text-xs font-bold text-t3navy hover:bg-t3navy/5 active:scale-95"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPriceItem(null)}
                  className="rounded-full px-4 py-2 text-xs font-bold text-t3navy/70 hover:bg-t3navy/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePrice}
                  className="rounded-full bg-[#25D366] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#20ba5a] active:scale-95"
                >
                  Save ({formatNaira(tempPrice)})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ADD / EDIT DRINK MODAL                                              */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-t3navy-900/70 backdrop-blur-sm"
            onClick={() => setIsFormModalOpen(false)}
          />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-t3navy/10">
              <h3 className="font-display text-lg sm:text-xl font-black text-t3navy">
                {editingDrink ? 'Edit Drink' : 'Add New Drink to Catalog'}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-t3navy/50 hover:bg-t3navy/5"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDrink} className="mt-4 space-y-3.5">
              {/* Drink Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-t3navy/70">
                  Drink Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Zobo Drink, Bigi Chapman, Eva Water..."
                  className="mt-1.5 w-full rounded-2xl border border-t3navy/20 px-3.5 py-2.5 text-sm font-semibold text-t3navy focus:border-t3red focus:outline-none focus:ring-2 focus:ring-t3red/20"
                  autoFocus
                />
              </div>

              {/* Package / Size */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-t3navy/70">
                  Package / Size *
                </label>
                <input
                  type="text"
                  required
                  value={formSize}
                  onChange={(e) => setFormSize(e.target.value)}
                  placeholder="e.g. 50cl PET · Pack of 12, Crate of 24..."
                  className="mt-1.5 w-full rounded-2xl border border-t3navy/20 px-3.5 py-2.5 text-sm font-semibold text-t3navy focus:border-t3red focus:outline-none focus:ring-2 focus:ring-t3red/20"
                />

                {/* Quick Selection Chips */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {COMMON_PACK_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFormSize(sz)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
                        formSize === sz
                          ? 'bg-t3navy text-white'
                          : 'bg-t3navy/5 text-t3navy/70 hover:bg-t3navy/10'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-t3navy/70">
                  Selling Price (₦) *
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-lg font-black text-t3red">
                    ₦
                  </span>
                  <input
                    type="number"
                    step={100}
                    required
                    value={formPrice || ''}
                    onChange={(e) => setFormPrice(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full rounded-2xl border border-t3navy/20 py-2.5 pl-10 pr-4 font-display text-lg font-black text-t3navy focus:border-t3red focus:outline-none focus:ring-2 focus:ring-t3red/20"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="rounded-full px-4 py-2 text-xs font-bold text-t3navy/70 hover:bg-t3navy/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#25D366] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#20ba5a] active:scale-95"
                >
                  {editingDrink ? 'Save Changes' : '+ Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
