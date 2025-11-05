<template>
  <q-item
    clickable
    @click="goToChannel()"
    :style="active && `background-color: var(--q-dark-page)`"
  >
    <q-item-section>
      <div>
        <ChannelName
          v-bind="props"
          :is-private="type === 'private'"
          :highlight="newMessageCount > 0 || active"
        />
      </div>
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
