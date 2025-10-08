<template>
  <div class="channel-message q-pa-md q-px-lg">
    <div class="row q-gutter-sm">
      <span class="channel-message__username text-bold">{{ username }}</span>
      <span class="channel-message__timestamp text-grey-5"
        >{{ datetime.toLocaleDateString() }} {{ datetime.toLocaleTimeString() }}</span
      >
    </div>
    <div>
      {{ text }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import type { Message } from "src/types/global";
const props = withDefaults(defineProps<Message>(), {});
const { username, text, timestamp } = props;

const datetime = computed(() => new Date(timestamp));
</script>
