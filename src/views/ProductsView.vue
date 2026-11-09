<script setup>
import '../styles/pages/product-detail.css'
</script>
<template>

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Product details | Northstar</title>
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
        <main class="container section">
            <div class="breadcrumb"><a href="index.html">Home</a> / <a href="products.html">Shop</a> / Everyday Skin Set
            </div>
            <div class="detail-grid">
                <section>
                    <div class="gallery-main"><img src="../assets/skincare-set.jpg"
                            alt="Everyday Skin Set skincare products"></div>
                    <div class="thumbs">
                        <div class="thumb"><img src="../assets/skincare-set.jpg" alt="Skincare set view"></div>
                        <div class="thumb"><img src="../assets/moisturizer.jpg" alt="Moisturizer view"></div>
                        <div class="thumb"><img src="../assets/cleanser.jpg" alt="Cleanser view"></div>
                        <div class="thumb"><img src="../assets/amber-perfume.jpg" alt="Related fragrance"></div>
                    </div>
                </section>
                <section><span class="tag">BESTSELLER</span>
                    <div class="eyebrow product-eyebrow">Northstar essentials</div>
                    <h1>Everyday Skin Set</h1>
                    <p class="muted">A simple, feel-good routine with everyday skincare essentials. Made for a
                        comfortable, refreshed finish.</p>
                    <div class="detail-price">$42.00 <span class="old-price">$52.00</span></div>
                    <p class="stock">✓ In stock · Ready to ship</p>
                    <hr class="product-divider">
                    <form action="cart.html" method="get">
                        <div class="field"><label>Choose your set</label>
                            <div class="option-row"><label class="option"><input type="radio" name="variant"
                                        value="standard" checked> Standard</label><label class="option"><input
                                        type="radio" name="variant" value="deluxe"> Deluxe +$12</label></div>
                        </div>
                        <div class="field"><label for="quantity">Quantity</label><input class="qty" id="quantity"
                                name="quantity" type="number" min="1" max="10" value="1"></div>
                        <div class="actions"><button type="submit">Add to cart</button><a class="button secondary"
                                href="cart.html">View cart</a></div>
                    </form>
                    <div class="product-details">
                        <h3>Product details</h3>
                        <p class="muted">Thoughtfully selected essentials. Suitable for daily use. Please review the
                            product packaging for ingredients and usage instructions.</p>
                        <p><strong>Category:</strong> Beauty<br><strong>SKU:</strong>
                            NS-SKIN-001<br><strong>Shipping:</strong> Usually ships within 1–2 business days</p>
                    </div>
                </section>
            </div>
            <section class="section">
                <div class="section-head">
                    <div>
                        <div class="eyebrow">You may also like</div>
                        <h2>Related products</h2>
                    </div><a href="products.html">View all →</a>
                </div>
                <div class="grid">
                    <article class="product-card">
                        <div class="product-image"><img src="../assets/moisturizer.jpg" alt="Daily Moisturizer"></div>
                        <div class="product-info">
                            <h3>Daily Moisturizer</h3><span class="price">$19.00</span>
                        </div>
                    </article>
                    <article class="product-card">
                        <div class="product-image"><img src="../assets/cleanser.jpg" alt="Hydrating Cleanser"></div>
                        <div class="product-info">
                            <h3>Hydrating Cleanser</h3><span class="price">$16.00</span>
                        </div>
                    </article>
                    <article class="product-card">
                        <div class="product-image"><img src="../assets/dark-perfume.jpg" alt="Classic Scent"></div>
                        <div class="product-info">
                            <h3>Classic Scent</h3><span class="price">$46.00</span>
                        </div>
                    </article>
                    <article class="product-card">
                        <div class="product-image"><img src="../assets/knit-throw.jpg" alt="Soft Knit Throw"></div>
                        <div class="product-info">
                            <h3>Soft Knit Throw</h3><span class="price">$34.00</span>
                        </div>
                    </article>
                </div>
            </section>
        </main>
    </body>
</template>