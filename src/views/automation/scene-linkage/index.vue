<script lang="tsx" setup>
import { type Ref, onMounted, ref } from 'vue';
import {
  type DataTableColumns,
  NButton,
  NCard,
  NFlex,
  NGrid,
  NGridItem,
  NPagination,
  useDialog,
  useMessage
} from 'naive-ui';
import { IosSearch } from '@vicons/ionicons4';
import { CopyOutline as copyIcon, PencilOutline as editIcon, TrashOutline as trashIcon } from '@vicons/ionicons5';
import type { LastLevelRouteKey } from '@elegant-router/types';
import { useRouterPush } from '@/hooks/common/router';
const dialog = useDialog();
const message = useMessage();
const { routerPushByKey } = useRouterPush();

const showModal = () => {
  routerPushByKey('automation_linkage-edit');
};
// 页面跳转
const goRouter = (name: LastLevelRouteKey, id: string) => {
  routerPushByKey(name, { query: { id } });
};
const queryData = ref({
  page: 1,
  page_size: 12,
  name: ''
});
const sceneLinkageList = ref([
  {
    id: '12312512312',
    name: '人来自动开灯',
    description: '晚上7点后自动开灯',
    status: true
  },
  {
    id: '3w4535',
    name: '打开空调降温',
    description: '气温28度后打开空调降温',
    status: true
  },
  {
    id: '45645asedf',
    name: '燃气泄露检测',
    description: '检测到燃气超标自动告警通知',
    status: false
  },
  {
    id: 'asdadsa',

    name: '关闭窗帘',
    description: '执行晚安指令时自动关闭窗帘',
    status: false
  },
  {
    id: 'gsefds' as string,
    name: '油烟机启动',
    description: '检测到燃气灶点火时自动开启油烟机',
    status: true
  }
]);
const dataTotal = ref(0);
const getData = async () => {
  // const res = await deviceConfig(queryData.value);
  // if (!res.error) {
  //   sceneLinkageList.value = res.data.list;
  //   dataTotal.value = res.data.total;
  // }
};
const handleQuery = async () => {
  // sceneLinkageList.value = [];
};
const deleteLink = () => {
  dialog.warning({
    title: '提示',
    content: '请确认是否删除该自动化配置？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      // sceneLinkageList.value.splice(index, 1);
      message.success('操作成功');
    }
  });
};

const showLog = ref(false);
const openLog = () => {
  showLog.value = true;
};
const bodyStyle = ref({
  width: '800px'
});
const columnsData: Ref<DataTableColumns<ServiceManagement.Service>> = ref([
  {
    key: 'name',
    title: '执行时间',
    align: 'center'
  },
  {
    key: 'device_number',
    title: '执行说明',
    align: 'center'
  },
  {
    key: 'activate_flag',
    title: '执行状态',
    align: 'center'
  }
]);
const logQuery = ref({
  page: 1,
  page_size: 12,
  time: ref<[number, number]>([Date.now(), Date.now()]),
  status: ''
});
const logDataTotal = 0;
const logData = ref([]);
const getLogList = () => {};
onMounted(() => {});
</script>

<template>
  <div class="h-full w-full">
    <NCard :bordered="false">
      <NFlex justify="space-between" class="mb-4">
        <NButton type="primary" @click="showModal()">+新增联动规则</NButton>
        <NFlex align="center" justify="flex-end" :wrap="false">
          <NInput
            v-model:value="queryData.name"
            placeholder="请输入场景联动名称"
            class="search-input"
            type="text"
            clearable
          >
            <template #prefix>
              <NIcon>
                <IosSearch />
              </NIcon>
            </template>
          </NInput>
          <NButton class="w-72px" type="primary" @click="handleQuery">搜索</NButton>
        </NFlex>
      </NFlex>
      <n-empty
        v-if="sceneLinkageList.length === 0"
        size="huge"
        description="暂无数据"
        class="min-h-60 justify-center"
      ></n-empty>
      <template v-else>
        <NGrid x-gap="24" y-gap="16" :cols="24">
          <NGridItem v-for="item in sceneLinkageList" :key="item.id" :span="6">
            <NCard hoverable>
              <NFlex justify="space-between" align="center" class="mb-4">
                <div class="text-16px font-600">
                  {{ item.name }}
                </div>
                <n-switch v-model:value="item.status" />
              </NFlex>
              <div>{{ item.description }}</div>
              <NFlex justify="flex-end" class="mt-4">
                <NTooltip trigger="hover">
                  <template #trigger>
                    <NButton tertiary circle type="warning" @click="goRouter('automation_linkage-edit', item.id)">
                      <template #icon>
                        <n-icon>
                          <editIcon />
                        </n-icon>
                      </template>
                    </NButton>
                  </template>
                  编辑
                </NTooltip>
                <NTooltip trigger="hover">
                  <template #trigger>
                    <NButton circle tertiary type="info" @click="openLog">
                      <template #icon>
                        <n-icon>
                          <copyIcon />
                        </n-icon>
                      </template>
                    </NButton>
                  </template>
                  日志
                </NTooltip>
                <NTooltip trigger="hover">
                  <template #trigger>
                    <NButton circle tertiary type="error" @click="deleteLink()">
                      <template #icon>
                        <n-icon>
                          <trashIcon />
                        </n-icon>
                      </template>
                    </NButton>
                  </template>
                  删除
                </NTooltip>
              </NFlex>
            </NCard>
          </NGridItem>
        </NGrid>
        <NFlex justify="flex-end" class="mt-4">
          <NPagination
            v-model:page="queryData.page"
            :page-size="queryData.page_size"
            :item-count="dataTotal"
            @update:page="getData"
          />
        </NFlex>
      </template>
    </NCard>
    <n-modal v-model:show="showLog" :style="bodyStyle" preset="card" title="日志" size="huge" :bordered="false">
      <NFlex class="mb-10">
        <n-date-picker v-model:value="logQuery.time" type="datetimerange" clearable />
        <n-select v-model:value="logQuery.status" class="max-w-40" />
      </NFlex>
      <NDataTable :columns="columnsData" :data="logData" size="small" class="mb-10" />
      <NFlex justify="end">
        <NPagination
          v-model:page="logQuery.page"
          :page-size="logQuery.page_size"
          :item-count="logDataTotal"
          @update:page="getLogList"
        />
      </NFlex>
    </n-modal>
  </div>
</template>

<style scoped lang="scss">
.config-content {
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 0;
  .scene-item {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 18px;
    flex: 0 0 26%;
    margin-right: calc(20% / 2);
    margin-bottom: 30px;

    .item-name {
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: space-between;
    }

    .item-desc {
      margin: 15px 0;
    }

    .item-operate {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: center;
    }
  }
  .scene-item:hover {
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  /* 去除每行尾多余的边距 */
  .scene-item:nth-child(3n) {
    margin-right: 0;
  }
}
.pagination-box {
  display: flex;
  justify-content: flex-end;
}
.search-input {
  width: 200px;
}

.log-card {
  width: 600px;
}
</style>
