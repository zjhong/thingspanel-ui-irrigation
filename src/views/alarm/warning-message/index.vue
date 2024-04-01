<!--
 * @Descripttion:
 * @version:
 * @Author: zhaoqi
 * @Date: 2024-03-17 15:24:25
 * @LastEditors: zhaoqi
 * @LastEditTime: 2024-03-20 16:43:27
-->
<script setup lang="tsx">
import AlarmConfiguration from './components/alarm-configuration.vue';
import NewInformation from './components/new-information.vue';
</script>

<template>
  <div class="overflow-hidden">
    <NCard title="告警中心" :bordered="false" class="h-full rounded-8px shadow-sm">
      <n-tabs type="line" size="large" :tabs-padding="20" pane-style="padding: 20px;">
        <n-tab-pane name="告警信息">
          <AlarmConfiguration />
        </n-tab-pane>
        <n-tab-pane name="告警配置">
          <NewInformation />
        </n-tab-pane>
      </n-tabs>
    </NCard>
  </div>
</template>

<style scoped></style>
