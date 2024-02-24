<template>
  <div class="overflow-hidden">
    <n-card title="服务管理" :bordered="false" class="h-full rounded-8px shadow-sm">
      <template #header-extra>
        <n-button type="primary" @click="handleAddTable">新增</n-button>
      </template>
      <div class="flex-col h-full">
        <n-data-table
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :pagination="pagination"
          flex-height
          class="flex-1-hidden"
        />
        <table-action-modal
          v-model:visible="visible"
          :type="modalType"
          :edit-data="editData"
          @get-table-data="getTableData"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue'
import type { Ref } from 'vue'
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui'
import type { DataTableColumns, PaginationProps } from 'naive-ui'
import { serviceManagementStatusLabels, serviceManagementTypeLabels } from '@/constants'
import { useBoolean, useLoading } from '@/hooks'
import { fetchServiceManagementList } from '@/service/demo'
import { $t } from '~/src/locales'
import type { ModalType } from './components/table-action-modal.vue'
import TableActionModal from './components/table-action-modal.vue'

const { loading, startLoading, endLoading } = useLoading(false)
const { bool: visible, setTrue: openModal } = useBoolean()

const tableData = ref<ServiceManagement.Service[]>([])
function setTableData(data: ServiceManagement.Service[]) {
  tableData.value = data
}

async function getTableData() {
  startLoading()
  const { data } = await fetchServiceManagementList()
  if (data) {
    setTimeout(() => {
      setTableData(data)
      endLoading()
    }, 1000)
  }
}

const columns: Ref<DataTableColumns<ServiceManagement.Service>> = ref([
  {
    key: 'index',
    title: '序号',
    align: 'center',
    width: '100px'
  },
  {
    key: 'name',
    title: '服务名称',
    align: 'left'
  },
  {
    key: 'serviceType',
    title: '服务类别',
    align: 'left',
    render: row => {
      if (row.serviceType) {
        return <span>{serviceManagementTypeLabels[row.serviceType]}</span>
      }
      return <span></span>
    }
  },
  {
    key: 'desc',
    title: '介绍',
    align: 'left'
  },
  {
    key: 'author',
    title: '作者',
    align: 'left'
  },
  {
    key: 'version',
    title: '版本',
    align: 'left'
  },
  {
    key: 'status',
    title: '状态',
    align: 'left',
    render: row => {
      if (row.status) {
        const tagTypes: Record<ServiceManagement.StatusKey, NaiveUI.ThemeColor> = {
          '1': 'success',
          '2': 'warning'
        }
        return <NTag type={tagTypes[row.status]}>{serviceManagementStatusLabels[row.status]}</NTag>
      }
      return <span></span>
    }
  },
  {
    key: 'actions',
    title: '操作',
    align: 'center',
    width: '300px',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} type="primary" onClick={() => handleUseConfig(row.id)}>
            使用配置
          </NButton>
          <NButton size={'small'} type="primary" onClick={() => handleRegisterConfig(row.id)}>
            注册配置
          </NButton>
          {/* <NButton size={'small'} type="primary" onClick={() => handleEditTable(row.id)}>
            编辑
          </NButton> */}
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row.id)}>
            {{
              default: () => $t('common.deleteConfirm'),
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
]) as Ref<DataTableColumns<ServiceManagement.Service>>

const modalType = ref<ModalType>('add')

function setModalType(type: ModalType) {
  modalType.value = type
}

const editData = ref<ServiceManagement.Service | null>(null)

// function setEditData(data: ServiceManagement.Service | null) {
//   editData.value = data
// }

function handleAddTable() {
  openModal()
  setModalType('add')
}

// function handleEditTable(rowId: string) {
//   const findItem = tableData.value.find(item => item.id === rowId)
//   if (findItem) {
//     setEditData(findItem)
//   }
//   setModalType('edit')
//   openModal()
// }

function handleDeleteTable(rowId: string) {
  window.$message?.info(`点击了删除，rowId为${rowId}`)
}

const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  }
})

function handleUseConfig(id: string) {
  console.log(id)
}

function handleRegisterConfig(id: string) {
  console.log(id)
}

function init() {
  getTableData()
}

// 初始化
init()
</script>

<style scoped></style>
