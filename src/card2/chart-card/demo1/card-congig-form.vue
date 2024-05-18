<script setup lang="ts">
import CardBaseForm from '@/card2/modules/card-base-form.vue';
import CardDataSourceForm from '@/card2/modules/card-data-source-form.vue';
</script>

<template>
  <n-tabs
    class="card-tabs"
    default-value="basic"
    size="large"
    animated
    pane-wrapper-style="margin: 0 -4px"
    pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
  >
    <n-tab-pane name="basic" tab="基础配置">
      <CardBaseForm />
    </n-tab-pane>
    <n-tab-pane name="source" tab="数据源">
      <CardDataSourceForm />
    </n-tab-pane>
    <n-tab-pane name="card-config" tab="卡片配置">在这里写卡片配置</n-tab-pane>
  </n-tabs>
</template>

<style scoped></style>
