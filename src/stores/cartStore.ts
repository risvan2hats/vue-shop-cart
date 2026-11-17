// Cart store – unified, deduplicated, using Pinia setup syntax.
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import cartService from '@/services/cartService'
import checkoutService from '@/services/checkoutService'
import { getApiErrorMessage, getApiErrorStatus } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'
import { useProductStore } from '@/stores/productStore'
import { useProduct } from '@/composables/useProduct'
import { showToast } from '@/composables/showToast'

// Re‑use product types from the product service (they match the composable types).
import type { Product, ProductVariant } from '@/services/productService'
import type { CartApiPayload } from '@/services/cartService'

export interface CartItem {
  id: number | string
  product_id: number
  quantity: number
  // Optional full objects for backward‑compatible UI components.
  product?: Product | null
  variant_id?: number | null
  variant?: ProductVariant | null
}

const GUEST_CART_STORAGE_KEY = 'guest_cart'

/** Retrieve guest cart items from local storage. */
function getStoredGuestCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}
/** Save guest cart items to local storage. */
function saveStoredGuestCart(items: CartItem[]) {
  try {
    localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    showToast('Unable to save guest cart.', 'error')
  }
}
/** Clear guest cart from local storage. */
function clearStoredGuestCart() {
  try {
    localStorage.removeItem(GUEST_CART_STORAGE_KEY)
  } catch {
    showToast('Unable to clear guest cart.', 'error')
  }
}
/** Normalise any cart payload to our CartItem shape. */
function normalizeItem(raw: CartItem): CartItem {
  return {
    id: raw.id,
    product_id: raw.product?.id ?? raw.product_id,
    variant_id: raw.variant?.id ?? raw.variant_id ?? null,
    quantity: Number(raw.quantity ?? 0),
    product: raw.product ?? undefined,
    variant: raw.variant ?? undefined,
  }
}

const taxRate = Number(import.meta.env.VITE_TAX_RATE ?? 0.08)
const shipping = Number(import.meta.env.VITE_SHIPPING_COST ?? 5)

export const useCartStore = defineStore('cart', () => {
  // ---- State ------------------------------------------------------------
  const items = ref<CartItem[]>(getStoredGuestCart())
  const addingProductId = ref<number | null>(null)
  const updatingItemId = ref<number | string | null>(null)
  const checkoutComplete = ref(false)
  const mergePromise = ref<Promise<void> | null>(null)

  // ---- Getters ----------------------------------------------------------
  const totalItems = computed(() => items.value.length)
  const totalQuantity = computed(() => items.value.reduce((t, i) => t + i.quantity, 0))
  const totalAmount = computed(() => {
    const productStore = useProductStore()
    return items.value.reduce((sum, item) => {
      const product = productStore.products.find((p) => p.id === item.product_id) ?? item.product ?? null
      const variant = product?.variants?.find((v) => v.id === item.variant_id) ?? item.variant ?? null
      return sum + (useProduct().getCurrentPrice(product, variant) * item.quantity)
    }, 0)
  })

  // ---- Helper functions -------------------------------------------------
  const loadGuestCart = () => {
    items.value = getStoredGuestCart()
  }
  const saveGuestCart = () => {
    saveStoredGuestCart(items.value)
  }
  const clearGuestCart = () => {
    clearStoredGuestCart()
    items.value = []
  }

  // ---- Actions ----------------------------------------------------------
  const fetchCart = async () => {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) return loadGuestCart()
    try {
      const resp = await cartService.getCart()
      const payload = (resp as CartApiPayload).items ?? (resp as CartApiPayload).data ?? []
      items.value = (payload as CartItem[]).map(normalizeItem)
    } catch (e) {
      if (getApiErrorStatus(e) === 401) return loadGuestCart()
      showToast('Unable to load your cart. Please try again.', 'error')
    }
  }

  const mergeGuestCart = async () => {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) return
    if (mergePromise.value) return mergePromise.value
    mergePromise.value = (async () => {
      const guest = getStoredGuestCart()
      if (!guest.length) return fetchCart()
      clearStoredGuestCart()
      const merged: Record<string, { productId: number; variantId: number | null; qty: number }> = {}
      guest.forEach((it) => {
        const key = `${it.product_id}:${it.variant_id ?? 'null'}`
        merged[key] = merged[key]
          ? { ...merged[key], qty: merged[key].qty + it.quantity }
          : { productId: it.product_id, variantId: it.variant_id ?? null, qty: it.quantity }
      })
      for (const k in merged) {
        const { productId, variantId, qty } = merged[k]
        try {
          await cartService.addItem(productId, qty, variantId)
        } catch {
          showToast('Unable to merge cart.', 'error')
        }
      }
      await fetchCart()
    })()
    return mergePromise.value
  }

  const addToCart = async (product: Product | null, qty = 1, variant: ProductVariant | null = null) => {
    if (!product?.id || qty < 1) return false
    addingProductId.value = product.id
    const auth = useAuthStore()
    const findExisting = () => items.value.find((i) => i.product_id === product.id && i.variant_id === (variant?.id ?? null))
    if (!auth.isAuthenticated) {
      const existing = findExisting()
      const stock = Number(variant?.stock ?? product.stock ?? 999)
      const newQty = (existing?.quantity ?? 0) + qty
      if (newQty > stock) {
        showToast('Cannot add more than available stock.', 'error')
        addingProductId.value = null
        return false
      }
      if (existing) {
        existing.quantity = newQty
      } else {
        items.value.push({
          id: `guest_${product.id}_${variant?.id ?? 'def'}`,
          product_id: product.id,
          variant_id: variant?.id ?? null,
          quantity: qty,
          product,
          variant: variant ?? undefined,
        })
      }
      saveGuestCart()
      showToast('Added to cart.', 'success')
      addingProductId.value = null
      return true
    }
    try {
      await cartService.addItem(product.id, qty, variant?.id)
      await fetchCart()
      showToast('Added to cart.', 'success')
      return true
    } catch (e) {
      showToast(getApiErrorMessage(e) || 'Unable to add product to cart.', 'error')
      return false
    } finally {
      addingProductId.value = null
    }
  }

  const removeItem = async (id: number | string) => {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) {
      items.value = items.value.filter((i) => String(i.id) !== String(id))
      saveGuestCart()
      showToast('Removed from cart.', 'success')
      return true
    }
    try {
      await cartService.removeItem(id)
      await fetchCart()
      showToast('Removed from cart.', 'success')
      return true
    } catch {
      showToast('Unable to remove item from cart.', 'error')
      return false
    }
  }

  const updateItemQuantity = async (id: number | string, qty: number) => {
    if (qty < 1) return false
    const auth = useAuthStore()
    const item = items.value.find((i) => String(i.id) === String(id))
    if (!item) return false

    const product = useProductStore().products.find((p) => p.id === item.product_id)
    const variant = product?.variants?.find((v) => v.id === item.variant_id)
    const stock = Number(variant?.stock ?? product?.stock ?? 999)
    if (qty > stock) {
      showToast('Quantity exceeds available stock.', 'error')
      return false
    }

    if (!auth.isAuthenticated) {
      item.quantity = qty
      saveGuestCart()
      showToast('Cart quantity updated.', 'success')
      return true
    }
    try {
      await cartService.updateItem(id, qty)
      await fetchCart()
      showToast('Cart quantity updated.', 'success')
      return true
    } catch {
      showToast('Unable to update item quantity.', 'error')
      return false
    }
  }

  const resetCart = () => {
    clearGuestCart()
    items.value = []
  }

  const clearCart = async () => {
    if (!items.value.length) throw new Error('Your cart is empty.')
    const auth = useAuthStore()
    if (auth.isAuthenticated) {
      await checkoutService.clearCart();
    }
    resetCart()
  }

  return {
    // state
    items,
    addingProductId,
    updatingItemId,
    checkoutComplete,
    taxRate,
    shipping,
    mergePromise,
    // getters
    totalItems,
    totalQuantity,
    totalAmount,
    // actions / helpers
    loadGuestCart,
    saveGuestCart,
    clearGuestCart,
    fetchCart,
    mergeGuestCart,
    addToCart,
    removeItem,
    updateItemQuantity,
    resetCart,
    clearCart,
  }
})
