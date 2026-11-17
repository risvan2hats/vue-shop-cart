import api from './api'

export interface CartItemProduct {
  id: number
  title: string
  image_url?: string | null
  image?: string | null
  selling_price?: number | string | null
  price?: number | string | null
  stock?: number | string | null
  category?: { id?: number; name?: string } | null
}

export interface CartItemVariant {
  id: number
  stock?: number | string | null
  price?: number | string | null
  selling_price?: number | string | null
  attributes?: Record<string, string | number>
}

export interface CartItem {
  id: number | string
  product_id: number
  quantity: number
  product?: CartItemProduct | null
  variant_id?: number | null
  variant?: CartItemVariant | null
}

export interface CartApiPayload {
  data?: CartApiPayload | CartItem[]
  items?: CartItem[]
  id?: number | string
}

/**
 * Cart service for managing cart operations
 */
const cartService = {
  /**
   * Fetch the current cart
   */
  async getCart() {
    const response = await api.get<CartApiPayload>('/cart')
    return response.data
  },

  /**
   * Add an item to the cart
   */
  async addItem(productId: number, quantity = 1, variantId?: number | null) {
    const response = await api.post<CartApiPayload>('/cart/items', {
      product_id: productId,
      ...(variantId != null ? { variant_id: variantId } : {}),
      quantity,
    })

    return response.data
  },

  /**
   * Update the quantity of an item in the cart
   */
  async updateItem(cartItemId: number | string, quantity: number) {
    const response = await api.patch<CartApiPayload>(`/cart/items/${cartItemId}`, { quantity })
    return response.data
  },

  /**
   * Remove an item from the cart
   */
  async removeItem(cartItemId: number | string) {
    const response = await api.delete<CartApiPayload>(`/cart/items/${cartItemId}`)
    return response.data
  },

  /**
   * Clear the entire cart
   */
  async clearCart() {
    const response = await api.delete<CartApiPayload>('/cart')
    return response.data
  },
}

export default cartService
