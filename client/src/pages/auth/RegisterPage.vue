<template>
  <q-page class="row items-center justify-center">
    <div class="full-width" style="max-width: 400px">
      <h2 class="text-h2">Register</h2>

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
          v-model="firstName"
          label="First name *"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
        <q-input
          filled
          v-model="lastName"
          label="Last name *"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <q-input
          filled
          v-model="email"
          label="Email *"
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

        <q-input
          filled
          v-model="passwordRepeated"
          label="Password Repeated *"
          type="password"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <q-btn label="Submit" type="submit" color="primary" class="full-width" />

        <div class="text-center q-mt-md">
          <router-link to="/auth/login" class="text-primary">
            Already have an account? <span class="text-bold">Log in here</span>
          </router-link>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const passwordRepeated = ref('');

function onSubmit() {
  console.log('Submitted:', { username: username.value, password: password.value });
  // You could also validate or send to an API here
}
</script>
