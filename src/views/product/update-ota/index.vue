<template>
  <div class="overflow-hidden">
    <n-card :title="$t('page.product.update-ota.otaTitle')" :bordered="false" class="h-full rounded-8px shadow-sm">
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
          <n-drawer-content :title="drawerTitle">
            <device-register />
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
import moment from 'moment'
import { useBoolean, useLoading } from '@/hooks'
import { $t } from '@/locales'
import { getOtaTaskList } from '~/src/service/product/update-ota'
import ColumnSetting from './components/column-setting.vue'
import DeviceRegister from './components/device-register.vue'
const { loading, startLoading, endLoading } = useLoading(false)
const { bool: editPwdVisible, setTrue: openConfig } = useBoolean()

const queryParams = reactive<QueryFormModel & { product_id: string }>({
  name: '',
  product_id: '',
  page: 1,
  page_size: 10
})

const tableData = ref<otaRecord[]>([])
function setTableData(data: otaRecord[]) {
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
  const { data } = await getOtaTaskList(queryParams)
  if (data) {
    const list: otaRecord[] = data.list
    setTableData(list)
    pagination.pageCount = Math.ceil(data.total / queryParams.page_size)
    endLoading()
  }
}
const drawerTitle: Ref<string> = ref('')
async function handleRegisterConfig(record: otaRecord) {
  openConfig()
  drawerTitle.value = `${record.name}-${$t('page.product.list.preRegister')}`
}
const columns: Ref<DataTableColumns<otaRecord>> = ref([
  {
    // 升级包名称
    key: 'name',
    title: $t('page.product.update-ota.packageName')
  },
  // 待升级版本号
  {
    key: 'device_type',
    title: $t('page.product.update-ota.version')
  },
  // 升级包版本号 设备配置
  {
    key: 'product_model',
    title: $t('page.product.update-ota.versionCode')
  },
  // 升级包类型
  {
    key: 'device_config_id',
    title: $t('page.product.update-ota.type')
  },
  // 模块名称
  {
    key: 'description',
    title: $t('page.product.update-ota.moduleName')
  },
  // 添加日期
  {
    key: 'created_at',
    title: $t('page.product.update-ota.createTime'),
    render: row => {
      return moment(row.created_at).format('YYYY-MM-DD hh:mm:ss')
    }
  },
  // 描述
  {
    key: 'description',
    title: $t('page.product.update-ota.desc')
  },
  {
    key: 'actions',
    title: $t('common.action'),
    align: 'center',
    width: '300px',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} type="primary" onClick={() => handleRegisterConfig(row)}>
            {$t('page.product.list.register')}
          </NButton>
        </NSpace>
      )
    }
  }
]) as Ref<DataTableColumns<otaRecord>>

function init() {
  getTableData()
}

// 初始化
init()
</script>

<style scoped></style>
