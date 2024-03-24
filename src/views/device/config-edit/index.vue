<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { FormInst } from 'naive-ui';
import { useMessage } from 'naive-ui';
import { router } from '@/router';
import { deviceConfigAdd, deviceConfigEdit, deviceConfigInfo, deviceTemplate } from '@/service/api/device';

const route = useRoute();
const message = useMessage();
const configId = ref(route.query.id || null);
const modalTitle = ref('添加');
const configForm = ref(defaultConfigForm());

function defaultConfigForm() {
  return {
    id: null,
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
const queryTemplate = ref({
  page: 1,
  page_size: 20,
  total: 0
});
const deviceTemplateOptions = ref([]);
const getDeviceTemplate = () => {
  deviceTemplate(queryTemplate.value).then(res => {
    deviceTemplateOptions.value = deviceTemplateOptions.value.concat(res.data.list);
    queryTemplate.value.total = res.data.total;
  });
};

const deviceTemplateScroll = (e: Event) => {
  const currentTarget = e.currentTarget as HTMLElement;
  if (currentTarget.scrollTop + currentTarget.offsetHeight >= currentTarget.scrollHeight) {
    if (deviceTemplateOptions.value.length <= queryTemplate.value.total) {
      queryTemplate.value.page += 1;
      getDeviceTemplate();
    }
  }
};
const configFormRef = ref<HTMLElement & FormInst>();
const handleClose = () => {
  configFormRef.value?.restoreValidation();
  configForm.value = defaultConfigForm();
  router.go(-1);
};
// 提交表单
const handleSubmit = async () => {
  await configFormRef?.value?.validate();
  if (!configId.value) {
    const res = await deviceConfigAdd(configForm.value);
    if (!res.error) {
      message.success('新增成功');
      handleClose();
    }
  } else {
    const res = await deviceConfigEdit(configForm.value);
    if (!res.error) {
      message.success('修改成功');
      handleClose();
    }
  }
};
const getConfig = async () => {
  const res = await deviceConfigInfo({ id: configId.value });
  configForm.value = { ...res.data };
};

watch(
  () => configId.value,
  async newId => {
    if (newId) {
      modalTitle.value = '编辑';
    }
  }
);

onMounted(async () => {
  // configId.value=<string>route.query.id || ''
  if (configId.value) {
    modalTitle.value = '编辑';
    await getConfig();
  } else {
    modalTitle.value = '添加';
  }
  getDeviceTemplate();
});
</script>

<template>
  <div class="overflow-hidden">
    <NCard :title="`${modalTitle}设备配置`">
      <NForm
        ref="configFormRef"
        :model="configForm"
        :rules="configFormRules"
        label-placement="left"
        label-width="auto"
        class="w-600"
      >
        <NFormItem label="设备配置名称" path="name">
          <NInput v-model:value="configForm.name" placeholder="请输入设备名称" />
        </NFormItem>
        <NFormItem label="选择设备模板" path="device_template_id">
          <NSelect
            v-model:value="configForm.device_template_id"
            :options="deviceTemplateOptions"
            filterable
            label-field="name"
            value-field="id"
            @scroll="deviceTemplateScroll"
          ></NSelect>
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
        <!--        <NFormItem label="设备连接方式" path="device_conn_type">-->
        <!--          <n-radio-group v-model:value="configForm.device_conn_type" name="device_conn_type">-->
        <!--            <n-space>-->
        <!--              <n-radio value="A">设备连接平台</n-radio>-->
        <!--              <n-radio value="B">平台连接设备</n-radio>-->
        <!--            </n-space>-->
        <!--          </n-radio-group>-->
        <!--        </NFormItem>-->
        <NFlex justify="flex-end">
          <NButton type="primary" @click="handleSubmit">确定</NButton>
        </NFlex>
      </NForm>
    </NCard>
  </div>
</template>

<style lang="scss" scoped>
.w-600 {
  width: 600px;
}
</style>
