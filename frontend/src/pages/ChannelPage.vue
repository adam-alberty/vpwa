<template>
  <q-scroll-area style="height: calc(100vh - 110px)" ref="scrollRef" class="chat-scroll">
    <q-infinite-scroll
      reverse
      :offset="100"
      scroll-target=".chat-scroll__content"
      :disable="allLoaded"
      @load="loadMoreMessages"
    >
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>

      <p v-if="allLoaded" class="q-ma-lg g-mb-lg text-grey-6">
        This is the beginning of <b>{{ channelStore.currentChannel?.name }}</b
        >...
      </p>

      <channel-message
        v-for="message in channelStore.currentChannel?.messages"
        :key="message.id"
        v-bind="message"
      />
    </q-infinite-scroll>
  </q-scroll-area>
</template>

<script setup lang="ts">
import ChannelMessage from '@/components/ChannelMessage.vue';

import type { QScrollArea } from 'quasar';
import { useChannelStore } from '@/stores/channel.store';
import { computed, ref, watch } from 'vue';

const channelStore = useChannelStore();

const scrollTarget = ref(null);
const scrollRef = ref<QScrollArea | null>(null);

const allLoaded = computed(() => channelStore.currentChannel.nextMessagePage == null);

watch(
  () => channelStore.sendMessageIndex,
  (newValue, oldValue) => {
    if (newValue > oldValue) {
      console.log(scrollRef.value)
      setTimeout(() => scrollRef.value.setScrollPercentage('vertical', 1, 200), 10);
    }
  },
);

function loadMoreMessages(index: number, done: () => void) {
  // TODO: Be...
  setTimeout(() => {
    channelStore.fetchMessages()

    done()
  }, 2000)
}
</script>
