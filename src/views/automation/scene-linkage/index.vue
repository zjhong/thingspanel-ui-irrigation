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
import { CopyOutline as copyIcon, PencilOutline as editIcon, TrashOutline as trashIcon } from '@vicons/ionicons5';
import moment from 'moment';
import { useRouterPush } from '@/hooks/common/router';
import {
  sceneAutomationsDel,
  sceneAutomationsGet,
  sceneAutomationsLog,
  sceneAutomationsSwitch
} from '@/service/api/automation';
const dialog = useDialog();
const message = useMessage();
const { routerPushByKey } = useRouterPush();

const sceneLinkageList = ref([] as any);

// 新建场景
const linkAdd = () => {
  routerPushByKey('automation_linkage-edit');
};

// 编辑场景
const linkEdit = (item: any) => {
  routerPushByKey('automation_linkage-edit', { query: { id: item.id } });
};

// 开启/关闭场景
const linkActivation = async (item: any) => {
  const res = await sceneAutomationsSwitch(item.id);
  if (!res.error) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await getData();
    message.success('操作成功');
  }
};

const queryData = ref({
  name: '',
  page: 1,
  page_size: 10
});
const dataTotal = ref(0);

const getData = async () => {
  const res = await sceneAutomationsGet(queryData.value);
  sceneLinkageList.value = res.data.list;
  dataTotal.value = res.data.total;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const handleQuery = async () => {
//   queryData.value.page = 1;
//   await getData();
// };
const bodyStyle = ref({
  width: '800px'
});
const showLog = ref(false);
console.log(moment().subtract(7, 'day').format());
const logQuery = ref({
  page: 1,
  page_size: 12,
  scene_automation_id: '',
  execution_result: null,
  execution_start_time: '',
  execution_end_time: '',
  queryTime: ref(null as any)
});
const logDataTotal = 0;
const logData = ref([]);
const getLogList = async () => {
  if (logQuery.value.queryTime && logQuery.value.queryTime.length === 2) {
    logQuery.value.execution_start_time = moment(logQuery.value.queryTime[0]).format();
    logQuery.value.execution_end_time = moment(logQuery.value.queryTime[1]).format();
  }
  const res = await sceneAutomationsLog(logQuery.value);
  logData.value = res.data;
};

const logColumnsData: Ref<DataTableColumns<ServiceManagement.Service>> = ref([
  {
    key: 'executed_at',
    title: '执行时间',
    align: 'center'
  },
  {
    key: 'detail',
    title: '执行说明',
    align: 'center'
  },
  {
    key: 'execution_result',
    title: '执行状态',
    align: 'center'
  }
]);
// 查看日志
const openLog = (item: any) => {
  logQuery.value.scene_automation_id = item.id;
  getLogList();
  showLog.value = true;
};
// 删除场景
const deleteLink = async (item: any) => {
  dialog.warning({
    title: '删除提示',
    content: '请确认是否删除该场景联动信息？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const res = await sceneAutomationsDel(item.id);
      if (!res.error) {
        await getData();
        message.success('操作成功');
      }
    }
  });
};
const closeTest = () => {
  showLog.value = false;
};
onMounted(() => {
  getData();
});
</script>

<template>
  <div class="h-full w-full">
    <NCard :bordered="false">
      <NFlex justify="space-between" class="mb-4">
        <NButton type="primary" @click="linkAdd()">+新增联动规则</NButton>
        <!--        <NFlex align="center" justify="flex-end" :wrap="false">-->
        <!--          <NInput-->
        <!--            v-model:value="queryData.name"-->
        <!--            placeholder="请输入场景联动名称"-->
        <!--            class="search-input"-->
        <!--            type="text"-->
        <!--            clearable-->
        <!--          >-->
        <!--            <template #prefix>-->
        <!--              <NIcon>-->
        <!--                <IosSearch />-->
        <!--              </NIcon>-->
        <!--            </template>-->
        <!--          </NInput>-->
        <!--          <NButton class="w-72px" type="primary" @click="handleQuery">搜索</NButton>-->
        <!--        </NFlex>-->
      </NFlex>
      <n-empty
        v-if="sceneLinkageList.length === 0"
        size="huge"
        description="暂无数据"
        class="min-h-60 justify-center"
      ></n-empty>
      <template v-else>
        <NGrid x-gap="24" y-gap="16" :cols="24">
          <NGridItem v-for="(item, index) in sceneLinkageList" :key="index" :span="6">
            <NCard hoverable>
              <NFlex justify="space-between" align="center" class="mb-4">
                <div class="text-16px font-600">
                  {{ item.name }}
                </div>
                <n-switch
                  v-model:value="item.enabled"
                  checked-value="Y"
                  unchecked-value="N"
                  @update-value="() => linkActivation(item)"
                />
              </NFlex>
              <div>{{ item.description }}</div>
              <NFlex justify="flex-end" class="mt-4">
                <NTooltip trigger="hover">
                  <template #trigger>
                    <NButton tertiary circle type="warning" @click="linkEdit(item)">
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
                    <NButton circle tertiary type="info" @click="openLog(item)">
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
                    <NButton circle tertiary type="error" @click="deleteLink(item)">
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
    <NModal
      v-model:show="showLog"
      :style="bodyStyle"
      preset="card"
      title="日志"
      size="huge"
      :bordered="false"
      :mask-closable="false"
      @close="closeTest"
    >
      <NFlex class="mb-10">
        <n-date-picker v-model:value="logQuery.queryTime" type="daterange" clearable @change="getLogList" />
        <n-select v-model:value="logQuery.execution_result" class="max-w-40" />
      </NFlex>
      <NDataTable :columns="logColumnsData" :data="logData" size="small" class="mb-10" />
      <NFlex justify="end">
        <NPagination
          v-model:page="logQuery.page"
          :page-size="logQuery.page_size"
          :item-count="logDataTotal"
          @update:page="getLogList"
        />
      </NFlex>
    </NModal>
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
