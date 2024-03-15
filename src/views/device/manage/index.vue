<script setup lang="ts">
import { ref } from 'vue';
import type { TreeSelectOption } from 'naive-ui/es/tree-select/src/interface';
import { deviceGroupTree, deviceList, getDeviceConfigList } from '@/service/api/device';
import type { SearchConfig } from '@/components/data-table-page/index.vue';

const getDeviceGroupOptions = async () => {
  // 将原始数据转换为树形结构
  function convertTreeNodeToTarget(treeNode: DeviceManagement.TreeNode): TreeSelectOption {
    const { group, children } = treeNode;
    const targetNode: TreeSelectOption = {
      label: group.name,
      key: group.id
    };

    if (children && children.length > 0) {
      targetNode.children = children.map(convertTreeNodeToTarget);
    }

    return targetNode;
  }

  // 将 TreeNode 数组转换为目标数据结构的数组
  function convertTreeNodesToTarget(treeNodes: DeviceManagement.TreeNode[]): TreeSelectOption[] {
    return treeNodes.map(convertTreeNodeToTarget);
  }

  const res = await deviceGroupTree({});
  let options: any[] = [];
  if (res.data) {
    options = convertTreeNodesToTarget(res.data);
  }
  return options;
};

const getDeviceConfigOptions = async pattern => {
  console.log(pattern);
  const res = await getDeviceConfigList({ page: 1, page_size: 99, device_type: pattern });
  const options: any[] = [];
  if (res.data && res.data.list) {
    // eslint-disable-next-line array-callback-return
    res.data.list.map(ietm => {
      options.push({
        label: ietm.name,
        value: ietm.id
      });
    });
  }
  return options;
};

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
    key: 'is_online',
    label: '在线状态',
    render: row => {
      return row.is_online === 1 ? '在线' : '离线';
    }
  },
  {
    key: 'warn_status',
    label: '告警',
    render: row => {
      return row.warn_status === 'Y' ? '告警' : '未告警';
    }
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
    key: 'access_way',
    label: '通过服务/协议',
    render: row => {
      return row.access_way === 'A' ? '通过协议' : '通过服务';
    }
  }
];
const actions = [
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
const searchConfigs = ref<SearchConfig[]>([
  {
    key: 'group_id',
    label: '分组',
    type: 'tree-select',
    multiple: false,
    options: [{ label: '分组', key: '' }],
    loadOptions: getDeviceGroupOptions
  },
  {
    key: 'device_config_id',
    label: '不限设备配置',
    type: 'select',
    options: [{ label: '不限设备配置', value: '' }],
    loadOptions: pattern => getDeviceConfigOptions(pattern)
  },
  {
    key: 'is_online',
    label: '不限在线状态',
    type: 'select',
    options: [
      { label: '不限在线状态', value: '' },
      { label: '在线', value: 1 },
      { label: '不在线', value: 0 }
    ]
  },
  {
    key: 'warn_status',
    label: '不限告警状态',
    type: 'select',
    options: [
      { label: '不限告警状态', value: '' },
      { label: '告警', value: 'Y' },
      { label: '不告警', value: 'N' }
    ]
  },
  {
    key: 'access_way',
    label: '不限接入类型',
    type: 'select',
    options: [
      { label: '不限接入类型', value: '' },
      { label: '通过协议', value: 'A' },
      { label: '通过服务', value: 'B' }
    ]
  },
  {
    key: 'search',
    label: '设备名称或编号',
    type: 'input'
  }
]);
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
