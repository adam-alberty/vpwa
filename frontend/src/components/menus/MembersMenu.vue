<template>
  <q-scroll-area>
    <q-list class="q-pa-sm" gap="sm">
      <UserMemberCard v-for="member in memberStore.members" :key="member.id" v-bind="member" class="q-mb-sm" />
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { useMemberStore } from 'src/stores/members.store';
import UserMemberCard from '../UserMemberCard.vue';

const memberStore = useMemberStore();
</script>
