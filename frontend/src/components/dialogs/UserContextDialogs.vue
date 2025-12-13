<template>
  <div>
    <q-menu
      v-if="showIsTyping"
      anchor="center start"
      self="center right"
      class="bg-highlight q-py-sm q-px-md typing-menu"
      :offset="[10, 5]"
      :target="target"
    >
      <div class="typing-content" :class="{'text-secondary': !typing}">{{typing || `${username} is not typing...`}}</div>
    </q-menu>

    <q-menu
      anchor="top right"
      self="top left"
      class="bg-highlight"
      context-menu
      :target="target"
    >
      <q-list dense style="min-width: 100px">
        <q-item clickable v-close-popup @click="mention">
          <q-item-section>@{{username}}</q-item-section>
        </q-item>
        <template v-if="!isMe && showContextMenu">
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
  </div>
</template>

<script lang="ts" setup>
import type { Channel } from '@/types';
import { ChannelMemberRole } from '@/types';
import { useAuthStore, useMemberStore, useMessageStore, useWsStore } from '@/stores';

import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { success, error } from '@/utils/toast';

const props = withDefaults(defineProps<{id: string, username: string, role?: ChannelMemberRole, channel?: Channel, target: string, showIsTyping?: boolean, showContextMenu?: boolean}>(), {
  showIsTyping: true
});

const emit = defineEmits<{
  (e: 'update:typing', value: string): void;
  (e: 'update:isTyping', value: boolean): void;
}>();

const route = useRoute();

const auth = useAuthStore();
const memberStore = useMemberStore();
const wsStore = useWsStore();

const typing = ref('');
const isTyping = ref(false);

const isMe = computed(() => auth.user?.id == props.id);
const isAdmin = computed(() => props.role == ChannelMemberRole.ADMIN);

const amIAdmin = computed(() => memberStore.getAdmin(auth.user.id)?.id == auth.user?.id);

let typingTimeout

if (props.showIsTyping) {
  onMounted(() => {
    wsStore.on(`@${props.id}:typing`, handleIsTyping);
  });

  onUnmounted(() => {
    wsStore.off(`@${props.id}:typing`, handleIsTyping);
  });
}

function handleIsTyping(typingStr: string) {
  typing.value = typingStr;
  isTyping.value = typingStr.length > 0;

  emit('update:typing', typingStr);
  emit('update:isTyping', isTyping.value);

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    isTyping.value = false;
    emit('update:isTyping', false);
  }, 1000);
}

function mention() {
  const messageStore = useMessageStore();
  messageStore.currentMessage = messageStore.currentMessage.trim() + ` @${props.username} `;
}

async function kick() {
  return memberStore.kickMember(route.params.id as string, props.id).then(success).catch(error);
}
</script>

<style scoped lang="sass">
.typing-menu
  .typing-content
    width: 620px
    height: 100px
    overflow-x: hidden
    word-wrap: break-word

  @media (max-width: $breakpoint-sm-max)
    .typing-content
      width: 350px
      height: 180px
</style>
