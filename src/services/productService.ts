import api from './api'

export interface ProductVariant {
  id: number
  is_active?: boolean
  attributes?: Record<string, string | number>
  selling_price?: number | string | null
  price?: number | string | null
  stock?: number | string | null
}

export interface ProductCategory {
  id: number
  name: string
  slug?: string
}

export interface Product {
  id: number
  title: string
  description?: string
  sku?: string | null
  image_url?: string | null
  image?: string | null
  selling_price?: number | string | null
  price?: number | string | null
  stock?: number | string | null
  category_id?: number
  category?: ProductCategory | null
  variants?: ProductVariant[]
}

export interface PaginationMeta {
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
}

export interface Paginated<T> {
  data: T[]
  meta?: PaginationMeta | null
}

export interface ProductQuery {
  page?: number
  per_page?: number
  search?: string
  category?: string
  min_price?: string | number
  max_price?: string | number
  in_stock?: number
  sort?: string
}

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
