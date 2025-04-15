import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  css: ['~/assets/app.css'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  fonts: {
    families: [
      {
        name: 'Wix Madefor Display',
        provider: 'google', // Google Fonts как провайдер
        weights: [400, 700], // Укажите нужные начертания
        styles: ['normal', 'italic'], // Укажите стили, если нужны
      },
      {
        name: 'Wix Madefor Text',
        provider: 'google',
        weights: [400, 500, 700],
        styles: ['normal', 'italic'],
      },
    ],
  },
})