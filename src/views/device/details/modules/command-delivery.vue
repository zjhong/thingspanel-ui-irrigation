<script setup lang="ts">
import dayjs from 'dayjs';
import DistributionAndTable from '@/views/device/details/modules/public/distribution-and-table.vue';
import { commandDataPub, getCommandDataSetLogs } from '@/service/api';
import { $t } from '@/locales';
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
  { title: $t('device_template.table_header.commandIdentifier'), minWidth: '140px', key: 'identify' },
  { title: $t('device_template.table_header.commandName'), minWidth: '140px', key: '' },
  {
    title: '命令下发时间',
    minWidth: '140px',
    key: 'created_at',
    render: row => dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
  },
  { title: $t('generate.status'), minWidth: '140px', key: 'status', render: row => formatStatus(row.status) },
  { title: '命令内容', minWidth: '140px', key: 'data' },
  { title: $t('generate.errorMessage'), minWidth: '140px', key: 'error_message' }
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
