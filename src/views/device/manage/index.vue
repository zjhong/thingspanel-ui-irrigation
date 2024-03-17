<script setup lang="tsx">
import { ref, watch } from 'vue';
import type { DrawerPlacement, StepsProps } from 'naive-ui';
import _ from 'lodash';
import type { TreeSelectOption } from 'naive-ui/es/tree-select/src/interface';
import {
  checkDevice,
  deleteDevice,
  devicCeonnectForm,
  deviceGroupTree,
  deviceList,
  getDeviceConfigList,
  putDeviceActive
} from '@/service/api/device';
import type { SearchConfig } from '@/components/data-table-page/index.vue';
import AddDevicesStep1 from '@/views/device/manage/modules/add-devices-step1.vue';
import AddDevicesStep2 from '@/views/device/manage/modules/add-devices-step2.vue';
import AddDevicesStep3 from '@/views/device/manage/modules/add-devices-step3.vue';

const addKey = ref();
const deviceNumber = ref();
const configOptions = ref();
const deviceId = ref();
const configId = ref();
const formData = ref();
const tablePageRef = ref();
const buttonDisabled = ref(true);
const getFormJson = async id => {
  const res = await devicCeonnectForm({ device_id: id });

  formData.value = res.data;
};
const setUpId = (dId, cId) => {
  deviceId.value = dId;
  configId.value = cId;
  getFormJson(dId);
};
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
  configOptions.value = [{ label: '不限设备配置', value: '' }, ...options];
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
      return row?.is_online === 1 ? '在线' : '离线';
    }
  },
  {
    key: 'warn_status',
    label: '告警',
    render: row => {
      return row?.warn_status === 'Y' ? '告警' : '未告警';
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
      return row?.access_way === 'B' ? '通过服务' : '通过协议';
    }
  }
];
const actions = [
  {
    label: '详情',
    callback: async row => {
      console.log(row.id);
    }
  },
  {
    label: '删除',
    callback: async row => {
      await deleteDevice({ id: row?.id });
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
const dropOption = [
  {
    label: '手动添加',
    key: 'hands'
  },
  {
    label: '通过编号添加',
    key: 'number'
  }
];
const topActions = [
  {
    element: () => (
      <n-dropdown options={dropOption} trigger="hover" onSelect={handleSelect}>
        <n-button type="primary">添加设备</n-button>
      </n-dropdown>
    )
  }
];
const active = ref(false);
const isSuccess = ref(false);

const setIsSuccess = (flag: boolean) => {
  isSuccess.value = flag;
};
const placement = ref<DrawerPlacement>('right');
const current = ref<number>(1);
const currentStatus = ref<StepsProps['status']>('process');
const activate = (place: DrawerPlacement, key: string | number) => {
  current.value = 1;
  active.value = true;
  addKey.value = key;
  placement.value = place;
};

const completeAdd = async () => {
  const { error } = await putDeviceActive({ device_number: deviceNumber.value });
  if (!error) {
    active.value = true;
  }
};

const completeHandAdd = () => {
  tablePageRef.value?.handleReset();
};

function handleSelect(key: string | number) {
  activate('bottom', key);
}

watch(
  deviceNumber,
  _.debounce(async newDeviceNumber => {
    try {
      const { data, error } = await checkDevice(newDeviceNumber);
      if (!error && data && data.is_available) {
        buttonDisabled.value = false;
      } else {
        buttonDisabled.value = true;
      }
    } catch (error) {
      console.error(error);
    }
  }, 500)
);
</script>

<template>
  <div>
    <data-table-page
      ref="tablePageRef"
      :fetch-data="deviceList"
      :columns-to-show="columns_to_show"
      :table-actions="actions"
      :search-configs="searchConfigs"
      :top-actions="topActions"
    />

    <n-drawer v-model:show="active" :height="720" :placement="placement" @after-leave="completeHandAdd">
      <n-drawer-content v-if="addKey === 'hands'" title="手动添加设备" class="flex-center pt-24px">
        <n-steps :current="current" :status="currentStatus">
          <n-step title="创建设备" description="创建设备的基本信息" />
          <n-step title="配置设备端" description="根据系统提供的连接配置参数配置设备" />
          <n-step title="配置设备完成" description="如果配置成功，则完成配置" />
        </n-steps>

        <n-card class="mt-6" bordered border>
          <div v-if="current === 1">
            <AddDevicesStep1
              :set-id-callback="setUpId"
              :config-options="configOptions"
              :next-callback="
                () => {
                  current += 1;
                }
              "
            />
          </div>
          <div v-if="current === 2">
            <AddDevicesStep2
              :set-is-success="setIsSuccess"
              :device_id="deviceId"
              :form-elements="formData"
              :next-callback="
                () => {
                  current += 1;
                }
              "
            />
            <!--            <n-button @click="current-=1">取消</n-button>-->
            <!--            <n-button @click="current+=1">完成</n-button>-->
          </div>

          <div v-if="current === 3">
            <AddDevicesStep3
              :is-success="isSuccess"
              :close-callback="
                () => {
                  active = false;
                }
              "
              :back-callback="
                () => {
                  current -= 1;
                }
              "
            />
          </div>
        </n-card>
      </n-drawer-content>
      <n-drawer-content v-if="addKey === 'number'" class="flex-center pt-24px" title="通过编号添加">
        <n-h4 align-text>
          <n-li>
            <NText strong>输入设备编号立即完成设备添加</NText>
          </n-li>
        </n-h4>
        <div class="mb-6">
          <n-input v-model:value="deviceNumber" placeholder="请输入设备编号" class="max-w-240px"></n-input>
          {{ buttonDisabled ? '' : '设备编号可用' }}
        </div>

        <n-button type="primary" :disabled="buttonDisabled" @click="completeAdd">完成</n-button>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style scoped></style>
