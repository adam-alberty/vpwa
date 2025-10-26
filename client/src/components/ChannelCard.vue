<template>
  <q-item clickable :style="active && `background-color: var(--q-dark-page)`">
    <q-item-section>
      <div>
        <Channel-Name v-bind="props" :highlight="newMessageCount > 0 || active" />
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import ChannelName from './ChannelName.vue';

import { computed } from 'vue';
import { useChannelStore } from '@/stores/channel.store';

import type { Channel } from '@/types/global';
const props = withDefaults(defineProps<Channel>(), {
  isPrivate: false,
});
const { id, name, isPrivate, newMessageCount } = props;

const channelStore = useChannelStore();
const active = computed(() => channelStore.currentChannel?.id == id);
</script>
