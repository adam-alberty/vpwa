<template>
   <q-avatar
    >{{ username.charAt(0).toUpperCase() }}
    <span class="status-dot absolute" :class="status"></span>
  </q-avatar>
</template>

<script setup lang="ts">
const props = defineProps<{ username: string; status: string }>()
</script>

<style scoped lang="sass">
.status-dot
  bottom: 0
  right: 0
  width: 15px
  height: 15px
  border-radius: 50%
  border: 2px solid #2f3136 // matches Discord background
</style>
