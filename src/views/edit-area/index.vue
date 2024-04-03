<!--
 * @Descripttion:
 * @version:
 * @Author: zhaoqi
 * @Date: 2024-03-28 19:49:57
 * @LastEditors: zhaoqi
 * @LastEditTime: 2024-03-31 09:50:40
-->
<script setup lang="tsx">
import { useRoute } from 'vue-router';
import editSpace from './components/edit-space.vue';
import editArea from './components/edit-area.vue';

const route = useRoute();
const type: any = route.query.type;
console.log(99999, type);
</script>

<template>
  <NCard>
    <n-tabs type="line" animated :value="type">
      <n-tab-pane name="space" tab="编辑空间"><editSpace /></n-tab-pane>
      <n-tab-pane name="area" tab="编辑区域"><editArea /></n-tab-pane>
    </n-tabs>
  </NCard>
</template>

<style scoped></style>
