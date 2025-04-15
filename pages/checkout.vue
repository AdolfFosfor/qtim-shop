<script setup lang="ts">
import { productsStore } from '~/store/products'
import { indexStore } from '~/store'
import { storeToRefs } from 'pinia'
import { ref, reactive } from 'vue'

// Получаем экземпляры хранилищ
const productsStoreInstance = productsStore()
// Префикс _ для неиспользуемых переменных
const _indexStoreInstance = indexStore()

// Получаем данные корзины
const { cart, cartTotal, cartItemsCount } = storeToRefs(productsStoreInstance)

// Проверяем, есть ли товары в корзине
const hasItems = computed(() => cart.value.length > 0)

// Если корзина пуста, перенаправляем на главную страницу
onMounted(() => {
  if (!hasItems.value) {
    navigateTo('/')
  }
})

// Данные формы
const form = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
  comment: '',
  paymentMethod: 'card',
  deliveryMethod: 'courier'
})

// Состояние отправки формы
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const orderNumber = ref(Math.floor(Math.random() * 900000) + 100000) // Генерируем случайный номер заказа

// Валидация формы
const errors = reactive({
  name: '',
  phone: '',
  email: '',
  address: ''
})

const validateForm = () => {
  let isValid = true
  
  // Сбрасываем ошибки
  errors.name = ''
  errors.phone = ''
  errors.email = ''
  errors.address = ''
  
  // Проверяем имя
  if (!form.name.trim()) {
    errors.name = 'Пожалуйста, укажите ваше имя'
    isValid = false
  }
  
  // Проверяем телефон
  if (!form.phone.trim()) {
    errors.phone = 'Пожалуйста, укажите ваш телефон'
    isValid = false
  } else if (!/^\+?[0-9]{10,15}$/.test(form.phone.replace(/\s+/g, ''))) {
    errors.phone = 'Пожалуйста, укажите корректный номер телефона'
    isValid = false
  }
  
  // Проверяем email
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Пожалуйста, укажите корректный email'
    isValid = false
  }
  
  // Проверяем адрес для доставки курьером
  if (form.deliveryMethod === 'courier' && !form.address.trim()) {
    errors.address = 'Пожалуйста, укажите адрес доставки'
    isValid = false
  }
  
  return isValid
}

// Обработка отправки формы
const submitOrder = () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  // Имитируем отправку заказа
  setTimeout(() => {
    isSubmitting.value = false
    isSubmitted.value = true
    
    // Очищаем корзину после успешного оформления заказа
    productsStoreInstance.clearCart()
  }, 1500)
}

// Возврат в магазин
const goToShop = () => {
  navigateTo('/')
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Оформление заказа</h1>
    
    <!-- Если заказ успешно оформлен -->
    <div v-if="isSubmitted" class="bg-white rounded-lg shadow-md p-8 text-center">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="uil:check" size="32" class="text-green-500" />
      </div>
      <h2 class="text-xl font-medium text-gray-800 mb-2">Заказ успешно оформлен!</h2>
      <p class="text-gray-600 mb-2">Номер вашего заказа: <span class="font-medium">{{ orderNumber }}</span></p>
      <p class="text-gray-600 mb-6">Мы свяжемся с вами в ближайшее время для подтверждения заказа.</p>
      <button 
        class="px-6 py-3 bg-main text-white font-medium rounded-lg hover:bg-main/90 transition"
        @click="goToShop"
      >
        Вернуться в магазин
      </button>
    </div>
    
    <!-- Форма оформления заказа -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Левая колонка с формой -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-medium mb-4">Контактная информация</h2>
          
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Имя <span class="text-red-500">*</span></label>
              <input 
                v-model="form.name" 
                type="text" 
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main/50"
                :class="{'border-red-500': errors.name}"
                placeholder="Введите ваше имя"
              >
              <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Телефон <span class="text-red-500">*</span></label>
              <input 
                v-model="form.phone" 
                type="tel" 
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main/50"
                :class="{'border-red-500': errors.phone}"
                placeholder="+7 (___) ___-__-__"
              >
              <p v-if="errors.phone" class="mt-1 text-sm text-red-500">{{ errors.phone }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                v-model="form.email" 
                type="email" 
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main/50"
                :class="{'border-red-500': errors.email}"
                placeholder="example@mail.ru"
              >
              <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
            </div>
          </div>
          
          <h2 class="text-xl font-medium mb-4">Доставка</h2>
          
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Способ доставки</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input 
                    v-model="form.deliveryMethod" 
                    type="radio" 
                    value="courier" 
                    class="mr-2 text-main focus:ring-main"
                  >
                  <span>Курьером</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="form.deliveryMethod" 
                    type="radio" 
                    value="pickup" 
                    class="mr-2 text-main focus:ring-main"
                  >
                  <span>Самовывоз</span>
                </label>
              </div>
            </div>
            
            <div v-if="form.deliveryMethod === 'courier'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Адрес доставки <span class="text-red-500">*</span></label>
              <textarea 
                v-model="form.address" 
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main/50"
                :class="{'border-red-500': errors.address}"
                rows="3"
                placeholder="Введите адрес доставки"
              />
              <p v-if="errors.address" class="mt-1 text-sm text-red-500">{{ errors.address }}</p>
            </div>
          </div>
          
          <h2 class="text-xl font-medium mb-4">Оплата</h2>
          
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Способ оплаты</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input 
                    v-model="form.paymentMethod" 
                    type="radio" 
                    value="card" 
                    class="mr-2 text-main focus:ring-main"
                  >
                  <span>Банковской картой</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="form.paymentMethod" 
                    type="radio" 
                    value="cash" 
                    class="mr-2 text-main focus:ring-main"
                  >
                  <span>Наличными при получении</span>
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Комментарий к заказу</label>
            <textarea 
              v-model="form.comment" 
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main/50"
              rows="3"
              placeholder="Дополнительная информация к заказу"
            />
          </div>
        </div>
      </div>
      
      <!-- Правая колонка с информацией о заказе -->
      <div>
        <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
          <h2 class="text-xl font-medium mb-4">Ваш заказ</h2>
          
          <div class="space-y-3 mb-4 max-h-80 overflow-y-auto pr-2">
            <div v-for="item in cart" :key="item.id" class="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div class="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                <img :src="`/images/${item.image}.webp`" :alt="item.name" class="w-full h-full object-contain p-1">
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-sm truncate">{{ item.name }}</h3>
                <p class="text-sm text-gray-500">{{ item.price }} ₽ × {{ item.count }}</p>
              </div>
              <div class="text-right font-medium">
                {{ item.price * item.count }} ₽
              </div>
            </div>
          </div>
          
          <div class="border-t border-gray-200 pt-4 space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Товары ({{ cartItemsCount }})</span>
              <span>{{ cartTotal }} ₽</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Доставка</span>
              <span>{{ form.deliveryMethod === 'courier' ? '300 ₽' : 'Бесплатно' }}</span>
            </div>
            <div class="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
              <span>Итого</span>
              <span>{{ cartTotal + (form.deliveryMethod === 'courier' ? 300 : 0) }} ₽</span>
            </div>
          </div>
          
          <button 
            class="w-full mt-6 py-3 bg-main text-white font-medium rounded-lg hover:bg-main/90 transition flex items-center justify-center"
            :disabled="isSubmitting"
            @click="submitOrder"
          >
            <span v-if="isSubmitting">
              <Icon name="uil:spinner" size="20" class="animate-spin mr-2" />
              Оформление...
            </span>
            <span v-else>Оформить заказ</span>
          </button>
          
          <p class="text-xs text-gray-500 mt-3 text-center">
            Нажимая кнопку «Оформить заказ», вы соглашаетесь с условиями обработки персональных данных
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
