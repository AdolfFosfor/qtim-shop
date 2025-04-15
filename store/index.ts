import { defineStore } from 'pinia'

export const indexStore = defineStore('index', {
    state: () => ({
        cart: false as boolean,
    }),
    getters: {
    },
    actions: {
        setCart(payload: boolean) {
            this.cart = payload
        }
    }
})