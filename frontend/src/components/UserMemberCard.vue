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
        :isTyping="isTyping"
      />
    </q-item-section>

    <div class="column justify-center">
      <div class="text-bold text-white">{{ username }}</div>
      <!-- <div class="text-caption text-grey-5">{{ status }}</div> -->
    </div>

    <q-menu
      anchor="center start"
      self="center right"
      class="bg-highlight q-py-sm q-px-md"
      :offset="[10, 5]"
    >
      <div class="typing-menu" :class="{'text-secondary': !typing}">{{typing || 'User is not typing...'}}</div>
    </q-menu>

    <q-menu
      anchor="top right"
      self="top left"
      class="bg-highlight"
      context-menu
    >
      <q-list dense style="min-width: 100px">
        <q-item clickable v-close-popup @click="mention">
          <q-item-section>@{{username}}</q-item-section>
        </q-item>
        <template v-if="!isMe">
          <q-separator />
          <q-item v-if="amIAdmin" clickable v-close-popup @click="kick">
            <q-item-section>Kick and Ban</q-item-section>
          </q-item>
          <q-item v-else-if="!isAdmin && channel?.type == 'public'" clickable v-close-popup @click="kick">
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
import { useAuthStore, useMemberStore, useMessageStore, useWsStore } from '@/stores';

import type { UserMember } from 'src/types';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { success, error } from '@/utils/toast';

const route = useRoute();

const auth = useAuthStore();
const memberStore = useMemberStore();
const wsStore = useWsStore();

type Props = UserMember & {
  channel?: Channel
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

const typing = ref('');
const isTyping = ref(false);

let typingTimeout

onMounted(() => {
  wsStore.on(`@${props.id}:typing`, handleIsTyping);
});

onUnmounted(() => {
  wsStore.off(`@${props.id}:typing`, handleIsTyping);
});

function handleIsTyping(typingStr: string) {
  typing.value = typingStr;
  isTyping.value = typingStr.length > 0;

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    isTyping.value = false;
  }, 1000);
}

function mention() {
  const messageStore = useMessageStore();
  messageStore.currentMessage += `@${props.username} `;
}

async function kick() {
  return memberStore.kickMember(route.params.id as string, props.id).then(success).catch(error);
}
</script>

<style lang="sass" scoped>
.typing-menu
  width: 620px
  height: 100px
  overflow-x: hidden
  word-wrap: break-word

.user-member-card
  border-radius: 0.7rem

  &:hover
    background-color: $dark-page
</style>
