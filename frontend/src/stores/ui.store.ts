import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  const leftDrawerOpen = ref(false);
  const rightDrawerOpen = ref(false);

  function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
  }

  function toggleRightDrawer() {
    rightDrawerOpen.value = !rightDrawerOpen.value;
  }

  return { leftDrawerOpen, rightDrawerOpen, toggleLeftDrawer, toggleRightDrawer };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot));
}
