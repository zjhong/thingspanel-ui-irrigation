<script lang="ts" setup>
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';
import { $t } from '@/locales';

const source = ref('');
const { copy, isSupported } = useClipboard();

function handleCopy() {
  if (!isSupported) {
    window.$message?.error('您的浏览器不支持Clipboard API');
    return;
  }
  if (!source.value) {
    window.$message?.error('请输入要复制的内容');
    return;
  }
  copy(source.value);
  window.$message?.success(`${$t('theme.configOperation.copySuccess')}：${source.value}`);
}
</script>

<template>
  <div class="h-full">
    <NCard :title="$t('generate.text-copy')" :bordered="false" class="h-full rounded-8px shadow-sm">
      <NInputGroup>
        <NInput v-model:value="source" :placeholder="$t('generate.enterTextToCopy')" />
        <NButton type="primary" @click="handleCopy">{{ $t('generate.copy') }}</NButton>
      </NInputGroup>
    </NCard>
  </div>
</template>

<style scoped></style>
