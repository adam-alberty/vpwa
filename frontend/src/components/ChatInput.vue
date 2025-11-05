<template>
  <textarea
    class="bg-dark text-white full-width q-pa-md"
    :class="{ 'text-italic': command, 'text-red-3': command && !validCommand }"
    :value="modelValue"
    placeholder="Type a message"
    @input="onInput"
    @keydown.enter.prevent="onEnter"
    @keydown.tab.prevent="onTab"
  ></textarea>
</template>

<script setup lang="ts">
import { useChannelStore } from 'src/stores/channel.store';
import { useUiStore } from 'src/stores/ui.store';
import { computed, defineEmits, defineProps, ref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  modelValue: string;
}>();

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

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'submit', value?: string): void;
  (e: 'command', value?: string, args?: Array<string>): void;
}>();

const value = ref(props.modelValue);

const command = computed(() => {
  if (!value.value?.startsWith('/')) return undefined;
  return value.value.substring(1).split(' ')[0];
});

const validCommand = computed(() => {
  if (commands?.includes(command.value)) return undefined;
  return command.value;
});

const commandArgs = computed(() => {
  if (!command.value) return undefined;
  return value.value
    ?.substring(command.value.length + 1)
    .split(/ +/)
    .filter(Boolean);
});

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  value.value = target.value.trim();
  emit('update:modelValue', value.value);
}

function onTab(event: KeyboardEvent) {
  if (command.value && !validCommand.value) {
    const autoComplete = commands?.find((cmd) => cmd.startsWith(command.value));
    if (!autoComplete) return;

    value.value = `/${autoComplete}`;
    emit('update:modelValue', value.value);
  }
}

function onEnter(event: KeyboardEvent) {
  if (event.shiftKey || !value.value?.length) return;

  if (command.value) {
    emit('command', command.value, commandArgs.value);
    emit('update:modelValue', '');
    return;
  }

  emit('submit', value.value);
  emit('update:modelValue', '');
}

const uiStore = useUiStore();
const channelStore = useChannelStore();
const route = useRoute();

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

<style lang="sass" scoped>
textarea
  border: none
  outline: none
  resize: none
  font-size: large
  border-top: 1px solid rgba(255, 255, 255, 0.28)
</style>
