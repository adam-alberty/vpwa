<template>
  <q-item clickable :class="active && `bg-black`">
    <q-item-section>
      <div>
        <Channel-Name v-bind="props" />
        <div class="text-grey-5">{{ lastMessage }}</div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import ChannelName from './ChannelName.vue';

import { computed } from 'vue';
import { useChannelStore } from 'src/stores/channel-store';

import type { Channel } from 'src/types/global';
const props = withDefaults(defineProps<Channel>(), {
  isPrivate: false
});
const { id, name, lastMessage, isPrivate } = props;

const channelStore = useChannelStore();
const active = computed(() => channelStore.currentChannel?.id == id);
</script>
