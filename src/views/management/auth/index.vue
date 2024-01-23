<template>
  <div class="overflow-hidden">
    <n-card title="权限管理" :bordered="false" class="h-full rounded-8px shadow-sm">
      <template #header-extra>
        <n-button type="primary" @click="handleAddTable">
          <icon-ic-round-plus class="mr-4px text-20px" />
          添加权限
        </n-button>
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
        <table-action-modal v-model:visible="visible" :type="modalType" :edit-data="editData" :table-list="tableData" />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue'
import type { Ref } from 'vue'
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui'
import type { DataTableColumns, PaginationProps } from 'naive-ui'
import { routerSysFlagLabels, routerTypeLabels } from '@/constants'
import { useBoolean, useLoading } from '@/hooks'
import { fetchAllRoutes } from '@/service/demo'
import { $t } from '@/locales'
import TableActionModal from './components/table-action-modal.vue'
import type { ModalType } from './components/table-action-modal.vue'

const { loading, startLoading, endLoading } = useLoading(false)
const { bool: visible, setTrue: openModal } = useBoolean()

const tableData = ref<CustomRoute.Route[]>([])
function setTableData(data: CustomRoute.Route[]) {
  tableData.value = data
}

async function getTableData() {
  startLoading()
  const { data } = await fetchAllRoutes()
  if (data) {
    setTimeout(() => {
      setTableData(data)
      endLoading()
    }, 1000)
  }
}

const columns: Ref<DataTableColumns<CustomRoute.Route>> = ref([
  // {
  //   type: 'selection',
  //   align: 'center'
  // },
  {
    key: 'meta.i18nTitle',
    title: '标题',
    align: 'left',
    render: row => {
      if (row.meta.i18nTitle) {
        return <span>{$t(row.meta.i18nTitle)}</span>
      }
      return <span></span>
    }
  },
  {
    key: 'name',
    title: '名称',
    align: 'left'
  },
  {
    key: 'icon',
    title: '图标',
    align: 'left',
    render: row => {
      if (row.meta.icon) {
        return <svg-icon icon={row.meta.icon} />
      }
      return <span></span>
    }
  },
  {
    key: 'path',
    title: 'url',
    align: 'left'
  },
  {
    key: 'component',
    title: '组件',
    align: 'left'
  },
  {
    key: 'type',
    title: '类型',
    align: 'left',
    render: row => {
      if (row.type) {
        const tagTypes: Record<CustomRoute.routerTypeKey, NaiveUI.ThemeColor> = {
          '1': 'success',
          '2': 'error',
          '3': 'warning',
          '4': 'default'
        }
        return <NTag type={tagTypes[row.type]}>{routerTypeLabels[row.type]}</NTag>
      }
      return <span></span>
    }
  },
  {
    key: 'sys_flag',
    title: '访问标识',
    align: 'left',
    render: row => {
      if (row.sys_flag) {
        const tagTypes: Record<CustomRoute.routerSysFlagKey, NaiveUI.ThemeColor> = {
          '1': 'success',
          '2': 'error',
          '3': 'warning'
        }
        return <NTag type={tagTypes[row.sys_flag]}>{routerSysFlagLabels[row.sys_flag]}</NTag>
      }
      return <span></span>
    }
  },
  {
    key: 'describe',
    title: '描述',
    align: 'left'
  },
  {
    key: 'actions',
    title: '操作',
    align: 'left',
    render: row => {
      return (
        <NSpace>
          <NButton type="primary" size={'small'} onClick={() => handleEditTable(row.id)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row.id)}>
            {{
              default: () => '确认删除',
              trigger: () => (
                <NButton type="error" size={'small'}>
                  删除
                </NButton>
              )
            }}
          </NPopconfirm>
        </NSpace>
      )
    }
  }
]) as Ref<DataTableColumns<CustomRoute.Route>>

const modalType = ref<ModalType>('add')

function setModalType(type: ModalType) {
  modalType.value = type
}

const editData = ref<CustomRoute.Route | null>(null)

function setEditData(data: CustomRoute.Route | null) {
  editData.value = data
}

function handleAddTable() {
  openModal()
  setModalType('add')
}

function handleEditTable(rowId: string) {
  const findItem = tableData.value.find(item => item.id === rowId)
  if (findItem) {
    setEditData(findItem)
  }
  setModalType('edit')
  openModal()
}

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

function init() {
  getTableData()
}

// 初始化
init()
</script>

<style scoped></style>
