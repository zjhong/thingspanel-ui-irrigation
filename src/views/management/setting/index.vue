<template>
  <div class="overflow-hidden">
    <n-card :bordered="false" class="h-full rounded-8px shadow-sm">
      <div class="flex-col h-full">
        <n-tabs type="line" animated>
          <n-tab-pane name="1" tab="主题设置">
            <theme-setting></theme-setting>
          </n-tab-pane>
          <n-tab-pane name="2" tab="数据清理设置">
            <data-clear-setting></data-clear-setting>
          </n-tab-pane>
        </n-tabs>
      </div>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import ThemeSetting from './components/theme-setting.vue'
import DataClearSetting from './components/data-clear-setting.vue'
</script>
<style lang="scss"></style>
