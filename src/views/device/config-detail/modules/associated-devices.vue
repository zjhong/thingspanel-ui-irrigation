<script setup lang="ts">
import type { Ref } from 'vue';
import { onMounted, ref } from 'vue';
import type { DataTableColumns, FormInst } from 'naive-ui';
import { NButton, NPagination, useMessage } from 'naive-ui';
import moment from 'moment/moment';
import { deviceConfigBatch, deviceList } from '@/service/api/device';

const message = useMessage();

interface Props {
  deviceConfigId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  deviceConfigId: ''
});
const visible = ref(false);
const associatedFormRef = ref<HTMLElement & FormInst>();
const associatedForm = ref(defaultAssociatedForm());

function defaultAssociatedForm() {
  return {
    device_ids: null,
    device_config_id: ''
  };
}

const associatedFormRules = ref({
  // device_ids: {
  //   required: true,
  //   message: '请选择设备',
  //   trigger: 'change'
  // },
});

const addDevice = () => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  getDeviceOptions();
  visible.value = true;
};
const modalClose = () => {};
const handleSubmit = async () => {
  await associatedFormRef?.value?.validate();
  associatedForm.value.device_config_id = props.deviceConfigId;
  const res = await deviceConfigBatch(associatedForm.value);
  if (!res.error) {
    message.success('新增成功');
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    handleClose();
  }
};
const handleClose = () => {
  associatedFormRef.value?.restoreValidation();
  associatedForm.value = defaultAssociatedForm();
  visible.value = false;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  queryData.value.page = 1;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  getDeviceList();
};
const handleScroll = (e: Event) => {
  const currentTarget = e.currentTarget as HTMLElement;
  if (currentTarget.scrollTop + currentTarget.offsetHeight >= currentTarget.scrollHeight) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (deviceOptions.value.length <= queryDevice.value.total) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      queryDevice.value.page += 1;
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      getDeviceOptions();
    }
  }
};

const deviceOptions = ref([] as any[]);
const queryDevice = ref({
  page: 1,
  page_size: 20,
  total: 0
});
const getDeviceOptions = async () => {
  const res = await deviceList(queryDevice.value);
  deviceOptions.value = deviceOptions.value.concat(res.data.list);
  // eslint-disable-next-line require-atomic-updates
  queryDevice.value.total = res.data.total;
};
const columnsData: Ref<DataTableColumns<ServiceManagement.Service>> = ref([
  {
    key: 'name',
    title: '设备名称',
    align: 'center'
  },
  {
    key: 'device_number',
    title: '设备编码',
    align: 'center'
  },
  {
    key: 'activate_flag',
    title: '在线状态',
    align: 'center'
  },
  {
    key: 'ts',
    title: '推送时间',
    align: 'center',
    render: row => {
      if (row.ts) {
        return moment(row.ts).format('YYYY-MM-DD hh:mm:ss');
      }
      return '';
    }
  }
]);
const queryData = ref({
  device_config_id: props.deviceConfigId,
  page: 1,
  page_size: 10
});
const configDevice = ref([]);
const configDeviceTotal = ref(0);
const getDeviceList = async () => {
  console.log(props.deviceConfigId, '432432432434');
  queryData.value.device_config_id = props.deviceConfigId;
  const res = await deviceList(queryData.value);
  configDevice.value = res.data.list || [];
  configDeviceTotal.value = res.data.total;
};
onMounted(async () => {
  await getDeviceList();
});
</script>

<template>
  <div class="associated-box">
    <NButton type="primary" @click="addDevice()">+添加设备</NButton>
    <NDataTable
      :columns="columnsData"
      :data="configDevice"
      size="small"
      :row-key="item => item.id"
      class="table-class"
    />
    <div class="pagination-box">
      <NPagination
        v-model:page="queryData.page"
        :page-size="queryData.page_size"
        :item-count="configDeviceTotal"
        @update:page="getDeviceList"
      />
    </div>
    <NModal
      v-model:show="visible"
      :mask-closable="false"
      title="添加设备"
      class="w-600px"
      preset="card"
      @after-leave="modalClose"
    >
      <NForm
        ref="associatedFormRef"
        :model="associatedForm"
        :rules="associatedFormRules"
        label-placement="left"
        label-width="auto"
      >
        <NFormItem label="选择设备" path="device_ids">
          <NSelect
            v-model:value="associatedForm.device_ids"
            :options="deviceOptions"
            label-field="name"
            value-field="id"
            filterable
            multiple
            @scroll="handleScroll"
          ></NSelect>
        </NFormItem>
        <NFlex justify="flex-end">
          <NButton @click="handleClose">取消</NButton>
          <NButton type="primary" @click="handleSubmit">添加</NButton>
        </NFlex>
      </NForm>
    </NModal>
  </div>
</template>

<style scoped lang="scss">
.associated-box {
  height: 100%;
}

.pagination-box {
  display: flex;
  justify-content: flex-end;
}

.table-class {
  margin: 10px;
  height: 50%;
}
</style>
