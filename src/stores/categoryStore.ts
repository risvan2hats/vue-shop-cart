import { defineStore } from 'pinia'
import categoryService, { type CategoryQuery, type ProductCategory } from '@/services/categoryService'
import { showToast } from '@/composables/showToast'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as ProductCategory[],
    loading: false,
  }),

  actions: {
    /**
     * Fetch categories from API
     */
    async fetchCategories(params: CategoryQuery = {}) {
      this.loading = true

      try {
        const response = await categoryService.getCategories(params)

        this.categories = response.data || []
      } catch {
        showToast('Unable to load categories. Please try again.', 'error')
      } finally {
        this.loading = false
      }
    },
  },
})
