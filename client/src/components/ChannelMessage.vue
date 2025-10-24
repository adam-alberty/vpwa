<template>
  <div class="channel-message q-py-md q-px-lg row no-wrap">
    <q-item-section avatar>
      <q-avatar size="40px" color="secondary" text-color="white"
        >{{ username.charAt(0).toUpperCase() }}
      </q-avatar>
    </q-item-section>
    <div>
      <div class="row items-center q-gutter-sm q-mb-xs">
        <span class="channel-message__username text-bold">{{ username }}</span>
        <span class="channel-message__timestamp text-grey-6"
          >{{ formatTimestamp(datetime) }}

          <q-tooltip anchor="top middle" self="bottom middle" :offset="[5, 5]">
            {{ datetime.toDateString() }} {{ datetime.toTimeString() }}
          </q-tooltip>
        </span>
      </div>

      <div>
        <template v-for="(part, i) in txtParts" :key="i">
          <span v-if="part.isMention" class="mention rounded-borders">
            {{ part.value }}
          </span>
          <span v-else>{{ part.value }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import type { Message } from '@/types/global';
const props = withDefaults(defineProps<Message>(), {});
const { username, text, timestamp } = props;

const datetime = computed(() => new Date(timestamp));

const txtParts = computed(() => {
  const tokens = text.split(/(\s+)/);
  return tokens.map((token) => {
    const isMention = token.startsWith('@') && token.length > 1 && !/\s/.test(token); // Strts w @ and ends w space
    // TODO: Mby check if the user / mention exists...
    return { value: token, isMention };
  });
});

const formatTimestamp = (timestamp: Date) => {
  const inputDate = new Date(timestamp).setHours(0, 0, 0, 0);
  const todaysDate = new Date().setHours(0, 0, 0, 0);

  return `${inputDate !== todaysDate ? timestamp.toLocaleDateString() + ' ' : ''}${timestamp.toLocaleTimeString(
    'en',
    {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    },
  )}`;
};
</script>

<style lang="sass" scoped>
.mention
  color: #00bcff
  font-weight: 600
  background-color: rgba(0, 188, 235, 0.15)
  padding: 0 4px
</style>
