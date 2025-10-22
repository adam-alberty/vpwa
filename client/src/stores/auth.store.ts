import { defineStore, acceptHMRUpdate } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({

  }),

  getters: {},

  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
