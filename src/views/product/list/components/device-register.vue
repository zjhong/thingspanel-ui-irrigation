<script setup lang="tsx">
import { reactive, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { NButton, NSpace } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { useBoolean, useLoading } from '@sa/hooks';
import { $t } from '@/locales';
import { exportDevice, getDeviceList } from '@/service/product/list';
import TableDeviceModal from './table-device-modal.vue';
import type { ModalType } from './table-action-modal.vue';
import ColumnSetting from './column-setting.vue';
const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();
import moment from "moment"
const props: DeviceRegisterProps = defineProps({
  pid: {
    type: String,
    required: true
  }
});
const queryParams = reactive({
  deviceNumber: '',
  batchNumber: '',
  product_id: props.pid,
  page: 1,
  page_size: 10
});
watch(
  props,
  () => {
    queryParams.product_id = props.pid;
    getTableData();
  },
  { deep: true }
);
const tableData = ref<PreproductDeviceRecord[]>([]);
function setTableData(data: PreproductDeviceRecord[]) {
  tableData.value = data;
}
const exportFile = () => {
  exportDevice({ ...queryParams, page: undefined, page_size: undefined });
};

const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination.page = page;
    queryParams.page = page;
    getTableData();
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    queryParams.page = 1;
    queryParams.page_size = pageSize;
    getTableData();
  }
});
function handleQuery() {
  init();
}
function handleReset() {
  Object.assign(queryParams, {
    deviceNumber: '',
    batchNumber: '',
    page: 1
  });
  handleQuery();
}
async function getTableData() {
  startLoading();
  const { data } = await getDeviceList(queryParams);
  if (data) {
    const list: PreproductDeviceRecord[] = data.list;
    setTableData(list);
    pagination.pageCount = Math.ceil(data.total / queryParams.page_size);
    endLoading();
  }
}

const columns: Ref<DataTableColumns<PreproductDeviceRecord>> = ref([
  {
    key: 'name',
    title: $t('page.product.list.deviceNumber')
  },
  {
    key: 'batch_number',
    title: $t('page.product.list.batchNumber')
  },
  {
    key: 'current_version',
    title: $t('page.product.list.firmwareVersion')
  },
  {
    key: 'created_at',
    title: $t('page.product.list.activeStatus'),
    render: (row) => {
      return row.created_at ? moment(row.created_at) : '-'
    },
  },
  {
    key: 'activate_at',
    title: $t('page.product.list.activeDate'),
    render: (row) => {
      return row.activate_at ? moment(row.activate_at) : '-'
    },
  }
]) as Ref<DataTableColumns<PreproductDeviceRecord>>;

const modalType = ref<ModalType>('add');

function setModalType(type: ModalType) {
  modalType.value = type;
}

const editData = ref<PreproductDeviceRecord | null>(null);

function handleAddTable() {
  editData.value = null;
  openModal();
  setModalType('add');
}

// function handleEditPwd(rowId: string) {
// 	const findItem = tableData.value.find((item) => item.id === rowId);
// 	if (findItem) {
// 		setEditData(findItem);
// 	}
// 	openEditPwdModal();
// }

function init() {
  getTableData();
}
watch(
  visible,
  () => {
    if (!visible.value) {
      getTableData();
    }
  },
  { deep: true }
);
// 初始化
init();
</script>

<template>
  <div class="overflow-hidden h-full">
    <NCard :bordered="false" class="h-full rounded-8px shadow-sm">
      <div class="flex-col h-full">
        <NForm ref="queryFormRef" inline label-placement="left" :model="queryParams">
          <NFormItem :label="$t('page.product.list.batchNumber')" path="email">
            <NInput v-model:value="queryParams.batchNumber" />
          </NFormItem>
          <NFormItem :label="$t('page.product.list.deviceNumber')" path="name">
            <NInput v-model:value="queryParams.deviceNumber" />
          </NFormItem>
          <NFormItem>
            <NButton class="w-72px" type="primary" @click="handleQuery">搜索</NButton>
            <NButton class="w-72px ml-20px" type="primary" @click="handleReset">重置</NButton>
          </NFormItem>
        </NForm>
        <NSpace class="pb-12px" justify="space-between">
          <NSpace>
            <NButton type="primary" @click="handleAddTable">
              <template #icon>
                <IconIcRoundPlus class="mr-4px text-20px" />
              </template>

              创建批次
            </NButton>
            <NButton type="primary" @click="exportFile">
              <template #icon>
                <IconAntDesignExportOutlined class="mr-4px text-20px" />
              </template>

              导出
            </NButton>
          </NSpace>
          <NSpace align="center" :size="18">
            <NButton size="small" type="primary" @click="getTableData">
              <IconMdiRefresh class="mr-4px text-16px" :class="{ 'animate-spin': loading }" />
              {{ $t('common.refreshTable') }}
            </NButton>
            <ColumnSetting v-model:columns="columns" />
          </NSpace>
        </NSpace>
        <NDataTable remote :columns="columns" :data="tableData" :loading="loading" :pagination="pagination" flex-height
          class="flex-1-hidden" />
        <TableDeviceModal v-model:visible="visible" :pid="props.pid" :type="modalType"
          :edit-data="(editData as unknown as deviceAddType)" @success="getTableData" />
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
