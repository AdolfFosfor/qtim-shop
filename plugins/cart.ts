// В Nuxt 3 мы не должны импортировать хранилище в плагине напрямую

export default defineNuxtPlugin({
  name: 'cart-plugin',
  enforce: 'pre', // запускаем плагин до других плагинов
  setup() {
    // Используем хук app:mounted для инициализации корзины на клиенте
    if (import.meta.client) {
      const nuxtApp = useNuxtApp()
      
      // Инициализируем корзину после загрузки приложения
      nuxtApp.hook('app:mounted', () => {
        // Импортируем хранилище только после монтирования приложения
        // когда Pinia уже будет инициализирована
        import('~/store/products').then(({ productsStore }) => {
          const store = productsStore()
          store.initCart()
        })
      })
    }
  }
})
