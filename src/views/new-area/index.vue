<!--
 * @Descripttion:
 * @version:
 * @Author: zhaoqi
 * @Date: 2024-03-28 19:49:57
 * @LastEditors: zhaoqi
 * @LastEditTime: 2024-03-29 13:28:38
-->
<script setup lang="tsx">
import addSpace from "./components/add-space.vue";
import addArea from "./components/add-area.vue";
</script>

<template>
  <NCard>
    <n-tabs type="line" animated>
      <n-tab-pane name="oasis" tab="添加空间"> <addSpace /> </n-tab-pane>
      <n-tab-pane name="the beatles" tab="添加区域"><addArea /> </n-tab-pane>
    </n-tabs>
  </NCard>
</template>

<style scoped></style>
