<script setup></script>
<template>

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Home | Northstar</title>
        <meta name="description" content="Discover everyday essentials at Northstar.">

    </head>
    <div class="topbar">
        <div class="container nav">
            <RouterLink to="/" class="logo">north<span>star.</span></RouterLink>
            <nav class="navlinks">
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/products">Shop</RouterLink>
                <a href="products.html?category=beauty">Beauty</a>
                <a href="products.html?category=fragrances">Fragrance</a>
            </nav>
            <div class="navright">
                <RouterLink to="/cart" class="cart-link">Cart (2)</RouterLink>
            </div>
        </div>
    </div>
</template>