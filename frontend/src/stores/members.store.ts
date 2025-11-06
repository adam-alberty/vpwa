import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';

export const useMemberStore = defineStore('member', () => {
  const members = ref<any[]>([]);
  return { members };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMemberStore, import.meta.hot));
}
