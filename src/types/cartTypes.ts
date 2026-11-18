// Shared cart‑related types
import type { Product, ProductVariant } from "@/services/productService";

/** Cart item shape – reused across the app */
export interface CartItem {
  id: number | string;
  product_id: number;
  quantity: number;
  // Optional full objects for backward‑compatible UI components.
  product?: Product | null;
  variant_id?: number | null;
  variant?: ProductVariant | null;
}
