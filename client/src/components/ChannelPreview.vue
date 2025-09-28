<template>
  <q-item :to="`/channels/${id}`" :active="active" clickable>
    <q-item-section avatar>
      <q-avatar size="32px" color="primary" text-color="white"> A </q-avatar>
    </q-item-section>

    <q-item-section>
      <div>
        <div>{{ name }}</div>
        <div class="text-grey-8">user: some message</div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
interface Props {
  id: string;
  name: string;
  active: boolean;
}

const props = withDefaults(defineProps<Props>(), {});
const { id, name, active } = props;
</script>
