/**
 * Shared product and pricing helpers.
 */
export function useProduct() {
    const getActiveVariants = (product) => (product?.variants || []).filter(
        (variant) => variant.is_active !== false
    );

    const getVariantAttributes = (product) => [
        ...new Set(
            getActiveVariants(product).flatMap((variant) =>
                Object.keys(variant.attributes || {})
            )
        ),
    ];

    const getVariantOptions = (product, attribute) => [
        ...new Set(
            getActiveVariants(product)
                .map((variant) => variant.attributes?.[attribute])
                .filter((value) => value != null)
        ),
    ];

    const getSelectedVariant = (product, selectedAttributes = {}) => (
        getActiveVariants(product).find((variant) => {
            const attributes = variant.attributes || {};
            return Object.keys(attributes).length === Object.keys(selectedAttributes).length
                && Object.entries(attributes).every(([key, value]) => selectedAttributes[key] === value);
        }) || null
    );

    const getCurrentPrice = (product, variant = null) => Number(
        variant?.selling_price ??
        variant?.price ??
        product?.selling_price ??
        product?.price ??
        0
    );

    const getOriginalPrice = (product, variant = null) => Number(
        variant?.price ??
        product?.price ??
        0
    );

    const hasDiscount = (product, variant = null) => (
        getCurrentPrice(product, variant) < getOriginalPrice(product, variant)
    );

    const getProductStock = (product, variant = null) => (
        getActiveVariants(product).length
            ? Number(variant?.stock || 0)
            : Number(product?.stock || 0)
    );

    const getProductImage = (product) => product?.image_url || product?.image || null;

    const usdFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const formatPrice = (price) => {
        const amount = Number(price);
        return usdFormatter.format(Number.isFinite(amount) ? amount : 0);
    };

    return {
        getActiveVariants,
        getVariantAttributes,
        getVariantOptions,
        getSelectedVariant,
        getCurrentPrice,
        getOriginalPrice,
        hasDiscount,
        getProductStock,
        getProductImage,
        formatPrice,
    };
}
