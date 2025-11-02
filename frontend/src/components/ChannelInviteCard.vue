<template>
  <q-item class="bg-grey-9">
    <q-item-section>
      <div>
        <q-icon name="mail" color="primary" size="19px" class="q-my-none" />
        <Channel-Name v-bind="props" highlight />

        <q-menu anchor="center end" self="center left" class="no-shadow">
          <div class="row q-gutter-x-sm q-pa-xs bg-blue-grey-8">
            <q-btn size="11px" dense flat icon="check" class="bg-positive text-white" @click="accept" />
            <q-btn size="11px" dense flat icon="close" class="bg-negative text-white" @click="reject"/>
          </div>
        </q-menu>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import ChannelName from './ChannelName.vue';

import type { ChannelInvite } from '@/types/global';
const props = withDefaults(defineProps<ChannelInvite>(), {
  isPrivate: false
});
const { name, isPrivate } = props;

const emit = defineEmits<{
  (e: 'accept', value: ChannelInvite): void
  (e: 'reject', value: ChannelInvite): void
}>()

function accept() {
  emit('accept', props);
}

function reject() {
  emit('reject', props);
}
</script>

<style lang="sass" scoped>
.q-item
  border-left: 3px solid var(--q-primary)
</style>
