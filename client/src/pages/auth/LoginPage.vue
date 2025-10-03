<template>
  <h2 class="text-h2">Log in</h2>

  <q-form @submit="onSubmit" ref="formRef" class="q-gutter-y-md full-width">
    <q-input
      filled
      v-model="form.usernameOrEmail"
      label="Username or e-mail *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type username or e-mail']"
    />
    <q-input
      filled
      v-model="form.password"
      label="Password *"
      type="password"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type password']"
    />

    <q-banner v-if="errorMessage" class="bg-red text-white">{{ errorMessage }}</q-banner>

    <q-btn push size="lg" label="Log in" type="submit" color="primary" class="full-width" />

    <div class="text-center q-mt-md">
      <router-link to="/auth/register" class="text-primary">
        Don’t have an account? <span class="text-bold">Register here</span>
      </router-link>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const formRef = ref();
const form = reactive({
  usernameOrEmail: '',
  password: '',
});
const errorMessage = ref('');

async function onSubmit() {
  try {
    const valid = await formRef.value.validate();

    if (!valid) {
      return;
    }

    const data = JSON.stringify({
      username_or_email: form.usernameOrEmail,
      password: form.password,
    });
    console.log(data);
  } catch (err) {
    console.log(err);
    errorMessage.value = 'Could not log in';
  }
}
</script>
