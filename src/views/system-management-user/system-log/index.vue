<script setup lang="tsx">
import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { NButton } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { getSystemLogList } from '@/service/api/system-management-user';
import { $t } from '@/locales';
import { useLoading } from '~/packages/hooks';

const { loading, startLoading, endLoading } = useLoading(false);

const queryParams = reactive({
  username: '',
  selected_time: null
});
const total = ref(0);

const tableData = ref<Api.SystemManage.SystemLogList[]>([]);

function setTableData(data: Api.SystemManage.SystemLogList[] | []) {
  tableData.value = data || [];
}

const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  }
});

const formatTime = (time: string | null) => {
  if (time) {
    return new Date(time + 8 * 60 * 60 * 1000).toISOString().toString();
  }
  return '';
};

const getTableData = async () => {
  startLoading();
  const start_time = queryParams.selected_time ? queryParams.selected_time[0] : null;
  const end_time = queryParams.selected_time ? queryParams.selected_time[1] : null;
  const prams = {
    page: pagination.page || 1,
    page_size: pagination.pageSize || 10,
    username: queryParams.username,
    start_time: formatTime(start_time),
    end_time: formatTime(end_time)
  };
  const res = await getSystemLogList(prams);
  console.log(res);
  if (res?.data) {
    setTableData(res?.data.list || []);
    total.value = res.data.total || 0;
  }
  endLoading();
};

const columns: Ref<DataTableColumns<DataService.Data>> = ref([
  {
    key: 'created_at',
    title: '时间',
    align: 'left',
    width: '280'
  },
  {
    key: 'ip',
    title: 'IP',
    align: 'left'
  },
  {
    key: 'path',
    title: '请求路径',
    align: 'left',
    width: '200'
  },
  {
    key: 'name',
    title: '请求方法',
    align: 'left'
  },
  {
    key: 'latency',
    title: '请求耗时',
    align: 'left'
  },
  {
    key: 'username',
    title: '用户名',
    align: 'left'
  }
]) as Ref<DataTableColumns<DataService.Data>>;

function handleQuery() {
  getTableData();
}

getTableData();
</script>

<template>
  <div class="overflow-hidden">
    <NCard :title="$t('generate.system-log')" :bordered="false" class="h-full rounded-8px shadow-sm">
      <div class="h-full flex-col">
        <NForm inline label-placement="left" :model="queryParams">
          <NFormItem :label="$t('generate.username')" path="name">
            <NInput v-model:value="queryParams.username" />
          </NFormItem>
          <NFormItem path="selected_time">
            <NDatePicker v-model:value="queryParams.selected_time" type="datetimerange" clearable separator="-" />
          </NFormItem>
          <NButton class="w-72px" type="primary" @click="handleQuery">{{ $t('generate.query') }}</NButton>
        </NForm>
        <NDataTable :columns="columns" :data="tableData" :loading="loading" flex-height class="flex-1-hidden" />
        <div class="pagination-box">
          <NPagination v-model:page="pagination.page" :item-count="total" @update:page="getTableData" />
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.pagination-box {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
