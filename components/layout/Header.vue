<script setup lang="ts">

import {indexStore} from '~/store'
</script>

<template>
  <header class="sticky top-0 w-full flex items-center justify-center z-50">
    <div class="h-24 container flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-1 bg-white rounded-xl p-2">
        <h1><span class="text-5xl">🦴</span></h1>
        <h1 class="font-black text-dark/90 text-2xl leading-none"> B<span class="text-main">O</span>NE <br> SH<span class="text-main">O</span>P</h1>
      </NuxtLink>

      <button class="flex items-center justify-center p-2 bg-white rounded-2xl ring-2 ring-main/20 hover:ring-main/50 transition" @click="() => indexStore().setCart(!indexStore().cart)">
        <Icon size="26" name="uil:cart" style="color: var(--color-dark)" />
      </button>
    </div>
  </header>
</template>

<style scoped lang="scss">

</style>