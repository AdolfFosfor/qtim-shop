<script setup lang="ts">
import { indexStore } from '~/store'
import { productsStore } from '~/store/products'
import { storeToRefs } from 'pinia'

// Получаем флаг отображения корзины из indexStore
const { cart: isCartOpen } = storeToRefs(indexStore())
const indexStoreInstance = indexStore()

// Получаем данные корзины из productsStore
const productsStoreInstance = productsStore()
const { cart, cartTotal, cartItemsCount } = storeToRefs(productsStoreInstance)

// Методы для работы с корзиной
const removeItem = (productId: number) => {
  productsStoreInstance.removeFromCart(productId)
}

const incrementQuantity = (productId: number) => {
  productsStoreInstance.incrementCartItem(productId)
}

const decrementQuantity = (productId: number) => {
  productsStoreInstance.decrementCartItem(productId)
}

const clearCart = () => {
  productsStoreInstance.clearCart()
}

const closeCart = () => {
  indexStoreInstance.setCart(false)
}

// Переход на страницу оформления заказа
const goToCheckout = () => {
  indexStoreInstance.setCart(false) // Закрываем корзину
  navigateTo('/checkout') // Переходим на страницу оформления заказа
}
</script>

<template>
<div v-if="isCartOpen" class="fixed z-20 right-0 top-0 h-screen w-[400px] flex flex-col border-l-2 border-main/10 items-center justify-start p-5 pt-24 bg-white overflow-y-auto">
  <div class="w-full flex flex-col items-center justify-start">
    <h3 class="text-xl font-bold mb-4">Корзина</h3>
    
    <!-- Если корзина пуста -->
    <div v-if="cart.length === 0" class="w-full flex flex-col items-center justify-center py-8">
      <h4 class="text-lg font-medium">Ваша корзина пуста 🙃</h4>
      <button class="mt-4 px-4 py-2 bg-main text-white rounded-lg hover:bg-main/80 transition" @click="closeCart">
        Перейти к покупкам
      </button>
    </div>
    
    <!-- Если в корзине есть товары -->
    <div v-else class="w-full">
      <!-- Список товаров в корзине -->
      <div class="w-full flex flex-col gap-4 mb-6">
        <div v-for="item in cart" :key="item.id" class="w-full flex items-start justify-between p-3 border border-main/10 rounded-lg">
          <div class="flex items-center gap-3">
            <img :src="`/images/${item.image}.webp`" :alt="item.name" class="w-16 h-16 object-cover rounded-md" >
            <div>
              <h4 class="font-medium">{{ item.name }}</h4>
              <p class="text-sm text-dark/70">{{ item.price }} ₽</p>
            </div>
          </div>
          
          <div class="flex flex-col items-end gap-2">
            <button class="text-red-500 hover:text-red-700 transition" @click="removeItem(item.id)">
              <Icon name="uil:trash-alt" size="18" />
            </button>
            
            <div class="flex items-center gap-2 border border-main/20 rounded-lg">
              <button class="px-2 py-1 text-dark/70 hover:text-dark transition" @click="decrementQuantity(item.id)">
                <Icon name="uil:minus" size="16" />
              </button>
              <span class="text-sm font-medium">{{ item.count }}</span>
              <button class="px-2 py-1 text-dark/70 hover:text-dark transition" @click="incrementQuantity(item.id)">
                <Icon name="uil:plus" size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Итого и кнопки -->
      <div class="w-full border-t border-main/10 pt-4">
        <div class="flex items-center justify-between mb-2">
          <span class="font-medium">Товаров:</span>
          <span>{{ cartItemsCount }}</span>
        </div>
        <div class="flex items-center justify-between mb-4">
          <span class="font-bold">Итого:</span>
          <span class="font-bold">{{ cartTotal }} ₽</span>
        </div>
        
        <div class="flex items-center gap-3">
          <button class="flex-1 px-4 py-2 border border-main/20 text-dark rounded-lg hover:bg-gray-100 transition" @click="clearCart">
            Очистить
          </button>
          <button 
            class="flex-1 px-4 py-2 bg-main text-white rounded-lg hover:bg-main/80 transition"
            @click="goToCheckout"
          >
            Оформить
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
/* Стили для скролла в корзине */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>