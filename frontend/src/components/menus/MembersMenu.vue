<template>
  <q-scroll-area>
    <q-list class="q-pa-sm" gap="sm">
      <UserMemberCard v-for="member in memberStore.members" :key="member.id" v-bind="member" :channel="channelStore.currentChannel" class="q-mb-sm" />
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { useChannelStore } from '@/stores/channel.store';
import { useMemberStore } from 'src/stores/member.store';
import UserMemberCard from '../UserMemberCard.vue';

const memberStore = useMemberStore();
const channelStore = useChannelStore();
</script>
