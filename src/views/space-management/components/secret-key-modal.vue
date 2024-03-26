<script setup lang="ts">
import { computed } from 'vue';
import { useClipboard } from '@vueuse/core';

export interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  /** 编辑的表格行数据 */
  secretKey?: string;
}

defineOptions({ name: 'SecretKeyModal' });

const props = withDefaults(defineProps<Props>(), {
  secretKey: ''
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;
}

const emit = defineEmits<Emits>();

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});

const { copy, isSupported } = useClipboard();

function handleCopy() {
  if (!isSupported) {
    window.$message?.error('您的浏览器不支持Clipboard API');
    return;
  }
  if (!props.secretKey) {
    window.$message?.error('请输入要复制的内容');
    return;
  }
  copy(props.secretKey);
  window.$message?.success(`复制成功：${props.secretKey}`);
}
</script>

<template>
  <NModal v-model:show="modalVisible" preset="card" title="查看密钥" class="w-700px">
    <NSpace vertical>
      <NInput :default-value="secretKey" type="text" readonly @focus="handleCopy" />
    </NSpace>
  </NModal>
</template>

<style lang="scss"></style>
