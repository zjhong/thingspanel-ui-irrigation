<script setup lang="tsx">
import { reactive, ref, watch } from 'vue';
import { addAttributes, putAttributes } from '@/service/api/system-data';

const emit = defineEmits(['update:addAndEditModalVisible', 'update:objItem', 'determine']);

const props = defineProps({
  addAndEditModalVisible: {
    type: Boolean,
    required: true
  },
  DeviceTemplateId: {
    type: String,
    required: true
  },
  objItem: {
    type: Object,
    required: true
  }
});

console.log(props.objItem, '测试');

// 提交表单
const formRef: any = ref(null);
const DeviceTemplateId = ref<string>(props.DeviceTemplateId);

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
};

const fromRules: Rules = {
  data_name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入属性名称'
  },
  data_identifier: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入属性标识符'
  },
  read_write_flag: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入属性类型'
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
        device_template_id: DeviceTemplateId,
        ...newVal
      });
    } else {
      addFrom = reactive({
        device_template_id: DeviceTemplateId,
        data_name: '',
        data_identifier: '',
        read_write_flag: 'String',
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

// 确定按钮
const submit: () => void = async () => {
  await formRef.value?.validate();
  if (props.objItem.id) {
    const response: any = await putAttributes(addFrom);
    if (response.data) {
      emit('update:objItem', {});
      emit('update:addAndEditModalVisible', false);
      emit('determine');
      window.$message?.success('编辑成功');
    }
    console.log(response, '提交');
  } else {
    const response: any = await addAttributes(addFrom);
    if (response.data) {
      emit('update:objItem', {});
      emit('update:addAndEditModalVisible', false);
      emit('determine');
      window.$message?.success('新增成功');
    }
    console.log(response, '提交');
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
    <n-form-item label="属性名称" path="data_name">
      <n-input v-model:value.trim="addFrom.data_name" placeholder="请输入属性名称" />
    </n-form-item>
    <n-form-item label="属性标识符" path="data_identifier">
      <n-input v-model:value.trim="addFrom.data_identifier" placeholder="请输入属性标识符" />
    </n-form-item>
    <n-form-item label="属性类型" path="read_write_flag">
      <n-select v-model:value="addFrom.read_write_flag" :options="generalOptions" placeholder="请选择属性类型" />
    </n-form-item>
    <n-form-item label="单位">
      <n-input v-model:value.trim="addFrom.unit" placeholder="请输入单位" />
    </n-form-item>
    <n-form-item label="描述">
      <n-input v-model:value.trim="addFrom.description" placeholder="请输入描述" type="textarea" />
    </n-form-item>
  </n-form>
  <div class="box1">
    <n-button class="m-r3" @click="clear">取消</n-button>
    <n-button @click="submit">确定</n-button>
  </div>
</template>

<style lang="scss" scoped>
.box1 {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
