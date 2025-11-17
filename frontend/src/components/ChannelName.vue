<template>
  <div class="row items-center no-wrap">
    <q-icon
      :name="type == 'private' ? 'lock' : 'tag'"
      class="q-mr-sm"
      :class="{ 'text-bold': highlight, 'text-grey-5': !highlight }"
    ></q-icon>
    <div class="line-h-1" :class="{ 'text-bold': highlight, 'text-grey-5': !highlight }">{{ name }}</div>
  </div>
</template>

<script setup lang="ts">
import type { ChannelType } from '@/types';

interface Props {
  name: string;
  type: ChannelType;
  highlight?: boolean;
}

const props = withDefaults(defineProps<Props>(), {});
</script>
