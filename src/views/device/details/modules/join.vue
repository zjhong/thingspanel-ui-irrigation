<script setup lang="ts">
import { defineProps, onMounted, reactive, ref, watchEffect } from 'vue';
import { NButton, NForm, NFormItem, NInput, NSelect } from 'naive-ui';
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface';
import { devicCeonnectForm, getDeviceConnectInfo, updateDeviceVoucher } from '@/service/api/device';
import { useDeviceDataStore } from '@/store/modules/device';

// 定义支持的表单元素类型
type FormElementType = 'input' | 'table' | 'select';

// 定义选项接口，适用于 select 类型的表单元素
interface Option {
  label: string;
  value: number | string;
}

// 定义验证规则接口
interface Validate {
  message: string; // 验证失败时显示的错误消息
  required?: boolean; // 指定字段是否必填
  rules?: string; // 用于验证字段值的正则表达式规则
  type?: 'number' | 'string' | 'array' | 'boolean' | 'object'; // 验证的类型
}

// 定义表单元素接口
interface FormElement {
  type: FormElementType; // 表单元素的类型
  dataKey: string; // 用于唯一标识表单元素的键
  label: string; // 显示为表单元素标签的文本
  options?: Option[]; // 下拉选择的枚举选项，仅 select 类型时有效
  placeholder?: string; // 提示文本，仅 input 类型时有效
  validate?: Validate; // 包含表单验证规则的对象
  array?: FormElement[]; // 仅 table 类型时有效，定义表格列的配置
}

const deviceDataStore = useDeviceDataStore();

const props = defineProps<{
  id: string;
}>();
const formElements = ref<FormElement[]>([]);
const formData = reactive({});
const getFormJson = async () => {
  const res = await devicCeonnectForm({ device_id: props.id });

  formElements.value = res.data;
};
const connectInfo = ref<object>({});
const feachConnectInfo = async () => {
  const res = await getDeviceConnectInfo({ device_id: props.id });
  connectInfo.value = res.data;
  console.log(res);
};

onMounted(() => {
  deviceDataStore.fetchData(props.id);
  feachConnectInfo();
  getFormJson();
});

watchEffect(() => {
  const thejson = JSON.parse(deviceDataStore?.deviceData?.voucher || '');
  if (formElements.value && Array.isArray(formElements.value)) {
    formElements.value.forEach(element => {
      if (element.type === 'table' && Array.isArray(element.array)) {
        element.array.forEach(subElement => {
          formData[subElement.dataKey] ??= thejson[subElement.dataKey] || '';
        });
      } else {
        formData[element.dataKey] ??= thejson[element.dataKey] || '';
      }
    });
  }
});

const handleSubmit = async () => {
  const res = await updateDeviceVoucher({
    device_id: props.id,
    voucher: JSON.stringify(formData)
  });
  if (!res.error) {
    console.log(res);
  } else {
    console.log(res);
  }
};
</script>

<template>
  <NForm>
    <n-scrollbar style="max-height: 360px">
      <template v-for="element in formElements" :key="element.dataKey">
        <div v-if="element.type === 'input'" class="form-item">
          <NFormItem :label="element.label">
            <NInput v-model:value="formData[element.dataKey]" :placeholder="element.placeholder" />
          </NFormItem>
        </div>
        <div v-if="element.type === 'select'" class="form-item">
          <NFormItem :label="element.label">
            <NSelect v-model:value="formData[element.dataKey]" :options="element.options as SelectMixedOption[]" />
          </NFormItem>
        </div>
        <div v-if="element.type === 'table'">
          <!--          <div class="table-label">{{ element.label }}</div>-->
          <div class="table-content">
            <template v-for="subElement in element.array" :key="subElement.dataKey">
              <div v-if="subElement.type === 'input'" class="table-item">
                <NFormItem :label="subElement.label">
                  <NInput v-model:value="formData[subElement.dataKey]" :placeholder="subElement.placeholder" />
                </NFormItem>
              </div>
              <div v-if="subElement.type === 'select'" class="table-item">
                <NFormItem :label="subElement.label">
                  <NSelect
                    v-model:value="formData[subElement.dataKey]"
                    :options="subElement.options as SelectMixedOption[]"
                  />
                </NFormItem>
              </div>
            </template>
          </div>
        </div>
      </template>

      <NCard title="连接信息">
        <NDescriptions :column="1">
          <NDescriptionsItem v-for="(value, key) in connectInfo" :key="key" :label="key">
            <span class="font-600">{{ value }}</span>
          </NDescriptionsItem>
        </NDescriptions>
      </NCard>
    </n-scrollbar>
    <div class="mt-4 w-full flex-center">
      <NButton type="primary" @click="handleSubmit">提交</NButton>
    </div>
  </NForm>
</template>

<style scoped>
.form-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.form-item > * {
  width: 100%;
}

.table-label {
  font-weight: bold;
  margin-bottom: 10px;
}

.table-content {
  margin-left: 20px;
}

.table-item {
  margin-bottom: 8px;
}
</style>
