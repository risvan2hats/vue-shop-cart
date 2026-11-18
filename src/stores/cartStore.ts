// Cart store – logged in: the API is the source of truth; guest: local storage.
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import cartService from '@/services/cartService';
import checkoutService from '@/services/checkoutService';
import { getApiErrorMessage, getApiErrorStatus } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { useProductStore } from '@/stores/productStore';
import { useProduct } from '@/composables/useProduct';
import { showToast } from '@/composables/showToast';

// Shared types
import type { Product, ProductVariant } from '@/types/productTypes';
import type { CartItem } from '@/types/cartTypes';

const GUEST_CART_STORAGE_KEY = 'guest_cart';

/** Retrieve guest cart items from local storage. */
function getStoredGuestCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}
/** Save guest cart items to local storage. */
function saveStoredGuestCart(items: CartItem[]) {
  try {
    localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    showToast('Unable to save guest cart.', 'error');
  }
}
/** Clear guest cart from local storage. */
function clearStoredGuestCart() {
  try {
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
  } catch {
    showToast('Unable to clear guest cart.', 'error');
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
  };
}

/** Unique key for a product/variant line. */
const lineKey = (i: CartItem) => `${i.product_id}:${i.variant_id ?? 'null'}`;

/** Available stock for a product or variant (999 when unknown). */
const stockOf = (product?: Product | null, variant?: ProductVariant | null) =>
  Number(variant?.stock ?? product?.stock ?? 999);

const taxRate = Number(import.meta.env.VITE_TAX_RATE ?? 0.08);
const shipping = Number(import.meta.env.VITE_SHIPPING_COST ?? 5);

export const useCartStore = defineStore('cart', () => {
  // ---- State ------------------------------------------------------------
  const items = ref<CartItem[]>(getStoredGuestCart());
  const addingProductId = ref<number | null>(null);
  const updatingItemId = ref<number | string | null>(null);
  const checkoutComplete = ref(false);
  const mergePromise = ref<Promise<void> | null>(null);

  const { getCurrentPrice } = useProduct();
  const isAuth = () => useAuthStore().isAuthenticated;

  // ---- Getters ----------------------------------------------------------
  const totalItems = computed(() => items.value.length);
  const totalQuantity = computed(() =>
    items.value.reduce((t, i) => t + i.quantity, 0),
  );
  const totalAmount = computed(() => {
    const { products } = useProductStore();
    return items.value.reduce((sum, item) => {
      const product =
        products.find((p) => p.id === item.product_id) ?? item.product ?? null;
      const variant =
        product?.variants?.find((v) => v.id === item.variant_id) ??
        item.variant ??
        null;
      return sum + getCurrentPrice(product, variant) * item.quantity;
    }, 0);
  });

  // ---- Guest cart helpers -----------------------------------------------
  const loadGuestCart = () => {
    items.value = getStoredGuestCart();
  };
  const saveGuestCart = () => saveStoredGuestCart(items.value);
  const clearGuestCart = () => {
    clearStoredGuestCart();
    items.value = [];
  };
  const resetCart = clearGuestCart;

  // ---- Actions ----------------------------------------------------------
  /** Load the cart from the API, or from local storage for guests. */
  const fetchCart = async () => {
    if (!isAuth()) return loadGuestCart();
    try {
      const resp = await cartService.getCart();
      const data = resp.data as CartItem[] | { items?: CartItem[] } | null;
      const payload = Array.isArray(data) ? data : (data?.items ?? []);
      items.value = payload.map(normalizeItem);
    } catch (e) {
      if (getApiErrorStatus(e) === 401) return loadGuestCart();
      showToast('Unable to load your cart. Please try again.', 'error');
    }
  };

  /**
   * After login: send guest items to the API, then reload the server cart.
   * Lines that fail to merge stay in local storage so nothing is lost.
   */
  const mergeGuestCart = async () => {
    if (!isAuth()) return;
    mergePromise.value ??= (async () => {
      try {
        const guest = getStoredGuestCart();

        // Combine duplicate product/variant lines into one quantity.
        const lines = new Map<
          string,
          { productId: number; variantId: number | null; qty: number }
        >();
        for (const i of guest) {
          const key = lineKey(i);
          const line = lines.get(key) ?? {
            productId: i.product_id,
            variantId: i.variant_id ?? null,
            qty: 0,
          };
          line.qty += i.quantity;
          lines.set(key, line);
        }

        const failed = new Set<string>();
        for (const [key, { productId, variantId, qty }] of lines) {
          try {
            await cartService.addItem(productId, qty, variantId);
          } catch {
            failed.add(key);
          }
        }

        if (failed.size) {
          saveStoredGuestCart(guest.filter((i) => failed.has(lineKey(i))));
          showToast('Some guest cart items could not be merged.', 'error');
        } else {
          clearStoredGuestCart();
        }
        await fetchCart();
      } finally {
        mergePromise.value = null;
      }
    })();
    return mergePromise.value;
  };

  /** Add a product (and optional variant) via the API, or local storage for guests. */
  const addToCart = async (
    product: Product | null,
    qty = 1,
    variant: ProductVariant | null = null,
  ) => {
    if (!product?.id || qty < 1) return false;
    addingProductId.value = product.id;
    try {
      if (isAuth()) {
        await cartService.addItem(product.id, qty, variant?.id);
        await fetchCart();
      } else {
        const variantId = variant?.id ?? null;
        const existing = items.value.find(
          (i) => i.product_id === product.id && i.variant_id === variantId,
        );
        const newQty = (existing?.quantity ?? 0) + qty;
        if (newQty > stockOf(product, variant)) {
          showToast('Cannot add more than available stock.', 'error');
          return false;
        }
        if (existing) {
          existing.quantity = newQty;
        } else {
          items.value.push({
            id: `guest_${product.id}_${variant?.id ?? 'def'}`,
            product_id: product.id,
            variant_id: variantId,
            quantity: qty,
            product,
            variant: variant ?? undefined,
          });
        }
        saveGuestCart();
      }
      showToast('Added to cart.', 'success');
      return true;
    } catch (e) {
      showToast(
        getApiErrorMessage(e) || 'Unable to add product to cart.',
        'error',
      );
      return false;
    } finally {
      addingProductId.value = null;
    }
  };

  /** Remove a cart line by id. */
  const removeItem = async (id: number | string) => {
    try {
      if (isAuth()) {
        await cartService.removeItem(id);
        await fetchCart();
      } else {
        items.value = items.value.filter((i) => String(i.id) !== String(id));
        saveGuestCart();
      }
      showToast('Removed from cart.', 'success');
      return true;
    } catch {
      showToast('Unable to remove item from cart.', 'error');
      return false;
    }
  };

  /** Set a cart line's quantity, checking available stock first. */
  const updateItemQuantity = async (id: number | string, qty: number) => {
    if (qty < 1) return false;
    const item = items.value.find((i) => String(i.id) === String(id));
    if (!item) return false;

    const product = useProductStore().products.find(
      (p) => p.id === item.product_id,
    );
    const variant = product?.variants?.find((v) => v.id === item.variant_id);
    if (qty > stockOf(product, variant)) {
      showToast('Quantity exceeds available stock.', 'error');
      return false;
    }

    updatingItemId.value = id;
    try {
      if (isAuth()) {
        await cartService.updateItem(id, qty);
        await fetchCart();
      } else {
        item.quantity = qty;
        saveGuestCart();
      }
      showToast('Cart quantity updated.', 'success');
      return true;
    } catch {
      showToast('Unable to update item quantity.', 'error');
      return false;
    } finally {
      updatingItemId.value = null;
    }
  };

  /** Empty the cart on the server (if logged in) and locally. */
  const clearCart = async () => {
    if (!items.value.length) throw new Error('Your cart is empty.');
    if (isAuth()) await checkoutService.clearCart();
    clearGuestCart();
  };

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
  };
});