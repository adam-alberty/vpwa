<template>
  <q-item :to="`/channels/${id}`" clickable>
    <q-item-section avatar>
      <q-avatar size="32px" color="grey-4" text-color="dark"> A </q-avatar>
    </q-item-section>

    <q-item-section>
      <div>
        <div>{{ name }}</div>
        <div class="text-grey-8">username: some message</div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
interface Props {
  id: string;
  name: string;
}

const props = withDefaults(defineProps<Props>(), {});
const { id, name } = props;
</script>
