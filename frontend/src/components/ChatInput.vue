<template>
  <textarea
    class="text-white"
    :class="{ 'text-italic': command, 'text-red-3': command && !validCommand }"
    v-model="value"
    placeholder="Type a message"
    @input="onInput"
    @keydown.enter.prevent="onEnter"
    @keydown.tab.prevent="onTab"
  ></textarea>
  <!-- {{ value }} -->
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps<{
  modelValue?: string;
  commands?: string[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'submit', value?: string): void;
  (e: 'command', value?: string, args?: Array<string>): void;
}>();

const value = ref(props.modelValue);

watch(value, (val) => emit('update:modelValue', val));
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
  value.value = target.value;
}

function onTab(event: KeyboardEvent) {
  if (command.value && !validCommand.value) {
    const autoComplete = props.commands?.find((cmd) => cmd.startsWith(command.value));
    if (!autoComplete) return;

    value.value = `/${autoComplete}`;
  }
}

function onEnter(event: KeyboardEvent) {
  const trimmedValue = value.value.trim()
  if (event.shiftKey || !trimmedValue?.length) return;

  if (command.value) {
    emit('command', command.value, commandArgs.value);
    value.value = '';
    return;
  }

  emit('submit', trimmedValue);
  value.value = '';
}
</script>

<style lang="sass" scoped>
textarea
  box-sizing: border-box
  border: none
  outline: none
  resize: none
  font-size: large
  border-radius: 0.7rem
  width: 100%
  padding: 1rem
  height: 70px
  border: 1px solid #26272b
</style>
