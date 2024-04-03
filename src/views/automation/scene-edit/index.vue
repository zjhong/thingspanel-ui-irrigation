<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { NButton, NCard, NFlex, useDialog, useMessage } from 'naive-ui';
import { deviceConfig, deviceGroupTree } from '@/service/api';
import { warningMessageList } from '@/service/api/alarm';
import PopUp from '@/views/alarm/warning-message/components/pop-up.vue';
import {
  deviceConfigMetricsMenu,
  deviceListAll,
  deviceMetricsMenu,
  sceneAdd,
  sceneEdit,
  sceneGet,
  sceneInfo
} from '@/service/api/automation';
const route = useRoute();
const dialog = useDialog();
const message = useMessage();

const configId = ref(route.query.id || '');

// 新建告警弹窗显示状态
const popUpVisible = ref(false);
// 新建告警回执
const newEdit = () => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  getAlarmList('');
};
// 场景表单实例
const configFormRef = ref(null);
// 场景表单数据
const configForm = ref({
  id: '',
  name: '',
  description: '',
  actions: []
});
// 场景表单规则
const configFormRules = ref({
  name: {
    required: true,
    message: '请输入场景名称',
    trigger: 'blur'
  },
  description: {
    required: true,
    message: '请输入场景描述',
    trigger: 'blur'
  }
});
// 下拉选择器加载状态
const loadingSelect = ref(false);

// 动作选项
const actionOptions = ref([
  {
    label: '操作设备',
    value: '1',
    disabled: false
  },
  {
    label: '激活场景',
    value: '20'
  },
  {
    label: '触发告警',
    value: '30'
  },
  {
    label: '触发服务',
    value: '40'
  }
]);

// 动作选择action值改变时
const actionChange = (actionGroupItem: any, actionGroupIndex: any, data: any) => {
  // eslint-disable-next-line array-callback-return
  actionOptions.value.map(item => {
    item.disabled = false;
  });
  actionGroupItem.actionInstructList = [];
  actionGroupItem.action_type = null;
  actionGroupItem.action_target = null;
  if (data === '1') {
    // eslint-disable-next-line array-callback-return
    actionOptions.value.map(item => {
      if (item.value === '1') {
        item.disabled = true;
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    addIfGroupsSubItem(actionGroupIndex);
  }
};
// 设备类型选项
const actionTypeOptions = ref([
  {
    label: '单个设备',
    value: '10'
  },
  {
    label: '单类设备',
    value: '11'
  }
]);

// 选择设备类型
const actionTypeChange = (instructItem: any, data: any) => {
  instructItem.action_target = null;
  instructItem.action_param_type = null;
  instructItem.action_param = null;
  instructItem.action_value = null;

  if (data === '10') {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getDevice('', '');
  } else if (data === '11') {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getDeviceConfig('');
  }
};

// 设备分组列表
const deviceGroupOptions = ref([] as any);
// 获取设备分组
const getGroup = async () => {
  deviceGroupOptions.value = [];
  const res = await deviceGroupTree({});
  // eslint-disable-next-line array-callback-return
  res.data.map((item: any) => {
    deviceGroupOptions.value.push(item.group);
  });
};

// 设备列表
const deviceOptions = ref([] as any);
const queryDevice = ref({
  group_id: '',
  name: ''
});

// 获取设备列表
const getDevice = async (groupId: string, name: string) => {
  queryDevice.value.group_id = groupId || '';
  queryDevice.value.name = name || '';
  const res = await deviceListAll(queryDevice.value);
  deviceOptions.value = res.data;
};

// 设备配置列表
const deviceConfigOption = ref([]);
// 设备配置列表查询条件
const queryDeviceConfig = ref({
  page: 1,
  page_size: 20,
  name: ''
});
// 获取设备配置列表
const getDeviceConfig = async (name: string) => {
  queryDevice.value.name = name || '';
  loadingSelect.value = true;
  const res = await deviceConfig(queryDeviceConfig.value);
  deviceConfigOption.value = res.data.list;
  loadingSelect.value = false;
};

// 选择动作目标
const actionTargetChange = (instructItem: any) => {
  instructItem.action_param_type = null;
  instructItem.action_param = null;
  instructItem.action_value = null;
};

// 下拉获取的动作标识符
const actionParamShow = async (instructItem: any, data: any) => {
  if (data === true && instructItem.action_target) {
    instructItem.actionParamType = [];
    let res = null as any;
    if (instructItem.action_type === '10') {
      res = await deviceMetricsMenu({ device_id: instructItem.action_target });
    } else if (instructItem.action_type === '11') {
      res = await deviceConfigMetricsMenu({ device_config_id: instructItem.action_target });
    }
    // eslint-disable-next-line array-callback-return
    if (res.data) {
      // eslint-disable-next-line array-callback-return
      res.data.map((item: any) => {
        item.value = item.data_source_type;
        item.label = `${item.data_source_type}${item.label ? `(${item.label})` : ''}`;

        // eslint-disable-next-line array-callback-return
        item.options.map((subItem: any) => {
          subItem.value = subItem.key;
          subItem.label = `${subItem.key}${subItem.label ? `(${subItem.label})` : ''}`;
        });
      });
      // eslint-disable-next-line require-atomic-updates
      instructItem.actionParamType = res.data;
    }
  }
};

// 选择动作标识符
const actionParamChange = (instructItem: any, pathValues: any) => {
  instructItem.action_param_type = pathValues[0].value;
  instructItem.action_value = null;
};

// 场景列表
const sceneList = ref([]);
// 场景查询条件
const queryScene = ref({
  page: 1,
  page_size: 10,
  name: ''
});
// 获取场景列表
const getSceneList = async (name: string) => {
  queryScene.value.name = name || '';
  loadingSelect.value = true;
  const res = await sceneGet(queryScene.value);
  sceneList.value = res.data.list;
  loadingSelect.value = false;
};

// 告警列表
const alarmList = ref([]);
// 告警列表查询条件
const queryAlarm = ref({
  page: 1,
  page_size: 10,
  name: ''
});
const getAlarmList = async (name: string) => {
  queryAlarm.value.name = name || '';
  loadingSelect.value = true;
  const res = await warningMessageList(queryAlarm.value);
  loadingSelect.value = false;
  alarmList.value = res.data.list;
};

// 操作设备类型的数据Item
const instructListItem = ref({
  action_target: null, //  动作目标id  设备id、设备配置id，场景id、告警id
  action_type: null, // 动作标识符类型
  action_param_type: null, // 动作标识符类型
  action_param: null, // 动作标识符类型
  action_value: null, // 参数值
  deviceGroupId: null, // 设备分组ID
  actionParamType: [] // 动作标识菜单下拉列表数据选项
});

interface ActionInstructItem {
  action_target: string;
  action_type: string;
  action_param_type: string;
  action_param: string; // 动作标识符类型
  action_value: string; // 参数值
  deviceGroupId: string;
  actionParamType: object | any;
}

// 动作数组的item
const actionItem = ref({
  actionType: null,
  action_type: null, // 动作类型后端
  action_target: null, // 动作目标id   设备id、设备配置id，场景id、告警id
  actionInstructList: []
});
interface ActionItem {
  actionType: string;
  action_type: string;
  action_target: string;
  actionInstructList: Array<ActionInstructItem>;
}

// 动作数组的值
let actionGroups: Array<ActionItem> = reactive([] as any);

// 新增一个动作组
const addActionGroupItem = () => {
  const actionItemData = JSON.parse(JSON.stringify(actionItem.value));
  // actionItemData.actionInstructList.push(JSON.parse(JSON.stringify(instructListItem.value)));
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

// 表单提交
const submitData = async () => {
  const actionsData = [] as any;
  // eslint-disable-next-line array-callback-return
  actionGroups.map((item: any) => {
    if (item.actionType === '1') {
      // eslint-disable-next-line array-callback-return
      item.actionInstructList.map((instructItem: any) => {
        actionsData.push(instructItem);
      });
    } else {
      item.action_type = item.actionType;
      actionsData.push(item);
    }
  });
  configForm.value.actions = actionsData;
  dialog.warning({
    title: '提示',
    content: '请确认是否保存该场景信息？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      if (configId.value) {
        const res = await sceneEdit(configForm.value);
        if (!res.error) {
          message.success('编辑成功');
        }
      } else {
        const res = await sceneAdd(configForm.value);
        if (!res.error) {
          message.success('新增成功');
        }
      }
    }
  });
};

const getSceneInfo = async () => {
  const res = await sceneInfo(configId.value);
  configForm.value = { ...configForm.value, ...res.data.info };
  configForm.value.actions = res.data.actions;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  dataEcho();
};

// 处理页面回去回显
const dataEcho = () => {
  const actionGroupsData = [] as any;
  const actionItemData = JSON.parse(JSON.stringify(actionItem.value));
  actionItemData.actionType = '1';
  // eslint-disable-next-line array-callback-return
  configForm.value.actions.map((item: any) => {
    if (item.action_type === '10' || item.action_type === '11') {
      actionItemData.actionInstructList.push(item);
    } else {
      item.actionType = item.action_type;
      actionGroupsData.push(item);
    }
  });
  actionGroups.push(actionItemData);
  actionGroups = actionGroups.concat(actionGroupsData);
};

onMounted(() => {
  getGroup();
  getDevice('', '');
  getAlarmList('');
  getSceneList('');
  getDeviceConfig('');
  if (configId.value) {
    // eslint-disable-next-line no-unused-expressions
    typeof configId.value === 'string' ? (configForm.value.id = configId.value) : '';
    getSceneInfo();
  } else {
    addActionGroupItem();
  }
});
</script>

<template>
  <div class="scene-edit">
    <NCard :bordered="false" :title="`${configId ? '编辑' : '新增'}场景`">
      <NForm
        ref="configFormRef"
        :model="configForm"
        :rules="configFormRules"
        label-placement="left"
        label-width="150"
        size="small"
      >
        <NFormItem label="场景名称" path="name" class="w-150">
          <NInput v-model:value="configForm.name" placeholder="请输入场景名称" />
        </NFormItem>
        <NFormItem label="描述" path="description" class="w-150">
          <NInput v-model:value="configForm.description" type="textarea" placeholder="请输入描述" rows="1" />
        </NFormItem>
        <NFormItem label="场景动作" class="w-100%">
          <NFlex vertical class="mt-1 w-100%">
            <NFlex
              v-for="(actionGroupItem, actionGroupIndex) in actionGroups"
              :key="actionGroupIndex"
              class="mt-1 w-100%"
            >
              <NSelect
                v-model:value="actionGroupItem.actionType"
                :options="actionOptions"
                class="max-w-40"
                @update:value="data => actionChange(actionGroupItem, actionGroupIndex, data)"
              />
              <template v-if="actionGroupItem.actionType === '1'">
                <!--          执行动作是操作设备->添加指令--->
                <NCard class="flex-1">
                  <NFlex
                    v-for="(instructItem, instructIndex) in actionGroupItem.actionInstructList"
                    :key="instructIndex"
                    class="mb-6"
                  >
                    <NSelect
                      v-model:value="instructItem.action_type"
                      :options="actionTypeOptions"
                      class="max-w-40"
                      @update:value="data => actionTypeChange(instructItem, data)"
                    />
                    <template v-if="instructItem.action_type === '10'">
                      <NSelect
                        v-model:value="instructItem.action_target"
                        :options="deviceOptions"
                        value-field="id"
                        label-field="name"
                        :consistent-menu-width="false"
                        :loading="loadingSelect"
                        class="max-w-40"
                        @update:value="() => actionTargetChange(instructItem)"
                      >
                        <template #header>
                          <NFlex align="center" class="w-500px">
                            分组
                            <n-select
                              v-model:value="instructItem.deviceGroupId"
                              :options="deviceGroupOptions"
                              label-field="name"
                              value-field="id"
                              class="max-w-40"
                              clearable
                              @update:value="data => getDevice(data, queryDevice.name)"
                            />
                            <NInput v-model:value="queryDevice.name" class="flex-1" clearable autofocus></NInput>
                            <NButton type="primary" @click.stop="getDevice(queryDevice.group_id, queryDevice.name)">
                              搜索
                            </NButton>
                          </NFlex>
                        </template>
                      </NSelect>
                    </template>
                    <template v-if="instructItem.action_type === '11'">
                      <NSelect
                        v-model:value="instructItem.action_target"
                        :options="deviceConfigOption"
                        label-field="name"
                        value-field="id"
                        class="max-w-40"
                        placeholder="请选择"
                        filterable
                        remote
                        :loading="loadingSelect"
                        @search="getDeviceConfig"
                        @update:value="() => actionTargetChange(instructItem)"
                      />
                    </template>
                    <template v-if="instructItem.action_type">
                      <NCascader
                        v-model:value="instructItem.action_param"
                        placeholder="请选择"
                        :options="instructItem.actionParamType"
                        check-strategy="child"
                        children-field="options"
                        size="small"
                        class="max-w-40"
                        @update:show="data => actionParamShow(instructItem, data)"
                        @update:value="pathValues => actionParamChange(instructItem, pathValues)"
                      />
                      <NInput
                        v-model:value="instructItem.action_value"
                        placeholder="参数，如：{'param1':1}"
                        class="max-w-40"
                      />
                    </template>

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
              <template v-if="actionGroupItem.actionType === '20'">
                <NFlex class="ml-6 flex-1" align="center">
                  激活
                  <NSelect
                    v-model:value="actionGroupItem.action_target"
                    :options="sceneList"
                    label-field="name"
                    value-field="id"
                    class="max-w-40"
                    placeholder="请选择"
                    :loading="loadingSelect"
                    filterable
                    remote
                    @search="getSceneList"
                  />
                </NFlex>
              </template>
              <template v-if="actionGroupItem.actionType === '30'">
                <NFlex class="ml-6 flex-1" align="center">
                  触发
                  <NSelect
                    v-model:value="actionGroupItem.action_target"
                    :options="alarmList"
                    label-field="name"
                    value-field="id"
                    class="max-w-40"
                    placeholder="请选择"
                    filterable
                    remote
                    :loading="loadingSelect"
                    @search="getAlarmList"
                  />
                  <NButton class="ml-4 w-30" @click="popUpVisible = true">创建告警</NButton>
                </NFlex>
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
        </NFormItem>
      </NForm>
      <NFlex justify="center" class="mt-20">
        <NButton type="primary" @click="submitData">保存</NButton>
      </NFlex>
    </NCard>
    <PopUp v-model:visible="popUpVisible" type="add" @new-edit="newEdit" />
  </div>
</template>

<style scoped></style>
