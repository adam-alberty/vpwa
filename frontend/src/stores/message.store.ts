import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';

export const useMessageStore = defineStore('message', () => {
  const messages = ref<any[]>([]);

  return { messages };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMessageStore, import.meta.hot));
}
