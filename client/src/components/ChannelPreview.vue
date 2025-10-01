<template>
  <q-item :to="`/channels/${id}`" clickable>
    <q-item-section avatar>
      <q-avatar size="32px" color="grey-7" text-color="white"
        >{{ name.charAt(0).toUpperCase() }}
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <div>
        <div>{{ name }}</div>
        <div class="text-grey-6">{{ lastMessage }}</div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
interface Props {
  id: string;
  name: string;
  lastMessage: string;
}

const props = withDefaults(defineProps<Props>(), {});
const { id, name, lastMessage } = props;
</script>
