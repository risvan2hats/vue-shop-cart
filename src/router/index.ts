import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    guestOnly?: boolean;
    title?: string;
  }
}

import { useAuthStore } from "@/stores/authStore";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { guestOnly: true, title: "Sign In" },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/ProfileView.vue"),
    meta: { requiresAuth: true, title: "My Profile" },
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
    meta: { title: "Home" },
  },
  {
    path: "/products",
    name: "products",
    component: () => import("@/views/AllProducts.vue"),
    meta: { title: "All Products" },
  },
  {
    path: "/products/:id",
    name: "product-details",
    component: () => import("@/views/ProductDetails.vue"),
    meta: { title: "Product Details" },
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("@/views/CartView.vue"),
    meta: { title: "Cart" },
  },
  {
    path: "/checkout",
    name: "checkout",
    component: () => import("@/views/CheckoutView.vue"),
    meta: { requiresAuth: true, title: "Checkout" },
  },
  {
    path: "/order-confirmation",
    name: "order-confirmation",
    component: () => import("@/views/orderConfirmationView.vue"),
    meta: { title: "Order Confirmation" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: "home" };
  }
});

const defaultTitle =
  (import.meta.env.VITE_SITE_TITLE as string | undefined) || "";

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} | ${defaultTitle}`
    : defaultTitle;
});

export default router;
