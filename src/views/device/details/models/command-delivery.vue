<script setup lang="ts">
import DistributionAndTable from '@/views/device/details/models/public/distribution-and-table.vue';
import { commandDataPub, getCommandDataSetLogs } from '@/service/api';

defineProps<{
  id: string;
}>();

const columns = [
  { title: '命名名称', key: 'id' },
  { title: '命令标识符', key: 'identify' },
  { title: '命令下发时间', key: 'created_at' },
  { title: '状态', key: 'status', render: row => (row.status === 1 ? '成功' : '失败') },
  { title: '命令参数', key: 'data' }
];
</script>

<template>
  <div>
    <DistributionAndTable
      :id="id as string"
      button-name="下发命令"
      :is-command="true"
      :table-columns="columns"
      :fetch-data-api="getCommandDataSetLogs"
      :submit-api="commandDataPub"
    />
  </div>
</template>

<style scoped></style>
