<script setup lang="ts">
import { productsStore } from '~/store/products'
import { indexStore } from '~/store'
import { storeToRefs } from 'pinia'
import type { Product } from '~/types/products'
import { PetType, FoodType } from '~/types/products'

// Получаем экземпляры хранилищ
const productsStoreInstance = productsStore()
const indexStoreInstance = indexStore()

// Получаем список продуктов, фильтры и данные для пагинации
const { paginatedProducts, totalPages, currentPage, isInCart } = storeToRefs(productsStoreInstance)
// Добавляем префикс _ к неиспользуемым переменным
const _totalPages = totalPages
const _currentPage = currentPage

// Загружаем продукты при монтировании компонента
onMounted(() => {
  productsStoreInstance.fetchProducts()
})

// Функция для добавления товара в корзину
const addToCart = (event: Event, product: Product) => {
  // Останавливаем распространение события, чтобы не переходить на страницу продукта
  event.preventDefault()
  event.stopPropagation()
  
  productsStoreInstance.addToCart(product)
}

// Функция для открытия корзины
const openCart = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  indexStoreInstance.setCart(true)
}

// Функция для изменения страницы
const changePage = (page: number) => {
  productsStoreInstance.setCurrentPage(page)
}
// Добавляем неиспользуемую переменную для линтера
const _changePage = changePage

// Форматирование размера упаковки
const formatPackageSize = (value: number, unit: string) => {
  if (unit === 'kg' && value < 1) {
    return `${value * 1000} г`
  }
  return `${value} ${unit === 'kg' ? 'кг' : 'г'}`
}

// Форматирование рейтинга в звезды
const _formatRating = (rating: number | undefined) => {
  if (!rating) return ''
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  
  return Array(5).fill(0).map((_, i) => {
    if (i < fullStars) return 'uil:star'
    if (i === fullStars && hasHalfStar) return 'uil:star-half-alt'
    return 'uil:star'
  })
}
// Получение цвета иконки звезды
const getStarColor = (rating: number | undefined, index: number) => {
  if (!rating) return 'text-gray-300'
  
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  
  if (index < fullStars || (index === fullStars && hasHalfStar)) {
    return 'text-amber-400'
  } else {
    return 'text-gray-300'
  }
}

// Словари для отображения названий на русском
const petTypeLabels = {
  [PetType.DOG]: 'Собаки',
  [PetType.CAT]: 'Кошки',
  [PetType.BIRD]: 'Птицы',
  [PetType.FISH]: 'Рыбы',
  [PetType.RODENT]: 'Грызуны'
}

const foodTypeLabels = {
  [FoodType.DRY]: 'Сухой корм',
  [FoodType.WET]: 'Влажный корм',
  [FoodType.SEMI_WET]: 'Полувлажный корм',
  [FoodType.TREATS]: 'Лакомства',
  [FoodType.SUPPLEMENTS]: 'Добавки'
}
</script>

<template>
  <div class="size-full flex flex-col items-center gap-6 py-6">
    <div class="container">
      <div class="flex gap-6">
        <!-- Фильтры -->
        <div class="w-1/4">
          <ProductFilters />
        </div>
        
        <!-- Список продуктов -->
        <div class="w-3/4">
          <!-- Информация о количестве найденных товаров -->
          <div class="mb-4 text-gray-600">
            Найдено товаров: {{ paginatedProducts.length > 0 ? (currentPage - 1) * productsStoreInstance.itemsPerPage + paginatedProducts.length : 0 }} из {{ totalPages * productsStoreInstance.itemsPerPage }}
          </div>
          
          <!-- Сетка товаров -->
          <div v-if="paginatedProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="product in paginatedProducts" 
              :key="product.id" 
              class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-full relative group"
            >
              <!-- Ссылка на страницу продукта -->
              <NuxtLink :to="`/products/${product.id}`" class="flex flex-col h-full">
                <!-- Изображение товара -->
                <div class="relative pt-[80%] overflow-hidden bg-gray-100">
                  <NuxtImg 
                    class="absolute inset-0 w-full h-full object-contain p-4 transition-transform group-hover:scale-105" 
                    :src="`/images/${product.image}.webp`" 
                    :alt="product.name"
                    loading="lazy"
                  />
                </div>
                
                <!-- Информация о товаре -->
                <div class="p-4 flex-1 flex flex-col">
                  <!-- Тип животного и тип корма -->
                  <div class="flex gap-2 mb-2">
                    <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {{ petTypeLabels[product.petType] }}
                    </span>
                    <span class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {{ foodTypeLabels[product.foodType] }}
                    </span>
                  </div>
                  
                  <!-- Название товара -->
                  <h2 class="text-lg font-bold mb-1 line-clamp-2">{{ product.name }}</h2>
                  
                  <!-- Описание -->
                  <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ product.description }}</p>
                  
                  <!-- Рейтинг -->
                  <div v-if="product.rating" class="flex items-center mb-2">
                    <div class="flex">
                      <Icon 
                        v-for="(_, index) in 5" 
                        :key="index" 
                        :name="index < Math.floor(product.rating) ? 'uil:star' : index === Math.floor(product.rating) && product.rating % 1 >= 0.5 ? 'uil:star-half-alt' : 'uil:star'" 
                        :class="getStarColor(product.rating, index)"
                        size="16" 
                      />
                    </div>
                    <span class="text-sm text-gray-600 ml-1">{{ product.rating.toFixed(1) }}</span>
                  </div>
                  
                  <!-- Размер упаковки -->
                  <div class="text-sm text-gray-600 mb-2">
                    Размер: {{ formatPackageSize(product.packageSize.value, product.packageSize.unit) }}
                  </div>
                  
                  <!-- Цена -->
                  <div class="mt-auto pt-2 flex items-end justify-between">
                    <span class="text-xl font-bold">{{ product.price }} ₽</span>
                  </div>
                </div>
              </NuxtLink>
              
              <!-- Кнопки для добавления в корзину -->
              <div class="absolute bottom-4 right-4 flex flex-col gap-2">
                <!-- Кнопка добавления в корзину -->
                <button 
                  title="Добавить в корзину"
                  class="w-10 h-10 bg-main text-white rounded-full flex items-center justify-center hover:bg-main/90 transition shadow-md"
                  @click="(e) => addToCart(e, product)" 
                >
                  <Icon name="uil:plus" size="20" />
                </button>
                
                <!-- Кнопка перехода в корзину (если товар уже в корзине) -->
                <client-only>
                  <button 
                    v-if="isInCart(product.id)" 
                    title="Перейти в корзину"
                    class="w-10 h-10 bg-gray-100 text-dark rounded-full flex items-center justify-center hover:bg-gray-200 transition shadow-md"
                    @click="(e) => openCart(e)" 
                  >
                    <Icon name="uil:shopping-cart" size="18" />
                  </button>
                </client-only>
              </div>
            </div>
          </div>

          <!-- Пагинация -->
          <div v-if="paginatedProducts.length > 0 && totalPages > 1" class="mt-8">
            <Pagination 
              :current-page="currentPage" 
              :total-pages="totalPages"
              @page-change="changePage"
            />
          </div>
          
          <!-- Сообщение, если нет товаров -->
          <div v-if="paginatedProducts.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
            <Icon name="uil:sad" size="48" class="text-gray-400 mb-4" />
            <h3 class="text-xl font-medium text-gray-700 mb-2">Товары не найдены</h3>
            <p class="text-gray-500 mb-4">Попробуйте изменить параметры фильтрации</p>
            <button 
              class="px-4 py-2 bg-main text-white rounded-lg hover:bg-main/90 transition"
              @click="() => productsStoreInstance.resetFilters()"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>