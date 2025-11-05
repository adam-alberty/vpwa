<template>
  <q-item
    clickable
    @click="goToChannel()"
    :style="active && `background-color: var(--q-dark-page)`"
  >
    <q-item-section>
      <div>
        <ChannelName v-bind="props" :highlight="newMessageCount > 0 || active" />
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Channel } from '@/types/global';
import { useRoute, useRouter } from 'vue-router';
import ChannelName from './ChannelName.vue';

const props = withDefaults(defineProps<Channel>(), {
  isPrivate: false,
});
const { id, name, isPrivate, newMessageCount } = props;

const router = useRouter();

function goToChannel() {
  router.push({ name: 'Channels', params: { id } });
}

const route = useRoute();
const active = computed(() => route.params.id == id);
</script>
