<script setup>
import '../styles/pages/order-confirmation.css'
</script>
<template>

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Order confirmation | Northstar</title>
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
            <section class="success">
                <div class="success-icon">✓</div>
                <div class="eyebrow">Order confirmed</div>
                <h1>Thank you for your order!</h1>
                <p class="muted">Your order has been placed successfully. A confirmation email will be sent to your
                    inbox shortly.</p>
                <div class="summary confirmation-summary">
                    <div class="summary-line"><span>Order number</span><strong>#NS-2026-00842</strong></div>
                    <div class="summary-line"><span>Order date</span><strong>November 7, 2026</strong></div>
                    <div class="summary-line"><span>Payment status</span><strong
                            class="paid-status">Paid</strong></div>
                    <div class="summary-line"><span>Estimated delivery</span><strong>November 12–14</strong></div>
                    <div class="summary-line summary-total"><span>Order total</span><span>$80.60</span></div>
                </div><a class="button" href="products.html">Continue shopping</a>
            </section>
        </main>
    </body>
</template>