<script setup lang="ts">
import { deviceList } from '@/service/api/device';
import type { SearchConfig } from '@/components/data-table-page/index.vue';
// 新增：操作配置数组

const actions = [
  {
    label: '编辑',
    callback: row => {
      console.log(row.id);
    }
  },
  {
    label: '保存',
    callback: row => {
      console.log(row.id);
    }
  }
];

const searchConfigs: SearchConfig[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'input'
  },
  {
    key: 'id',
    label: 'ID',
    type: 'input'
  },
  {
    key: 'dateRange',
    label: 'Date Range',
    type: 'date-range'
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ]
  },
  {
    key: 'registrationDate',
    label: 'Registration Date',
    type: 'date'
  }
] as SearchConfig[];
</script>

<template>
  <div>
    <data-table-page
      :fetch_data="deviceList"
      :columns-to-show="['id', 'device_number', 'name']"
      :table_actions="actions"
      :search-configs="searchConfigs"
    />
  </div>
</template>

<style scoped></style>
