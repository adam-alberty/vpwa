<template>
  <q-card class="user-member-card row items-center q-pa-sm no-border no-shadow">
    <q-item-section avatar>
      <UserAvatar
        v-bind="props"
        size="36px"
        :color="color"
        text-color="white"
        updateStatus
      />
    </q-item-section>

    <div class="column justify-center">
      <div class="text-bold text-white">{{ username }}</div>
      <!-- <div class="text-caption text-grey-5">{{ status }}</div> -->
    </div>

    <!-- Todo -->
    <q-menu
      anchor="center start"
      self="center right"
      class="bg-highlight q-py-sm q-px-md"
      :offset="[10, 5]"
    >
      <div class="typing-menu">Yes that is a great</div>
    </q-menu>
  </q-card>
</template>

<script setup lang="ts">
import UserAvatar from './UserAvatar.vue';
import { ChannelMemberRole } from '@/types';
import { useAuthStore } from '@/stores/auth-user.store';

import type { UserMember } from 'src/types';
import { computed } from 'vue';

const auth = useAuthStore();

const props = defineProps<UserMember>();

const itsMe = computed(() => auth.user?.id == props.id);
const color = computed(() => {
  if (props.role == ChannelMemberRole.ADMIN)
    return 'orange-13';
  if (itsMe.value)
    return 'primary';
  return 'grey-8';
});
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
