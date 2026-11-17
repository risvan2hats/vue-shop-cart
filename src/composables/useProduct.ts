export type AttributeValue = string | number
export type AttributeMap = Record<string, AttributeValue>

export interface ProductVariant {
  id: number
  is_active?: boolean
  attributes?: AttributeMap
  selling_price?: number | string | null
  price?: number | string | null
  stock?: number | string | null
}

export interface Product {
  id: number
  title?: string
  description?: string
  sku?: string | null
  image_url?: string | null
  image?: string | null
  selling_price?: number | string | null
  price?: number | string | null
  stock?: number | string | null
  category_id?: number
  variants?: ProductVariant[]
}

/**
 * Shared product and pricing helpers.
 */
export function useProduct() {
  const getActiveVariants = (product?: Product | null) => (product?.variants || []).filter(
    (variant) => variant.is_active !== false,
  )

  const getVariantAttributes = (product?: Product | null) => [
    ...new Set(
      getActiveVariants(product).flatMap((variant) =>
        Object.keys(variant.attributes || {}),
      ),
    ),
  ]

  const getVariantOptions = (product: Product | null | undefined, attribute: string) => [
    ...new Set(
      getActiveVariants(product)
        .map((variant) => variant.attributes?.[attribute])
        .filter((value) => value != null),
    ),
  ]

  const getSelectedVariant = (product: Product | null | undefined, selectedAttributes: AttributeMap = {}) => (
    getActiveVariants(product).find((variant) => {
      const attributes = variant.attributes || {}
      return Object.keys(attributes).length === Object.keys(selectedAttributes).length
        && Object.entries(attributes).every(([key, value]) => selectedAttributes[key] === value)
    }) || null
  )

  const getCurrentPrice = (product?: Product | null, variant: ProductVariant | null = null) => Number(
    variant?.selling_price ??
    variant?.price ??
    product?.selling_price ??
    product?.price ??
    0,
  )

  const getOriginalPrice = (product?: Product | null, variant: ProductVariant | null = null) => Number(
    variant?.price ??
    product?.price ??
    0,
  )

  const hasDiscount = (product?: Product | null, variant: ProductVariant | null = null) => (
    getCurrentPrice(product, variant) < getOriginalPrice(product, variant)
  )

  const getProductStock = (product?: Product | null, variant: ProductVariant | null = null) => (
    getActiveVariants(product).length
      ? Number(variant?.stock || 0)
      : Number(product?.stock || 0)
  )

  const getProductImage = (product?: Product | null) => product?.image_url || product?.image || undefined

  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  const formatPrice = (price: number | string | null | undefined) => {
    const amount = Number(price)
    return usdFormatter.format(Number.isFinite(amount) ? amount : 0)
  }

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
  }
}
