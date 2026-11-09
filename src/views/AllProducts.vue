<script setup>
import '../styles/pages/products.css'
</script>
<template>

    <body>
        <main class="container">
            <div class="page-title">
                <div class="breadcrumb"><a href="index.html">Home</a> / Shop</div>
                <div class="eyebrow">The collection</div>
                <h1>All products</h1>
                <p class="muted">Find your next everyday favourite.</p>
            </div>
            <div class="catalog-layout">
                <aside class="filters">
                    <h3>Filters</h3>
                    <form action="products.html" method="get">
                        <div class="filter-group"><strong>Category</strong><label><input type="checkbox" name="category"
                                    value="beauty"> Beauty</label><label><input type="checkbox" name="category"
                                    value="fragrances"> Fragrances</label><label><input type="checkbox" name="category"
                                    value="furniture"> Home & Living</label><label><input type="checkbox"
                                    name="category" value="groceries"> Groceries</label></div>
                        <div class="filter-group"><strong>Price range</strong>
                            <div class="field"><label for="min-price">Minimum ($)</label><input id="min-price"
                                    type="number" name="minPrice" min="0" placeholder="0"></div>
                            <div class="field"><label for="max-price">Maximum ($)</label><input id="max-price"
                                    type="number" name="maxPrice" min="0" placeholder="500"></div>
                        </div>
                        <div class="filter-group"><strong>Availability</strong><label><input type="checkbox"
                                    name="stock" value="in-stock"> In stock only</label></div><button type="submit"
                            class="filters-submit">Apply filters</button>
                    </form>
                </aside>
                <section>
                    <form class="toolbar" action="products.html" method="get"><input type="search" name="q"
                            placeholder="Search products..." aria-label="Search products"><select name="sort"
                            aria-label="Sort products">
                            <option value="featured">Featured</option>
                            <option value="price-asc">Price: Low to high</option>
                            <option value="price-desc">Price: High to low</option>
                            <option value="rating">Top rated</option>
                        </select></form>
                    <div class="section-head"><span class="muted">Showing 1–12 of 120 products</span><span
                            class="muted">Page 1 of 10</span></div>
                    <div class="grid">
                        <article class="product-card"><a href="product-detail.html">
                                <div class="product-image"><img src="../assets/skincare-set.jpg"
                                        alt="Everyday Skin Set"></div>
                                <div class="product-info">
                                    <h3>Everyday Skin Set</h3>
                                    <p>Beauty</p><span class="price">$42.00</span>
                                </div>
                            </a></article>
                        <article class="product-card"><a href="product-detail.html">
                                <div class="product-image"><img src="../assets/ceramic-vase.jpg"
                                        alt="Minimal Ceramic Vase"></div>
                                <div class="product-info">
                                    <h3>Minimal Ceramic Vase</h3>
                                    <p>Home & Living</p><span class="price">$28.00</span>
                                </div>
                            </a></article>
                        <article class="product-card"><a href="product-detail.html">
                                <div class="product-image"><img src="../assets/amber-perfume.jpg"
                                        alt="Signature Eau de Parfum"></div>
                                <div class="product-info">
                                    <h3>Signature Eau de Parfum</h3>
                                    <p>Fragrance</p><span class="price">$59.00</span>
                                </div>
                            </a></article>
                        <article class="product-card"><a href="product-detail.html">
                                <div class="product-image"><img src="../assets/knit-throw.jpg" alt="Soft Knit Throw">
                                </div>
                                <div class="product-info">
                                    <h3>Soft Knit Throw</h3>
                                    <p>Home & Living</p><span class="price">$34.00</span>
                                </div>
                            </a></article>
                        <article class="product-card"><a href="product-detail.html">
                                <div class="product-image"><img src="../assets/moisturizer.jpg" alt="Daily Moisturizer">
                                </div>
                                <div class="product-info">
                                    <h3>Daily Moisturizer</h3>
                                    <p>Beauty</p><span class="price">$19.00</span>
                                </div>
                            </a></article>
                        <article class="product-card"><a href="product-detail.html">
                                <div class="product-image"><img src="../assets/dark-perfume.jpg" alt="Classic Scent">
                                </div>
                                <div class="product-info">
                                    <h3>Classic Scent</h3>
                                    <p>Fragrance</p><span class="price">$46.00</span>
                                </div>
                            </a></article>
                        <article class="product-card"><a href="product-detail.html">
                                <div class="product-image"><img src="../assets/woven-basket.jpg" alt="Storage Basket">
                                </div>
                                <div class="product-info">
                                    <h3>Storage Basket</h3>
                                    <p>Home & Living</p><span class="price">$22.00</span>
                                </div>
                            </a></article>
                        <article class="product-card"><a href="product-detail.html">
                                <div class="product-image"><img src="../assets/cleanser.jpg" alt="Hydrating Cleanser">
                                </div>
                                <div class="product-info">
                                    <h3>Hydrating Cleanser</h3>
                                    <p>Beauty</p><span class="price">$16.00</span>
                                </div>
                            </a></article>
                    </div>
                    <div class="actions pagination-actions"><a class="button secondary"
                            href="#">Previous</a><a class="button" href="#">1</a><a class="button secondary"
                            href="#">2</a><a class="button secondary" href="#">3</a><a class="button secondary"
                            href="#">Next</a></div>
                </section>
            </div>
        </main>
    </body>
</template>