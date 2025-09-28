<template>
  <q-item>
    <q-item-section avatar>
      <q-avatar size="32px" color="secondary" text-color="white">{{ name.charAt(0) }}</q-avatar>
    </q-item-section>

    <q-item-section>
      <div>
        <q-badge color="blue"> Invite </q-badge>
        <div>{{ name }}</div>
      </div>
    </q-item-section>

    <q-item-section side>
      <div class="row items-center q-gutter-xs">
        <q-btn dense round flat icon="check" class="bg-green-5 text-white" />
        <q-btn dense round flat icon="close" class="bg-red-5 text-white" />
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
interface Props {
  name: string;
}

const props = withDefaults(defineProps<Props>(), {});
const { name } = props;
</script>
