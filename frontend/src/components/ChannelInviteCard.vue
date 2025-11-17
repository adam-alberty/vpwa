<template>
  <q-item class="item bg-grey-9">
    <q-item-section>
      <div>
        <q-icon name="mail" color="primary" size="20px" class="q-my-none q-mb-xs" />
        <ChannelName v-bind="props" highlight />

        <q-menu
          anchor="center end"
          self="center left"
          class="no-shadow bg-highlight q-pa-xs"
          :offset="[5, 5]"
        >
          <div class="row q-gutter-x-sm">
            <q-btn
              size="11px"
              dense
              flat
              icon="check"
              class="bg-positive text-white"
              @click="accept"
            >
              <q-tooltip>Accept invite</q-tooltip>
            </q-btn>
            <q-btn
              size="11px"
              dense
              flat
              icon="close"
              class="bg-negative text-white"
              @click="reject"
            >
              <q-tooltip>Reject invite</q-tooltip>
            </q-btn>
          </div>
        </q-menu>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import type { ChannelInvite } from 'src/types';
import ChannelName from './ChannelName.vue';

const props = defineProps<ChannelInvite>();
const {} = props;

const emit = defineEmits<{
  (e: 'accept', value: ChannelInvite): void;
  (e: 'reject', value: ChannelInvite): void;
}>();

function accept() {
  emit('accept', props);
}

function reject() {
  emit('reject', props);
}
</script>

<style lang="sass" scoped>
.q-item
  padding-left: 12px
  padding-bottom: 4px
</style>
