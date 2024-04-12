<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NPopconfirm } from 'naive-ui';
import dayjs from 'dayjs';
import DistributionAndTable from '@/views/device/details/modules/public/distribution-and-table.vue';
import { attributeDataPub, deleteAttributeDataSet, getAttributeDataSet, getAttributeDataSetLogs } from '@/service/api';
defineProps<{
  id: string;
}>();
const attributeRef = ref();
const columns0 = [
  { title: '属性标识符', key: 'key' },
  { title: '属性名称', key: 'data_name' },
  { title: '属性值', key: 'value', render: row => `${row.value}(${row.unit})` },
  { title: '更新时间', key: 'created_at', render: row => dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss') },
  {
    title: '操作',
    key: 'created_at',
    render: row => (
      <NPopconfirm
        onPositiveClick={async () => {
          await deleteAttributeDataSet(row.device_id);
          attributeRef.value.refresh();
        }}
      >
        {{
          trigger: () => (
            <NButton text size="small">
              删除
            </NButton>
          ),
          default: () => '确认删除'
        }}
      </NPopconfirm>
    )
  }
];

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
      ref="attributeRef"
      :no-refresh="true"
      :table-columns="columns0"
      :fetch-data-api="getAttributeDataSet"
    />
  </div>

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
