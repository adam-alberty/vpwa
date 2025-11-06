import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  const leftDrawerOpen = ref(false);
  const rightDrawerOpen = ref(false);

  function toggleLeftDrawer(open?: boolean) {
    if (typeof open === 'boolean') {
      leftDrawerOpen.value = open;
      return;
    }
    leftDrawerOpen.value = !leftDrawerOpen.value;
  }

  function toggleRightDrawer(open?: boolean) {
    if (typeof open === 'boolean') {
      rightDrawerOpen.value = open;
      return;
    }
    rightDrawerOpen.value = !rightDrawerOpen.value;
  }

  return { leftDrawerOpen, rightDrawerOpen, toggleLeftDrawer, toggleRightDrawer };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot));
}
