<script setup lang="ts">
import { defineProps, ref } from 'vue';

defineProps<{
  id: string;
}>();

const accessMethod = ref('获取的接入方式'); // 假设这是获取的接入方式
</script>

<template>
  <div>
    <!-- 第一行 -->
    <n-h3 class="mb--4">设备id：{{ id }}</n-h3>

    <!-- 第二行 -->
    <n-h4 class="mb-4">接入方式：{{ accessMethod }}</n-h4>

    <!-- 第三行 -->
    <n-card class="mb-4" style="height: 260px">
      <template #header>
        <span>凭证</span>
      </template>
      <!-- 卡片内容 -->
    </n-card>

    <!-- 第四行 -->
    <n-card class="mb-4" style="height: 260px">
      <template #header>
        <span>连接信息</span>
      </template>
      <!-- 卡片内容 -->
    </n-card>

    <!-- 第五行 -->
    <n-button type="primary">保存</n-button>
  </div>
</template>

<style scoped>
.text-lg {
  font-size: 1.25rem; /* slightly larger font size */
}
</style>
