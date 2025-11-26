<template>
  <router-view />
</template>

<script setup lang="ts">
import api from '@/services/api';
import { useRouter } from 'vue-router';

const router = useRouter();

api.addErrorInterceptor(data => {
  if (data.status == 401) {
    router.replace('/').catch(console.error);
  }
});
</script>
