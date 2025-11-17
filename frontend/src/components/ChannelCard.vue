<template>
  <q-item clickable class="item" :class="active && `bg-highlight`" dense>
    <q-item-section>
      <ChannelName v-bind="props" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ChannelName from './ChannelName.vue';
import type { Channel } from 'src/types';

const props = defineProps<Channel>();
const { id } = props;

const route = useRoute();

const active = computed(() => route.params.id == id);
</script>

<style scoped lang="scss">
</style>
