import { defineStore, acceptHMRUpdate } from 'pinia';

export const useWsStore = defineStore('websocket', () => {
  return {};
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWsStore, import.meta.hot));
}
