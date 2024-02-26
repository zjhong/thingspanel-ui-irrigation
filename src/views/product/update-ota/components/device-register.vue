<template>
  <div class="overflow-hidden h-full">
    <n-card class="h-full">
      <div class="flex-col h-full">
        <n-tabs v-model:value="activeTab" type="line" animated>
          <n-tab-pane name="mission" tab="任务列表"></n-tab-pane>
          <n-tab-pane name="info" tab="升级包信息"></n-tab-pane>
        </n-tabs>
        <n-space v-if="activeTab === 'mission'" class="pb-12px" justify="space-between">
          <n-space>
            <n-button type="primary" @click="handleAddTable">
              <icon-ic-round-plus class="mr-4px text-20px" />
              {{ $t('page.product.update-ota.updateTask') }}
            </n-button>
          </n-space>
          <n-space align="center" :size="18">
            <n-button size="small" type="primary" @click="getTableData">
              <icon-mdi-refresh class="mr-4px text-16px" :class="{ 'animate-spin': loading }" />
              {{ $t('common.refreshTable') }}
            </n-button>
            <column-setting v-model:columns="columns" />
          </n-space>
        </n-space>
        <n-data-table
          v-if="activeTab === 'mission'"
          remote
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :pagination="pagination"
          flex-height
          class="flex-1-hidden"
        />
        <div v-if="activeTab === 'info'">info</div>
        <table-device-modal v-model:visible="visible" :type="modalType" :edit-data="editData" @success="getTableData" />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue'
import type { Ref } from 'vue'
import { NButton, NSpace } from 'naive-ui'
import type { DataTableColumns, PaginationProps } from 'naive-ui'
import { useBoolean, useLoading } from '@/hooks'
import { $t } from '@/locales'
import { getOtaTaskList } from '~/src/service/product/update-ota'
import TableDeviceModal from './table-device-modal.vue'
import type { ModalType } from './table-action-modal.vue'
import ColumnSetting from './column-setting.vue'
const { loading, startLoading, endLoading } = useLoading(false)
const { bool: visible, setTrue: openModal } = useBoolean()
const props = defineProps({
  mid: {
    type: Number,
    required: true
  }
})
const queryParams = reactive({
  deviceNumber: '',
  batchNumber: '',
  page: 1,
  page_size: 10
})
const activeTab = ref('mission')
const tableData = ref<productDeviceRecord[]>([])
function setTableData(data: productDeviceRecord[]) {
  tableData.value = data
}

const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination.page = page
    queryParams.page = page
    getTableData()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    queryParams.page = 1
    queryParams.page_size = pageSize
    getTableData()
  }
})

async function getTableData() {
  startLoading()
  const { data } = await getOtaTaskList({ ...queryParams, ota_upgrade_package_id: props.mid })
  if (data) {
    const list: productDeviceRecord[] = data.list
    setTableData(list)
    pagination.pageCount = Math.ceil(data.total / queryParams.page_size)
    endLoading()
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
    key: 'device_type',
    title: $t('page.product.update-ota.deviceNum')
  },
  // 描述
  {
    key: 'product_model',
    title: $t('page.product.update-ota.desc')
  },
  // 创建日期
  {
    key: 'device_config_id',
    title: $t('page.product.update-ota.createTime')
  },
  {
    key: 'actions',
    title: $t('common.action'),
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} type="primary" onClick={() => handleEditTable(row.id)}>
            {$t('page.product.update-ota.taskDetail')}
          </NButton>
        </NSpace>
      )
    }
  }
]) as Ref<DataTableColumns<productDeviceRecord>>

const modalType = ref<ModalType>('add')

function setModalType(type: ModalType) {
  modalType.value = type
}

const editData = ref<productDeviceRecord | null>(null)

function setEditData(data: productDeviceRecord | null) {
  editData.value = data
}

function handleAddTable() {
  openModal()
  setModalType('add')
}

// function handleEditPwd(rowId: string) {
// 	const findItem = tableData.value.find((item) => item.id === rowId);
// 	if (findItem) {
// 		setEditData(findItem);
// 	}
// 	openEditPwdModal();
// }

function handleEditTable(rowId: number) {
  const findItem = tableData.value.find(item => item.id === rowId)
  if (findItem) {
    setEditData(findItem)
  }
  setModalType('edit')
  openModal()
}

function init() {
  getTableData()
}

// 初始化
init()
</script>

<style scoped></style>
