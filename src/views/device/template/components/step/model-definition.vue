<script setup lang="tsx">
import { ref, reactive, computed } from "vue"
import type { PaginationProps } from 'naive-ui';
import { test, attribute, events, command } from "./tableList";
import { useLoading } from '@sa/hooks';
import { NButton, NSpace, NPopconfirm } from 'naive-ui';
import { $t } from "@/locales";
import { telemetryApi, attributesApi, eventsApi, commandsApi, delTelemetry, delAttributes, delEvents, delCommands } from '@/service/api/system-data'
import AddEditTest from './add-edit-test.vue'
import AddEditAttributes from './add-edit-attributes.vue'
import AddEditEvents from './add-edit-events.vue'
import AddEditCommands from './add-edit-commands.vue'

const emit = defineEmits(['update:stepCurrent', 'update:modalVisible']);
const { loading, startLoading, endLoading } = useLoading(false);

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

const DeviceTemplateId = ref<string>(props.DeviceTemplateId)
let tabsCurrent: any = ref('telemetry')
let addAndEditModalVisible = ref<boolean>(false)
let addAndEditTitle = ref<string>('新增/编辑遥测')

const comList: { id: string; components: any, title: string }[] = [
  { id: 'telemetry', components: AddEditTest, title: '新增/编辑遥测' },
  { id: 'attributes', components: AddEditAttributes, title: '新增/编辑属性' },
  { id: 'events', components: AddEditEvents, title: '新增/编辑事件' },
  { id: 'command', components: AddEditCommands, title: '新增/编辑命令' },
];
const SwitchCom = computed<any>(() => {
  console.log('我被触发了');
  return comList.find(item => {
    if (item.id === tabsCurrent.value) {
      const objItem: any = item
      addAndEditTitle.value = objItem.title
      return objItem
    }
  })?.components
});




const queryParams: any = reactive({
  page: 1,
  page_size: 10,
  device_template_id: props.DeviceTemplateId,
});

const columnsList: any = reactive([
  {
    addBtn: () => {
      addAndEditModalVisible.value = true
    },
    data: [{ "data_name": "测试" }],
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
              <NButton quaternary type="primary" size={'small'} onClick={() => edit(row)}>
                {$t('common.edit')}
              </NButton>
              <NPopconfirm onPositiveClick={() => del(row.id)}>
                {{
                  default: () => $t('common.confirmDelete'),
                  trigger: () => (
                    <NButton quaternary type="primary" size={'small'}>
                      {$t('common.delete')}
                    </NButton>
                  )
                }}
              </NPopconfirm>
            </NSpace>
          );
        }
      }
    ]
  },
  {
    addBtn: () => {
      addAndEditModalVisible.value = true
    },
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
              <NButton quaternary type="primary" size={'small'} onClick={() => edit(row)}>
                {$t('common.edit')}
              </NButton>
              <NPopconfirm onPositiveClick={() => del(row.id)}>
                {{
                  default: () => $t('common.confirmDelete'),
                  trigger: () => (
                    <NButton quaternary type="primary" size={'small'}>
                      {$t('common.delete')}
                    </NButton>
                  )
                }}
              </NPopconfirm>
            </NSpace>
          );
        }
      }
    ]
  },
  {
    addBtn: () => {
      addAndEditModalVisible.value = true
    },
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
              <NButton quaternary type="primary" size={'small'} onClick={() => edit(row)}>
                {$t('common.edit')}
              </NButton>
              <NPopconfirm onPositiveClick={() => del(row.id)}>
                {{
                  default: () => $t('common.confirmDelete'),
                  trigger: () => (
                    <NButton quaternary type="primary" size={'small'}>
                      {$t('common.delete')}
                    </NButton>
                  )
                }}
              </NPopconfirm>
            </NSpace>
          );
        }
      }
    ]
  },
  {
    addBtn: () => {
      addAndEditModalVisible.value = true
    },
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
              <NButton quaternary type="primary" size={'small'} onClick={() => edit(row)}>
                {$t('common.edit')}
              </NButton>
              <NPopconfirm onPositiveClick={() => del(row.id)}>
                {{
                  default: () => $t('common.confirmDelete'),
                  trigger: () => (
                    <NButton quaternary type="primary" size={'small'}>
                      {$t('common.delete')}
                    </NButton>
                  )
                }}
              </NPopconfirm>
            </NSpace>
          );
        }
      }
    ]
  }
])


const checkedTabs: (value: string | number) => void = (value) => {
  tabsCurrent.value = value
  console.log(value, '切换标签了')
}
const getTableData: (value?: string) => void = async (value) => {
  startLoading();
  if (value) {
    if (value === 'telemetry') {
      const { data: data0 }: any = await telemetryApi(queryParams)
      columnsList[0].data = data0?.list ?? []
    } else if (value === 'attributes') {
      const { data: data1 }: any = await attributesApi(queryParams)
      columnsList[1].data = data1?.list ?? []
    } else if (value === 'events') {
      const { data: data2 }: any = await eventsApi(queryParams)
      columnsList[2].data = data2?.list ?? []
    } else {
      const { data: data3 }: any = await commandsApi(queryParams)
      columnsList[3].data = data3?.list ?? []
    }
    endLoading()
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

// 编辑
let objItem = reactive<object>({})
const edit: (row: Object) => void = (row) => {
  addAndEditModalVisible.value = true
  objItem = row
  console.log(row, '点击了编辑')
}

// 新增或者编辑成功后的回调函数
const determine: () => void = () => {
  getTableData(tabsCurrent.value);
}

// 删除
const del: (id: string) => void = async (id) => {
  if (tabsCurrent.value === 'telemetry') {
    const response = await delTelemetry(id)
    console.log(response, '点击了删除')
  } else if (tabsCurrent.value === 'attributes') {
    const response = await delAttributes(id)
    console.log(response, '点击了删除')
  } else if (tabsCurrent.value === 'events') {
    const response = await delEvents(id)
    console.log(response, '点击了删除')
  } else {
    const response = await delCommands(id)
    console.log(response, '点击了删除')
  }
  getTableData(tabsCurrent.value);
}
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
const cloneaddAndEditVisible: () => void = () => {
  objItem = {}
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
        <n-data-table :columns="item.col" :data="item.data" :loading="loading" :pagination="pagination"
          class="flex-1-hidden m-t9" />
      </n-tab-pane>
    </n-tabs>
  </div>
  <div class="box1 m-t2">
    <n-button @click="next">下一步</n-button>
    <n-button @click="back" class="m-r3">上一步</n-button>
    <n-button @click="cancellation" class="m-r3">取消</n-button>
  </div>
  <NModal v-model:show="addAndEditModalVisible" preset="card" :title="addAndEditTitle"
    :class="[tabsCurrent === 'events' || tabsCurrent === 'command' ? 'w-50%' : 'w-30%']"
    @afterLeave="cloneaddAndEditVisible">
    <component :is="SwitchCom" v-model:addAndEditModalVisible="addAndEditModalVisible"
      v-model:DeviceTemplateId="DeviceTemplateId" v-model:objItem="objItem" @determine="determine"></component>
  </NModal>
</template>

<style lang="scss" scoped>
.addBtn {
  position: absolute;
  right: 0;
  top: .5rem;
}

.box1 {
  display: flex;
  flex-direction: row-reverse;
}
</style>
