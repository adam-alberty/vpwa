<template>
  <h2 class="text-h2">Log in</h2>

  <q-form @submit="onSubmit" class="q-gutter-y-md full-width">
    <q-input
      filled
      v-model="formData.email"
      label="E-mail *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type username or e-mail']"
    />
    <q-input
      filled
      v-model="formData.password"
      label="Password *"
      type="password"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type password']"
    />

    <q-btn
      push
      size="lg"
      label="Log in"
      type="submit"
      color="primary"
      class="full-width"
      :loading="loading"
      :disabled="loading"
    />

    <div class="text-center q-mt-md">
      <router-link to="/auth/register" class="text-primary">
        Don’t have an account? <span class="text-bold">Register here</span>
      </router-link>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth-user.store';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { error } from '@/utils/toast';

const router = useRouter();
const auth = useAuthStore();

const formData = reactive({
  email: '',
  password: '',
});

const loading = ref(false);

async function onSubmit() {
  try {
    loading.value = true;
    await auth.login(formData);
    await router.replace({ name: 'Index' }).catch(console.error);
  } catch (err) {
    error(err);
  } finally {
    setTimeout(() => (loading.value = false), 250);
  }
}
</script>
