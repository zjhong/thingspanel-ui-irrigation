<script setup lang="tsx">
import type { Ref } from 'vue';
import { onMounted, ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NCode, NFlex, NPagination, NPopover, NScrollbar, useMessage } from 'naive-ui';
import { deviceConfigEdit, deviceTemplate, deviceTemplateDetail } from '@/service/api/device';
import { useRouterPush } from '@/hooks/common/router';

const { routerPushByKey } = useRouterPush();

const message = useMessage();
// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits();

const showPopover = ref(false);

interface Props {
  configInfo?: object | any;
}

const props = withDefaults(defineProps<Props>(), {
  configInfo: null
});
const rowTemplateDetail = ref<string>('');
const columns: Ref<DataTableColumns<ServiceManagement.Service>> = ref([
  {
    key: 'name',
    title: '名称',
    align: 'center'
  },
  {
    key: 'author',
    title: '作者',
    align: 'center',
    width: '150px'
  },
  {
    key: 'operate',
    title: '操作',
    align: 'center',
    width: '130px',
    render: row => (
      <div class="flex">
        <NButton
          ghost
          quaternary
          type={'primary'}
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            choseTemp(row);
          }}
        >
          选择
        </NButton>
        <span>
          <NPopover
            trigger="hover"
            onUpdateShow={show => {
              if (show) {
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                openTemp(row);
              }
            }}
          >
            {{
              trigger: () => (
                <NButton ghost quaternary type={'primary'}>
                  查看
                </NButton>
              ),
              default: () => (
                <NScrollbar style="max-height: 220px;padding:8px">
                  {' '}
                  <NCode code={rowTemplateDetail.value} language="json" />
                </NScrollbar>
              )
            }}
          </NPopover>
        </span>
      </div>
    )
  }
]);
const choseTemp = async row => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const postData = props.configInfo;
  postData.device_template_id = row.id;
  const res = await deviceConfigEdit(postData);
  if (!res.error) {
    message.success('修改成功');
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    templateDetail.value = row;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    plugQuery.value.name = row.name;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    searchPlug();
    emit('upDateConfig');
  }
};
const openTemp = async row => {
  const { data, error } = await deviceTemplateDetail({ id: row.id });
  if (!error) {
    data.app_chart_config = JSON.parse(data.app_chart_config);
    data.web_chart_config = JSON.parse(data.web_chart_config);
    rowTemplateDetail.value = JSON.stringify(data, null, 2);
  }
};
const plugList = ref([]);

const selectValue = ref();
const plugQuery = ref({
  page: 1,
  page_size: 10,
  name: ''
});
const plugTotal = ref(0);
const getTableData = async () => {
  const res = await deviceTemplate(plugQuery.value);
  console.log(res);
  plugList.value = res.data.list;
  plugTotal.value = res.data.total;
};
const searchPlug = () => {
  plugQuery.value.page = 1;
  getTableData();
};
const templateDetail = ref<any>({});
const getTemplateDetail = async () => {
  if (props.configInfo.device_template_id) {
    const res = await deviceTemplateDetail({ id: props.configInfo.device_template_id });
    templateDetail.value = res.data || {};
  }
};
const openPopover = () => {
  showPopover.value = true;
  plugQuery.value.name = templateDetail?.value?.name || '';
  getTableData();
};
const toTemplate = () => {
  routerPushByKey('device_template');
};

const configRenderOption = info => {
  console.log(info);

  return (
    <NFlex class="ml-4 w-full items-center justify-between hover:bg-primary-100">
      <div class="flex-1">{info.option.name}</div>
      <div class="mr-6 flex">
        <NButton
          ghost
          quaternary
          type={'primary'}
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            choseTemp(info.option);
          }}
        >
          选择
        </NButton>
        <span>
          <NPopover
            trigger="hover"
            onUpdateShow={show => {
              if (show) {
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                openTemp(info.option);
              }
            }}
          >
            {{
              trigger: () => (
                <NButton ghost quaternary type={'primary'}>
                  查看
                </NButton>
              ),
              default: () => (
                <NScrollbar style="max-height: 220px;padding:8px">
                  <NCode code={rowTemplateDetail.value} language="json" />
                </NScrollbar>
              )
            }}
          </NPopover>
        </span>
      </div>
    </NFlex>
  );
};

// watch(
//     () => props.configInfo,
//     (newValue) => {
//       if(newValue){
//           message.success('111');
//         // getTemplateDetail()
//       }
//     }
// )
onMounted(async () => {
  await getTemplateDetail();
});
</script>

<template>
  <div class="attribute-box">
    <NFlex align="center">
      <div>绑定设备模板</div>
      <NPopover :show="showPopover" placement="bottom-start" trigger="manual" @clickoutside="showPopover = false">
        <template #trigger>
          <NInput
            v-model:value="templateDetail.name"
            class="w-300px"
            @focus="openPopover"
            @blur="showPopover = false"
          />
        </template>
        <div class="w-500">
          <NInput v-model:value="plugQuery.name" @focus="showPopover = true" @input="searchPlug" />
          <NDataTable :columns="columns" :data="plugList" size="small" class="m-tb-10" />
          <div class="pagination-box">
            <!-- Data table to display device groups -->
            <!-- Pagination component -->
            <NPagination
              v-model:page="plugQuery.page"
              :page-size="plugQuery.page_size"
              :item-count="plugTotal"
              @update:page="getTableData"
            />
          </div>
        </div>
      </NPopover>
      <div class="to-create" @click="toTemplate">没有找到？去创建</div>
    </NFlex>
    <div class="mt-24px w-500">
      <div>绑定设备模板(方案2)</div>
      <NSelect
        v-model:value="selectValue"
        value-field="id"
        label-field="name"
        :options="plugList"
        filterable
        :render-option="configRenderOption"
        @focus="getTableData"
        @search="
          v => {
            console.log(v);
          }
        "
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.attribute-box {
  padding: 50px;

  .to-create {
    color: #999999;
  }

  .to-create:hover {
    cursor: pointer;
    text-decoration: underline;
    color: #646cff;
  }

  .m-b-10 {
    margin-bottom: 10px;
  }
}

.pagination-box {
  display: flex;
  justify-content: flex-end;
}

.m-tb-10 {
  margin: 10px 0;
}

.w-300px {
  width: 300px;
  margin: 0 15px;
}

.w-500 {
  width: 500px;
}
</style>
