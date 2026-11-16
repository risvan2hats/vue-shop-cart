
import { defineStore } from 'pinia';
import productService from '@/services/productService';
import { useErrorMessage } from '@/composables/useErrorMessage';

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [],
        meta: null,
        loading: false,

        selectedProduct: null,
        productLoading: false,
        productNotFound: false,
    }),

    actions: {

        /**
         * Fetch products from the API with optional query parameters.
         * @param {Object} params - Query parameters for filtering, sorting, etc.
         */
        async fetchProducts(params = {}) {
            this.loading = true;

            try {
                const response = await productService.getProducts(params);

                this.products = response.data || [];
                this.meta = response.meta || null;

            } catch (error) {
                useErrorMessage(error, 'Unable to load products. Please try again.', 'Load products');

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
                useErrorMessage(error, 'Unable to load product. Please try again.', 'Load product');
                if (error.response?.status === 404) {
                    this.productNotFound = true;
                }

            } finally {
                this.productLoading = false;
            }
        },
    },
});
