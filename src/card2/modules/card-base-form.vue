<script setup lang="ts">
import { reactive, watch } from 'vue';
import { debounce } from 'lodash';

defineOptions({ name: 'CardBaseForm' });
const props = defineProps<{
  changeCtxConfig: (key: string, data: any) => void;
}>();

const basisData = reactive({
  phone: ''
});

const throttledWatcher = debounce(() => {
  props.changeCtxConfig('basis', basisData);
  // 在这里处理你的业务逻辑
}, 300);

watch(
  () => basisData,
  () => {
    throttledWatcher();
  },
  { deep: true }
);
</script>

<template>
  <n-form :model="basisData">
    <n-form-item label="电话号码" path="phone">
      <n-input v-model:value="basisData.phone" placeholder="电话号码" />
    </n-form-item>
  </n-form>
</template>

<style scoped></style>
