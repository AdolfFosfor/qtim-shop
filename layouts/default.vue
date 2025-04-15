<script setup lang="ts">
  import {productsStore} from '~/store/products'

  import Cart from '~/components/layout/Cart.vue'
  import Header from '~/components/layout/Header.vue'
  import Footer from '~/components/layout/Footer.vue'

  productsStore().fetchProducts()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />

    <main class="flex-grow">
      <slot />
    </main>

    <Footer />
    <Cart />
  </div>
</template>

<style scoped lang="scss">

</style>