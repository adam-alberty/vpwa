<template>
  <q-icon name="chat" color="primary" :size="size" />
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: '24px',
  },
});
</script>
