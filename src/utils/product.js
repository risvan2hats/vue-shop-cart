/**
 * Get active product variants.
 */
export const getActiveVariants = (product) => {
    return (product?.variants || []).filter(
        (variant) => variant.is_active !== false
    );
};

/**
 * Get available variant attribute names.
 */
export const getVariantAttributes = (product) => {
    return [
        ...new Set(
            getActiveVariants(product).flatMap((variant) =>
                Object.keys(variant.attributes || {})
            )
        ),
    ];
};

/**
 * Get available options for a variant attribute.
 */
export const getVariantOptions = (product, attribute) => {
    return [
        ...new Set(
            getActiveVariants(product)
                .map((variant) => variant.attributes?.[attribute])
                .filter((value) => value != null)
        ),
    ];
};

/**
 * Find the selected product variant.
 */
export const getSelectedVariant = (product, selectedAttributes = {}) => {
    return getActiveVariants(product).find((variant) => {
        const attributes = variant.attributes || {};

        return Object.keys(attributes).length === Object.keys(selectedAttributes).length
            && Object.entries(attributes).every(
                ([key, value]) => selectedAttributes[key] === value
            );
    }) || null;
};

/**
 * Get current selling price.
 */
export const getCurrentPrice = (product, variant = null) => {
    return Number(
        variant?.selling_price ??
        variant?.price ??
        product?.selling_price ??
        product?.price ??
        0
    );
};

/**
 * Get original product price.
 */
export const getOriginalPrice = (product, variant = null) => {
    return Number(
        variant?.price ??
        product?.price ??
        0
    );
};

/**
 * Check whether product has a discount.
 */
export const hasDiscount = (product, variant = null) => {
    return getCurrentPrice(product, variant) < getOriginalPrice(product, variant);
};

/**
 * Get available product stock.
 */
export const getProductStock = (product, variant = null) => {
    if (getActiveVariants(product).length) {
        return Number(variant?.stock || 0);
    }

    return Number(product?.stock || 0);
};

/**
 * Get product image.
 */
export const getProductImage = (product) => {
    return product?.image_url || product?.image || null;
};

/**
 * Format a number as USD currency.
 */
export const formatPrice = (price) => {
    const amount = Number(price);

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number.isFinite(amount) ? amount : 0);
};
