import cartService from './cartService';
import productService from './productService';

const checkoutService = {
    async placeOrder(items, details) {
        const verifiedItems = await Promise.all(items.map(async (item) => {
            let product;
            try {
                product = await productService.getProduct(item.product_id);
            } catch (error) {
                if (error.response?.status === 404) {
                    throw new Error(`${item.product.title} is no longer available.`);
                }
                throw new Error('Unable to verify product stock. Please try again.');
            }

            if (Number(product.stock) < item.quantity) {
                throw new Error(`${product.title} has only ${product.stock} in stock.`);
            }
            return { ...item, product };
        }));

        const response = await cartService.clearCart();

        const subtotal = verifiedItems.reduce((sum, item) => {
            const price = Number(
                item.product.current_price ??
                item.product.selling_price ??
                item.product.price ??
                0
            );
            return sum + price * item.quantity;
        }, 0);
        const tax = Number((subtotal * 0.08).toFixed(2));
        const shipping = details.shipping_method === 'express' ? 12 : 5;

        return {
            ...response,
            id: response?.id ?? response?.order_id ?? null,
            items: verifiedItems,
            contact: details.contact,
            shipping_address: details.shipping_address,
            shipping_method: details.shipping_method,
            subtotal,
            tax,
            shipping,
            total: Number((subtotal + tax + shipping).toFixed(2)),
        };
    },
};

export default checkoutService;
