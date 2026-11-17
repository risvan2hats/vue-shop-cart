import { defineStore } from 'pinia'
import productService, { type PaginationMeta, type Product, type ProductQuery } from '@/services/productService'
import { getApiErrorStatus } from '@/services/api'
import { showToast } from '@/composables/showToast'

function readProduct(payload: Product | { data?: Product } | null | undefined): Product | null {
  if (!payload) return null
  if ('id' in payload && payload.id) return payload
  if ('data' in payload && payload.data?.id) return payload.data
  return null
}

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    meta: null as PaginationMeta | null,
    loading: false,

    selectedProduct: null as Product | null,
    productLoading: false,
    productNotFound: false,
  }),

  actions: {
    /**
     * Fetch products from the API with optional query parameters.
     */
    async fetchProducts(params: ProductQuery = {}) {
      this.loading = true

      try {
        const response = await productService.getProducts(params)

        this.products = response.data || []
        this.meta = response.meta || null
      } catch {
        showToast('Unable to load products. Please try again.', 'error')
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch a single product by its ID.
     */
    async fetchProduct(id: string | number) {
      this.productLoading = true
      this.productNotFound = false
      this.selectedProduct = null

      try {
        const product = readProduct(await productService.getProduct(id))

        if (!product) {
          this.productNotFound = true
          return
        }

        this.selectedProduct = product
      } catch (error: unknown) {
        showToast('Unable to load product. Please try again.', 'error')
        if (getApiErrorStatus(error) === 404) {
          this.productNotFound = true
        }
      } finally {
        this.productLoading = false
      }
    },
  },
})
