<script setup lang="tsx">
import { onMounted, ref, watch } from 'vue';
import type { TransferRenderSourceList } from 'naive-ui';
import { NTree } from 'naive-ui';
import {
  deleteDeviceGroupRelation,
  deviceGroupRelation,
  deviceGroupTree,
  deviceUpdateConfig,
  getDeviceConfigList,
  getDeviceGroupRelation
} from '@/service/api';
import { useDeviceDataStore } from '@/store/modules/device';

const props = defineProps<{
  id: string;
}>();
const valueRef = ref<Array<string | number>>([]);
const device_coding = ref<string>('');
const treeData = ref();
type Option = {
  label: string;
  value: string;
  children?: Option[];
};
const options = ref<Option[]>();
const sOptions = ref<any[]>([{ label: '不绑定', value: '' }]);
const DeviceConfigList = async name => {
  const { data, error } = await getDeviceConfigList({ page: 1, page_size: 99, name });
  if (!error && data) {
    const tempSOptions = data?.list?.map(item => {
      return { label: item.name, value: item.id };
    });
    sOptions.value = sOptions.value.concat(tempSOptions);
  }
};

function transformDataToOptions(data) {
  // 定义转换函数
  const transform = item => {
    // 基本转换
    const option = {
      label: item.group.name,
      value: item.group.id,
      children: undefined
    };

    // 如果存在子项，则递归转换
    if (item.children && item.children.length > 0) {
      option.children = item.children.map(transform);
    }

    return option;
  };

  // 对输入的数据应用转换函数
  return data.map(transform);
}

const getTreeData = async () => {
  const { data, error } = await deviceGroupTree({});
  if (!error && data) {
    console.log(data);
    treeData.value = transformDataToOptions(data);
    options.value = flattenTree(treeData.value);
  }
};
const getTreeRelationData = async () => {
  console.log(props.id);
  const { data, error } = await getDeviceGroupRelation({ device_id: props.id });
  if (!error && data) {
    valueRef.value = data?.map(item => item.group_id);
    console.log(data);
  }
};
const deviceDataStore = useDeviceDataStore();
const selectedValues = ref<any>(deviceDataStore?.deviceData?.device_config_id);

function flattenTree(list: undefined | Option[]): Option[] {
  const result: Option[] = [];

  function flatten(_list: Option[] = []) {
    _list.forEach(item => {
      result.push(item);
      flatten(item.children);
    });
  }

  flatten(list);
  return result;
}

const renderSourceList: TransferRenderSourceList = ({ pattern }) => {
  return (
    <NTree
      data={treeData.value}
      style="margin: 0 4px;"
      checkedKeys={valueRef.value}
      keyField="value"
      defaultExpandAll
      checkable
      checkOnClick
      blockLine
      selectable={false}
      onUpdateCheckedKeys={(keys, _option, meta) => {
        valueRef.value = keys;
        if (meta.node) {
          if (meta.action === 'check') {
            deviceGroupRelation({ group_id: meta.node.value, device_id_list: [props.id] });
          } else {
            deleteDeviceGroupRelation({ group_id: meta.node.value, device_id: props.id });
          }
        }
        //
      }}
      pattern={pattern}
    />
  );
};
watch(
  () => valueRef.value,
  (value, oldValue) => {
    if (oldValue.length > value.length) {
      const difference = oldValue.filter(x => !value.includes(x));
      difference.forEach(item => {
        deleteDeviceGroupRelation({ group_id: item, device_id: props.id });
      });
    }
  }
);

const initData = () => {
  getTreeData();
  getTreeRelationData();
};

onMounted(() => {
  initData();
  DeviceConfigList('');
});

const selectConfig = v => {
  selectedValues.value = v;
  deviceUpdateConfig({ device_id: props.id, device_config_id: v });
  deviceDataStore.fetchData(props.id);
  initData();
};
</script>

<template>
  <div>
    <NFlex justify="space-between" class="mb-24px mt-8 h-50px items-center">
      <div class="w-320px flex items-center">
        <div>设备配置：</div>
        <NSelect
          v-model:value="selectedValues"
          filterable
          class="w-200px"
          :options="sOptions"
          @update:value="selectConfig"
          @search="DeviceConfigList"
        />
      </div>

      <div>
        <span>设备编码:</span>
        <span>{{ device_coding }}</span>
        <NButton type="primary" text class="ml-4">查看</NButton>
      </div>
    </NFlex>
    <div class="mt-4 h-60px">
      设备固件:
      <spna class="ml-4">{{ deviceDataStore?.deviceData?.current_version || '--' }}</spna>
    </div>

    <div>
      <div class="mb-4">设备分组</div>
      <n-transfer
        ref="transfer"
        v-model:value="valueRef"
        :options="options"
        :render-source-list="renderSourceList"
        source-filterable
      />
    </div>
  </div>
</template>

<style scoped></style>
