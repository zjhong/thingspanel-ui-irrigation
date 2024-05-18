<script setup lang="ts">
import { inject, reactive, watch } from 'vue';

defineOptions({ name: 'CardBaseForm' });
const updataCardConfig = inject<(value: Record<string, any>) => void>('updataCardConfig');
const basic = reactive<any>({});
watch(
  () => basic,
  () => {
    updataCardConfig?.({ basic });
  },
  { deep: true }
);
</script>

<template>
  <n-form :model="basic">
    <n-form-item label="电话号码" path="phone">
      <n-input v-model:value="basic.phone" placeholder="电话号码" />
    </n-form-item>
  </n-form>
</template>

<style scoped></style>
