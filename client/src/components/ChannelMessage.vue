<template>
  <div class="channel-message q-pa-md q-px-lg">
    <div class="row q-gutter-sm">
      <span class="channel-message__username text-bold">{{ username }}</span>
      <span class="channel-message__timestamp text-grey-5"
        >{{ timestamp.toLocaleDateString() }} {{ timestamp.toLocaleTimeString() }}</span
      >
    </div>
    <div>
      {{ text }}
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  username: string;
  text: string;
  timestamp: Date;
}

const props = withDefaults(defineProps<Props>(), {});
const { username, text, timestamp } = props;
</script>
