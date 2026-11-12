import cartService from './cartService';

const checkoutService = {
    clearCart() {
        return cartService.clearCart();
    },
};

export default checkoutService;
