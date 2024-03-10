<script lang="ts" setup>
import {reactive, ref, watch} from 'vue'
import {deviceConfigAdd, deviceConfigEdit, deviceTemplate} from "@/service/api/device";
import {FormInst, useMessage} from "naive-ui";

const message = useMessage();

const props = defineProps({
  modalVisible: {
    type: Boolean,
    default: false,
  },
  modalType: {
    type: String,
    default() {
      return 'add'
    }
  }
})
const modalTitle = ref('添加')
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
})
const deviceTemplateOptions = ref([])

const emit = defineEmits();
const visible = ref(false)
watch(
    () => props.modalVisible,
    (newValue) => {
      visible.value = newValue
      if (props.modalType === 'add') {
        modalTitle.value = '添加'
      } else {
        modalTitle.value = '编辑'
      }
      getDeviceTemplate()
    }
)
const modalClose = () => {
  emit('modalClose');
}
const getDeviceTemplate = () => {
  const paramsData = {
    page: 1,
    page_size: 100,
  }
  deviceTemplate(paramsData).then(res => {
    deviceTemplateOptions.value = res.data.list
  })
}
const deviceTemplateScroll = () => {

}
const configFormRef = ref<HTMLElement & FormInst>();

//提交表单
const handleSubmit = async () => {
  await configFormRef?.value?.validate();
  if (props.modalType === 'add') {
    const res = await deviceConfigAdd(configForm.value);
    if (!res.error) {
      message.success('新增成功');
    }
  } else {
    const res = await deviceConfigEdit(configForm.value);
    if (!res.error) {
      message.success('修改成功');
    }
  }
  handleClose()
  emit('submitted');
}
const handleClose = () => {
  configFormRef.value?.restoreValidation();
  configForm.value=defaultConfigForm()
  visible.value = false
  modalClose()
}
</script>

<template>
  <div class="overflow-hidden">
    <NModal v-model:show="visible" :mask-closable="false" :title="`${modalTitle}设备配置`" class="w-600px"
            preset="card" @after-leave="modalClose">
      <NForm ref="configFormRef" :model="configForm" :rules="configFormRules" label-placement="left" label-width="auto">
        <NFormItem label="设备配置名称" path="name">
          <NInput v-model:value="configForm.name" placeholder="请输入设备名称"/>
        </NFormItem>
        <NFormItem label="选择设备模板" path="device_template_id">
          <NTreeSelect
              v-model:value="configForm.device_template_id"
              :options="deviceTemplateOptions"
              label-field="name"
              value-field="author"
              @scroll="deviceTemplateScroll"
          ></NTreeSelect>
        </NFormItem>
        <NFormItem label="设备接入类型" path="device_type">
          <n-radio-group v-model:value="configForm.device_type" name="device_type">
            <n-space>
              <n-radio value="1">直连设备</n-radio>
              <n-radio value="2">网关</n-radio>
              <n-radio value="3">网关子设备</n-radio>
            </n-space>
          </n-radio-group>
        </NFormItem>
        <NFormItem label="设备连接方式" path="device_conn_type">
          <n-radio-group v-model:value="configForm.device_conn_type" name="device_conn_type">
            <n-space>
              <n-radio value="A">设备连接平台</n-radio>
              <n-radio value="B">平台连接设备</n-radio>
            </n-space>
          </n-radio-group>
        </NFormItem>
        <div style="display: flex; justify-content: flex-end; gap: 8px">
          <NButton @click="handleClose">取消</NButton>
            <NButton @click="handleSubmit" type="primary">确定</NButton>
        </div>
      </NForm>
    </NModal>
  </div>
</template>

<style scoped>

</style>
