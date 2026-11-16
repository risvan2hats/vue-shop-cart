import { defineStore } from 'pinia';
import categoryService from '@/services/categoryService';
import { showToast } from '@/composables/showToast';

// Define a Pinia store for managing categories
export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: [],
        loading: false,
    }),

    actions: {

        /**
         * Fetch categories from API
         */
        async fetchCategories(params = {}) {
            this.loading = true;

            try {
                const response = await categoryService.getCategories(params);

                this.categories = response.data || [];

            } catch {
                showToast('Unable to load categories. Please try again.', 'error');

            } finally {
                this.loading = false;
            }
        },

    },
});