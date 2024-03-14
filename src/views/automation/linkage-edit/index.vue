<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { FormInst } from 'naive-ui';
import { NButton } from 'naive-ui';
const configFormRef = ref<HTMLElement & FormInst>();
const configForm = ref(defaultConfigForm());

function defaultConfigForm() {
  return {
    additional_info: null,
    description: null,
    device_conn_type: null,
    device_template_id: null,
    device_type: null,
    name: null,
    protocol_config: null,
    protocol_type: null,
    remark: null,
    voucher_type: null
  };
}

const configFormRules = ref({
  name: {
    required: true,
    message: '请输入设备配置名称',
    trigger: 'blur'
  },
  device_type: {
    required: true,
    message: '请选择设备接入类型',
    trigger: 'change'
  },
  device_conn_type: {
    required: true,
    message: '请选择设备连接方式',
    trigger: 'change'
  }
});
const judgeItem = ref({
  condition: '',
  deviceTotal: '',
  deviceId: '',
  climate: '',
  determine: '',
  targetValue: '',
  minValue: '',
  maxValue: ''
});
interface judgeObj {
  condition: string;
  deviceTotal: string;
  deviceId: string;
  climate: string;
  determine: string;
  targetValue: string;
  minValue: string;
  maxValue: string;
}
const judgeList1: Array<judgeObj> = reactive([]);
const conditionOptions = ref([
  {
    label: '设备条件',
    value: '1'
  },
  {
    label: '时间条件',
    value: '2'
  }
]);
const totalOptions = ref([
  {
    label: '单个设备',
    value: 'single'
  }
]);

const deviceOptions = ref([
  {
    label: '单个设备',
    value: 'single'
  }
]);

const climateOptions = ref([
  {
    label: '温度',
    value: 'temp'
  },
  {
    label: '湿度',
    value: 'humidity'
  }
]);
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
const addJudgeList1Item = () => {
  judgeList1.push({ ...judgeItem.value });
};
const deleteJudgeList1Item = (index: number) => {
  judgeList1.splice(index, 1);
};
onMounted(() => {
  addJudgeList1Item();
});
</script>

<template>
  <div class="linkage-edit">
    <NForm ref="configFormRef" :model="configForm" :rules="configFormRules" label-placement="left" label-width="auto">
      <NFlex justify="space-between">
        <NFormItem label="场景联动名称" path="name" class="flex-1">
          <NInput v-model:value="configForm.name" placeholder="请输入场景联动名称" />
        </NFormItem>
        <NFormItem label="描述" path="name" class="flex-1">
          <NInput v-model:value="configForm.name" type="textarea" placeholder="请输入描述" rows="1" />
        </NFormItem>
      </NFlex>
      <NFormItem label="如果"></NFormItem>
      <NFlex v-for="(item, index) in judgeList1" :key="index" class="mb-6">
        <n-tag v-if="index !== 0" type="success">并且</n-tag>
        <n-select v-model:value="item.condition" :options="conditionOptions" class="min-w-40 flex-1" />
        <n-select v-model:value="item.deviceTotal" :options="totalOptions" class="min-w-40 flex-1" />
        <n-select v-model:value="item.deviceId" :options="deviceOptions" class="min-w-40 flex-1" />
        <n-select v-model:value="item.climate" :options="climateOptions" class="min-w-40 flex-1" />
        <n-select v-model:value="item.determine" :options="determineOptions" class="min-w-40 flex-1" />
        <template v-if="item.determine !== 'between'">
          <n-input v-model:value="item.targetValue" placeholder="取值" class="min-w-40 flex-1" />
        </template>
        <template v-else>
          <n-input v-model:value="item.minValue" placeholder="最小值" class="min-w-40 flex-1" />
          <n-input v-model:value="item.maxValue" placeholder="最大值" class="min-w-40 flex-1" />
        </template>
        <NButton v-if="index === 0" type="primary" class="w-30" @click="addJudgeList1Item()">新增一个条件</NButton>
        <NButton v-if="index !== 0" type="error" class="w-30" @click="deleteJudgeList1Item(index)">删除</NButton>
      </NFlex>
    </NForm>
  </div>
</template>

<style scoped></style>
