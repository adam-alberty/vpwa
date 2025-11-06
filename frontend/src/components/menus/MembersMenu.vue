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
      <UserMemberCard v-for="member in memberStore.members" :key="member.user_id" v-bind="member" />
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { useMemberStore } from 'src/stores/members.store';
import UserMemberCard from '../UserMemberCard.vue';

const memberStore = useMemberStore();
</script>
