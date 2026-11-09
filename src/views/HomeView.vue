<script setup>
import '@/styles/pages/home.css'
import heroCollection from '@/assets/product-collection.jpg'
import skincareSet from '@/assets/skincare-set.jpg'
import ceramicVase from '@/assets/ceramic-vase.jpg'
import amberPerfume from '@/assets/amber-perfume.jpg'
import knitThrow from '@/assets/knit-throw.jpg'

const featuredProducts = [
    {
        image: skincareSet,
        alt: 'Everyday Skin Set',
        tag: 'BESTSELLER',
        name: 'Everyday Skin Set',
        category: 'Beauty · Daily care',
        price: '$42.00',
    },
    {
        image: ceramicVase,
        alt: 'Minimal Ceramic Vase',
        tag: 'NEW',
        name: 'Minimal Ceramic Vase',
        category: 'Home · Decor',
        price: '$28.00',
    },
    {
        image: amberPerfume,
        alt: 'Signature Eau de Parfum',
        tag: 'POPULAR',
        name: 'Signature Eau de Parfum',
        category: 'Fragrance · Unisex',
        price: '$59.00',
    },
    {
        image: knitThrow,
        alt: 'Soft Knit Throw',
        tag: '−15%',
        name: 'Soft Knit Throw',
        category: 'Home · Textiles',
        price: '$34.00',
        oldPrice: '$40.00',
    },
]
</script>

<template>

    <body>
       
        <main>
            <section class="hero">
                <div class="container hero-grid">
                    <div>
                        <div class="eyebrow">The everyday edit</div>
                        <h1>Good finds.<br>Better living.</h1>
                        <p>Thoughtfully picked essentials for your everyday routine. Explore the latest drops, trusted
                            favourites, and little upgrades that make a difference.</p>
                        <div class="actions"><a class="button" href="products.html">Shop all products</a><a
                                class="button secondary" href="products.html?sort=discount">Explore deals</a></div>
                    </div>
                    <div class="hero-art"><img :src="heroCollection"
                            alt="A collection of skincare, fragrance and home products"></div>
                </div>
            </section>
            <section class="section">
                <div class="container">
                    <div class="section-head">
                        <div>
                            <div class="eyebrow">Browse by interest</div>
                            <h2>Shop categories</h2>
                        </div><a href="products.html">View all →</a>
                    </div>
                    <div class="category-grid"><a class="category" href="products.html?category=beauty">✧ &nbsp;
                            Beauty</a><a class="category" href="products.html?category=fragrances">❋ &nbsp;
                            Fragrances</a><a class="category" href="products.html?category=furniture">⌂ &nbsp; Home &
                            Living</a><a class="category" href="products.html?category=groceries">◈ &nbsp; Daily
                            Essentials</a></div>
                </div>
            </section>
            <section class="section featured-section">
                <div class="container">
                    <div class="section-head">
                        <div>
                            <div class="eyebrow">Picked for you</div>
                            <h2>Featured products</h2>
                        </div><a href="products.html">Shop all →</a>
                    </div>
                    <div class="grid">
                        <article v-for="product in featuredProducts" :key="product.name" class="product-card"><a
                                href="product-detail.html">
                                <div class="product-image"><img :src="product.image" :alt="product.alt"></div>
                                <div class="product-info"><span class="tag">{{ product.tag }}</span>
                                    <h3>{{ product.name }}</h3>
                                    <p>{{ product.category }}</p>
                                    <span class="price">
                                        {{ product.price }}
                                        <span v-if="product.oldPrice" class="old-price">{{ product.oldPrice }}</span>
                                    </span>
                                </div>
                            </a></article>
                    </div>
                </div>
            </section>
            <section class="section collection-section">
                <div class="container">
                    <div class="banner">
                        <div>
                            <div class="eyebrow banner-eyebrow">A little something extra</div>
                            <h2>Make room for better.</h2>
                            <p>Discover fresh arrivals and limited-time offers.</p>
                        </div><a class="button secondary" href="products.html">Explore the collection</a>
                    </div>
                </div>
            </section>
        </main>
    </body>

</template>