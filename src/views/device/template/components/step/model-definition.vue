<script setup lang="tsx">
import { ref, reactive } from "vue"
const emit = defineEmits(['update:stepCurrent', 'update:modalVisible']);
import type { PaginationProps } from 'naive-ui';
import { test, attribute, events, command } from "./tableList";
import { useLoading } from '@sa/hooks';
import { NButton, NSpace } from 'naive-ui';
import { $t } from "@/locales";
const { loading, startLoading, endLoading } = useLoading(false);
import { telemetryApi, attributesApi, eventsApi, commandsApi } from '@/service/api/system-data'

const props = defineProps({
  stepCurrent: {
    type: Number,
    required: true,
  },
  modalVisible: {
    type: Boolean,
    required: true
  },
  DeviceTemplateId: {
    type: String,
    required: true,
  }
});
let addAndEditModalVisible = ref<boolean>(false)
let addAndEditTitle = ref<string>('新增/编辑遥测')

const queryParams: any = reactive({
  page: 1,
  page_size: 10,
  device_template_id: props.DeviceTemplateId,
});
let tabsCurrent: any = ref('telemetry')

const columnsList: any = reactive([
  {
    addBtn: () => {
      addAndEditModalVisible.value = true
    },
    data: [],
    name: 'telemetry',
    text: '遥测',
    col: [
      ...test.value,
      {
        key: 'actions',
        width: 350,
        title: () => $t('common.action'),
        align: 'center',
        render: row => {
          return (
            <NSpace justify={'center'}>
              <NButton quaternary type="primary" size={'small'} onClick={() => handleEditTable(row.id)}>
                {$t('common.edit')}
              </NButton>
              <NButton quaternary type="primary" size={'small'} onClick={() => handleEditTable(row.id)}>
                {$t('common.delete')}
              </NButton>
            </NSpace>
          );
        }
      }
    ]
  },
  {
    data: [],
    name: 'attributes',
    text: '属性',
    col: [
      ...attribute.value,
      {
        key: 'actions',
        width: 350,
        title: () => $t('common.action'),
        align: 'center',
        render: row => {
          return (
            <NSpace justify={'center'}>
              <NButton quaternary type="primary" size={'small'} onClick={() => handleEditTable(row.id)}>
                {$t('common.edit')}
              </NButton>
              <NButton quaternary type="primary" size={'small'} onClick={() => handleEditTable(row.id)}>
                {$t('common.delete')}
              </NButton>
            </NSpace>
          );
        }
      }
    ]
  },
  {
    data: [],
    name: 'events',
    text: '事件',
    col: [
      ...events.value,
      {
        key: 'actions',
        width: 350,
        title: () => $t('common.action'),
        align: 'center',
        render: row => {
          return (
            <NSpace justify={'center'}>
              <NButton quaternary type="primary" size={'small'} onClick={() => handleEditTable(row.id)}>
                {$t('common.edit')}
              </NButton>
              <NButton quaternary type="primary" size={'small'} onClick={() => handleEditTable(row.id)}>
                {$t('common.delete')}
              </NButton>
            </NSpace>
          );
        }
      }
    ]
  },
  {
    data: [],
    name: 'command',
    text: '命令',
    col: [
      ...command.value,
      {
        key: 'actions',
        width: 350,
        title: () => $t('common.action'),
        align: 'center',
        render: row => {
          return (
            <NSpace justify={'center'}>
              <NButton quaternary type="primary" size={'small'} onClick={() => handleEditTable(row.id)}>
                {$t('common.edit')}
              </NButton>
              <NButton quaternary type="primary" size={'small'} onClick={() => handleEditTable(row.id)}>
                {$t('common.delete')}
              </NButton>
            </NSpace>
          );
        }
      }
    ]
  }
])

const handleEditTable: (id: string) => void = (id) => {
  console.log(id, '点击了编辑或者删除')
}

const checkedTabs: (value: string | number) => void = (value) => {
  tabsCurrent.value = value
  console.log(value, '切换标签了')
}
const tableData = ref<UserManagement.User[]>([]);
const getTableData: (value?: string) => void = async (value) => {
  startLoading();
  if (value) {

  } else {
    const { data: data0 }: any = await telemetryApi(queryParams)
    columnsList[0].data = data0?.list ?? []
    const { data: data1 }: any = await attributesApi(queryParams)
    columnsList[1].data = data1?.list ?? []
    const { data: data2 }: any = await eventsApi(queryParams)
    columnsList[2].data = data2?.list ?? []
    const { data: data3 }: any = await commandsApi(queryParams)
    columnsList[3].data = data3?.list ?? []
    console.log(data0, data1, data2, data3, '请求到了遥远的数据');
    endLoading()
  }
}

// 分页参数
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

// 上一步
const next: () => void = async () => {
  console.log('新增物模');
}
// 下一步
const back: () => void = async () => {
  console.log('新增物模');
  emit('update:stepCurrent', 1)
}
// 取消
const cancellation: () => void = () => {
  emit('update:modalVisible', false)
}

getTableData()
</script>

<template>
  <div>
    <n-tabs type="line" animated @update:value="checkedTabs">
      <n-tab-pane :name="item.name" :tab="item.text" v-for="item in columnsList" :key="item.name">
        <n-button @click="item.addBtn" class="addBtn">
          <template #icon>
            <SvgIcon local-icon="add" class="more" />
          </template>新增
        </n-button>
        <NDataTable :columns="item.col" :data="tableData" :loading="loading" :pagination="pagination" :flex-height="true"
          class="flex-1-hidden m-t9" />
      </n-tab-pane>
    </n-tabs>
  </div>
  <div>
    <n-button @click="cancellation">取消</n-button>
    <n-button @click="back">上一步</n-button>
    <n-button @click="next">下一步</n-button>
  </div>
  <NModal v-model:show="addAndEditModalVisible" preset="card" :title="addAndEditTitle" class="w-60%">

  </NModal>
</template>

<style lang="scss" scoped>
.addBtn {
  position: absolute;
  right: 0;
  top: .5rem;
}
</style>
