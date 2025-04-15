<script setup lang="ts">
import { productsStore } from '~/store/products'
import { storeToRefs } from 'pinia'
import { PetType, MeatType, AgeGroup, FoodType } from '~/types/products'

// Получаем экземпляр хранилища и необходимые данные
const store = productsStore()
const { 
  availablePetTypes, 
  availableMeatTypes,
  availableAgeGroups, 
  availableFoodTypes,
  availableFeatures,
  priceRange
} = storeToRefs(store)

// Локальное состояние для диапазона цен
const localPriceRange = ref({
  min: priceRange.value.min,
  max: priceRange.value.max
})

// Обновляем локальный диапазон цен при изменении данных в хранилище
watch(priceRange, (newRange) => {
  localPriceRange.value = { ...newRange }
})

// Словари для отображения названий фильтров
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

// Оптимизированные функции для работы с фильтрами

// Функция для переключения фильтра по типу животного
const togglePetType = (type: PetType) => {
  const currentFilters = Array.isArray(store.filters.petType) ? [...store.filters.petType] : []
  const index = currentFilters.indexOf(type)
  
  if (index === -1) {
    currentFilters.push(type)
  } else {
    currentFilters.splice(index, 1)
  }
  
  store.setFilters({ petType: currentFilters })
  // Сбрасываем страницу на первую при изменении фильтров
  store.setCurrentPage(1)
}

// Функция для переключения фильтра по типу мяса
const toggleMeatType = (type: MeatType) => {
  const currentFilters = Array.isArray(store.filters.meatType) ? [...store.filters.meatType] : []
  const index = currentFilters.indexOf(type)
  
  if (index === -1) {
    currentFilters.push(type)
  } else {
    currentFilters.splice(index, 1)
  }
  
  store.setFilters({ meatType: currentFilters })
  // Сбрасываем страницу на первую при изменении фильтров
  store.setCurrentPage(1)
}

// Функция для переключения фильтра по возрастной группе
const toggleAgeGroup = (group: AgeGroup) => {
  const currentFilters = Array.isArray(store.filters.ageGroup) ? [...store.filters.ageGroup] : []
  const index = currentFilters.indexOf(group)
  
  if (index === -1) {
    currentFilters.push(group)
  } else {
    currentFilters.splice(index, 1)
  }
  
  store.setFilters({ ageGroup: currentFilters })
  // Сбрасываем страницу на первую при изменении фильтров
  store.setCurrentPage(1)
}

// Функция для переключения фильтра по типу корма
const toggleFoodType = (type: FoodType) => {
  const currentFilters = Array.isArray(store.filters.foodType) ? [...store.filters.foodType] : []
  const index = currentFilters.indexOf(type)
  
  if (index === -1) {
    currentFilters.push(type)
  } else {
    currentFilters.splice(index, 1)
  }
  
  store.setFilters({ foodType: currentFilters })
  // Сбрасываем страницу на первую при изменении фильтров
  store.setCurrentPage(1)
}

// Функция для переключения фильтра по свойствам
const toggleFeature = (feature: string) => {
  const currentFilters = Array.isArray(store.filters.features) ? [...store.filters.features] : []
  const index = currentFilters.indexOf(feature)
  
  if (index === -1) {
    currentFilters.push(feature)
  } else {
    currentFilters.splice(index, 1)
  }
  
  store.setFilters({ features: currentFilters })
  // Сбрасываем страницу на первую при изменении фильтров
  store.setCurrentPage(1)
}

// Таймер для задержки обновления цены
const priceDebounceTimer = ref<number | null>(null)

// Динамическое обновление фильтра цены
watch(localPriceRange, (newRange) => {
  // Проверяем, что min не больше max
  if (newRange.min > newRange.max) {
    localPriceRange.value.min = priceRange.value.min
    return
  }
  
  // Обновляем фильтр с небольшой задержкой для производительности
  if (priceDebounceTimer.value) {
    clearTimeout(priceDebounceTimer.value)
  }
  
  priceDebounceTimer.value = window.setTimeout(() => {
    store.setFilters({ 
      priceRange: { 
        min: newRange.min, 
        max: newRange.max 
      } 
    })
    // Сбрасываем страницу на первую при изменении фильтров
    store.setCurrentPage(1)
  }, 300)
}, { deep: true })

// Функция для сброса всех фильтров
const resetAllFilters = () => {
  store.resetFilters()
  localPriceRange.value = { ...priceRange.value }
  searchQuery.value = ''
  // Сбрасываем страницу на первую при сбросе фильтров
  store.setCurrentPage(1)
}

// Поисковый запрос
const searchQuery = ref('')

// Динамический поиск
const searchDebounceTimer = ref<number | null>(null)
watch(searchQuery, (newQuery) => {
  if (searchDebounceTimer.value) {
    clearTimeout(searchDebounceTimer.value)
  }
  
  searchDebounceTimer.value = window.setTimeout(() => {
    store.setSearchQuery(newQuery)
    // Сбрасываем страницу на первую при изменении поиска
    store.setCurrentPage(1)
  }, 300)
})

// Сбрасываем поисковый запрос
const _resetSearch = () => {
  searchQuery.value = ''
  store.setSearchQuery('')
}

// Проверяем, есть ли активные фильтры
const hasActiveFilters = computed(() => {
  return (Array.isArray(store.filters.petType) && store.filters.petType.length > 0) ||
    (Array.isArray(store.filters.meatType) && store.filters.meatType.length > 0) ||
    (Array.isArray(store.filters.ageGroup) && store.filters.ageGroup.length > 0) ||
    (Array.isArray(store.filters.foodType) && store.filters.foodType.length > 0) ||
    (Array.isArray(store.filters.features) && store.filters.features.length > 0) ||
    (store.filters.priceRange && 
      (store.filters.priceRange.min !== priceRange.value.min || 
       store.filters.priceRange.max !== priceRange.value.max)) ||
    store.searchQuery !== ''
})
</script>

<template>
  <div class="w-full bg-white shadow-md rounded-lg p-4 mb-6">
    <h2 class="text-xl font-bold mb-4">Фильтры</h2>
    
    <!-- Поиск -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
      <div class="flex gap-2">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Введите запрос..." 
          class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-main/50"
        >
      </div>
    </div>
    
    <!-- Тип животного -->
    <div class="mb-4">
      <h3 class="font-medium mb-2">Тип животного</h3>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="type in availablePetTypes" 
          :key="type"
          :class="[
            'px-3 py-1 rounded-full text-sm border transition',
            Array.isArray(store.filters.petType) && store.filters.petType.includes(type) 
              ? 'bg-main text-white border-main' 
              : 'bg-white text-gray-700 border-gray-300 hover:border-main/50'
          ]"
          @click="togglePetType(type)"
        >
          {{ petTypeLabels[type] }}
        </button>
      </div>
    </div>
    
    <!-- Тип мяса/ингредиента -->
    <div class="mb-4">
      <h3 class="font-medium mb-2">Тип мяса/ингредиента</h3>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="type in availableMeatTypes" 
          :key="type"
          :class="[
            'px-3 py-1 rounded-full text-sm border transition',
            Array.isArray(store.filters.meatType) && store.filters.meatType.includes(type) 
              ? 'bg-main text-white border-main' 
              : 'bg-white text-gray-700 border-gray-300 hover:border-main/50'
          ]"
          @click="toggleMeatType(type)"
        >
          {{ meatTypeLabels[type] }}
        </button>
      </div>
    </div>
    
    <!-- Возрастная группа -->
    <div class="mb-4">
      <h3 class="font-medium mb-2">Возрастная группа</h3>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="group in availableAgeGroups" 
          :key="group"
          :class="[
            'px-3 py-1 rounded-full text-sm border transition',
            Array.isArray(store.filters.ageGroup) && store.filters.ageGroup.includes(group) 
              ? 'bg-main text-white border-main' 
              : 'bg-white text-gray-700 border-gray-300 hover:border-main/50'
          ]"
          @click="toggleAgeGroup(group)"
        >
          {{ ageGroupLabels[group] }}
        </button>
      </div>
    </div>
    
    <!-- Тип корма -->
    <div class="mb-4">
      <h3 class="font-medium mb-2">Тип корма</h3>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="type in availableFoodTypes" 
          :key="type"
          :class="[
            'px-3 py-1 rounded-full text-sm border transition',
            Array.isArray(store.filters.foodType) && store.filters.foodType.includes(type) 
              ? 'bg-main text-white border-main' 
              : 'bg-white text-gray-700 border-gray-300 hover:border-main/50'
          ]"
          @click="toggleFoodType(type)"
        >
          {{ foodTypeLabels[type] }}
        </button>
      </div>
    </div>
    
    <!-- Диапазон цен -->
    <div class="mb-4">
      <h3 class="font-medium mb-2">Цена</h3>
      <div class="flex items-center gap-2 mb-2">
        <input 
          v-model.number="localPriceRange.min" 
          type="number" 
          min="0" 
          :max="localPriceRange.max"
          class="w-24 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-main/50"
        >
        <span>—</span>
        <input 
          v-model.number="localPriceRange.max" 
          type="number" 
          :min="localPriceRange.min"
          class="w-24 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-main/50"
        >
      </div>
      <div class="text-sm text-gray-500">
        Диапазон: {{ priceRange.min }} ₽ — {{ priceRange.max }} ₽
      </div>
    </div>
    
    <!-- Дополнительные свойства -->
    <div v-if="availableFeatures.length > 0" class="mb-4">
      <h3 class="font-medium mb-2">Дополнительные свойства</h3>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="feature in availableFeatures" 
          :key="feature"
          :class="[
            'px-3 py-1 rounded-full text-sm border transition',
            Array.isArray(store.filters.features) && store.filters.features.includes(feature) 
              ? 'bg-main text-white border-main' 
              : 'bg-white text-gray-700 border-gray-300 hover:border-main/50'
          ]"
          @click="toggleFeature(feature)"
        >
          {{ feature }}
        </button>
      </div>
    </div>
    
    <!-- Кнопка сброса фильтров -->
    <button 
      v-if="hasActiveFilters"
      class="w-full mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition flex items-center justify-center gap-2"
      @click="resetAllFilters"
    >
      <Icon name="uil:filter-slash" size="18" />
      Сбросить все фильтры
    </button>
  </div>
</template>

<style scoped>
/* Стили для input type="number" без стрелок */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>
