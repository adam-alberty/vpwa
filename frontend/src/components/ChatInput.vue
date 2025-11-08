<template>
  <textarea
    class="text-white"
    :class="{ 'text-italic': command, 'text-red-3': command && !validCommand }"
    v-model="messageInput"
    placeholder="Type a message"
    @input="onInput"
    @keydown.enter.prevent="onEnter"
    @keydown.tab.prevent="onTab"
  ></textarea>
</template>

<script setup lang="ts">
import { useChannelStore } from 'src/stores/channel.store';
import { useMessageStore } from 'src/stores/message.store';
import { useUiStore } from 'src/stores/ui.store';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const messageStore = useMessageStore();
const uiStore = useUiStore();
const channelStore = useChannelStore();
const route = useRoute();

const messageInput = ref('');

const commands = [
  // Fetch from BE based on channel (most likely)
  'list',
  'invite',
  'join',
  'kick',
  'revoke',
  'quit',
  'cancel',
];

const command = computed(() => {
  if (!messageInput.value.startsWith('/'))
    return undefined;
  return messageInput.value.substring(1).split(' ')[0];
});

const validCommand = computed(() => {
  if (commands?.includes(command.value)) return undefined;
  return command.value;
});

const commandArgs = computed(() => {
  if (!command.value)
    return undefined;
  return messageInput.value
    .substring(command.value.length + 1)
    .split(/ +/)
    .filter(Boolean);
});

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  // value.value = target.value.trim();
  // emit('update:modelValue', value.value);
}

function onTab(event: KeyboardEvent) {
  if (command.value && !validCommand.value) {
    const autoComplete = commands?.find((cmd) => cmd.startsWith(command.value));
    if (!autoComplete) return;

    // value.value = `/${autoComplete}`;
    // emit('update:modelValue', value.value);
  }
}

async function onEnter(event: KeyboardEvent) {
  if (event.shiftKey || !messageInput.value.length) return;

  messageStore.createMessage(route.params.id as string, messageInput.value);

  messageInput.value = '';
}

function handleCommand(command: string, args: string[]) {
  switch (command) {
    case 'list':
      uiStore.toggleRightDrawer();
      break;
    case 'invite':
      console.log('Invite');
      break;
    case 'join':
      // if (!args.length) return newChannelDialog.value?.open();
      break;
    case 'kick':
      console.log('Kick');
      break;
    case 'revoke':
      console.log('Revoke');
      break;
    case 'quit':
      console.log('Quit');
      break;
    case 'cancel':
      channelStore.leaveChannel(route.params.id as string);
      break;
  }
}
</script>

<style lang="scss" scoped>
textarea {
  box-sizing: border-box;
  border: none;
  outline: none;
  resize: none;
  font-size: large;
  border-radius: 0.7rem;
  width: 100%;
  padding: 1rem;
  height: 70px;
  border: 1px solid #26272b;
}
</style>
