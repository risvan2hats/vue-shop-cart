<script setup>
import '../styles/pages/cart.css'
</script>
<template>

    <body>
        <main class="container">
            <div class="page-title">
                <div class="breadcrumb"><a href="index.html">Home</a> / Cart</div>
                <div class="eyebrow">Almost yours</div>
                <h1>Your cart</h1>
                <p class="muted">Review your items before checking out.</p>
            </div>
            <div class="cart-layout">
                <section>
                    <article class="cart-item">
                        <div class="cart-thumb"><img src="../assets/skincare-set.jpg" alt="Everyday Skin Set"></div>
                        <div>
                            <h3>Everyday Skin Set</h3>
                            <p class="muted">Variant: Standard</p>
                            <p class="price">$42.00</p><label class="muted" for="qty1">Quantity</label> <input
                                class="qty" id="qty1" type="number" min="1" value="1">
                        </div>
                        <div><strong>$42.00</strong>
                            <p><a href="#" class="muted">Remove</a></p>
                        </div>
                    </article>
                    <article class="cart-item">
                        <div class="cart-thumb"><img src="../assets/ceramic-vase.jpg" alt="Minimal Ceramic Vase"></div>
                        <div>
                            <h3>Minimal Ceramic Vase</h3>
                            <p class="muted">Colour: Natural</p>
                            <p class="price">$28.00</p><label class="muted" for="qty2">Quantity</label> <input
                                class="qty" id="qty2" type="number" min="1" value="1">
                        </div>
                        <div><strong>$28.00</strong>
                            <p><a href="#" class="muted">Remove</a></p>
                        </div>
                    </article>
                    <div class="actions"><a href="products.html" class="button secondary">Continue shopping</a></div>
                </section>
                <aside class="summary">
                    <h2>Order summary</h2>
                    <div class="summary-line"><span>Subtotal</span><strong>$70.00</strong></div>
                    <div class="summary-line"><span>Estimated tax (8%)</span><strong>$5.60</strong></div>
                    <div class="summary-line"><span>Shipping</span><strong>$5.00</strong></div>
                    <div class="summary-line"><span>Discount</span><strong>−$0.00</strong></div>
                    <form action="checkout.html" method="get">
                        <div class="field coupon-field"><label for="coupon">Discount code</label><input
                                id="coupon" name="coupon" placeholder="Enter promo code"></div><button type="submit"
                            class="button checkout-submit">Proceed to checkout</button>
                    </form>
                    <div class="summary-line summary-total"><span>Total</span><span>$80.60</span></div>
                    <p class="muted cart-disclaimer">Shipping and tax are estimates. Final amounts are confirmed
                        at checkout.</p>
                </aside>
            </div>
        </main>
    </body>
</template>