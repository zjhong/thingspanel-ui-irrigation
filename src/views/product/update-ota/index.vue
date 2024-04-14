<script setup lang="tsx">
import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, NSpace } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { useBoolean, useLoading } from '@sa/hooks';
import { $t } from '@/locales';
import { getOtaPackageList } from '@/service/product/update-package';
import { getDeviceConfigList } from '@/service/api/device';
import ColumnSetting from './components/column-setting.vue';
import DeviceRegister from './components/device-register.vue';
const { loading, startLoading, endLoading } = useLoading(false);

const { bool: editPwdVisible, setTrue: openConfig } = useBoolean();
const queryParams = reactive({
  name: '',
  device_config_id: '',
  page: 1,
  page_size: 10
});
const currentMid = ref();
const tableData = ref<productPackageRecord[]>([]);
function setTableData(data: productPackageRecord[]) {
  tableData.value = data;
}
function handleQuery() {
  init();
}
function handleReset() {
  Object.assign(queryParams, {
    name: '',
    device_config_id: '',
    page: 1
  });
  handleQuery();
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
  const { data } = await getOtaPackageList(queryParams);
  if (data) {
    const list: productPackageRecord[] = data.list;
    setTableData(list);
    pagination.pageCount = Math.ceil(data.total / queryParams.page_size);
    endLoading();
  }
}
const drawerTitle: Ref<string> = ref('');
const editData = ref<productPackageRecord>();
async function handleRegisterConfig(record: productPackageRecord) {
  currentMid.value = record.id;
  editData.value = record;
  openConfig();
  drawerTitle.value = `${record.name}-${$t('page.product.list.preRegister')}`;
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
    key: 'device_config_name',
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
      );
    }
  }
]) as Ref<DataTableColumns<productPackageRecord>>;

const deviceOptions = ref();

const getList = async (name?: string) => {
  const { data, error } = await getDeviceConfigList({
    page: 1,
    page_size: 99,
    name
  });
  if (!error && data) {
    deviceOptions.value = data?.list||[];
  }
};
function init() {
  getList();
  getTableData();
}

// 初始化
init();
</script>

<template>
  <div class="h-full overflow-hidden">
    <NCard :title="$t('page.product.update-ota.otaTitle')" :bordered="false" class="h-full rounded-8px shadow-sm">
      <div class="h-full flex-col">
        <NForm ref="queryFormRef" inline label-placement="left" :model="queryParams">
          <NGrid :cols="24" :x-gap="18">
            <NFormItemGridItem :span="6" :label="$t('page.product.list.deviceConfig')" path="email">
              <NSelect
                v-model:value="queryParams.device_config_id"
                filterable
                :options="deviceOptions"
                label-field="name"
                value-field="id"
                @search="getList"
              />
            </NFormItemGridItem>
            <NFormItemGridItem :span="6" :label="$t('page.product.update-package.packageName')" path="name">
              <NInput v-model:value="queryParams.name" />
            </NFormItemGridItem>
            <NFormItemGridItem>
              <NButton class="w-72px" type="primary" @click="handleQuery">{{ $t('common.search') }}</NButton>
              <NButton class="ml-20px w-72px" type="primary" @click="handleReset">{{ $t('common.reset') }}</NButton>
            </NFormItemGridItem>
          </NGrid>
        </NForm>
        <NSpace class="pb-12px" justify="space-between">
          <NSpace></NSpace>
          <NSpace align="center" :size="18">
            <NButton size="small" type="primary" @click="getTableData">
              <IconMdiRefresh class="mr-4px text-16px" :class="{ 'animate-spin': loading }" />
              {{ $t('common.refreshTable') }}
            </NButton>
            <ColumnSetting v-model:columns="columns" />
          </NSpace>
        </NSpace>
        <NDataTable
          remote
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :pagination="pagination"
          flex-height
          class="flex-1-hidden"
        />
        <NDrawer v-model:show="editPwdVisible" display-directive="show" width="80%" placement="right">
          <NDrawerContent :title="$t('page.product.update-ota.lookTask')" closable>
            <DeviceRegister :mid="currentMid" :record="editData" />
          </NDrawerContent>
        </NDrawer>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
