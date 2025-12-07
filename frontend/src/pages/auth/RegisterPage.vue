<template>
  <h2 class="text-h2">Register</h2>

  <q-form @submit.prevent="onSubmit" class="q-gutter-y-md full-width">
    <q-input
      filled
      v-model="formData.username"
      label="Username *"
      lazy-rules
      :rules="[minLen(3), maxLen(16)]"
    />
    <q-input
      filled
      v-model="formData.email"
      label="Email *"
      lazy-rules
      :rules="[minLen(1), maxLen(254)]"
    />
    <q-input
      filled
      v-model="formData.firstName"
      label="First name *"
      lazy-rules
      :rules="[minLen(1), maxLen(16)]"
    />
    <q-input
      filled
      v-model="formData.lastName"
      label="Last name *"
      lazy-rules
      :rules="[minLen(1), maxLen(16)]"
    />
    <q-input
      filled
      v-model="formData.password"
      label="Password *"
      type="password"
      lazy-rules
      :rules="[minLen(8), maxLen(256)]"
    />
    <q-input
      filled
      v-model="formData.passwordRepeated"
      label="Password Repeated *"
      type="password"
      lazy-rules
      :rules="[(val) => val == formData.password || 'Passwords do not match']"
    />

    <q-btn
      push
      size="lg"
      label="Register"
      type="submit"
      color="primary"
      class="full-width"
      :loading="loading"
      :disabled="loading"
    />

    <div class="text-center q-mt-md">
      <router-link to="/auth/login" class="text-primary">
        Already have an account? <span class="text-bold">Log in here</span>
      </router-link>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth-user.store';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { success, error } from '@/utils/toast';
import { minLen, maxLen } from '@/utils/validators';

const router = useRouter();
const formData = reactive({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordRepeated: '',
});
const auth = useAuthStore();
const loading = ref(false);

async function onSubmit() {
  try {
    loading.value = true;
    await auth.register(formData);
    await router.push('/');
    success('Account successfully created! You can log in now');
  } catch (err) {
    error(err);
  } finally {
    setTimeout(() => (loading.value = false), 250);
  }
}
</script>
