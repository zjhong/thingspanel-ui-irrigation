<script setup lang="tsx">
import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { NButton } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { getSystemLogList } from '@/service/api/system-management-user';
import { useLoading } from '~/packages/hooks';

const { loading, startLoading, endLoading } = useLoading(false);

const queryParams = reactive({
  name: '',
  selected_time: null
});

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

const getTableData = async () => {
  startLoading();
  const res = await getSystemLogList({
    page: pagination.page || 1,
    page_size: pagination.pageSize || 10,
    username: queryParams.name,
    start_time: undefined,
    end_time: undefined
  });
  console.log(res);
  if (res?.data) {
    setTableData(res?.data.list || []);
  }
  endLoading();
};

const columns: Ref<DataTableColumns<DataService.Data>> = ref([
  {
    key: 'created_at',
    title: '时间',
    align: 'left'
  },
  {
    key: 'ip',
    title: 'IP',
    align: 'left'
  },
  {
    key: 'path',
    title: '请求路径',
    align: 'left'
  },
  {
    key: 'ip',
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
    <NCard title="系统日志" :bordered="false" class="h-full rounded-8px shadow-sm">
      <div class="h-full flex-col">
        <NForm inline label-placement="left" :model="queryParams">
          <NFormItem label="用户名" path="name">
            <NInput v-model:value="queryParams.name" />
          </NFormItem>
          <NFormItem path="selected_time">
            <NDatePicker v-model:value="queryParams.selected_time" type="datetimerange" clearable separator="-" />
          </NFormItem>
          <NButton class="w-72px" type="primary" @click="handleQuery">查询</NButton>
        </NForm>
        <NDataTable
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :pagination="pagination"
          flex-height
          class="flex-1-hidden"
        />
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
