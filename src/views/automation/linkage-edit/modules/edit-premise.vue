<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { NButton, NFlex } from 'naive-ui';
import type { FormInst } from 'naive-ui';
import { IosRefresh } from '@vicons/ionicons4';
import { repeat } from 'seemly';
import { deviceConfig, deviceGroupTree } from '@/service/api';
import { configMetricsConditionMenu, deviceListAll, deviceMetricsConditionMenu } from '@/service/api/automation';
interface Emits {
  (e: 'conditionChose', data: any): void;
}
const emit = defineEmits<Emits>();
const loadingSelect = ref(false);
/** if分组的数据类型 */
// 选项一条件类型的下拉
const ifTypeOptions = ref([
  {
    label: '设备条件',
    value: '1'
  },
  {
    label: '时间条件',
    value: '2'
  }
  // {
  //   label: '服务条件',
  //   value: '3'
  // }
]);
const ifTypeChange = (ifItem: any, data: any) => {
  ifItem.trigger_conditions_type = null;
  // eslint-disable-next-line no-param-reassign,@typescript-eslint/no-use-before-define
  ifItem = judgeItem.value;
  ifItem.ifType = data;
};

// 设备条件类型下选项2使用的下拉
const deviceConditionOptions = ref([
  {
    label: '单个设备',
    value: '10',
    disabled: false
  },
  {
    label: '单类设备',
    value: '11',
    disabled: false
  }
]);
const deviceConfigDisabled = ref(false);
const triggerConditionsTypeChange = (ifItem: any, data: any) => {
  ifItem.trigger_source = null;
  ifItem.trigger_param_type = null;
  ifItem.trigger_param = null;
  ifItem.trigger_operator = null;
  ifItem.trigger_value = null;
  ifItem.minValue = null;
  ifItem.maxValue = null;
  deviceConfigDisabled.value = false;
  if (!data) {
    // eslint-disable-next-line array-callback-return
    deviceConditionOptions.value.map(item => {
      item.disabled = false;
    });
  }
  if (data === '10') {
    // eslint-disable-next-line array-callback-return
    deviceConditionOptions.value.map(item => {
      item.disabled = item.value !== data;
    });
  } else if (data === '11') {
    // eslint-disable-next-line array-callback-return
    deviceConditionOptions.value.map(item => {
      item.disabled = true;
    });
    deviceConfigDisabled.value = true;
  }
  emit('conditionChose', data);
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
// 选择设备
const triggerSourceChange = (ifItem: any) => {
  ifItem.trigger_param_type = null;
  ifItem.trigger_param = null;
  ifItem.trigger_operator = null;
  ifItem.trigger_value = null;
  ifItem.minValue = null;
  ifItem.maxValue = null;
  // ifItem.action_param_type = null;
  // ifItem.action_param = null;
  // ifItem.action_value = null;
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

// 下拉获取的动作标识符
const actionParamShow = async (ifItem: any, data: any) => {
  if (data === true && ifItem.trigger_source) {
    ifItem.triggerParamOptions = [];
    let res = null as any;
    if (ifItem.trigger_conditions_type === '10') {
      res = await deviceMetricsConditionMenu({ device_id: ifItem.trigger_source });
    } else if (ifItem.trigger_conditions_type === '11') {
      res = await configMetricsConditionMenu({ device_config_id: ifItem.trigger_source });
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
      ifItem.triggerParamOptions = res.data;
    }
    const statusData = {
      value: 'status',
      label: 'status(状态)',
      options: [
        {
          value: 'On-line',
          label: 'On-line(上线)'
        },
        {
          value: 'Off-line',
          label: 'Off-line(上线)'
        },
        {
          value: 'All',
          label: 'All(全部)'
        }
      ]
    };
    ifItem.triggerParamOptions.push(statusData);
  }
};

// 时间条件类型下选项2使用的下拉
const timeConditionOptions = ref([
  {
    label: '单次',
    value: '20'
  },
  {
    label: '重复',
    value: '21'
  },
  {
    label: '时间范围',
    value: '22'
  }
]);
// 服务条件类型下选项2使用的下拉
const serviceConditionOptions = ref([
  {
    label: '天气',
    value: 'weather'
  }
]);

// const deviceOptions = ref([]);

// 时间条件下，重复时，使用的周期选项
const cycleOptions = ref([
  {
    label: '每小时',
    value: 'HOUR'
  },
  {
    label: '每天',
    value: 'DAY'
  },
  {
    label: '每周',
    value: 'WEEK'
  },
  {
    label: '每月',
    value: 'MONTH'
  }
]);

// 时间条件下，范围时，使用的周期选项
const weekOptions = ref([
  {
    label: '周一',
    value: '1'
  },
  {
    label: '周二',
    value: '2'
  },
  {
    label: '周三',
    value: '3'
  },
  {
    label: '周四',
    value: '4'
  },
  {
    label: '周五',
    value: '5'
  },
  {
    label: '周六',
    value: '6'
  },
  {
    label: '周天',
    value: '7'
  }
]);
// 天气条件选项
const weatherOptions = ref([
  {
    label: '日出',
    value: 'sunrise'
  },
  {
    label: '日落',
    value: 'sunset'
  }
]);

// 操作符选项
const determineOptions = ref([
  {
    label: '等于',
    value: '='
  },
  {
    label: '不等于',
    value: '!='
  },
  {
    label: '大于',
    value: '>'
  },
  {
    label: '小于',
    value: '<'
  },
  {
    label: '大于等于',
    value: '>='
  },
  {
    label: '小于等于',
    value: '<='
  },
  {
    label: '介于',
    value: 'between'
  },
  {
    label: '包含在列表内',
    value: 'in'
  }
]);
// 过期时间选项
const expirationTimeOptions = ref([
  {
    label: '5分钟',
    value: 5
  },
  {
    label: '10分钟',
    value: 10
  },
  {
    label: '30分钟',
    value: 30
  },
  {
    label: '1小时',
    value: 60
  },
  {
    label: '1天',
    value: 1140
  }
]);

// 月份范围选项
const mouthRangeOptions = repeat(31, undefined).map((_, i) => ({
  label: String(i + 1),
  value: i + 1
}));
const judgeItem = ref({
  ifType: null, // 第一条件类型
  trigger_conditions_type: null, // 第二条件-后端
  trigger_source: null, // 设备/设备类ID值-后端
  trigger_param_type: null, // 触发消息标识符-后端
  trigger_param: null, // 触发参数-后端
  trigger_operator: null, // 操作符
  trigger_value: null, // 目标值(后端)
  task_type: null, // 重复时间周期值-后端
  params: null, //  时间值-后端
  execution_time: null, // 执行时间-日时分值-后端
  expiration_time: null, // 过期时间-日时分值-后端
  timeValue: null, // 时分秒值
  onceTimeValue: null, // 单次执行时间-日时分值
  hourTimeValue: null, // 时间值-选择小时
  dayTimeValue: null, // 时间值-选择天
  weekTimeValue: null, // 时间值-选择周
  monthTimeValue: null, // 时间值-选择月

  // eslint-disable-next-line no-bitwise
  weekChoseValue: Array<string | number>, // 星期多选值
  monthChoseValue: null, // 月份某一天

  startTimeValue: null, // 范围的开始时间
  endTimeValue: null, // 范围的结束时间
  minValue: null, // 最小
  maxValue: null, // 最大
  weatherValue: null, // 天气值
  deviceGroupId: null, // 设备分组id
  triggerParamOptions: [] // 动作标识菜单下拉列表数据选项
});
// interface JudgeItem {
//   ifType: string; // 第一条件类型
//   trigger_conditions_type: string; // 第二条件--后端
//   trigger_source: string; // 设备类ID值--后端
//   trigger_param_type: string; // 触发消息标识符--后端
//   trigger_param: string; // 触发参数--后端
//   trigger_operator: string; // 操作符
//   trigger_value: string; // 目标值(后端)
//   onceTimeValue: string; // 单次执行时间-日时分值
//   execution_time: string; // 单次执行时间-后端
//   expiration_time: string; // 单次过期时间-后端
//
//   timeValue: string; // 时分秒值
//   task_type: string; // 重复时间周期值
//   params: string; //  时间值-后端
//   hourTimeValue: number; // 时间值-选择小时
//   dayTimeValue: number; // 时间值-选择天
//   weekTimeValue: number; // 时间值-选择周
//   monthTimeValue: number; // 时间值-选择月
//   weekChoseValue: (string | number)[] | null | undefined; // 星期多选值
//   monthChoseValue: string; // 月份某一天
//   startTimeValue: number; // 范围的开始时间
//   endTimeValue: number; // 范围的结束时间
//   minValue: string; // 最小
//   maxValue: string; // 最大
//   weatherValue: string; // 天气值
//   deviceGroupId: string; // 设备分组id
//   triggerParamOptions: object | any; // 动作标识菜单下拉列表数据选项
// }

const ifGroups = ref([] as any);

// 给某个条件中增加条件
const addIfGroupsSubItem = (ifGroupIndex: any) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  formInstRef.value?.validate(errors => {
    if (errors) {
      console.error(errors);
    } else {
      ifGroups[ifGroupIndex].push(JSON.parse(JSON.stringify(judgeItem.value)));
    }
  });
};
// 删除某个条进组中的某个条件
const deleteIfGroupsSubItem = (ifGroupIndex: any, ifIndex: any) => {
  ifGroups[ifGroupIndex].splice(ifIndex, 1);
};
// 删除某个条件组
const deleteIfGroupsItem = (ifIndex: any) => {
  ifGroups.value.splice(ifIndex, 1);
};
// 新增一个条件组
const addIfGroupItem = async () => {
  const groupObj: any = [];
  groupObj.push(JSON.parse(JSON.stringify(judgeItem.value)));
  ifGroups.value.push(groupObj);
};

const ifGroupsData = () => {
  return ifGroups.value;
};
const formData = ref({
  ifGroups: ifGroups.value
});

defineExpose({
  ifGroupsData
});

const triggerParamChange = (ifItem: any, data: any) => {
  console.log(data);
  ifItem.trigger_param_type = data[0].value;
  // ifItem.trigger_param = data[1].value;
};
const formInstRef = ref<FormInst | null>(null);

interface Props {
  // eslint-disable-next-line vue/no-unused-properties
  conditionData?: object | any;
}
const props = withDefaults(defineProps<Props>(), {
  // eslint-disable-next-line vue/require-valid-default-prop
  conditionData: []
});

watch(
  () => props.conditionData,
  newValue => {
    if (newValue) {
      ifGroups.value = props.conditionData;
    }
  }
);
onMounted(() => {
  getGroup();
  getDevice('', '');
  getDeviceConfig('');
});
</script>

<template>
  <NFlex vertical class="mt-1 w-100%">
    <NForm ref="formInstRef" :model="formData" size="small">
      (满足以下任意一组条件即可触发)
      <NFlex v-for="(ifGroupItem, ifGroupIndex) in ifGroups" :key="ifGroupIndex" class="w-100%">
        <NCard class="mb-4 w-[calc(100%-78px)]">
          <NFlex v-for="(ifItem, ifIndex) in ifGroupItem" :key="ifIndex" class="ifGroupItem-class mb-6 w-100%">
            <NFlex class="flex-1">
              <NTag v-if="ifIndex !== 0" type="success" class="tag-class" size="small">并且</NTag>
              <!-- 选项1条件类型下拉-->
              <NFormItem
                :show-label="false"
                :show-feedback="false"
                :path="`ifGroups[${ifGroupIndex}][${ifIndex}].ifType`"
                :rule="{ message: '', required: true, trigger: 'change' }"
                class="ml-15 max-w-30 w-full"
              >
                <NSelect
                  v-model:value="ifItem.ifType"
                  :options="ifTypeOptions"
                  placeholder="请选择"
                  @update-value="data => ifTypeChange(ifItem, data)"
                />
              </NFormItem>
              <template v-if="ifItem.ifType === '1'">
                <!--  设备条件->选择类型下拉-->
                <NFormItem
                  :show-label="false"
                  :show-feedback="false"
                  :path="'ifGroups[' + ifGroupIndex + '][' + ifIndex + '].trigger_conditions_type'"
                  :rule="{ message: '', required: true, trigger: 'change' }"
                  class="max-w-40 w-full"
                >
                  <NSelect
                    v-model:value="ifItem.trigger_conditions_type"
                    :options="deviceConditionOptions"
                    placeholder="请选择"
                    clearable
                    @update:value="data => triggerConditionsTypeChange(ifItem, data)"
                  />
                </NFormItem>
                <template v-if="ifItem.trigger_conditions_type === '10'">
                  <NSelect
                    v-model:value="ifItem.trigger_source"
                    :options="deviceOptions"
                    value-field="id"
                    label-field="name"
                    :consistent-menu-width="false"
                    :loading="loadingSelect"
                    class="max-w-40"
                    @update:value="() => triggerSourceChange(ifItem)"
                  >
                    <template #header>
                      <NFlex align="center" class="w-500px">
                        分组
                        <NSelect
                          v-model:value="ifItem.deviceGroupId"
                          :options="deviceGroupOptions"
                          label-field="name"
                          value-field="id"
                          class="max-w-40"
                          clearable
                          @@update:value="data => getDevice(data, queryDevice.name)"
                        />
                        <NInput v-model:value="queryDevice.name" class="flex-1" clearable autofocus></NInput>
                        <NButton type="primary" @click.stop="getDevice(queryDevice.group_id, queryDevice.name)">
                          搜索
                        </NButton>
                      </NFlex>
                    </template>
                  </NSelect>
                </template>
                <template v-if="ifItem.trigger_conditions_type === '11'">
                  <!--  设备条件下->单类设备>选择设备类型下拉-->
                  <NSelect
                    v-model:value="ifItem.trigger_source"
                    :options="deviceConfigOption"
                    label-field="name"
                    value-field="id"
                    class="max-w-40"
                    placeholder="请选择"
                    filterable
                    remote
                    :loading="loadingSelect"
                    @search="getDeviceConfig"
                    @update:value="() => triggerSourceChange(ifItem)"
                  />
                </template>
                <template v-if="ifItem.trigger_source">
                  <!--            设备条件下->单个设备/单类设备->设备ID/设备类ID->选择设备状态-->
                  <NCascader
                    v-model:value="ifItem.trigger_param"
                    placeholder="请选择"
                    :options="ifItem.triggerParamOptions"
                    check-strategy="child"
                    children-field="options"
                    size="small"
                    class="max-w-40"
                    @update:show="data => actionParamShow(ifItem, data)"
                    @update:value="(value, option, pathValues) => triggerParamChange(ifItem, pathValues)"
                  />
                  <template v-if="ifItem.trigger_param_type === 'telemetry'">
                    <!--          设备条件下->单个设备/单类设备>-设备ID/选择设备类ID>触发消息标识符是遥测->选择操作符 --->
                    <NSelect v-model:value="ifItem.trigger_operator" :options="determineOptions" class="max-w-35" />
                    <template v-if="ifItem.trigger_operator === 'in'">
                      <!--          设备条件下->单个设备/单类设备>-设备ID/选择设备类ID>触发消息标识符是遥测->操作符是in(包含在)->输入范围值 --->
                      <NInput v-model:value="ifItem.trigger_value" placeholder="多个英文逗号隔开" class="max-w-40" />
                    </template>
                    <template v-else-if="ifItem.trigger_operator == 'between'">
                      <!--          设备条件下->单个设备/单类设备>-设备ID/选择设备类ID>触发消息标识符是遥测->操作符是between(介于)->输入最大/最小值 --->
                      <NInput v-model:value="ifItem.minValue" placeholder="最小值" class="max-w-20" />
                      <NInput v-model:value="ifItem.maxValue" placeholder="最大值" class="max-w-20" />
                    </template>
                    <template v-else>
                      <!--          设备条件下->单个设备/单类设备>-设备ID/选择设备类ID>触发消息标识符是遥测->操作符是除以上外->输入目标值 --->
                      <NInput v-model:value="ifItem.trigger_value" placeholder="取值" class="max-w-40" />
                    </template>
                  </template>
                  <template v-if="ifItem.trigger_param_type === 'attributes'">
                    <!--          设备条件下->单个设备/单类设备>-设备ID/选择设备类ID>触发消息标识符是属性->输入参数 --->
                    <NInput
                      v-model:value="ifItem.trigger_value"
                      placeholder="参数，如：{'param1':1}"
                      class="max-w-40"
                    />
                  </template>
                  <template v-if="ifItem.trigger_param_type === 'event'">
                    <!--          设备条件下->单个设备/单类设备>-设备ID/选择设备类ID>触发消息标识符是事件->输入参数 --->
                    <NInput
                      v-model:value="ifItem.trigger_value"
                      placeholder="参数，如：{'param1':1}"
                      class="max-w-40"
                    />
                  </template>
                  <template v-if="ifItem.trigger_param_type === 'status'">
                    <!--          设备条件下->单个设备/单类设备>-设备ID/选择设备类ID>触发消息标识符是状态-> --->
                  </template>
                </template>
              </template>
              <template v-if="ifItem.ifType === '2'">
                <!--  时间条件->选择类型下拉-->
                <NSelect
                  v-model:value="ifItem.trigger_conditions_type"
                  :options="timeConditionOptions"
                  class="max-w-40"
                  placeholder="请选择时间条件"
                />
                <template v-if="ifItem.trigger_conditions_type === '20'">
                  <!--  时间条件下->单次->输入时间-->
                  <NFlex class="w-150" align="center">
                    <n-date-picker
                      v-model:value="ifItem.onceTimeValue"
                      type="datetime"
                      :time-picker-props="{ format: 'HH:mm' }"
                      format="yyyy-MM-dd HH:mm"
                      placeholder="请选择日时分"
                    />
                    <span class="ml-4">未执行</span>
                    <NButton text class="refresh-class">
                      <n-icon>
                        <IosRefresh />
                      </n-icon>
                    </NButton>
                    <span class="ml-4">过期时间</span>
                    <NSelect
                      v-model:value="ifItem.expiration_time"
                      :options="expirationTimeOptions"
                      placeholder="请选择过期时间"
                      class="max-w-40"
                    />
                  </NFlex>
                </template>
                <template v-if="ifItem.trigger_conditions_type === '21'">
                  <!--  时间条件下->重复->选择周期-->
                  <NSelect
                    v-model:value="ifItem.task_type"
                    :options="cycleOptions"
                    class="max-w-40"
                    placeholder="请选择重复周期"
                  />
                  <template v-if="ifItem.task_type === 'HOUR'">
                    <NTimePicker v-model:value="ifItem.hourTimeValue" placeholder="请选择" format="mm" />
                    <span class="ml-4">过期时间</span>
                    <NSelect
                      v-model:value="ifItem.expiration_time"
                      :options="expirationTimeOptions"
                      placeholder="请选择过期时间"
                      class="max-w-40"
                    />
                  </template>
                  <template v-if="ifItem.task_type === 'DAY'">
                    <!--  时间条件下->重复->每天->选择时分秒-->
                    <NTimePicker
                      v-model:value="ifItem.dayTimeValue"
                      placeholder="请选择"
                      value-format="HH:mm"
                      format="HH:mm"
                    />
                    <span class="ml-4">过期时间</span>
                    <NSelect
                      v-model:value="ifItem.expiration_time"
                      :options="expirationTimeOptions"
                      placeholder="请选择过期时间"
                      class="max-w-40"
                    />
                  </template>
                  <template v-if="ifItem.task_type === 'WEEK'">
                    <!--  时间条件下->重复->每周->选择星期和输入时分-->
                    <NCheckboxGroup v-model:value="ifItem.weekChoseValue">
                      <NSpace item-style="display: flex;">
                        <n-checkbox
                          v-for="(weekItem, weekIndex) in weekOptions"
                          :key="weekIndex"
                          :value="weekItem.value"
                          :label="weekItem.label"
                        />
                      </NSpace>
                    </NCheckboxGroup>
                    <NTimePicker
                      v-model:value="ifItem.weekTimeValue"
                      placeholder="请选择"
                      value-format="HH:mm"
                      format="HH:mm"
                    />
                    <span class="ml-4">过期时间</span>
                    <NSelect
                      v-model:value="ifItem.expiration_time"
                      :options="expirationTimeOptions"
                      placeholder="请选择过期时间"
                      class="max-w-40"
                    />
                  </template>
                  <template v-if="ifItem.task_type === 'MONTH'">
                    <NSelect
                      v-model:value="ifItem.monthChoseValue"
                      :options="mouthRangeOptions"
                      placeholder="请选择日期"
                      class="max-w-40"
                    />
                    <NTimePicker
                      v-model:value="ifItem.monthTimeValue"
                      placeholder="请选择"
                      value-format="HH:mm"
                      format="HH:mm"
                    />
                    <span class="ml-4">过期时间</span>
                    <NSelect
                      v-model:value="ifItem.expiration_time"
                      :options="expirationTimeOptions"
                      placeholder="请选择过期时间"
                      class="max-w-40"
                    />
                  </template>
                </template>
                <template v-if="ifItem.trigger_conditions_type === '22'">
                  <!--  时间条件下->范围->选择星期和时间周期-->
                  <NCheckboxGroup v-model:value="ifItem.weekChoseValue">
                    <NSpace item-style="display: flex;">
                      <NCheckbox
                        v-for="(weekItem, weekIndex) in weekOptions"
                        :key="weekIndex"
                        :value="weekItem.value"
                        :label="weekItem.label"
                      />
                    </NSpace>
                  </NCheckboxGroup>
                  <NTimePicker
                    v-model:value="ifItem.startTimeValue"
                    placeholder="请选择"
                    value-format="HH:mm:ss"
                    format="HH:mm:ss"
                  />
                  -
                  <NTimePicker
                    v-model:value="ifItem.endTimeValue"
                    placeholder="请选择"
                    value-format="HH:mm:ss"
                    format="HH:mm:ss"
                  />
                </template>
              </template>
              <template v-if="ifItem.ifType === '3'">
                <!--            服务条件->选择类型下拉-->
                <NSelect
                  v-model:value="ifItem.trigger_conditions_type"
                  :options="serviceConditionOptions"
                  class="max-w-40"
                />
                <NSelect v-model:value="ifItem.weatherValue" :options="weatherOptions" class="max-w-40" />
              </template>
            </NFlex>
            <NFlex class="w-100px">
              <NButton
                v-if="ifIndex === 0 && ifItem.ifType !== '2'"
                type="primary"
                class="absolute right-0"
                @click="addIfGroupsSubItem(ifGroupIndex)"
              >
                新增一个条件
              </NButton>
              <NButton
                v-if="ifIndex !== 0"
                type="error"
                class="absolute right-0"
                @click="deleteIfGroupsSubItem(ifGroupIndex, ifIndex)"
              >
                删除一个条件
              </NButton>
            </NFlex>
          </NFlex>
        </NCard>
        <NButton v-if="ifGroupIndex > 0" type="error" class="relative" @click="deleteIfGroupsItem(ifGroupIndex)">
          删除组
        </NButton>
      </NFlex>
    </NForm>
    <NButton type="primary" class="w-30" @click="addIfGroupItem()">新增一个组</NButton>
  </NFlex>
</template>

<style scoped>
.ifGroupItem-class {
  position: relative;
  .tag-class {
    position: absolute;
    top: 5px;
  }
}
.refresh-class {
  font-size: 24px;
}
</style>
