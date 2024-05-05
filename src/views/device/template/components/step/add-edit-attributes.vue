<script setup lang="tsx">
import { reactive, ref, watch } from 'vue';
import { addAttributes, putAttributes } from '@/service/api/system-data';
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
  read_write_flag: Rule;
  data_type: Rule;
};

const fromRules: Rules = {
  data_name: {
    required: true,
    trigger: ['blur', 'input'],
    message: $t('device_template.table_header.pleaseEnterTheAttributeName')
  },
  data_identifier: {
    required: true,
    trigger: ['blur', 'input'],
    message: $t('device_template.table_header.pleaseEnterTheAttributeIdentifier')
  },
  data_type: {
    required: true,
    trigger: ['blur', 'input'],
    message: $t('device_template.table_header.pleaseEnterTheAttributeType')
  },
  read_write_flag: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入读写标志'
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
  ['String', 'Number', 'Boolean'].map(v => ({
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
    const response: any = await putAttributes(addFrom);
    if (response.data) {
      emit('update:objItem', {});
      emit('update:addAndEditModalVisible', false);
      emit('determine');
      emit('update:objItem', {});
      emit('update:addAndEditModalVisible', false);
      emit('determine');
      window.$message?.success('编辑成功');
    }
    console.log(response, '提交');
  } else {
    const response: any = await addAttributes(addFrom);
    if (response.data) {
      emit('update:addAndEditModalVisible', false);
      emit('determine');
      emit('update:objItem', {});
      emit('update:addAndEditModalVisible', false);
      emit('determine');
      window.$message?.success('新增成功');
    }
  }
};

// 取消按钮
const clear: () => void = () => {
  emit('update:objItem', {});
  emit('update:addAndEditModalVisible', false);
  console.log(props.objItem, '取消');
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
    <n-form-item :label="$t('device_template.table_header.attributeName')" path="data_name">
      <n-input
        v-model:value.trim="addFrom.data_name"
        :placeholder="$t('device_template.table_header.pleaseEnterTheAttributeName')"
      />
    </n-form-item>
    <n-form-item :label="$t('device_template.table_header.attributeIdentifier')" path="data_identifier">
      <n-input
        v-model:value.trim="addFrom.data_identifier"
        :placeholder="$t('device_template.table_header.pleaseEnterTheAttributeIdentifier')"
      />
    </n-form-item>
    <n-form-item :label="$t('device_template.table_header.attributeType')" path="data_type">
      <n-select
        v-model:value="addFrom.data_type"
        :options="generalOptions"
        :placeholder="$t('device_template.table_header.pleaseEnterTheAttributeType')"
      />
    </n-form-item>
    <n-form-item :label="$t('device_template.table_header.readAndWriteSign')" path="read_write_flag">
      <n-select v-model:value="addFrom.read_write_flag" :options="readAndWriteOptions" placeholder="请输入读写标志" />
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
