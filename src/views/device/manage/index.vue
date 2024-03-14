<script setup lang="ts">
import { deviceList } from '@/service/api/device';
import type { SearchConfig } from '@/components/data-table-page/index.vue';

const columns_to_show = [
  {
    key: 'device_number',
    label: '设备编号'
  },
  {
    key: 'name',
    label: '设备名称'
  },
  {
    key: 'dealy',
    label: '在线状态'
  },
  {
    key: 'dealy',
    label: '告警'
  },
  {
    key: 'device_config_name',
    label: '设备配置'
  },
  {
    key: 'ts',
    label: '上次推送时间'
  },
  {
    key: 'dealy',
    label: '通过服务/协议'
  }
];
const actions = [
  {
    label: '配置',
    callback: row => {
      console.log(row.id);
    }
  },
  {
    label: '详情',
    callback: row => {
      console.log(row.id);
    }
  },
  {
    label: '删除',
    callback: row => {
      console.log(row.id);
    }
  }
];
const searchConfigs: SearchConfig[] = [
  {
    key: 'group_id',
    label: '分组',
    type: 'tree-select',
    multiple: true,
    options: []
  },
  {
    key: 'category',
    label: '不限设备配置',
    type: 'select',
    options: [
      { label: '类别1', value: 'category1' },
      { label: '类别2', value: 'category2' },
      { label: '类别3', value: 'category3' }
    ]
  },

  {
    key: 'category',
    label: '不限在线状态',
    type: 'select',
    options: [
      { label: '类别1', value: 'category1' },
      { label: '类别2', value: 'category2' },
      { label: '类别3', value: 'category3' }
    ]
  },
  {
    key: 'category',
    label: '不限告警状态',
    type: 'select',
    options: [
      { label: '类别1', value: 'category1' },
      { label: '类别2', value: 'category2' },
      { label: '类别3', value: 'category3' }
    ]
  },
  {
    key: 'category',
    label: '不限接入类型',
    type: 'select',
    options: [
      { label: '类别1', value: 'category1' },
      { label: '类别2', value: 'category2' },
      { label: '类别3', value: 'category3' }
    ]
  },
  {
    key: 'searchText',
    label: '设备名称或编号',
    type: 'input'
  }
];
const topActions = [
  {
    label: '新增设备',
    onClick: () => {
      console.log('点击了');
    }
  }
];
</script>

<template>
  <div>
    <data-table-page
      :fetch-data="deviceList"
      :columns-to-show="columns_to_show"
      :table-actions="actions"
      :search-configs="searchConfigs"
      :top-actions="topActions"
    />
  </div>
</template>

<style scoped></style>
