<template>
  <q-item class="items-start bg-grey-9">
    <q-item-section avatar>
      <q-avatar size="32px" color="green-7" text-color="white">{{ name.charAt(0) }}</q-avatar>
    </q-item-section>

    <q-item-section>
      <div>
        <q-badge color="blue"> Invite </q-badge>
        <div class="row items-center no-wrap">
          <q-icon :name="isPrivate ? 'lock' : 'tag'" class="q-mr-xs"></q-icon>
          <div class="text-bold">{{ name }}</div>
        </div>

        <div class="row q-gutter-x-sm">
          <q-btn size="sm" dense flat label="Accept" icon="check" class="bg-green-7 text-white q-pr-sm" />
          <q-btn size="sm" dense flat label="Reject" icon="close" class="bg-red-5 text-white q-pr-sm" />
        </div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import type { ChannelInvite } from 'src/types/global';
const props = withDefaults(defineProps<ChannelInvite>(), {
  isPrivate: false
});
const { name } = props;
</script>
