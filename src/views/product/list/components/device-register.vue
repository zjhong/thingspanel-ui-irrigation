<script setup lang="tsx">
import { reactive, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { NButton, NPopconfirm, NSpace } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { useBoolean, useLoading } from '@sa/hooks';
import { $t } from '@/locales';
import { deleteProduct, exportDevice, getDeviceList } from '@/service/product/list';
import TableDeviceModal from './table-device-modal.vue';
import type { ModalType } from './table-action-modal.vue';
import ColumnSetting from './column-setting.vue';
const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();

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
const tableData = ref<productDeviceRecord[]>([]);
function setTableData(data: productDeviceRecord[]) {
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
    const list: productDeviceRecord[] = data.list;
    setTableData(list);
    pagination.pageCount = Math.ceil(data.total / queryParams.page_size);
    endLoading();
  }
}
const columns: Ref<DataTableColumns<productDeviceRecord>> = ref([
  {
    key: 'name',
    title: $t('page.product.list.deviceNumber')
  },
  {
    key: 'device_type',
    title: $t('page.product.list.batchNumber')
  },
  {
    key: 'product_model',
    title: $t('page.product.list.firmwareVersion')
  },
  {
    key: 'device_config_id',
    title: $t('page.product.list.firmwareVersion')
  },
  {
    key: 'description',
    title: $t('page.product.list.onlineDate')
  },
  {
    key: 'created_at',
    title: $t('page.product.list.activeStatus')
  },
  {
    key: 'updated_at',
    title: $t('page.product.list.activeDate')
  },
  {
    key: 'actions',
    title: $t('page.product.list.operate'),
    align: 'center',
    width: '300px',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} type="primary" onClick={() => handleEditTable(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" size={'small'}>
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
]) as Ref<DataTableColumns<productDeviceRecord>>;

const modalType = ref<ModalType>('add');

function setModalType(type: ModalType) {
  modalType.value = type;
}

const editData = ref<productDeviceRecord | null>(null);

function setEditData(data: productDeviceRecord | null) {
  editData.value = data;
}

function handleAddTable() {
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

function handleEditTable(rowId: string) {
  const findItem = tableData.value.find(item => item.id === rowId);
  if (findItem) {
    setEditData(findItem);
  }
  setModalType('edit');
  openModal();
}

async function handleDeleteTable(rowId: string) {
  const data = await deleteProduct(rowId);
  if (!data.error) {
    window.$message?.success($t('common.deleteSuccess'));
    getTableData();
  }
}

function init() {
  getTableData();
}

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
