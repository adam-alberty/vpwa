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
        This is the beginning of <b>{{ channelStore.currentChannel?.name }}</b
        >...
      </p>

      <ChannelMessage v-for="message in messageStore.messages" :key="message.id" v-bind="message" />
    </q-infinite-scroll>
  </q-scroll-area>

  <q-scroll-area v-else style="height: calc(100vh - 110px)" class="chat-scroll">
    <div v-for="_ in 20">
      <MessageSkeleton />
    </div>
  </q-scroll-area>
</template>

<script setup lang="ts">
import ChannelMessage from '@/components/ChannelMessage.vue';
import type { QScrollArea } from 'quasar';
import MessageSkeleton from 'src/components/MessageSkeleton.vue';
import { useChannelStore } from 'src/stores/channel.store';
import { useMemberStore } from 'src/stores/members.store';
import { useMessageStore } from 'src/stores/message.store';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const loading = ref(true);
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

const route = useRoute();
const messageStore = useMessageStore();
const channelStore = useChannelStore();
const memberStore = useMemberStore();

watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      pageChange();
      scrollRef.value?.setScrollPercentage('vertical', 1, 0);
    }
  },
);

onMounted(() => {
  pageChange();
});

async function pageChange() {
  loading.value = true;
  channelStore.setCurrentChannel(route.params.id as string);
  memberStore.loadMembers(route.params.id as string);
  messageStore.loadMessages(route.params.id as string);
  loading.value = false;
}

function loadMoreMessages(index: number, done: () => void) {
  // TODO: Be...
  setTimeout(() => {
    // fetchMessages();

    done();
  }, 2000);
}
</script>
