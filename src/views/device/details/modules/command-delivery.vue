<script setup lang="ts">
import dayjs from 'dayjs';
import DistributionAndTable from '@/views/device/details/modules/public/distribution-and-table.vue';
import { commandDataPub, getCommandDataSetLogs } from '@/service/api';

defineProps<{
  id: string;
}>();

// 状态
const formatStatus = status => {
  switch (status) {
    case '1':
      return '发送成功';
    case '2':
      return '发送失败';
    case '3':
      return '返回成功';
    case '4':
      return '返回失败';
    default:
      return '';
  }
};

const columns = [
  { title: '命令标识符', key: 'identify' },
  { title: '命名名称', key: 'id' },
  { title: '命令下发时间', key: 'created_at', render: row => dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss') },
  { title: '状态', key: 'status', render: row => formatStatus(row.status) },
  { title: '命令参数', key: 'data' },
  { title: '错误信息', key: 'error_message' }
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
