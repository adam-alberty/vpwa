<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="row justify-center q-pa-md">
        <div class="full-width row justify-center">
          <div class="full-width" style="max-width: 400px">
            <div class="q-mt-xl">
              <AppLogo size="32px" />
            </div>
            <router-view />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AppLogo from 'src/components/AppLogo.vue';
import { useWsStore } from '@/stores/ws.store';
import { onMounted } from 'vue';

const wsStore = useWsStore();
wsStore.disconnect();
</script>
