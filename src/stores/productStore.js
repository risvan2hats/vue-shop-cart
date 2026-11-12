
import { defineStore } from 'pinia';
import productService from '@/services/productService';

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [],
        meta: null,
        loading: false,
        error: null,

        selectedProduct: null,
        productLoading: false,
        productError: null,
        productNotFound: false,
    }),

    actions: {

        /**
         * Fetch products from the API with optional query parameters.
         * @param {Object} params - Query parameters for filtering, sorting, etc.
         */
        async fetchProducts(params = {}) {
            this.loading = true;
            this.error = null;

            try {
                const response = await productService.getProducts(params);

                this.products = response.data || [];
                this.meta = response.meta || null;

            } catch (error) {
                this.error = error.response?.data?.message
                    || 'Unable to load products. Please try again.';

                console.error('Product fetch failed:', error);

            } finally {
                this.loading = false;
            }
        },

        /**
         * Fetch a single product by its ID.
         * @param {string|number} id - The ID of the product to fetch.
         */
        async fetchProduct(id) {
            this.productLoading = true;
            this.productError = null;
            this.productNotFound = false;
            this.selectedProduct = null;

            try {
                const response = await productService.getProduct(id);
                const product = response.data || response;

                if (!product || !product.id) {
                    this.productNotFound = true;
                    return;
                }

                this.selectedProduct = product;

            } catch (error) {
                if (error.response?.status === 404) {
                    this.productNotFound = true;
                } else {
                    this.productError = error.response?.data?.message
                        || 'Unable to load product. Please try again.';
                }

                console.error('Product fetch failed:', error);

            } finally {
                this.productLoading = false;
            }
        },
    },
});
