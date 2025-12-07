<template>
  <q-scroll-area>
    <div v-if="memberStore.loading && !memberStore.members?.length" class="q-pa-sm">
      <q-skeleton type="rect" class="full-width" />
    </div>
    <q-list v-else class="q-pa-sm" gap="sm">
      <UserMemberCard v-for="member in memberStore.members" :key="member.id" v-bind="member" :channel="channelStore.currentChannel" class="q-mb-sm" />
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { useChannelStore, useMemberStore } from '@/stores';
import UserMemberCard from '../UserMemberCard.vue';

const memberStore = useMemberStore();
const channelStore = useChannelStore();
</script>
