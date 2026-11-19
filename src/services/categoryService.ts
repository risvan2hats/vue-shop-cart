import api from './api'
import type {
  CategoryQuery,
  Paginated,
  ProductCategory,
  ProductSubCategory,
} from '@/types/productTypes'

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

  /**
   * Fetch sub-categories
   */
  async getSubCategories(params: CategoryQuery = {}) {
    const response = await api.get<{ data: ProductSubCategory[] }>('/sub-categories', {
      params,
    })

    return response.data
  },
}

export default categoryService
