<template>
  <div class="overflow-hidden h-full">
    <n-card :title="$t('page.product.update-ata.otaTitle')" :bordered="false" class="h-full rounded-8px shadow-sm">
      <div class="flex-col h-full">
        <n-form ref="queryFormRef" inline label-placement="left" :model="queryParams">
          <n-form-item :label="$t('page.product.list.deviceConfig')" path="email">
            <n-input v-model:value="queryParams.product_id" />
          </n-form-item>
          <n-form-item :label="$t('page.product.update-package.packageName')" path="name">
            <n-input v-model:value="queryParams.name" />
          </n-form-item>
          <n-form-item>
            <n-button class="w-72px" type="primary" @click="handleQuery">{{ $t('common.search') }}</n-button>
            <n-button class="w-72px ml-20px" type="primary" @click="handleReset">{{ $t('common.reset') }}</n-button>
          </n-form-item>
        </n-form>
        <n-space class="pb-12px" justify="space-between">
          <n-space></n-space>
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
        <n-drawer v-model:show="editPwdVisible" width="80%" placement="right">
          <n-drawer-content :title="$t('page.product.update-ota.lookTask')">
            <device-register :mid="currentMid" />
          </n-drawer-content>
        </n-drawer>
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
import { getOtaPackageList } from '@/service/product/update-package'
import ColumnSetting from './components/column-setting.vue'
import DeviceRegister from './components/device-register.vue'
const { loading, startLoading, endLoading } = useLoading(false)

const { bool: editPwdVisible, setTrue: openConfig } = useBoolean()
const queryParams = reactive({
  name: '',
  product_id: '',
  page: 1,
  page_size: 10
})
const currentMid = ref()
const tableData = ref<productPackageRecord[]>([])
function setTableData(data: productPackageRecord[]) {
  tableData.value = data
}
function handleQuery() {
  init()
}
function handleReset() {
  Object.assign(queryParams, {
    name: '',
    product_id: '',
    page: 1
  })
  handleQuery()
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
  const { data } = await getOtaPackageList(queryParams)
  if (data) {
    const list: productPackageRecord[] = data.list
    setTableData(list)
    pagination.pageCount = Math.ceil(data.total / queryParams.page_size)
    endLoading()
  }
}
const drawerTitle: Ref<string> = ref('')
async function handleRegisterConfig(record: productPackageRecord) {
  currentMid.value = record.id
  openConfig()
  drawerTitle.value = `${record.name}-${$t('page.product.list.preRegister')}`
}
const columns: Ref<DataTableColumns<productPackageRecord>> = ref([
  {
    key: 'name',
    title: $t('page.product.update-package.packageName')
  },
  {
    key: 'target_version',
    title: $t('page.product.update-package.version')
  },
  {
    key: 'version',
    title: $t('page.product.update-package.versionCode')
  },
  {
    key: 'product _id',
    title: $t('page.product.update-package.deviceConfig')
  },
  {
    key: 'package_type',
    title: $t('page.product.update-package.type')
  },
  {
    key: 'module',
    title: $t('page.product.update-package.moduleName')
  },
  {
    key: 'created_at',
    title: $t('page.product.update-package.createTime')
  },
  {
    key: 'description',
    title: $t('page.product.update-package.desc')
  },
  {
    key: 'actions',
    title: $t('common.action'),
    align: 'center',
    render: (row: productPackageRecord) => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} type="primary" onClick={() => handleRegisterConfig(row)}>
            {$t('page.product.update-ota.lookTask')}
          </NButton>
        </NSpace>
      )
    }
  }
]) as Ref<DataTableColumns<productPackageRecord>>

function init() {
  getTableData()
}

// 初始化
init()
</script>

<style scoped></style>
