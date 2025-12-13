<template>
  <q-card class="row items-center q-pa-sm no-border no-shadow" :id="`user-member-card-${id}`">
    <q-item-section avatar>
      <UserAvatar
        v-bind="member"
        size="36px"
        :color="color"
        text-color="white"
        updateStatus
        :isTyping="isTyping"
        :key="member.status"
      />
    </q-item-section>

    <div class="column justify-center">
      <div class="text-bold text-white">{{ username }}</div>
      <!-- <div class="text-caption text-grey-5">{{ status }}</div> -->
    </div>

    <UserContextDialogs
      v-bind="member"
      v-model:isTyping="isTyping"
      :showIsTyping="!isMe"
      :target="`#user-member-card-${id}`"
      showContextMenu
    />
  </q-card>
</template>

<script setup lang="ts">
import UserAvatar from './UserAvatar.vue';
import UserContextDialogs from '@/components/dialogs/UserContextDialogs.vue';
import type { Channel} from '@/types';
import { ChannelMemberRole } from '@/types';
import { useAuthStore, useMemberStore } from '@/stores';

import type { UserMember } from 'src/types';
import { computed, ref } from 'vue';

const auth = useAuthStore();

type Props = UserMember & {
  channel?: Channel
};
const props = defineProps<Props>();
const member = computed(() =>
  props.id == auth.user?.id ? { ...auth.user, role: props.role, channel: props.channel } : props
);

const isMe = computed(() => auth.user?.id == props.id);
const isAdmin = computed(() => props.role == ChannelMemberRole.ADMIN);

const color = computed(() => {
  if (isAdmin.value)
    return 'orange-13';
  if (isMe.value)
    return 'primary';
  return 'grey-8';
});

const isTyping = ref(false);
</script>

<style lang="sass" scoped>
.q-card
  border-radius: 0.7rem

  &:hover
    background-color: $highlight
</style>
