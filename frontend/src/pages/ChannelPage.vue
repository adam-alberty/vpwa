<template>
  <q-scroll-area
    v-if="!loading"
    style="height: calc(100vh - 110px)"
    ref="scrollRef"
    class="chat-scroll"
  >
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
        This is the beginning of <b>{{ channel.name }}</b
        >...
      </p>

      <ChannelMessage v-for="message in messages" :key="message.id" v-bind="message" />
    </q-infinite-scroll>
  </q-scroll-area>
  <div v-else>loading</div>
</template>

<script setup lang="ts">
import ChannelMessage from '@/components/ChannelMessage.vue';
import type { QScrollArea } from 'quasar';
import { computed, ref, watch } from 'vue';

const loading = ref(true);
const channel = ref(null);
const messages = ref<any[]>(null);
const hasMoreMessages = ref(false);

const scrollRef = ref<QScrollArea | null>(null);
const allLoaded = computed(() => hasMoreMessages.value === false);

// watch(
//   () => channelStore.sendMessageIndex,
//   (newValue, oldValue) => {
//     if (newValue > oldValue) {
//       console.log(scrollRef.value);
//       setTimeout(() => scrollRef.value.setScrollPercentage('vertical', 1, 200), 10);
//     }
//   },
// );

function fetchMessages() {}

function loadMoreMessages(index: number, done: () => void) {
  // TODO: Be...
  setTimeout(() => {
    fetchMessages();

    done();
  }, 2000);
}
</script>
