<script setup lang="ts">
import ThemeSetting from './components/theme-setting.vue';
import DataClearSetting from './components/data-clear-setting.vue';
</script>

<template>
  <div class="overflow-hidden">
    <NCard :bordered="false" class="h-full rounded-8px shadow-sm">
      <div class="flex-col h-full">
        <NTabs type="line" animated>
          <NTabPane name="1" :tab="$t('page.manage.setting.themeSetting.title')">
            <ThemeSetting></ThemeSetting>
          </NTabPane>
          <NTabPane name="2" :tab="$t('page.manage.setting.dataClearSetting.title')">
            <DataClearSetting></DataClearSetting>
          </NTabPane>
        </NTabs>
      </div>
    </NCard>
  </div>
</template>

<style lang="scss"></style>
