<template>
  <textarea
    class="chat-input position-absolute bg-dark text-white full-width q-pa-md"
    :class="{ 'text-italic': command, 'text-red-3': command && !validCommand }"
    :value="modelValue"
    placeholder="Type a message"
    @input="onInput"
    @keydown.enter.prevent="onEnter"
    @keydown.tab.prevent="onTab"
  ></textarea>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, ref } from 'vue';

const props = defineProps<{
  modelValue: string;
  commands?: string[];
}>();

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
  if (!props.commands?.includes(command.value)) return undefined;
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
    const autoComplete = props.commands?.find((cmd) => cmd.startsWith(command.value));
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
</script>

<style lang="sass" scoped>
.chat-input
  border: none
  outline: none
  resize: none
  font-size: large
  border-top: 1px solid rgba(255, 255, 255, 0.28)
</style>
