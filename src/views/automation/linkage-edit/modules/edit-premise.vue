<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { NButton } from 'naive-ui';
import { IosRefresh } from '@vicons/ionicons4';
import { repeat } from 'seemly';

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
  },
  {
    label: '服务条件',
    value: '3'
  },
  {
    label: '时间范围',
    value: '4'
  }
]);

// 设备条件类型下选项2使用的下拉
const deviceConditionOptions = ref([
  {
    label: '单个设备',
    value: 'single'
  },
  {
    label: '单类设备',
    value: 'singleClass'
  }
]);
// 时间条件类型下选项2使用的下拉
const timeConditionOptions = ref([
  {
    label: '单次',
    value: 'once'
  },
  {
    label: '重复',
    value: 'repeat'
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

// 设备条件下选项3下拉
// 单个设备使用的选项,根据条件2的结果
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
// 单类设备选项使用的选项,根据条件2的结果
const singleClassDeviceOptions = ref([
  {
    label: '温度传感器',
    value: '1'
  },
  {
    label: '光照传感器',
    value: '2'
  }
]);

// 时间条件下，重复时，使用的周期选项
const cycleOptions = ref([
  {
    label: '每小时',
    value: 'hour'
  },
  {
    label: '每天',
    value: 'day'
  },
  {
    label: '每周',
    value: 'week'
  },
  {
    label: '每月',
    value: 'month'
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
// 设备状态选项
const deviceStatusOptions = ref([
  {
    label: '温度',
    value: 'temp'
  },
  {
    label: '湿度',
    value: 'humidity'
  },
  {
    label: '上下线',
    value: 'isOnline'
  },
  {
    label: '告警事件',
    value: 'waring'
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
    label: '5min',
    value: '5'
  },
  {
    label: '10min',
    value: '10'
  }
]);

// 月份范围选项
const mouthRangeOptions = repeat(31, undefined).map((_, i) => ({
  label: String(i + 1),
  value: i + 1
}));
const judgeItem = ref({
  ifType: null, // 第一条件类型
  condition: null, // 第二条件
  deviceId: null, // 设备ID值
  deviceClassId: null, // 设备类ID值
  daytimeValue: null, // 单次日时分值
  timeValue: null, // 时分秒值
  expirationTimeValue: null, // 过期时间值
  timeCycleValue: null, // 重复时间周期值
  deviceStatusValue: null, // 设备状态值
  minuteRangeValue: null, // 分钟区间值
  weekTimeValue: null, // 星期多选值
  determine: null, // 操作符
  targetValue: null, // 目标值
  minValue: null, // 最小
  maxValue: null, // 最大
  rangeValue: null, // 范围值
  parameter: null, // 参数值
  weatherValue: null // 天气值
});
interface JudgeItem {
  ifType: string; // 第一条件类型
  condition: string; // 第二条件
  deviceId: string; // 设备ID值
  deviceClassId: string; // 设备类ID值
  daytimeValue: string; // 单次日时分值
  timeValue: string; // 时分秒值
  expirationTimeValue: string; // 过期时间值
  timeCycleValue: string; // 重复时间周期值
  deviceStatusValue: string; // 设备状态值
  minuteRangeValue: number; // 分钟区间值
  weekTimeValue: any; // 星期多选值
  determine: string; // 操作符
  targetValue: string; // 目标值
  minValue: string; // 最小
  maxValue: string; // 最大
  rangeValue: string; // 范围值
  parameter: string; // 参数值
  weatherValue: string; // 天气值
}
const ifGroups: Array<Array<JudgeItem>> = reactive([]);

// 给某个条件中增加条件
const addIfGroupsSubItem = (ifGroupIndex: any) => {
  ifGroups[ifGroupIndex].push(JSON.parse(JSON.stringify(judgeItem.value)));
};
// 删除某个条进组中的某个条件
const deleteIfGroupsSubItem = (ifGroupIndex: any, ifIndex: any) => {
  ifGroups[ifGroupIndex].splice(ifIndex, 1);
};
// 删除某个条件组
const deleteIfGroupsItem = (ifIndex: any) => {
  ifGroups.splice(ifIndex, 1);
};
// 新增一个条件组
const addIfGroupItem = () => {
  const groupObj: any = [];
  groupObj.push(JSON.parse(JSON.stringify(judgeItem.value)));
  ifGroups.push(groupObj);
};
onMounted(() => {
  addIfGroupItem();
});
</script>

<template>
  <NFlex vertical class="mt-1 w-100%">
    (满足以下任意一组条件即可触发)
    <NFlex v-for="(ifGroupItem, ifGroupIndex) in ifGroups" :key="ifGroupIndex">
      <NCard class="flex-1">
        <NFlex v-for="(ifItem, ifIndex) in ifGroupItem" :key="ifIndex" class="ifGroupItem-class mb-6">
          <n-tag v-if="ifIndex !== 0" type="success" class="tag-class">并且</n-tag>
          <!-- 选项1条件类型下拉-->
          <n-select
            v-model:value="ifItem.ifType"
            :options="ifTypeOptions"
            class="ml-20 max-w-40"
            placeholder="请选择执行条件"
          />
          <template v-if="ifItem.ifType === '1'">
            <!--  设备条件->选择类型下拉-->
            <n-select
              v-model:value="ifItem.condition"
              :options="deviceConditionOptions"
              class="max-w-40"
              placeholder="请选择设备条件"
            />
            <template v-if="ifItem.condition === 'single'">
              <!--  设备条件下->单个设备->选择设备下拉-->
              <n-select
                v-model:value="ifItem.deviceId"
                :options="singleDeviceOptions"
                class="max-w-40"
                placeholder="请选择单个设备"
              />
            </template>
            <template v-if="ifItem.condition === 'singleClass'">
              <!--  设备条件下->单类设备>选择设备类型下拉-->
              <n-select
                v-model:value="ifItem.deviceClassId"
                :options="singleClassDeviceOptions"
                class="max-w-40"
                placeholder="请选择单类设备"
              />
            </template>
            <template v-if="ifItem.deviceId || ifItem.deviceClassId">
              <!--            设备条件下->单个设备/单类设备->设备ID/设备类ID->选择设备状态-->
              <n-select v-model:value="ifItem.deviceStatusValue" :options="deviceStatusOptions" class="max-w-40" />
              <template v-if="ifItem.deviceStatusValue !== 'isOnline'">
                <!--          设备条件下->单个设备/单类设备>-设备ID/选择设备类ID>设备状态不是上下线-> --->
                <template v-if="ifItem.deviceStatusValue === 'waring'">
                  <!--          设备条件下->单个设备/单类设备>-设备ID/选择设备类ID>设备状态是告警->输入参数 --->
                  <n-input v-model:value="ifItem.parameter" placeholder="参数，如：{'param1':1}" class="max-w-40" />
                </template>
                <template v-else>
                  <!--          设备条件下->单个设备/单类设备>-设备ID/选择设备类ID>设备状态是不是告警->选择操作符 --->
                  <n-select v-model:value="ifItem.determine" :options="determineOptions" class="max-w-40" />
                  <template v-if="ifItem.determine === 'in'">
                    <!--          设备条件下->单个设备/单类设备>-设备ID/选择设备类ID>设备状态是不是告警->操作符是in(包含在)->输入范围值 --->
                    <n-input v-model:value="ifItem.rangeValue" placeholder="多个逗号隔开" class="max-w-40" />
                  </template>
                  <template v-else-if="ifItem.determine == 'between'">
                    <!--          设备条件下->单个设备/单类设备>-设备ID/选择设备类ID>设备状态是不是告警->操作符是between(介于)->输入最大/最小值 --->
                    <n-input v-model:value="ifItem.minValue" placeholder="最小值" class="max-w-40" />
                    <n-input v-model:value="ifItem.maxValue" placeholder="最大值" class="max-w-40" />
                  </template>
                  <template v-else>
                    <!--          设备条件下->单个设备/单类设备>-设备ID/选择设备类ID>设备状态是不是告警->操作符是除以上外->输入目标值 --->
                    <n-input v-model:value="ifItem.targetValue" placeholder="取值" class="max-w-40" />
                  </template>
                </template>
              </template>
            </template>
          </template>
          <template v-if="ifItem.ifType === '2'">
            <!--  时间条件->选择类型下拉-->
            <n-select
              v-model:value="ifItem.condition"
              :options="timeConditionOptions"
              class="max-w-40"
              placeholder="请选择时间条件"
            />
            <template v-if="ifItem.condition === 'once'">
              <!--  时间条件下->单次->输入时间-->
              <NFlex class="w-150" align="center">
                <n-date-picker
                  v-model:formatted-value="ifItem.daytimeValue"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm"
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
                <n-select
                  v-model:value="ifItem.expirationTimeValue"
                  :options="expirationTimeOptions"
                  placeholder="请选择过期时间"
                  class="max-w-40"
                />
              </NFlex>
            </template>
            <template v-if="ifItem.condition === 'repeat'">
              <!--  时间条件下->重复->选择周期-->
              <n-select
                v-model:value="ifItem.timeCycleValue"
                :options="cycleOptions"
                class="max-w-40"
                placeholder="请选择重复周期"
              />
              <template v-if="ifItem.timeCycleValue === 'hour'">
                <!--  时间条件下->重复->每小时->输入分钟区间-->
                <n-input-number
                  v-model:value="ifItem.minuteRangeValue"
                  :show-button="false"
                  max="59"
                  min="0"
                  step="1"
                  placeholder="请输入0-59的分钟区间"
                />
                <span class="ml-4">过期时间</span>
                <n-select
                  v-model:value="ifItem.expirationTimeValue"
                  :options="expirationTimeOptions"
                  placeholder="请选择过期时间"
                  class="max-w-40"
                />
              </template>
              <template v-if="ifItem.timeCycleValue === 'day'">
                <!--  时间条件下->重复->每天->选择时分秒-->
                <n-time-picker v-model="ifItem.timeValue" placeholder="请选择时分秒" />
                <span class="ml-4">过期时间</span>
                <n-select
                  v-model:value="ifItem.expirationTimeValue"
                  :options="expirationTimeOptions"
                  placeholder="请选择过期时间"
                  class="max-w-40"
                />
              </template>
              <template v-if="ifItem.timeCycleValue === 'week'">
                <!--  时间条件下->重复->每周->选择星期和输入时分-->
                <n-checkbox-group v-model:value="ifItem.weekTimeValue">
                  <n-space item-style="display: flex;">
                    <n-checkbox
                      v-for="(weekItem, weekIndex) in weekOptions"
                      :key="weekIndex"
                      :value="weekItem.value"
                      :label="weekItem.label"
                    />
                  </n-space>
                </n-checkbox-group>
                <n-time-picker v-model="ifItem.timeValue" placeholder="请选择时分" />
                <span class="ml-4">过期时间</span>
                <n-select
                  v-model:value="ifItem.expirationTimeValue"
                  :options="expirationTimeOptions"
                  placeholder="请选择过期时间"
                  class="max-w-40"
                />
              </template>
              <template v-if="ifItem.timeCycleValue === 'month'">
                <n-select
                  v-model:value="ifItem.expirationTimeValue"
                  :options="mouthRangeOptions"
                  placeholder="请选择日期"
                  class="max-w-40"
                />

                <n-time-picker
                  v-model="ifItem.timeValue"
                  placeholder="请选择时分"
                  value-format="HH:mm"
                  format="HH:mm"
                />
                <span class="ml-4">过期时间</span>
                <n-select
                  v-model:value="ifItem.expirationTimeValue"
                  :options="expirationTimeOptions"
                  placeholder="请选择过期时间"
                  class="max-w-40"
                />
              </template>
            </template>
          </template>
          <template v-if="ifItem.ifType === '3'">
            <!--            服务条件->选择类型下拉-->
            <n-select v-model:value="ifItem.condition" :options="serviceConditionOptions" class="max-w-40" />
            <n-select v-model:value="ifItem.weatherValue" :options="weatherOptions" class="max-w-40" />
          </template>
          <template v-if="ifItem.ifType === '4'">
            <!--  时间条件下->范围->选择星期和时间周期-->
            <n-checkbox-group v-model:value="ifItem.weekTimeValue">
              <n-space item-style="display: flex;">
                <n-checkbox
                  v-for="(weekItem, weekIndex) in weekOptions"
                  :key="weekIndex"
                  :value="weekItem.value"
                  :label="weekItem.label"
                />
              </n-space>
            </n-checkbox-group>
            <n-time-picker
              v-model="ifItem.timeValue"
              placeholder="请选择开始时分"
              value-format="HH:mm"
              format="HH:mm"
            />
            -
            <n-time-picker
              v-model="ifItem.timeValue"
              placeholder="请选择结束时分"
              value-format="HH:mm"
              format="HH:mm"
            />
          </template>
          <NButton v-if="ifIndex === 0" type="primary" class="w-30" @click="addIfGroupsSubItem(ifGroupIndex)">
            新增一个条件
          </NButton>
          <NButton v-if="ifIndex !== 0" type="error" class="w-30" @click="deleteIfGroupsSubItem(ifGroupIndex, ifIndex)">
            删除
          </NButton>
        </NFlex>
      </NCard>
      <NButton v-if="ifGroupIndex > 0" type="error" class="ml-4 w-30" @click="deleteIfGroupsItem(ifGroupIndex)">
        删除组
      </NButton>
    </NFlex>
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
