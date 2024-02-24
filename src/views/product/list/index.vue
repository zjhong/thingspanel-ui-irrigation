<template>
  <div class="overflow-hidden">
    <n-card :title="$t('page.product.list.productList')" :bordered="false" class="h-full rounded-8px shadow-sm">
      <div class="flex-col h-full">
        <n-space class="pb-12px" justify="space-between">
          <n-space>
            <n-button type="primary" @click="handleAddTable">
              <icon-ic-round-plus class="mr-4px text-20px" />
              {{ $t('common.add') }}
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
          remote
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :pagination="pagination"
          flex-height
          class="flex-1-hidden"
        />
        <table-action-modal v-model:visible="visible" :type="modalType" :edit-data="editData" @success="getTableData" />
        <!-- <edit-password-modal v-model:visible="editPwdVisible" :edit-data="editData"
					@success="getTableData"></edit-password-modal> -->
      </div>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue'
import type { Ref } from 'vue'
import { NButton, NPopconfirm, NSpace } from 'naive-ui'
import type { DataTableColumns, PaginationProps } from 'naive-ui'
import moment from 'moment'
import { useBoolean, useLoading } from '@/hooks'
import { $t } from '@/locales'
import { deleteProduct, getProductList } from '@/service/product/list'
import TableActionModal from './components/table-action-modal.vue'
import type { ModalType } from './components/table-action-modal.vue'
import ColumnSetting from './components/column-setting.vue'
const { loading, startLoading, endLoading } = useLoading(false)
const { bool: visible, setTrue: openModal } = useBoolean()
// const { bool: editPwdVisible } = useBoolean()

const queryParams = reactive<QueryFormModel>({
  name: '',
  page: 1,
  page_size: 10
})

const tableData = ref<productRecord[]>([])
function setTableData(data: productRecord[]) {
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
  const { data } = await getProductList(queryParams)
  if (data) {
    const list: productRecord[] = data.list
    setTableData(list)
    pagination.pageCount = Math.ceil(data.total / queryParams.page_size)
    endLoading()
  }
}
async function handleRegisterConfig(id: number) {
  return id
}
const columns: Ref<DataTableColumns<productRecord>> = ref([
  {
    key: 'name',
    title: $t('page.product.list.productName')
  },
  {
    key: 'device_type',
    title: $t('page.product.list.deviceType')
  },
  {
    key: 'product_model',
    title: $t('page.product.list.productNumber')
  },
  {
    key: 'device_config_id',
    title: $t('page.product.list.deviceConfig')
  },
  {
    key: 'description',
    title: $t('page.product.list.productDesc')
  },
  {
    key: 'created_at',
    title: $t('page.product.list.createTime'),
    render: row => {
      return moment(row.created_at).format('YYYY-MM-DD hh:mm:ss')
    }
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
          <NButton size={'small'} type="primary" onClick={() => handleRegisterConfig(row.id)}>
            {$t('page.product.list.register')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row.id)}>
            {{
              default: () => {
                $t('common.deleteConfirm')
              },
              trigger: () => (
                <NButton type="error" size={'small'}>
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </NSpace>
      )
    }
  }
]) as Ref<DataTableColumns<productRecord>>

const modalType = ref<ModalType>('add')

function setModalType(type: ModalType) {
  modalType.value = type
}

const editData = ref<productRecord | null>(null)

function setEditData(data: productRecord | null) {
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

async function handleDeleteTable(rowId: number) {
  const data = await deleteProduct(rowId)
  if (!data.error) {
    window.$message?.success($t('common.deleteSuccess'))
    getTableData()
  }
}

function init() {
  getTableData()
}

// 初始化
init()
</script>

<style scoped></style>
