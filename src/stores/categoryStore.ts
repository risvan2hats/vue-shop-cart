import { defineStore } from 'pinia'
import categoryService from '@/services/categoryService'
import type { CategoryQuery, ProductCategory, ProductSubCategory } from '@/types/productTypes'
import { showToast } from '@/composables/showToast'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as ProductCategory[],
    subCategories: [] as ProductSubCategory[],
    loading: false,
    subCategoriesLoading: false,
  }),

  getters: {
    /**
     * Sub-categories filtered by category id
     */
    subCategoriesForCategory: (state) => (categoryId: number) =>
      state.subCategories.filter((sc) => sc.category_id === categoryId),
  },

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

    /**
     * Fetch all sub-categories from API
     */
    async fetchSubCategories(params: CategoryQuery = {}) {
      this.subCategoriesLoading = true

      try {
        const response = await categoryService.getSubCategories(params)

        this.subCategories = response.data || []
      } catch {
        showToast('Unable to load sub-categories. Please try again.', 'error')
      } finally {
        this.subCategoriesLoading = false
      }
    },
  },
})
