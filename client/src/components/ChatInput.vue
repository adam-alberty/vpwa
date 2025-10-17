<template>
  <textarea
    class="chat-input bg-dark text-white"
    :value="modelValue"
    placeholder="Type a message"
    @input="onInput"
    @keydown.enter.prevent="onEnter"
  ></textarea>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit', value?: string): void
}>()

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value.trim())
}

function onEnter(event: KeyboardEvent) {
  if (event.shiftKey || !props.modelValue?.length)
    return
  emit('submit', props.modelValue)
  emit('update:modelValue', '')
}
</script>

<style lang="sass" scoped>
.chat-input
  width: 100%
  padding: 1rem
  border: none
  outline: none
  resize: none
  font-size: large
  border-top: 1px solid rgba(255, 255, 255, 0.28)
</style>
