<template>
  <div class="row items-center no-wrap">
    <q-icon
      :name="isPrivate ? 'lock' : 'tag'"
      class="q-mr-sm"
      :class="{ 'text-bold': highlight, 'text-grey-5': !highlight }"
    ></q-icon>
    <div class="line-h-1" :class="{ 'text-bold': highlight, 'text-grey-5': !highlight }">{{ name }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string;
  isPrivate?: boolean;
  highlight?: boolean;
}

const props = withDefaults(defineProps<Props>(), {});
</script>
