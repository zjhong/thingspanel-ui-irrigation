<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NButton, NCard, NFlex, NPagination, useDialog, useMessage } from 'naive-ui';
import { IosSearch } from '@vicons/ionicons4';
import moment from 'moment';
import { sceneActive, sceneDel, sceneGet, sceneLog } from '@/service/api/automation';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

const dialog = useDialog();
const message = useMessage();
const { routerPushByKey } = useRouterPush();

// interface sceneManageItem {
//   name: string;
//   description: string;
//   created_at: string;
// }
const content = ref({
  sceneManageList: [] as any
});

// 新建场景
const sceneAdd = () => {
  routerPushByKey('automation_scene-edit');
};

// 编辑场景
const sceneEdit = (item: any) => {
  routerPushByKey('automation_scene-edit', { query: { id: item.id } });
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
  content.value.sceneManageList = res.data.list;
  dataTotal.value = res.data.total;
};
const handleQuery = async () => {
  queryData.value.page = 1;
  await getData();
};
const bodyStyle = ref({
  width: '1000px'
});
const showLog = ref(false);

const execution_result_options = ref([
  {
    label: '全部',
    value: ''
  },
  {
    label: '执行成功',
    value: 'S'
  },
  {
    label: '执行失败',
    value: 'F'
  }
]);
const logQuery = ref({
  id: '',
  page: 1,
  page_size: 10,
  time: ref<[number, number]>([moment().subtract(7, 'days').valueOf(), moment().valueOf()]),
  execution_start_time: '',
  execution_end_time: '',
  execution_result: ''
});
const logDataTotal = ref(0);
const logData = ref([]);
const queryLog = () => {
  logQuery.value.page = 1;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  getLogList();
};
const getLogList = async () => {
  if (logQuery.value.time) {
    logQuery.value.execution_start_time = moment(logQuery.value.time[0]).format();
    logQuery.value.execution_end_time = moment(logQuery.value.time[1]).format();
  }
  const res = await sceneLog(logQuery.value);
  logData.value = res.data.list;
  logDataTotal.value = res.data.total;
};
// 查看日志
const openLog = (item: any) => {
  logQuery.value.id = item.id;
  getLogList();
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
const logClose = () => {
  logQuery.value = {
    id: '',
    page: 1,
    page_size: 10,
    time: [moment().subtract(7, 'days').valueOf(), moment().valueOf()],
    execution_start_time: '',
    execution_end_time: '',
    execution_result: ''
  };
};
onMounted(() => {
  getData();
});
</script>

<template>
  <div class="h-full w-full">
    <NCard :bordered="false">
      <NFlex justify="space-between" class="mb-4">
        <NButton type="primary" @click="sceneAdd()">{{ $t('generate.+add-scene') }}</NButton>
        <NFlex align="center" justify="flex-end" :wrap="false">
          <NInput
            v-model:value="queryData.name"
            :placeholder="$t('generate.enterSceneName')"
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
          <NButton class="w-72px" type="primary" @click="handleQuery">{{ $t('common.search') }}</NButton>
        </NFlex>
      </NFlex>
      <NEmpty
        v-if="content.sceneManageList.length === 0"
        size="huge"
        description="暂无数据"
        class="min-h-60 justify-center"
      ></NEmpty>
      <template v-else>
        <NTable :bordered="false" :single-line="false">
          <thead>
            <tr>
              <th>{{ $t('generate.order-number') }}</th>
              <th>{{ $t('generate.scene-name') }}</th>
              <th>{{ $t('generate.scene-description') }}</th>
              <th>{{ $t('common.creationTime') }}</th>
              <th>{{ $t('generate.modification-time') }}</th>
              <th>{{ $t('generate.operation') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(sceneItem, index) in content.sceneManageList" :key="index">
              <td class="w-100px">{{ index + 1 }}</td>
              <td>{{ sceneItem.name }}</td>
              <td>{{ sceneItem.description }}</td>
              <td class="w-180px">{{ moment(sceneItem['created_at']).format('yyyy-MM-DD HH:mm:ss') }}</td>
              <td class="w-180px">{{ moment(sceneItem['updated_at']).format('yyyy-MM-DD HH:mm:ss') }}</td>
              <td class="w-320px">
                <NFlex justify="space-around">
                  <NButton tertiary type="success" @click="sceneActivation(sceneItem)">
                    {{ $t('generate.activate') }}
                  </NButton>
                  <NButton tertiary type="info" @click="sceneEdit(sceneItem)">{{ $t('common.edit') }}</NButton>
                  <NButton tertiary @click="openLog(sceneItem)">{{ $t('page.irrigation.time.log.name') }}</NButton>
                  <NButton tertiary type="error" @click="deleteScene(sceneItem)">{{ $t('common.delete') }}</NButton>
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
    <n-modal
      v-model:show="showLog"
      :style="bodyStyle"
      preset="card"
      :title="$t('page.irrigation.time.log.name')"
      size="huge"
      :bordered="false"
      @close="logClose()"
    >
      <NFlex class="mb-6">
        <n-date-picker v-model:value="logQuery.time" type="datetimerange" @update:value="queryLog" />
        <n-select
          v-model:value="logQuery.execution_result"
          :options="execution_result_options"
          class="max-w-40"
          :placeholder="$t('generate.select-execution-status')"
          @update:value="queryLog"
        ></n-select>
        <NButton type="primary" @click="queryLog()">{{ $t('common.search') }}</NButton>
      </NFlex>
      <n-empty v-if="logDataTotal === 0" size="huge" description="暂无数据" class="min-h-60 justify-center"></n-empty>
      <template v-else>
        <NTable size="small" :bordered="false" :single-line="false" class="mb-6">
          <thead>
            <tr>
              <th>{{ $t('generate.order-number') }}</th>
              <th class="w-180px">{{ $t('generate.execution-time') }}</th>
              <th>{{ $t('generate.execution-description') }}</th>
              <th class="w-120px">{{ $t('generate.execution-status') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(sceneItem, index) in logData" :key="index">
              <td class="w-100px">{{ index + 1 }}</td>
              <td>{{ moment(sceneItem['executed_at']).format('yyyy-MM-DD HH:mm:ss') }}</td>
              <td>{{ sceneItem['detail'] }}</td>
              <td>
                <span v-if="sceneItem['execution_result'] === 'S'">{{ $t('generate.execution-successful') }}</span>
                <span v-if="sceneItem['execution_result'] === 'F'">{{ $t('generate.execution-failed') }}</span>
              </td>
            </tr>
          </tbody>
        </NTable>
        <NFlex justify="end">
          <NPagination
            v-model:page="logQuery.page"
            :page-size="logQuery.page_size"
            :item-count="logDataTotal"
            @update:page="getLogList"
          />
        </NFlex>
      </template>
    </n-modal>
  </div>
</template>

<style scoped></style>
