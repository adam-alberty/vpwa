<template>
  <div class="channel-message q-py-md q-px-lg row no-wrap" :class="{ highlight: isHighlight }">
    <q-item-section :key="sender.status" avatar>
      <UserAvatar v-bind="sender" size="40px" color="secondary" text-color="white" updateStatus />
    </q-item-section>
    <div>
      <div class="row items-center q-gutter-sm q-mb-xs">
        <span class="line-h-1 text-bold">{{ sender.username }}</span>
        <span class="channel-message__timestamp text-grey-6"
          >{{ formatTimestamp(datetime) }}

          <q-tooltip anchor="top middle" self="bottom middle" :offset="[5, 5]">
            {{ datetime.toDateString() }} {{ datetime.toTimeString() }}
          </q-tooltip>
        </span>
      </div>

      <div>
        <template v-for="(part, i) in txtParts" :key="i">
          <span v-if="part.isMention" class="mention rounded-borders" :class="{ highlight: part.highlight }">
            {{ part.value }}
          </span>
          <span v-else>{{ part.value }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import UserAvatar from './UserAvatar.vue';
import type { Message} from 'src/types';
import { UserStatus } from 'src/types';
import { computed, ref, watch } from 'vue';
import { useMemberStore } from '@/stores/member.store';
import { useAuthStore } from 'src/stores/auth-user.store';

const props = withDefaults(defineProps<Message>(), {});
const { sender, content, createdAt } = props;

const datetime = computed(() => new Date(createdAt));

const auth = useAuthStore();
const memberStore = useMemberStore();

const isHighlight = ref(false);

const txtParts = computed(() => {
  const tokens = content.split(/(\s+)/);
  return tokens.map((token) => {
    var isMention = token.startsWith('@') && token.length > 1 && !/\s/.test(token); // Strts w @ and ends w space
    var highlight;
    if (isMention) {
      const member = memberStore.getMember(token.slice(1));
      if (!member)
        isMention = false;
      else if (member.id == auth.user?.id) {
        highlight = true;
        isHighlight.value = true;
      }
    }
    // TODO: Mby check if the user / mention exists...
    return { value: token, isMention, highlight };
  });
});

const formatTimestamp = (timestamp: Date) => {
  if (isNaN(timestamp?.getTime())) return '';

  const inputDate = new Date(timestamp).setHours(0, 0, 0, 0);
  const todaysDate = new Date().setHours(0, 0, 0, 0);

  return `${inputDate !== todaysDate ? timestamp.toLocaleDateString() + ' ' : ''}${timestamp.toLocaleTimeString(
    'en',
    {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    },
  )}`;
};
</script>

<style lang="sass" scoped>
.channel-message
  &:hover
    background: #373b42 !important

  &.highlight
    background: $highlight

  &__timestamp
    line-height: 1
    font-size: 0.85rem

.mention
  color: #00bcff
  font-weight: 600
  background-color: rgba(0, 188, 235, 0.15)
  padding: 0 4px

  &.highlight
    color: #EFBF04
    background-color: #EFBF0425
</style>
