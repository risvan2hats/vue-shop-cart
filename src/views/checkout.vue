<script setup>
import '../styles/pages/checkout.css'
</script>


<template>>

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Checkout | Northstar</title>
        <meta name="description" content="Discover everyday essentials at Northstar.">
    </head>

    <body>
        <div class="topbar">
            <div class="container nav"><a class="logo" href="index.html">north<span>star.</span></a>
                <nav class="navlinks"><a href="index.html">Home</a><a href="products.html">Shop</a><a
                        href="products.html?category=beauty">Beauty</a><a
                        href="products.html?category=fragrances">Fragrance</a></nav>
                <div class="navright"><a href="cart.html" class="cart-link">Cart (2)</a></div>
            </div>
        </div>
        <main class="container">
            <div class="page-title">
                <div class="breadcrumb"><a href="index.html">Home</a> / <a href="cart.html">Cart</a> / Checkout</div>
                <div class="eyebrow">Secure checkout</div>
                <h1>Complete your order</h1>
                <p class="muted">You're just a few details away from your order.</p>
            </div>
            <form action="order-confirmation.html" method="get" class="checkout-grid">
                <div>
                    <section class="form-card">
                        <h2>Contact information</h2>
                        <div class="form-grid">
                            <div class="field"><label for="email">Email address *</label><input id="email" name="email"
                                    type="email" autocomplete="email" required placeholder="you@example.com"></div>
                            <div class="field"><label for="phone">Phone number *</label><input id="phone" name="phone"
                                    type="tel" autocomplete="tel" required placeholder="+1 555 000 0000"></div>
                        </div>
                    </section>
                    <section class="form-card">
                        <h2>Shipping address</h2>
                        <div class="form-grid">
                            <div class="field"><label for="first">First name *</label><input id="first" name="firstName"
                                    autocomplete="given-name" required></div>
                            <div class="field"><label for="last">Last name *</label><input id="last" name="lastName"
                                    autocomplete="family-name" required></div>
                        </div>
                        <div class="field"><label for="address">Street address *</label><input id="address"
                                name="address" autocomplete="street-address" required></div>
                        <div class="field"><label for="address2">Apartment, suite, etc.</label><input id="address2"
                                name="address2" autocomplete="address-line2"></div>
                        <div class="form-grid">
                            <div class="field"><label for="city">City *</label><input id="city" name="city"
                                    autocomplete="address-level2" required></div>
                            <div class="field"><label for="region">State / Province *</label><input id="region"
                                    name="region" autocomplete="address-level1" required></div>
                            <div class="field"><label for="postal">Postal code *</label><input id="postal"
                                    name="postalCode" autocomplete="postal-code" required></div>
                            <div class="field"><label for="country">Country *</label><select id="country" name="country"
                                    required>
                                    <option value="">Select country</option>
                                    <option>United States</option>
                                    <option>India</option>
                                    <option>United Kingdom</option>
                                    <option>Canada</option>
                                </select></div>
                        </div>
                    </section>
                    <section class="form-card">
                        <h2>Shipping method</h2><label class="radio-card"><input type="radio" name="shipping"
                                value="standard" checked><span><strong>Standard delivery</strong><br><span
                                    class="muted">3–5 business days · $5.00</span></span></label><label
                            class="radio-card"><input type="radio" name="shipping" value="express"><span><strong>Express
                                    delivery</strong><br><span class="muted">1–2 business days ·
                                    $12.00</span></span></label>
                    </section>
                    <section class="form-card">
                        <h2>Payment details</h2>
                        <p class="muted">Demo checkout UI — do not enter real card details.</p>
                        <div class="field"><label for="cardname">Name on card</label><input id="cardname"
                                name="cardName" autocomplete="cc-name" placeholder="Full name"></div>
                        <div class="field"><label for="cardnumber">Card number</label><input id="cardnumber"
                                name="cardNumber" inputmode="numeric" autocomplete="cc-number"
                                placeholder="•••• •••• •••• ••••"></div>
                        <div class="form-grid">
                            <div class="field"><label for="expiry">Expiry date</label><input id="expiry" name="expiry"
                                    autocomplete="cc-exp" placeholder="MM / YY"></div>
                            <div class="field"><label for="cvv">Security code</label><input id="cvv" name="cvv"
                                    inputmode="numeric" autocomplete="cc-csc" placeholder="CVV"></div>
                        </div>
                    </section>
                </div>
                <aside class="summary">
                    <h2>Order summary</h2>
                    <div class="summary-line"><span>Everyday Skin Set × 1</span><strong>$42.00</strong></div>
                    <div class="summary-line"><span>Minimal Ceramic Vase × 1</span><strong>$28.00</strong></div>
                    <div class="summary-line"><span>Subtotal</span><strong>$70.00</strong></div>
                    <div class="summary-line"><span>Tax</span><strong>$5.60</strong></div>
                    <div class="summary-line"><span>Shipping</span><strong>$5.00</strong></div>
                    <div class="summary-line summary-total"><span>Total</span><span>$80.60</span></div><button
                        type="submit" class="checkout-place-order">Place order · $80.60</button>
                    <p class="muted checkout-disclaimer">By placing your order, you agree to our
                        terms and privacy policy.</p>
                </aside>
            </form>
        </main>
    </body>
</template>