<template>
  <h2 class="text-h2">Log in</h2>

  <q-form @submit="onSubmit" class="q-gutter-y-md full-width">
    <q-input
      filled
      v-model="username"
      label="Username *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />
    <q-input
      filled
      v-model="password"
      label="Password *"
      type="password"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />

    <q-btn size="lg" label="Log in" type="submit" color="primary" class="full-width" />

    <div class="text-center q-mt-md">
      <router-link to="/auth/register" class="text-primary">
        Don’t have an account? <span class="text-bold">Register here</span>
      </router-link>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');

function onSubmit() {
  console.log('Submitted:', { username: username.value, password: password.value });
  // You could also validate or send to an API here
}
</script>
