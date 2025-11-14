<template>
  <q-scroll-area style="height: calc(100vh - 160px);" ref="scrollRef" class="chat-scroll">
    <q-infinite-scroll
      reverse
      :offset="100"
      scroll-target=".chat-scroll__content"
      :disable="allLoaded"
      @load="loadMoreMessages"
    >
      <template v-slot:loading>
        <div v-for="_ in 20" :key="_">
          <MessageSkeleton />
        </div>
      </template>

      <p v-if="allLoaded" class="q-ma-lg g-mb-lg text-grey-6">
        This is the beginning of <b>{{ channelStore.currentChannel?.name }}</b
        >...
      </p>

      <ChannelMessage v-for="message in messageStore.messages" :key="message.id" v-bind="message" />
    </q-infinite-scroll>
  </q-scroll-area>
</template>

<script setup lang="ts">
import ChannelMessage from '@/components/ChannelMessage.vue';
import type { QScrollArea } from 'quasar';
import MessageSkeleton from 'src/components/MessageSkeleton.vue';
import { useChannelStore } from 'src/stores/channel.store';
import { useMemberStore } from 'src/stores/members.store';
import { useMessageStore } from 'src/stores/message.store';
import { useWsStore } from 'src/stores/ws.store';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { error } from '@/utils/toast'

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
const router = useRouter();
const wsStore = useWsStore();
const messageStore = useMessageStore();
const channelStore = useChannelStore();
const memberStore = useMemberStore();

watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      await pageChange();
      scrollRef.value?.setScrollPercentage('vertical', 1, 0);
    }
  },
);

onMounted(async () => {
  await pageChange();
});

async function pageChange() {
  loading.value = true;
  try {
    wsStore.connect();
    await Promise.all([
      channelStore.setCurrentChannel(route.params.id as string),
      memberStore.loadMembers(route.params.id as string),
      messageStore.loadMessages(route.params.id as string),
    ])
  }
  catch (err) {
    error(err);
    router.back();
  }
  finally {
    loading.value = false;
  }
}

function loadMoreMessages(index: number, done: () => void) {
  // TODO: Be...
  setTimeout(() => {
    // fetchMessages();

    done();
  }, 2000);
}
</script>

<style scoped lang="scss">
.chat-scroll {
  height: 100%; // take full height of its flex parent
  display: flex;
  flex-direction: column;
}


</style>
