<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { NButton } from 'naive-ui';
import { dictQuery } from '@/service/api/setting';
import { deviceConfigEdit, deviceConfigVoucherType, protocolPluginConfigForm } from '@/service/api/device';
// protocolPluginConfigInput
import FormInput from './form.vue';

// const message = useMessage();

interface Emits {
  (e: 'upDateConfig'): void;
}

const emit = defineEmits<Emits>();

const typeOptions = ref([]);
const active: any = ref(false);
let dynamicForm: any = reactive({});

interface Props {
  configInfo?: object | any;
}

const props = withDefaults(defineProps<Props>(), {
  configInfo: null
});
const extendForm = ref({
  protocol_type: null,
  voucher_type: null
} as any);
const extendFormRules = ref({});
const handleSubmit = async () => {
  const postData = props.configInfo;
  postData.protocol_type = extendForm.value.protocol_type;
  postData.voucher_type = extendForm.value.voucher_type;
  const res = await deviceConfigEdit(postData);
  if (!res.error) {
    // message.success('修改成功');
    emit('upDateConfig');
  }
};
const getDict = async dictCode => {
  const queryData = {
    dict_code: dictCode
  };
  const res = await dictQuery(queryData);
  typeOptions.value = res.data || [];
};
const connectOptions = ref([] as any);

const getVoucherType = async data => {
  const res = await deviceConfigVoucherType({ device_type: props.configInfo.device_type, protocol_type: data });
  if (res.data) {
    connectOptions.value = Object.keys(res.data).map(key => {
      return { label: key, value: res.data[key] };
    });
  }
};
const getConfigForm = async data => {
  const res = await protocolPluginConfigForm({ device_type: props.configInfo.device_type, protocol_type: data });
  dynamicForm = reactive(res.data);
  console.log(res.data, '表单');
};
const openForm = () => {
  active.value = true;
};
const choseProtocolType = async data => {
  extendForm.value.voucher_type = null;
  // connectOptions.value = [];
  await getVoucherType(data);
  await getConfigForm(data);
};
onMounted(async () => {
  if (props.configInfo.device_type === '1') {
    getDict('DRIECT_ATTACHED_PROTOCOL');
  } else {
    getDict('GATEWAY_PROTOCOL');
  }
  extendForm.value = props.configInfo;
  await getVoucherType(extendForm.value.protocol_type);
});
</script>

<template>
  <div class="connection-box">
    <div class="connection-title">通过协议接入</div>
    <NForm :model="extendForm" :rules="extendFormRules" label-placement="left" label-width="auto" class="w-300">
      <NFormItem label="选择协议/服务" path="protocol_type">
        <NSelect
          v-model:value="extendForm.protocol_type"
          :options="typeOptions"
          placeholder="请选择选择协议/服务"
          label-field="translation"
          value-field="dict_value"
          @change="choseProtocolType"
        ></NSelect>
      </NFormItem>
      <NFormItem label="认证类型" path="voucher_type">
        <NSelect
          v-if="props.configInfo.device_type !== 1"
          v-model:value="extendForm.voucher_type"
          :options="connectOptions"
          placeholder="请选择认证类型"
        ></NSelect>
      </NFormItem>
      <NFlex justify="flex-end">
        <NButton type="primary" @click="openForm">表单配置</NButton>
        <NButton type="primary" @click="handleSubmit">保存</NButton>
      </NFlex>
    </NForm>
    <n-drawer v-model:show="active" :width="502" placement="right">
      <n-drawer-content title="表单配置">
        <FormInput v-model:dynamicForm="dynamicForm"></FormInput>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style scoped lang="scss">
.connection-box {
  padding: 50px;

  .connection-title {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .w-300 {
    width: 300px;
  }
}
</style>
