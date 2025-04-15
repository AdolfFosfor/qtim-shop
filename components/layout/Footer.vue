<script setup lang="ts">
// Год для копирайта
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="w-full bg-white border-t border-gray-200 py-6 mt-auto">
    <div class="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
      <div class="mb-4 md:mb-0">
        <p class="text-gray-600 text-sm">
          © {{ currentYear }} BONE SHOP. Все права защищены.
        </p>
      </div>
      
      <div class="flex items-center gap-4">
        <a  
          href="https://github.com/AdolfFosfor/qtim-shop" 
          target="_blank" 
          rel="noopener noreferrer"
          class="flex items-center gap-2 text-gray-600 hover:text-main transition"
          title="Исходный код проекта на GitHub"
        >
          <Icon name="uil:github" size="24" />
          <span class="text-sm">GitHub</span>
        </a>
      </div>
    </div>
  </footer>
</template>
