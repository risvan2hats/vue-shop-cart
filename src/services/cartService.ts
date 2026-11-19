import api from './api'
import type { CartApiPayload } from '@/types/cartTypes'

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
