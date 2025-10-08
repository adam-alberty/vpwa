<template>
  <q-scroll-area class="" style="height: calc(100vh - 180px)">
    <channel-message
      v-for="message in channelStore.currentChannel?.messages"
      :key="message.id"
      v-bind="message"
    />
  </q-scroll-area>
</template>

<script setup lang="ts">
import ChannelMessage from '@/components/ChannelMessage.vue';

import { useChannelStore } from 'src/stores/channel-store';
const channelStore = useChannelStore();
</script>
