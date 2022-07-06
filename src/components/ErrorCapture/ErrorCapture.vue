<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';
import { GeneralError, normalizeError } from '@/utils';
import { ErrorWrapper } from '@/components';

const error = ref<GeneralError | null>(null);

onErrorCaptured((err) => {
  error.value = normalizeError(err);
});
</script>

<template>
  <ErrorWrapper :error="error" @clear-error="error = null">
    <slot />
  </ErrorWrapper>
</template>
