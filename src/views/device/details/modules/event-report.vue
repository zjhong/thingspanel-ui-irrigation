<script setup lang="ts">
import dayjs from 'dayjs';
import DistributionAndTable from '@/views/device/details/modules/public/distribution-and-table.vue';
import { getEventDataSet } from '@/service/api';

defineProps<{
  id: string;
}>();

const columns = [
  { title: '事件标识符', key: 'identify' },
  { title: '事件名称', key: '' },
  { title: '事件上报时间', key: 'ts', render: row => dayjs(row.ts).format('YYYY-MM-DD HH:mm:ss') },
  { title: '事件内容', key: 'data' },
  { title: '错误信息', key: 'error_message' }
];
</script>

<template>
  <div>
    <DistributionAndTable :id="id as string" :table-columns="columns" :fetch-data-api="getEventDataSet" />
  </div>
</template>

<style scoped></style>
