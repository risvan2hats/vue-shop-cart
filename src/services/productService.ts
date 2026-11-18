import api from './api'
import type { Product, Paginated, ProductQuery } from '@/types/productTypes'

const productService = {
  /**
   * Fetch paginated products
   */
  async getProducts(params: ProductQuery = {}) {
    const response = await api.get<Paginated<Product>>('/products', {
      params,
    })

    return response.data
  },

  /**
   * Fetch a single product by ID
   */
  async getProduct(id: string | number) {
    const response = await api.get<Product | { data: Product }>(`/products/${id}`)
    return response.data
  },
}

export default productService
