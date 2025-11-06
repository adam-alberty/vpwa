<template>
  <q-item clickable @click="goToChannel()" class="item" :class="active && `bg-highlight`">
    <q-item-section>
      <ChannelName
        v-bind="props"
        :is-private="type === 'private'"
        :highlight="newMessageCount > 0 || active"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Channel } from '@/types/global';
import { useRoute, useRouter } from 'vue-router';
import ChannelName from './ChannelName.vue';

const props = defineProps<Channel>();
const { id, name, type, newMessageCount } = props;

const router = useRouter();
const route = useRoute();

function goToChannel() {
  router.push({ name: 'Channels', params: { id } });
}

const active = computed(() => route.params.id == id);
</script>

<style scoped lang="scss">
.item {
  border-radius: 0.7rem;
  padding: 0rem 1rem;
}
</style>
