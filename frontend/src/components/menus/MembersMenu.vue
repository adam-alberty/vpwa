<template>
  <q-scroll-area>
    <div
      class="row items-center justify-between q-gutter-x-sm q-item text-weight-medium bg-dark text-body1"
      style="position: sticky; top: 0px; z-index: 1"
    >
      <div class="row items-center q-gutter-x-sm">
        <span class="q-ma-none">Channel members</span>
      </div>
    </div>
    <q-list class="q-pa-sm">
      <User-Member-Card v-for="user in members" :key="user.id" v-bind="user" />
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import UserMemberCard from '../UserMemberCard.vue';
import { useChannelStore } from '@/stores/channel.store';

const members: BasicUser[] = [
  // TODO: Integrate to channel
  { id: '1', username: 'You', status: 'online' },
  { id: '2', username: 'bob', status: 'offline' },
  { id: '3', username: 'alice', status: 'dnd' },
];

const channelStore = useChannelStore();
</script>
