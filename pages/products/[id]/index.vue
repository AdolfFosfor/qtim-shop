<script setup lang="ts">
  import { productsStore } from '~/store/products'
  import { indexStore } from '~/store'
  import { storeToRefs } from 'pinia'
  import { PetType, MeatType, AgeGroup, FoodType } from '~/types/products'

  const { id } = useRoute().params
  
  // Получаем экземпляры хранилищ
  const productsStoreInstance = productsStore()
  const indexStoreInstance = indexStore()
  
  // Получаем продукт по ID
  const product = productsStoreInstance.getProductById(+id)
  
  // Проверяем, есть ли товар в корзине
  const { isInCart, getCartItemQuantity } = storeToRefs(productsStoreInstance)
  
  // Словари для отображения названий на русском
  const petTypeLabels = {
    [PetType.DOG]: 'Собаки',
    [PetType.CAT]: 'Кошки',
    [PetType.BIRD]: 'Птицы',
    [PetType.FISH]: 'Рыбы',
    [PetType.RODENT]: 'Грызуны'
  }
  
  const meatTypeLabels = {
    [MeatType.CHICKEN]: 'Курица',
    [MeatType.BEEF]: 'Говядина',
    [MeatType.FISH]: 'Рыба',
    [MeatType.LAMB]: 'Ягненок',
    [MeatType.TURKEY]: 'Индейка',
    [MeatType.VEGETARIAN]: 'Вегетарианский',
    [MeatType.GRAIN_FREE]: 'Без зерновых'
  }
  
  const ageGroupLabels = {
    [AgeGroup.PUPPY]: 'Щенки',
    [AgeGroup.KITTEN]: 'Котята',
    [AgeGroup.ADULT]: 'Взрослые',
    [AgeGroup.SENIOR]: 'Пожилые',
    [AgeGroup.ALL_AGES]: 'Все возраста'
  }
  
  const foodTypeLabels = {
    [FoodType.DRY]: 'Сухой корм',
    [FoodType.WET]: 'Влажный корм',
    [FoodType.SEMI_WET]: 'Полувлажный корм',
    [FoodType.TREATS]: 'Лакомства',
    [FoodType.SUPPLEMENTS]: 'Добавки'
  }
  
  // Функции для работы с корзиной
  const addToCart = () => {
    if (product) {
      productsStoreInstance.addToCart(product)
      // Можно добавить уведомление о добавлении товара
    }
  }
  
  const openCart = () => {
    indexStoreInstance.setCart(true)
  }
</script>

<template>
  <div v-if="product" class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Левая колонка с изображением -->
      <div class="bg-gray-100 rounded-lg flex items-center justify-center p-4 h-[300px] md:h-[400px]">
        <NuxtImg 
          class="h-full object-contain" 
          :src="`/images/${product.image}.webp`" 
          :alt="product.name"
          loading="lazy"
        />
      </div>
      
      <!-- Правая колонка с информацией о товаре -->
      <div class="flex flex-col">
        <!-- Основная информация -->
        <h1 class="text-2xl md:text-3xl font-bold">{{product.name}}</h1>
        <div class="flex gap-2 my-3">
          <span class="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{{petTypeLabels[product.petType]}}</span>
          <span class="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full">{{foodTypeLabels[product.foodType]}}</span>
          <span class="text-sm px-2 py-1 bg-amber-100 text-amber-800 rounded-full">{{ageGroupLabels[product.ageGroup]}}</span>
        </div>
        <h3 class="text-2xl font-medium text-dark/80 mt-2 mb-4">{{product.price}}₽</h3>
        
        <!-- Описание товара -->
        <div class="my-4">
          <h4 class="font-medium text-lg mb-2">Описание</h4>
          <p class="text-gray-700">{{product.description}}</p>
        </div>
        
        <!-- Основные характеристики -->
        <div class="my-4">
          <h4 class="font-medium text-lg mb-2">Характеристики</h4>
          <ul class="space-y-2">
            <li class="flex items-center gap-2">
              <span class="font-medium">Тип животного:</span> {{petTypeLabels[product.petType]}}
            </li>
            <li class="flex items-center gap-2">
              <span class="font-medium">Тип мяса:</span> {{meatTypeLabels[product.meatType]}}
            </li>
            <li class="flex items-center gap-2">
              <span class="font-medium">Возрастная группа:</span> {{ageGroupLabels[product.ageGroup]}}
            </li>
            <li class="flex items-center gap-2">
              <span class="font-medium">Тип корма:</span> {{foodTypeLabels[product.foodType]}}
            </li>
            <li v-if="product.packageSize" class="flex items-center gap-2">
              <span class="font-medium">Размер упаковки:</span> {{product.packageSize.value}} {{product.packageSize.unit}}
            </li>
          </ul>
        </div>
        
        <!-- Дополнительные свойства -->
        <div v-if="product.features && product.features.length > 0" class="my-4">
          <h4 class="font-medium text-lg mb-2">Особенности</h4>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="feature in product.features" 
              :key="feature"
              class="text-sm px-3 py-1 bg-gray-100 text-gray-800 rounded-full"
            >
              {{feature}}
            </span>
          </div>
        </div>
        
        <!-- Рейтинг -->
        <div v-if="product.rating" class="my-4">
          <div class="flex items-center gap-2">
            <div class="flex">
              <Icon 
                v-for="i in 5" 
                :key="i"
                :name="i <= Math.floor(product.rating) ? 'uil:star' : (i - 0.5 <= product.rating ? 'uil:star-half-alt' : 'uil:star')"
                class="text-amber-400"
                size="20"
              />
            </div>
            <span class="text-gray-700">{{product.rating}}/5</span>
          </div>
        </div>
        
        <!-- Корзина -->
        <div class="mt-6 flex flex-col gap-3">
          <!-- Если товар уже в корзине, показываем количество и кнопку перехода в корзину -->
          <client-only>
            <div v-if="isInCart(product.id)" class="flex items-center justify-between">
              <span class="text-dark/70">В корзине: {{ getCartItemQuantity(product.id) }} шт.</span>
              <button class="text-main hover:text-main/80 transition underline" @click="openCart">
                Перейти в корзину
              </button>
            </div>
          </client-only>
          
          <!-- Кнопка добавления в корзину -->
          <button 
            class="h-12 px-6 bg-main text-white font-bold rounded-lg hover:bg-main/90 transition flex items-center justify-center gap-2"
            @click="addToCart" 
          >
            <Icon name="uil:cart-plus" size="20" />
            <client-only placeholder="Добавить в корзину">
              {{ isInCart(product.id) ? 'Добавить еще' : 'Добавить в корзину' }}
            </client-only>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
