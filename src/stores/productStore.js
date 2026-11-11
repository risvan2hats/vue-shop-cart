
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
    }),

    getters: {
        featuredProducts: (state) => state.products,

        formatPrice: () => (price) => new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(Number(price || 0)),

        getProductImage: () => (product) => {
            return product.image_url || product.image || null;
        },
    },

    actions: {
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
        async fetchProduct(id) {
            this.productLoading = true;
            this.productError = null;
            this.selectedProduct = null;

            try {
                const response = await productService.getProduct(id);
                this.selectedProduct = response.data || response;
            } catch (error) {
                this.productError = error.response?.data?.message
                    || 'Unable to load product. Please try again.';

                console.error('Product fetch failed:', error);
            } finally {
                this.productLoading = false;
            }
        },
    },
});
