<template>
  <q-item class="items-start bg-grey-9">
    <q-item-section>
      <div>
        <q-badge color="blue"> Invite </q-badge>
        <Channel-Name v-bind="props" highlight />

        <div class="row q-gutter-x-sm">
          <q-btn size="sm" dense flat label="Accept" icon="check" class="bg-green-7 text-white q-pr-sm" />
          <q-btn size="sm" dense flat label="Reject" icon="close" class="bg-red-5 text-white q-pr-sm" />
        </div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import ChannelName from './ChannelName.vue';

import type { ChannelInvite } from 'src/types/global';
const props = withDefaults(defineProps<ChannelInvite>(), {
  isPrivate: false
});
const { name, isPrivate } = props;
</script>
