import { defineStore } from 'pinia';
import categoryService from '@/services/categoryService';
import { useErrorMessage } from '@/composables/useErrorMessage';

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

            } catch (error) {
                useErrorMessage(error, 'Unable to load categories. Please try again.', 'Load categories');

            } finally {
                this.loading = false;
            }
        },

    },
});