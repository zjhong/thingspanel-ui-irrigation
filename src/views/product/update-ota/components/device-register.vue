<script setup lang="tsx">
import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, NSpace } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { useBoolean, useLoading } from '@sa/hooks';
import { $t } from '@/locales';
import { getStaticUrl } from '@/utils/common/tool';
import { getOtaTaskList } from '@/service/product/update-ota';
import TableDeviceModal from './table-device-modal.vue';
import type { ModalType } from './table-action-modal.vue';
import ColumnSetting from './column-setting.vue';
const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();
const { bool: visibleTable, setTrue: openTable } = useBoolean();
const props = defineProps({
  mid: {
    type: Number,
    required: true
  },
  record: {
    type: Object,
    default: () => {},
    required: true
  }
});

const queryParams = reactive({
  deviceNumber: '',
  batchNumber: '',
  page: 1,
  page_size: 10
});

const activeTab = ref('mission');
const tableData = ref<productDeviceRecord[]>([]);

function setTableData(data: productDeviceRecord[]) {
  tableData.value = data;
}

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

async function getTableData() {
  startLoading();
  const { data } = await getOtaTaskList({
    ...queryParams,
    ota_upgrade_package_id: props.mid
  });
  if (data) {
    const list: productDeviceRecord[] = data.list;
    setTableData(list);
    pagination.pageCount = Math.ceil(data.total / queryParams.page_size);
    endLoading();
  }
}

const columns: Ref<DataTableColumns<productDeviceRecord>> = ref([
  // 任务名称
  {
    key: 'name',
    title: $t('page.product.update-ota.taskName')
  },
  // 设备数量
  {
    key: 'device_count',
    title: $t('page.product.update-ota.deviceNum')
  },
  // 描述
  {
    key: 'description',
    title: $t('page.product.update-ota.desc')
  },
  // 创建日期
  {
    key: 'created_at',
    title: $t('page.product.update-ota.createTime')
  },
  {
    key: 'actions',
    title: $t('common.action'),
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} type="primary" onClick={() => handleEditTable(row)}>
            {$t('page.product.update-ota.taskDetail')}
          </NButton>
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
const rowData = ref<productDeviceRecord | null>(null);
function handleEditTable(row) {
  rowData.value = row;
  setModalType('edit');
  openTable();
}

function init() {
  getTableData();
}

// 初始化
init();

const downloadPackage = () => {
  const url = getStaticUrl(props.record.package_url);
  if (url) {
    window.open(url);
  }
};
</script>

<template>
  <div class="h-full overflow-hidden">
    <NCard class="h-full">
      <div class="h-full flex-col">
        <NTabs v-model:value="activeTab" type="line" animated>
          <NTabPane name="mission" tab="任务列表"></NTabPane>
          <NTabPane name="info" tab="升级包信息"></NTabPane>
        </NTabs>
        <NSpace v-if="activeTab === 'mission'" class="pb-12px" justify="space-between">
          <NSpace>
            <NButton type="primary" @click="handleAddTable">
              <IconIcRoundPlus class="mr-4px text-20px" />
              {{ $t('page.product.update-ota.updateTask') }}
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
        <NDataTable
          v-if="activeTab === 'mission'"
          remote
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :pagination="pagination"
          flex-height
          class="flex-1-hidden"
        />
        <div v-if="activeTab === 'info'">
          <NForm label-placement="left" :model="props.record">
            <NGrid :cols="24" :x-gap="18">
              <NFormItemGridItem :span="24" label="签名算法：" path="signature_type">
                {{ props.record.signature_type || '-' }}
              </NFormItemGridItem>
            </NGrid>
            <NGrid :cols="24" :x-gap="18">
              <NFormItemGridItem :span="24" label="升级包签名：" path="signature">
                <NSpace class="w-full" :size="24" align="center">
                  {{ props.record.signature || '-' }}
                  <NButton class="w-72px" type="primary" @click="downloadPackage">下载</NButton>
                </NSpace>
              </NFormItemGridItem>
            </NGrid>
            <NGrid :cols="24" :x-gap="24">
              <NFormItemGridItem :span="24" label="自定义信息：" path="additional_info">
                {{ props.record.additional_info || '-' }}
              </NFormItemGridItem>
            </NGrid>
          </NForm>
        </div>
        <TableDeviceModal
          v-model:visible="visible"
          :type="modalType"
          :pid="props.record.id"
          :edit-data="editData as unknown as UpgradeTaskCreate"
          @success="getTableData"
        />
        <TableDetailModal
          v-model:visible="visibleTable"
          :type="modalType"
          :edit-data="rowData as unknown as UpgradeTaskCreate"
        />
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
