<script setup lang="ts">
import { type Ref, onMounted, reactive, ref } from 'vue';
import { type DataTableColumns, NButton, NCard, NFlex, NPagination, useDialog, useMessage } from 'naive-ui';
import { IosSearch } from '@vicons/ionicons4';
import moment from 'moment';
import { sceneActive, sceneDel, sceneGet, sceneLog } from '@/service/api/automation';
// import { useRouterPush } from '@/hooks/common/router';
const dialog = useDialog();
const message = useMessage();
// const { routerPushByKey } = useRouterPush();

interface sceneManageItem {
  name: string;
  description: string;
  created_at: string;
}

let sceneManageList: Array<sceneManageItem> = reactive([] as any);

// 新建场景
const sceneAdd = () => {
  // routerPushByKey('scene-edit');
};

// 编辑场景
const sceneEdit = (item: any) => {
  console.log(item);
  // routerPushByKey('scene-edit', { query: { id: item.id } });
};

// 激活场景
const sceneActivation = (item: any) => {
  dialog.warning({
    title: '激活提示',
    content: '请确认是否激活该场景信息？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const res = await sceneActive(item.id);
      if (!res.error) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await getData();
        message.success('操作成功');
      }
    }
  });
};

const queryData = ref({
  name: '',
  page: 1,
  page_size: 10
});
const dataTotal = ref(0);

const getData = async () => {
  const res = await sceneGet(queryData.value);
  sceneManageList = res.data.list;
  dataTotal.value = res.data.total;
};
const handleQuery = async () => {
  queryData.value.page = 1;
  await getData();
};
const bodyStyle = ref({
  width: '800px'
});
const showLog = ref(false);

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
const logQuery = ref({
  page: 1,
  page_size: 12,
  time: ref<[number, number]>([Date.now(), Date.now()]),
  status: ''
});
const logDataTotal = 0;
const logData = ref([]);
const getLogList = async (item: any) => {
  const res = await sceneLog(item.id);
  logData.value = res.data;
};
// 查看日志
const openLog = (item: any) => {
  getLogList(item);
  showLog.value = true;
};
// 删除场景
const deleteScene = async (item: any) => {
  dialog.warning({
    title: '删除提示',
    content: '请确认是否删除该场景信息？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const res = await sceneDel(item.id);
      if (!res.error) {
        await getData();
        message.success('操作成功');
      }
    }
  });
};
onMounted(() => {
  getData();
});
</script>

<template>
  <div class="h-full w-full">
    <NCard :bordered="false">
      <NFlex justify="space-between" class="mb-4">
        <NButton type="primary" @click="sceneAdd()">+新增场景</NButton>
        <NFlex align="center" justify="flex-end" :wrap="false">
          <NInput
            v-model:value="queryData.name"
            placeholder="请输入场景名称"
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
      <NEmpty
        v-if="sceneManageList.length === 0"
        size="huge"
        description="暂无数据"
        class="min-h-60 justify-center"
      ></NEmpty>
      <template v-else>
        <NTable :bordered="false" :single-line="false">
          <thead>
            <tr>
              <th>场景名称</th>
              <th>场景描述</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(sceneItem, index) in sceneManageList" :key="index">
              <td>{{ sceneItem.name }}</td>
              <td>{{ sceneItem.description }}</td>
              <td>{{ moment(sceneItem.created_at).format('yyyy-MM-DD hh:mm:ss') }}</td>
              <td class="w-320px">
                <NFlex justify="space-around">
                  <NButton tertiary type="success" @click="sceneActivation(sceneItem)">激活</NButton>
                  <NButton tertiary type="info" @click="sceneEdit(sceneItem)">编辑</NButton>
                  <NButton tertiary @click="openLog(sceneItem)">日志</NButton>
                  <NButton tertiary type="error" @click="deleteScene(sceneItem)">删除</NButton>
                </NFlex>
              </td>
            </tr>
          </tbody>
        </NTable>
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
      <NDataTable :columns="logColumnsData" :data="logData" size="small" class="mb-10" />
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

<style scoped></style>
