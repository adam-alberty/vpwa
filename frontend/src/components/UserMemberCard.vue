<template>
  <q-card class="user-member-card row items-center q-pa-sm no-border no-shadow">
    <q-item-section avatar>
      <UserAvatar
        :username="username"
        :status="status"
        :id="id"
        size="36px"
        color="grey-8"
        text-color="white"
        updateStatus
      />
    </q-item-section>

    <div class="column justify-center">
      <div class="text-body1 text-weight-medium text-white">{{ username }}</div>
      <!-- <div class="text-caption text-grey-5">{{ status }}</div> -->
    </div>

    <!-- Todo -->
    <q-menu
      anchor="center start"
      self="center right"
      class="bg-blue-grey-8 q-py-sm q-px-md"
      :offset="[10, 5]"
    >
      <div class="typing-menu">Yes that is a great</div>
    </q-menu>
  </q-card>
</template>

<script setup lang="ts">
import UserAvatar from './UserAvatar.vue';

import type { UserMember } from 'src/types';

const props = defineProps<UserMember>();
</script>

<style lang="sass" scoped>
.typing-menu
  width: 620px
  height: 100px

.user-member-card
  border-radius: 0.7rem

  &:hover
    background-color: $dark-page
</style>
