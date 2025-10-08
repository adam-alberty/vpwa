<template>
  <q-scroll-area class="" style="height: calc(100vh - 200px)">
    <channel-message
      v-for="message in messages"
      :key="message.id"
      v-bind="message"
    />
  </q-scroll-area>
</template>

<script setup lang="ts">
import ChannelMessage from '@/components/ChannelMessage.vue';

import { getRandomMessages } from 'src/stores/mock';
const messages = getRandomMessages(20);
</script>
