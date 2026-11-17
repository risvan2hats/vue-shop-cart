import api from './api'

export interface ProductCategory {
  id: number
  name: string
  slug: string
}

export interface CategoryQuery {
  [key: string]: string | number | boolean | undefined
}

export interface Paginated<T> {
  data: T[]
  meta?: {
    current_page?: number
    last_page?: number
    per_page?: number
    total?: number
  } | null
}

const categoryService = {
  /**
   * Fetch categories
   */
  async getCategories(params: CategoryQuery = {}) {
    const response = await api.get<Paginated<ProductCategory>>('/categories', {
      params,
    })

    return response.data
  },
}

export default categoryService
