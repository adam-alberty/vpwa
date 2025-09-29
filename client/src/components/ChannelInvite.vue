<template>
  <q-item class="items-start">
    <q-item-section avatar>
      <q-avatar size="32px" color="green-7" text-color="white">{{ name.charAt(0) }}</q-avatar>
    </q-item-section>

    <q-item-section>
      <div>
        <q-badge color="blue"> Invite </q-badge>
        <div>{{ name }}</div>

        <div class="row q-gutter-x-sm">
          <q-btn size="sm" dense flat label="Accept" icon="check" class="bg-green-7 text-white" />
          <q-btn size="sm" dense flat label="Reject" icon="close" class="bg-red-5 text-white" />
        </div>
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
