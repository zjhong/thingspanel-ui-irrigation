<template>
  <div class="overflow-hidden">
    <n-card :title="$t('routes.management.auth')" :bordered="false" class="h-full rounded-8px shadow-sm">
      <template #header-extra>
        <n-button type="primary" @click="handleAddTable">
          <icon-ic-round-plus class="mr-4px text-20px" />
          {{ $t('common.add') }}
        </n-button>
      </template>
      <div class="flex-col h-full">
        <n-data-table
          :row-key="rowKey"
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
          :table-list="tableData"
          @success="getTableData"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref, h } from 'vue'
import type { Ref } from 'vue'
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui'
import type { DataTableColumns, PaginationProps } from 'naive-ui'
import { routerSysFlagLabels, routerTypeLabels } from '@/constants'
import { fetchElementList, delElement } from '@/service'
import { useBoolean, useLoading } from '@/hooks'
import { deepClone } from '@/utils'
import { $t } from '@/locales'
import TableActionModal from './components/table-action-modal.vue'
import type { ModalType } from './components/table-action-modal.vue'

const { loading, startLoading, endLoading } = useLoading(false)
const { bool: visible, setTrue: openModal } = useBoolean()

type QueryFormModel = {
  page: number
  page_size: number
}

const queryParams = reactive<QueryFormModel>({
  page: 1,
  page_size: 10
})

const tableData = ref<CustomRoute.Route[]>([])
function setTableData(data: CustomRoute.Route[]) {
  tableData.value = data
}

async function getTableData() {
  startLoading()
  const { data } = await fetchElementList(queryParams)
  if (data) {
    const list: ApiCustomRoute.Route[] = data.list
    setTableData(list)
    endLoading()
  }
}

const rowKey = (row: CustomRoute.Route) => {
  return row.id
}

const columns: Ref<DataTableColumns<CustomRoute.Route>> = ref([
  {
    key: 'description',
    title: () => $t('page.management.auth.form.title'),
    align: 'left',
    width: '200px',
    render: row => {
      if (row.multilingual && row.multilingual !== 'default') {
        return <span>{$t(row.multilingual)}</span>
      }
      return <span>{row.description}</span>
    }
  },

  {
    key: 'param2',
    title: () => $t('page.management.auth.form.icon'),
    align: 'left',
    render: row => {
      if (row.param2) {
        return <svg-icon icon={row.param2} />
      }
      return <span></span>
    }
  },
  {
    key: 'element_code',
    title: () => $t('page.management.auth.form.name'),
    align: 'left'
  },
  {
    key: 'param1',
    title: () => $t('page.management.auth.form.path'),
    align: 'left'
  },
  {
    key: 'param3',
    title: () => $t('page.management.auth.form.componentType'),
    align: 'left'
  },
  {
    key: 'element_type',
    title: () => $t('page.management.auth.form.type'),
    align: 'left',
    render: row => {
      if (row.element_type) {
        const tagTypes: Record<CustomRoute.routerTypeKey, NaiveUI.ThemeColor> = {
          '1': 'success',
          '2': 'error',
          '3': 'warning',
          '4': 'default'
        }
        return <NTag type={tagTypes[row.element_type]}>{routerTypeLabels[row.element_type]}</NTag>
      }
      return <span></span>
    }
  },
  {
    key: 'authority',
    title: () => $t('page.management.auth.form.authority'),
    align: 'left',
    render: row => {
      if (row.authority && row.authority.length) {
        const tags = row.authority.map((tagKey: string) => {
          return h(
            NTag,
            {
              type: 'success'
            },
            {
              default: () => routerSysFlagLabels[tagKey]
            }
          )
        })
        return tags
      }
      return <span></span>
    }
  },
  {
    key: 'remark',
    title: () => $t('common.remark'),
    align: 'left'
  },
  {
    key: 'actions',
    title: () => $t('common.action'),
    align: 'left',
    render: row => {
      return (
        <NSpace>
          <NButton type="primary" size={'small'} onClick={() => handleEditTable(row)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm
            negative-text={$t('common.cancel')}
            positive-text={$t('common.confirm')}
            onPositiveClick={() => handleDeleteTable(row.id)}
          >
            {{
              default: () => $t('common.confirm'),
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
]) as Ref<DataTableColumns<CustomRoute.Route>>

const modalType = ref<ModalType>('add')

function setModalType(type: ModalType) {
  modalType.value = type
}

const editData = ref<CustomRoute.Route | null>(null)

function handleAddTable() {
  openModal()
  setModalType('add')
}

function handleEditTable(row: any) {
  editData.value = deepClone(row)
  setModalType('edit')
  openModal()
}

async function handleDeleteTable(rowId: string) {
  const data = await delElement(rowId)
  if (!data.error) {
    window.$message?.success($t('common.deleteSuccess'))
    getTableData()
  }
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

function init() {
  getTableData()
}

// 初始化
init()
</script>

<style scoped></style>
