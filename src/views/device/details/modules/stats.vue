<script setup lang="ts">
import dayjs from 'dayjs';
import DistributionAndTable from '@/views/device/details/modules/public/distribution-and-table.vue';
import { attributeDataPub, getAttributeDataSetLogs } from '@/service/api';

defineProps<{
  id: string;
}>();

const columns = [
  { title: '属性下发时间', key: 'created_at', render: row => dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss') },
  { title: '消息id', key: 'message_id' },
  { title: '发送内容', key: 'data' },
  { title: '操作类型', key: 'operation_type', render: row => (row.status === 1 ? '手动操作' : '自动触发') },
  { title: '状态', key: 'status', render: row => (row.status === 1 ? '成功' : '失败') },
  { title: '错误信息', key: 'error_message' }
];
</script>

<template>
  <div>
    <DistributionAndTable
      :id="id as string"
      button-name="下发属性"
      :table-columns="columns"
      :fetch-data-api="getAttributeDataSetLogs"
      :submit-api="attributeDataPub"
    />
  </div>
</template>

<style scoped></style>
