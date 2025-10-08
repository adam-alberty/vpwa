<template>
  <q-item :to="`/channels/${id}`" clickable :class="active && `bg-black`">
    <q-item-section avatar>
      <q-avatar size="32px" color="grey-7" text-color="white"
        >{{ name.charAt(0).toUpperCase() }}
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <div>
        <div class="text-bold">{{ name }}</div>
        <div class="text-grey-5">{{ lastMessage }}</div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

interface Props {
  id: string;
  name: string;
  lastMessage: string;
}

const props = withDefaults(defineProps<Props>(), {});
const { id, name, lastMessage } = props;

const route = useRoute();
const active = computed(() => route.params.id === id);
</script>
