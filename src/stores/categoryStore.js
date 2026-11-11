import { defineStore } from 'pinia';
import categoryService from '@/services/categoryService';

// Define a Pinia store for managing categories
export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: [],
        loading: false,
        error: null,
    }),

    actions: {

        /**
         * Fetch categories from API
         */
        async fetchCategories(params = {}) {
            this.loading = true;
            this.error = null;

            try {
                const response = await categoryService.getCategories(params);

                this.categories = response.data || [];

            } catch (error) {
                this.error = error.response?.data?.message
                    || 'Unable to load categories. Please try again.';

                console.error('Category fetch failed:', error);

            } finally {
                this.loading = false;
            }
        },

    },
});