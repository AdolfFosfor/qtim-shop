import { defineStore } from 'pinia'
import type { CartProduct, Product, ProductFilters, PetType, MeatType, AgeGroup, FoodType } from '~/types/products'

export const productsStore = defineStore('products', {
    state: () => ({
        products: [] as Product[],
        cart: [] as CartProduct[],
        filters: {
            petType: [] as PetType[],
            meatType: [] as MeatType[],
            ageGroup: [] as AgeGroup[],
            foodType: [] as FoodType[],
            priceRange: {
                min: 0,
                max: 5000
            },
            features: [] as string[]
        } as ProductFilters,
        searchQuery: '',
        currentPage: 1,
        itemsPerPage: 6
    }),

    getters: {
        getProductById: (state) => {
            return (productId: number) => state.products.find((product) => product.id === productId)
        },
        // Получение общего количества товаров в корзине
        cartItemsCount: (state) => {
            return state.cart.reduce((total, item) => total + item.count, 0)
        },
        // Получение общей суммы корзины
        cartTotal: (state) => {
            return state.cart.reduce((total, item) => total + (item.price * item.count), 0)
        },
        // Проверка, есть ли товар в корзине
        isInCart: (state) => {
            return (productId: number) => state.cart.some(item => item.id === productId)
        },
        // Получение количества конкретного товара в корзине
        getCartItemQuantity: (state) => {
            return (productId: number) => {
                const item = state.cart.find(item => item.id === productId)
                return item ? item.count : 0
            }
        },
        // Получение отфильтрованных продуктов
        filteredProducts: (state) => {
            return state.products.filter(product => {
                // Фильтрация по типу животного
                if (state.filters.petType && state.filters.petType.length > 0 && !state.filters.petType.includes(product.petType)) {
                    return false
                }
                
                // Фильтрация по типу мяса
                if (state.filters.meatType && state.filters.meatType.length > 0 && !state.filters.meatType.includes(product.meatType)) {
                    return false
                }
                
                // Фильтрация по возрастной группе
                if (state.filters.ageGroup && state.filters.ageGroup.length > 0 && !state.filters.ageGroup.includes(product.ageGroup)) {
                    return false
                }
                
                // Фильтрация по типу корма
                if (state.filters.foodType && state.filters.foodType.length > 0 && !state.filters.foodType.includes(product.foodType)) {
                    return false
                }
                
                // Фильтрация по цене
                if (state.filters.priceRange && (product.price < state.filters.priceRange.min || product.price > state.filters.priceRange.max)) {
                    return false
                }
                
                // Фильтрация по дополнительным свойствам
                if (state.filters.features && state.filters.features.length > 0) {
                    // Проверяем, есть ли хотя бы одно из выбранных свойств в продукте
                    if (!product.features || !state.filters.features.some(feature => product.features?.includes(feature))) {
                        return false
                    }
                }
                
                // Поиск по тексту
                if (state.searchQuery && state.searchQuery.trim() !== '') {
                    const query = state.searchQuery.toLowerCase().trim()
                    const nameMatch = product.name.toLowerCase().includes(query)
                    const descriptionMatch = product.description.toLowerCase().includes(query)
                    const featuresMatch = product.features ? product.features.some(feature => 
                        feature.toLowerCase().includes(query)
                    ) : false
                    
                    if (!nameMatch && !descriptionMatch && !featuresMatch) {
                        return false
                    }
                }
                
                return true
            })
        },
        // Получение уникальных значений для фильтров
        availablePetTypes: (state) => {
            return [...new Set(state.products.map(product => product.petType))]
        },
        availableMeatTypes: (state) => {
            return [...new Set(state.products.map(product => product.meatType))]
        },
        availableAgeGroups: (state) => {
            return [...new Set(state.products.map(product => product.ageGroup))]
        },
        availableFoodTypes: (state) => {
            return [...new Set(state.products.map(product => product.foodType))]
        },
        availableFeatures: (state) => {
            // Собираем все уникальные свойства из всех продуктов
            const allFeatures = state.products
                .flatMap(product => product.features || [])
            return [...new Set(allFeatures)]
        },
        priceRange: (state) => {
            // Находим минимальную и максимальную цену среди всех продуктов
            if (state.products.length === 0) {
                return { min: 0, max: 5000 }
            }
            
            const prices = state.products.map(product => product.price)
            return {
                min: Math.min(...prices),
                max: Math.max(...prices)
            }
        },
        // Функция фильтрации продуктов - используется внутри totalPages и paginatedProducts
        // Удалена как отдельный геттер, чтобы избежать дублирования
        
        // Получение общего количества страниц
        totalPages: (state) => {
            // Используем ту же логику фильтрации, что и в filteredProducts
            const filtered = state.products.filter(product => {
                // Фильтрация по типу животного
                if (state.filters.petType && state.filters.petType.length > 0 && !state.filters.petType.includes(product.petType)) {
                    return false
                }
                
                // Фильтрация по типу мяса
                if (state.filters.meatType && state.filters.meatType.length > 0 && !state.filters.meatType.includes(product.meatType)) {
                    return false
                }
                
                // Фильтрация по возрастной группе
                if (state.filters.ageGroup && state.filters.ageGroup.length > 0 && !state.filters.ageGroup.includes(product.ageGroup)) {
                    return false
                }
                
                // Фильтрация по типу корма
                if (state.filters.foodType && state.filters.foodType.length > 0 && !state.filters.foodType.includes(product.foodType)) {
                    return false
                }
                
                // Фильтрация по цене
                if (state.filters.priceRange && (product.price < state.filters.priceRange.min || product.price > state.filters.priceRange.max)) {
                    return false
                }
                
                // Фильтрация по дополнительным свойствам
                if (state.filters.features && state.filters.features.length > 0) {
                    // Проверяем, что все выбранные свойства присутствуют в продукте
                    if (!product.features || !state.filters.features.every(feature => product.features?.includes(feature))) {
                        return false
                    }
                }
                
                // Фильтрация по поисковому запросу
                if (state.searchQuery && state.searchQuery.trim() !== '') {
                    const query = state.searchQuery.toLowerCase()
                    const nameMatch = product.name.toLowerCase().includes(query)
                    const descriptionMatch = product.description.toLowerCase().includes(query)
                    
                    if (!nameMatch && !descriptionMatch) {
                        return false
                    }
                }
                
                return true
            });
            return Math.ceil(filtered.length / state.itemsPerPage);
        },
        
        // Получение продуктов для текущей страницы
        paginatedProducts: (state) => {
            // Используем ту же логику фильтрации, что и в filteredProducts
            const filtered = state.products.filter(product => {
                // Фильтрация по типу животного
                if (state.filters.petType && state.filters.petType.length > 0 && !state.filters.petType.includes(product.petType)) {
                    return false
                }
                
                // Фильтрация по типу мяса
                if (state.filters.meatType && state.filters.meatType.length > 0 && !state.filters.meatType.includes(product.meatType)) {
                    return false
                }
                
                // Фильтрация по возрастной группе
                if (state.filters.ageGroup && state.filters.ageGroup.length > 0 && !state.filters.ageGroup.includes(product.ageGroup)) {
                    return false
                }
                
                // Фильтрация по типу корма
                if (state.filters.foodType && state.filters.foodType.length > 0 && !state.filters.foodType.includes(product.foodType)) {
                    return false
                }
                
                // Фильтрация по цене
                if (state.filters.priceRange && (product.price < state.filters.priceRange.min || product.price > state.filters.priceRange.max)) {
                    return false
                }
                
                // Фильтрация по дополнительным свойствам
                if (state.filters.features && state.filters.features.length > 0) {
                    // Проверяем, что все выбранные свойства присутствуют в продукте
                    if (!product.features || !state.filters.features.every(feature => product.features?.includes(feature))) {
                        return false
                    }
                }
                
                // Фильтрация по поисковому запросу
                if (state.searchQuery && state.searchQuery.trim() !== '') {
                    const query = state.searchQuery.toLowerCase()
                    const nameMatch = product.name.toLowerCase().includes(query)
                    const descriptionMatch = product.description.toLowerCase().includes(query)
                    
                    if (!nameMatch && !descriptionMatch) {
                        return false
                    }
                }
                
                return true
            });
            const startIndex = (state.currentPage - 1) * state.itemsPerPage;
            const endIndex = startIndex + state.itemsPerPage;
            return filtered.slice(startIndex, endIndex);
        }
    },

    actions: {
        // Установка текущей страницы
        setCurrentPage(page: number) {
            this.currentPage = page;
        },
        async fetchProducts() {
            const { data, error } = await useFetch('/api/mocks/products')
            if (error.value) console.error(error.value)

            // Используем as unknown для преобразования типов
            this.products = data.value as unknown as Product[]
            
            // Устанавливаем начальный диапазон цен на основе фактических данных
            if (this.products.length > 0) {
                const prices = this.products.map(product => product.price)
                this.filters.priceRange = {
                    min: Math.min(...prices),
                    max: Math.max(...prices)
                }
            }
        },
        // Установка фильтров
        setFilters(filters: Partial<ProductFilters>) {
            this.filters = { ...this.filters, ...filters }
        },
        
        // Сброс всех фильтров
        resetFilters() {
            this.filters = {
                petType: [],
                meatType: [],
                ageGroup: [],
                foodType: [],
                priceRange: this.priceRange,
                features: []
            }
            this.searchQuery = ''
            this.currentPage = 1
        },
        // Установка поискового запроса
        setSearchQuery(query: string) {
            this.searchQuery = query
        },
        // Добавление товара в корзину
        addToCart(product: Product) {
            const existingItem = this.cart.find(item => item.id === product.id)
            
            if (existingItem) {
                // Если товар уже в корзине, увеличиваем количество
                existingItem.count++
            } else {
                // Иначе добавляем новый товар в корзину
                this.cart.push({
                    ...product,
                    count: 1
                })
            }
            
            // Сохраняем корзину в localStorage
            this.saveCartToLocalStorage()
        },
        // Удаление товара из корзины
        removeFromCart(productId: number) {
            const index = this.cart.findIndex(item => item.id === productId)
            if (index !== -1) {
                this.cart.splice(index, 1)
                this.saveCartToLocalStorage()
            }
        },
        // Изменение количества товара в корзине
        updateCartItemQuantity(productId: number, quantity: number) {
            if (quantity <= 0) {
                // Если количество меньше или равно 0, удаляем товар из корзины
                this.removeFromCart(productId)
                return
            }
            
            const item = this.cart.find(item => item.id === productId)
            if (item) {
                item.count = quantity
                this.saveCartToLocalStorage()
            }
        },
        // Увеличение количества товара на 1
        incrementCartItem(productId: number) {
            const item = this.cart.find(item => item.id === productId)
            if (item) {
                item.count++
                this.saveCartToLocalStorage()
            }
        },
        // Уменьшение количества товара на 1
        decrementCartItem(productId: number) {
            const item = this.cart.find(item => item.id === productId)
            if (item && item.count > 1) {
                item.count--
                this.saveCartToLocalStorage()
            } else if (item && item.count === 1) {
                this.removeFromCart(productId)
            }
        },
        // Очистка корзины
        clearCart() {
            this.cart = []
            this.saveCartToLocalStorage()
        },
        // Сохранение корзины в localStorage
        saveCartToLocalStorage() {
            if (import.meta.client) {
                localStorage.setItem('cart', JSON.stringify(this.cart))
            }
        },
        // Загрузка корзины из localStorage
        loadCartFromLocalStorage() {
            if (import.meta.client) {
                const savedCart = localStorage.getItem('cart')
                if (savedCart) {
                    this.cart = JSON.parse(savedCart)
                }
            }
        },
        // Инициализация корзины при запуске приложения
        initCart() {
            this.loadCartFromLocalStorage()
        }
    },
})