<template>
  <q-card class="user-member-card row items-center q-pa-sm no-border no-shadow">
    <q-item-section avatar>
      <UserAvatar
        v-bind="props"
        :status="status || 'offline'"
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

    <q-menu
      anchor="top right"
      self="top left"
      class="bg-highlight q-py-sm q-px-md"
      context-menu
    >
      <q-list dense style="min-width: 100px">
        <template v-if="!isMe">
          <q-item v-if="amIAdmin" clickable v-close-popup @click="kick">
            <q-item-section>Kick and Ban</q-item-section>
          </q-item>
          <q-item v-else-if="!isAdmin && channel.type == 'public'" clickable v-close-popup @click="kick">
            <q-item-section>Vote Kick</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-menu>
  </q-card>
</template>

<script setup lang="ts">
import UserAvatar from './UserAvatar.vue';
import type { Channel} from '@/types';
import { ChannelMemberRole } from '@/types';
import { useAuthStore } from '@/stores/auth-user.store';
import { useMemberStore } from '@/stores/member.store';

import type { UserMember } from 'src/types';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { error } from '@/utils/toast';

const route = useRoute();

const auth = useAuthStore();
const memberStore = useMemberStore();

type Props = UserMember & {
  channel: Channel
};
const props = defineProps<Props>();

const isMe = computed(() => auth.user?.id == props.id);
const isAdmin = computed(() => props.role == ChannelMemberRole.ADMIN);

const amIAdmin = computed(() => memberStore.getAdmin(auth.user.id)?.id == auth.user?.id);

const color = computed(() => {
  if (isAdmin.value)
    return 'orange-13';
  if (isMe.value)
    return 'primary';
  return 'grey-8';
});

async function kick() {
  console.log('Kicking', props.id);
  return memberStore.kickMember(route.params.id as string, props.id).catch(error);
}
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
