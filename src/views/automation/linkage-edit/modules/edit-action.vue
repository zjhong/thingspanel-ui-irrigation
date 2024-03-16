<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { NButton } from 'naive-ui';
const actionTypeOptions = ref([
  {
    label: '操作设备',
    value: 1
  },
  {
    label: '激活场景',
    value: 2
  },
  {
    label: '触发告警',
    value: 3
  },
  {
    label: '触发服务',
    value: 4
  }
]);
const singleDeviceOptions = ref([
  {
    label: '设备1',
    value: '1'
  },
  {
    label: '设备2',
    value: '2'
  }
]);
const deviceGroupOptions = ref([
  {
    label: '分组1',
    value: '1'
  },
  {
    label: '分组2',
    value: '2'
  }
]);
const specificDeviceOptions = ref([
  {
    label: '空调',
    value: '1'
  },
  {
    label: '设备',
    value: '2'
  }
]);

const homeModeOptions = ref([
  {
    label: '居家模式',
    value: '1'
  },
  {
    label: '离家模式',
    value: '2'
  }
]);
const alarmOptions = ref([
  {
    label: '离线告警',
    value: '1'
  },
  {
    label: '低温告警',
    value: '2'
  }
]);

const serviceTypeOptions = ref([
  {
    label: '告警服务',
    value: '1'
  },
  {
    label: '提示服务',
    value: '2'
  }
]);

const serviceExecuteOptions = ref([
  {
    label: '发送通知',
    value: '1'
  },
  {
    label: '短信提醒',
    value: '2'
  }
]);
const devicePropertiesOptions = ref([
  {
    label: '温度',
    value: '1'
  },
  {
    label: '重启设备命令',
    value: '2'
  },
  {
    label: '自定义属性下发',
    value: '3'
  }
]);

const instructListItem = ref({
  deviceId: null, // 设备ID
  deviceGroupId: null, // 设备分组
  specificDeviceId: null, // 特定设备
  devicePropertiesValue: null, // 设备属性
  targetValue: null, // 目标值,
  parameter: null // 参数值
});

interface ActionInstructItem {
  deviceId: string;
  deviceGroupId: string;
  specificDeviceId: string;
  devicePropertiesValue: string;
  targetValue: string; // 目标值,
  parameter: string; // 参数值
}
const actionItem = ref({
  actionType: null,
  homeMode: null,
  alarm: null,
  serviceType: null,
  serviceExecute: null,
  actionInstructList: []
});
interface ActionItem {
  actionType: number;
  actionInstructList: Array<ActionInstructItem>;
  homeMode: string;
  alarm: string;
  serviceType: string;
  serviceExecute: string;
}
const actionGroups: Array<ActionItem> = reactive([]);

// 新增一个动作组
const addActionGroupItem = () => {
  const actionItemData = JSON.parse(JSON.stringify(actionItem.value));
  actionItemData.actionInstructList.push(JSON.parse(JSON.stringify(instructListItem.value)));
  actionGroups.push(actionItemData);
};
// 删除一个动作组
const deleteActionGroupItem = (actionGroupIndex: any) => {
  actionGroups.splice(actionGroupIndex, 1);
};

// 给某个动作组中增加指令
const addIfGroupsSubItem = (actionGroupIndex: any) => {
  actionGroups[actionGroupIndex].actionInstructList.push(JSON.parse(JSON.stringify(instructListItem.value)));
};
// 删除某个动作组中的某个指令
const deleteIfGroupsSubItem = (actionGroupIndex: any, ifIndex: any) => {
  actionGroups[actionGroupIndex].actionInstructList.splice(ifIndex, 1);
};
onMounted(() => {
  addActionGroupItem();
});
</script>

<template>
  <NFlex vertical class="mt-1 w-100%">
    <NFlex v-for="(actionGroupItem, actionGroupIndex) in actionGroups" :key="actionGroupIndex" class="mt-1 w-100%">
      <n-select v-model:value="actionGroupItem.actionType" :options="actionTypeOptions" class="max-w-40" />
      <template v-if="actionGroupItem.actionType === 1">
        <!--          执行动作是操作设备->添加指令--->
        <NCard class="flex-1">
          <NFlex
            v-for="(instructItem, instructIndex) in actionGroupItem.actionInstructList"
            :key="instructIndex"
            class="mb-6"
          >
            <n-select v-model:value="instructItem.deviceId" :options="singleDeviceOptions" class="max-w-40" />
            <n-select v-model:value="instructItem.deviceGroupId" :options="deviceGroupOptions" class="max-w-40" />
            <n-select v-model:value="instructItem.specificDeviceId" :options="specificDeviceOptions" class="max-w-40" />
            <n-select
              v-model:value="instructItem.devicePropertiesValue"
              :options="devicePropertiesOptions"
              class="max-w-40"
            />
            <n-input v-model:value="instructItem.parameter" placeholder="参数，如：{'param1':1}" class="max-w-40" />
            <NButton
              v-if="instructIndex === 0"
              type="primary"
              class="w-30"
              @click="addIfGroupsSubItem(actionGroupIndex)"
            >
              新增一行
            </NButton>
            <NButton
              v-if="instructIndex !== 0"
              type="error"
              class="w-30"
              @click="deleteIfGroupsSubItem(actionGroupIndex, instructIndex)"
            >
              删除
            </NButton>
          </NFlex>
        </NCard>
      </template>
      <template v-if="actionGroupItem.actionType === 2">
        <span class="ml-10 mr-10">激活</span>
        <n-select v-model:value="actionGroupItem.homeMode" :options="homeModeOptions" class="max-w-40" />
      </template>
      <template v-if="actionGroupItem.actionType === 3">
        <span class="ml-10 mr-10">触发</span>
        <n-select v-model:value="actionGroupItem.alarm" :options="alarmOptions" class="max-w-40" />
        <NButton type="primary" class="ml-4 w-30">创建告警</NButton>
      </template>
      <template v-if="actionGroupItem.actionType === 4">
        <n-select v-model:value="actionGroupItem.serviceType" :options="serviceTypeOptions" class="max-w-40" />
        <n-select v-model:value="actionGroupItem.serviceExecute" :options="serviceExecuteOptions" class="max-w-40" />
        <NButton type="primary" class="ml-4 w-30">创建告警</NButton>
      </template>
      <NButton
        v-if="actionGroupIndex > 0"
        type="error"
        class="ml-4 w-30"
        @click="deleteActionGroupItem(actionGroupIndex)"
      >
        删除组
      </NButton>
    </NFlex>
    <NButton type="primary" class="w-30" @click="addActionGroupItem()">新增执行动作</NButton>
  </NFlex>
</template>

<style scoped></style>
