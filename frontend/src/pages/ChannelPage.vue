<template>
  <q-scroll-area style="height: calc(100vh - 160px)" class="scroll" ref="scrollRef">
    <q-infinite-scroll @load="loadMoreMessages" :disable="!nextPage" :offset="100" reverse>
      <template v-if="isSkeletonShown" v-for="_ in 20">
        <div class="q-pa-sm row no-wrap items-start">
          <q-skeleton type="QAvatar" style="flex-shrink: 0" />
          <div class="full-width q-pl-md">
            <q-skeleton type="rect" style="width: 50%" />
            <q-skeleton type="rect" class="q-mt-sm" style="width: 30%" />
          </div>
        </div>
      </template>

      <p v-if="!nextPage" class="q-ma-lg g-mb-lg text-grey-6">
        This is the beginning of <b>{{ channelStore.currentChannel?.name }}</b
        >...
      </p>

      <ChannelMessage v-for="message in messageStore.messages" :key="message.id" v-bind="message" />
    </q-infinite-scroll>
  </q-scroll-area>
</template>

<script setup lang="ts">
import ChannelMessage from '@/components/ChannelMessage.vue';
import { QScrollArea } from 'quasar';
import {
  useAuthStore,
  useChannelStore,
  useMemberStore,
  useMessageStore,
  useWsStore,
} from 'src/stores';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { error, info } from '@/utils/toast';
import { UserStatus } from 'src/types';

const loading = ref(true);
const isSkeletonShown = ref(false);

const scrollRef = ref<QScrollArea | null>(null);
const nextPage = ref<number | null>(null);

const auth = useAuthStore();
const wsStore = useWsStore();
const messageStore = useMessageStore();
const channelStore = useChannelStore();
const memberStore = useMemberStore();

const route = useRoute();
const router = useRouter();

watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId != oldId) {
      await pageChange();
    }
  },
);

watch(
  () => messageStore.messages?.length,
  (newVal, oldVal) => {
    if (newVal > oldVal && scrollRef.value?.getScrollPercentage().top > 0.96) {
      // At bottom when message added
      setTimeout(() => scrollToBottom(), 100);
    }
  },
);

watch(
  () => auth.user?.status,
  async (newVal, oldVal) => {
    if (newVal == UserStatus.OFFLINE) {
      // Stop listening
      messageStore.stopListeningForMessages();
    } else if (oldVal == UserStatus.OFFLINE) {
      // Reload messages
      await messageStore.loadMessages(null);
      nextPage.value = 1;
    }
  },
);

onMounted(async () => {
  await pageChange();
  wsStore.on('channel:removed', handleChannelRemoved);
});

onUnmounted(() => {
  wsStore.off('channel:removed', handleChannelRemoved);
});

function scrollToBottom(duration = 250) {
  scrollRef.value?.setScrollPercentage('vertical', 1, duration);
}

async function handleChannelRemoved(data) {
  if (data.channel.id == route.params.id) {
    info(data.message ? `Channel removed: ${data.message}` : 'Channel removed');
    await router.replace('/');
  }
}

async function pageChange() {
  loading.value = true;
  const skeletonTimeout = setTimeout(() => {
    isSkeletonShown.value = true;
  }, 500);

  try {
    wsStore.connect();
    scrollToBottom(1);

    await Promise.all([
      channelStore.setCurrentChannel(route.params.id as string),
      memberStore.loadMembers(route.params.id as string),
    ]);
    await messageStore.loadMessages(null);

    nextPage.value = 1;
  } catch (err) {
    error(err);
    router.replace('/').catch(console.error);
  } finally {
    loading.value = false;
    clearTimeout(skeletonTimeout);
    isSkeletonShown.value = false;
  }
}

function loadMoreMessages(index: number, done: () => void) {
  messageStore
    .loadMessages(route.params.id as string, nextPage.value)
    .then((data) => {
      nextPage.value = data.meta.nextPage;
      done();
    })
    .catch(error);
}
</script>

<style scoped lang="scss"></style>
