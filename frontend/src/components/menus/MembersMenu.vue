<template>
  <q-scroll-area>
    <q-list class="q-pa-sm">
      <UserMemberCard v-for="member in memberStore.members" :key="member.user_id" v-bind="member" />
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { useMemberStore } from 'src/stores/members.store';
import UserMemberCard from '../UserMemberCard.vue';

const memberStore = useMemberStore();
</script>
