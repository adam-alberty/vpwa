<template>
  <q-scroll-area class="" style="height: calc(100vh - 180px)" ref="scrollRef">
    <channel-message
      v-for="message in channelStore.currentChannel?.messages"
      :key="message.id"
      v-bind="message"
    />
  </q-scroll-area>
</template>

<script setup lang="ts">
import ChannelMessage from '@/components/ChannelMessage.vue';

import { QScrollArea } from 'quasar'
import { useChannelStore } from 'src/stores/channel-store';
import { computed, nextTick, ref, watch } from 'vue';

const channelStore = useChannelStore();

const scrollRef = ref<QScrollArea | null>(null)
watch(() => channelStore.currentChannel?.messages.length, (newValue, oldValue) => {
  if (newValue > oldValue) {
    setTimeout(() => scrollRef.value.setScrollPercentage('vertical', 1, 200), 10)
  }
})
</script>
