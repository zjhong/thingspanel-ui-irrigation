<script setup lang="tsx">
import { reactive, ref, watch } from 'vue';
import { addTelemetry, putTelemetry } from '@/service/api/system-data';
import { $t } from '@/locales';

const emit = defineEmits(['update:addAndEditModalVisible', 'update:objItem', 'determine']);

const props = defineProps({
  addAndEditModalVisible: {
    type: Boolean,
    required: true
  },
  deviceTemplateId: {
    type: String,
    required: true
  },
  objItem: {
    type: Object,
    required: true
  }
});

// 提交表单
const formRef: any = ref(null);
const deviceTemplateId = ref<string>(props.deviceTemplateId);

let addFrom: any = reactive({});

type Rule = {
  required: boolean;
  trigger: string[];
  message: string;
};

type Rules = {
  data_name: Rule;
  data_identifier: Rule;
  data_type: Rule;
  read_write_flag: Rule;
};

const fromRules: Rules = {
  data_name: {
    required: true,
    trigger: ['blur', 'input'],
    message: $t('device_template.table_header.pleaseEnterADataName')
  },
  data_identifier: {
    required: true,
    trigger: ['blur', 'input'],
    message: $t('device_template.table_header.pleaseEnterTheDataIdentifier')
  },
  data_type: {
    required: true,
    trigger: ['blur', 'input'],
    message: $t('device_template.table_header.pleaseEnterTheDataType')
  },
  read_write_flag: {
    required: true,
    trigger: ['blur', 'input'],
    message: $t('generate.enter-read-write')
  }
};

const objItem = reactive<any>(props.objItem);

// 监听一下父组件传递过来的编辑数据
watch(
  objItem,
  newVal => {
    console.log('objItem changed', newVal.id);
    if (objItem.id) {
      addFrom = reactive({
        device_template_id: deviceTemplateId,
        ...newVal
      });
    } else {
      addFrom = reactive({
        device_template_id: deviceTemplateId,
        data_name: '',
        data_identifier: '',
        unit: '',
        description: ''
      });
    }
  },
  { deep: true, immediate: true }
);

const generalOptions: any = reactive(
  ['Number', 'String', 'Boolean'].map(v => ({
    label: v,
    value: v
  }))
);

const readAndWriteOptions: any = reactive(
  ['R-只读', 'RW-读/写'].map(v => ({
    label: v,
    value: v
  }))
);

// 确定按钮
const submit: () => void = async () => {
  await formRef.value?.validate();
  if (props.objItem.id) {
    const response: any = await putTelemetry(addFrom);
    if (response.data) {
      emit('update:objItem', {});
      emit('update:addAndEditModalVisible', false);
      emit('determine');
    }
    console.log(response, '提交');
  } else {
    const response: any = await addTelemetry(addFrom);
    if (response.data) {
      emit('update:objItem', {});
      emit('update:addAndEditModalVisible', false);
      emit('determine');
    }
    console.log(response, '提交');
  }
};

// 取消按钮
const clear: () => void = () => {
  emit('update:objItem', {});
  emit('update:addAndEditModalVisible', false);
  console.log(props.objItem, $t('common.cancel'));
};
</script>

<template>
  <n-form
    ref="formRef"
    :model="addFrom"
    :rules="fromRules"
    label-placement="left"
    label-width="100"
    require-mark-placement="right-hanging"
    class="addFrom"
  >
    <n-form-item :label="$t('device_template.table_header.dataName')" path="data_name">
      <n-input
        v-model:value.trim="addFrom.data_name"
        :placeholder="$t('device_template.table_header.pleaseEnterADataName')"
      />
    </n-form-item>
    <n-form-item :label="$t('device_template.table_header.dataIdentifier')" path="data_identifier">
      <n-input
        v-model:value.trim="addFrom.data_identifier"
        :placeholder="$t('device_template.table_header.pleaseEnterTheDataIdentifier')"
      />
    </n-form-item>
    <n-form-item :label="$t('device_template.table_header.dataType')" path="data_type">
      <n-select
        v-model:value="addFrom.data_type"
        :options="generalOptions"
        :placeholder="$t('device_template.table_header.pleaseEnterTheDataType')"
      />
    </n-form-item>
    <n-form-item :label="$t('device_template.table_header.readAndWriteSign')" path="read_write_flag">
      <n-select
        v-model:value="addFrom.read_write_flag"
        :options="readAndWriteOptions"
        :placeholder="$t('generate.enterReadWriteFlag')"
      />
    </n-form-item>
    <n-form-item :label="$t('device_template.table_header.unit')">
      <n-input v-model:value.trim="addFrom.unit" :placeholder="$t('device_template.table_header.pleaseEnterTheUnit')" />
    </n-form-item>
    <n-form-item :label="$t('device_template.table_header.description')">
      <n-input
        v-model:value.trim="addFrom.description"
        :placeholder="$t('device_template.table_header.PleaseEnterADescription')"
        type="textarea"
      />
    </n-form-item>
  </n-form>
  <div class="box1">
    <n-button class="m-r3" @click="clear">{{ $t('device_template.cancellation') }}</n-button>
    <n-button @click="submit">{{ $t('device_template.confirm') }}</n-button>
  </div>
</template>

<style lang="scss" scoped>
.box1 {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
