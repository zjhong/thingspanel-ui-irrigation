<script setup lang="ts">
import type { CardData } from '@/components/tp-kan-ban/kan-ban';

const props = defineProps<{
  view?: boolean;
  card: CardData;
}>();

const { card } = props;
const { config, cardId, deviceList, xdata } = card; // 卡片数据解析 分别为  config 配置，cardId 卡片id，deviceList 设备指标列表，xdata 卡片上的数据
console.log(config, cardId, deviceList, xdata);
const { title, showTitle, basis, source, cardUI } = config; // 配置数据解析 分别为  title 标题，showTitle 是否显示标题，basis 基础配置，source 数据源配置，cardUI 卡片UI配置
console.log(title, showTitle, basis, source, cardUI);
</script>

<template>
  <div>{{ card?.cardId }}</div>

  <div>phone:{{ basis?.phone }}</div>
</template>

<style scoped></style>
