<template>
  <q-item clickable @click="goToChannel()" class="item" :class="active && `bg-highlight`" dense>
    <q-item-section>
      <ChannelName v-bind="props" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ChannelName from './ChannelName.vue';
import type { Channel } from 'src/types';

const props = defineProps<Channel>();
const { id } = props;

const router = useRouter();
const route = useRoute();

async function goToChannel() {
  await router.push({ name: 'Channels', params: { id } });
}

const active = computed(() => route.params.id == id);
</script>

<style scoped lang="scss">
.item {
  border-radius: 0.7rem;
  padding: 0rem 1rem;
}
</style>
