<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NButton, NCard, NFlex, NGrid, NGridItem, NInput, NPagination } from 'naive-ui';
import { EyeOutline, Refresh } from '@vicons/ionicons5';
import moment from 'moment/moment';
import { Heart, HeartBroken } from '@vicons/fa';
import { Edit } from '@vicons/carbon';
import { $t } from '@/locales';
import { deviceAlarmHistory, deviceAlarmHistoryPut, deviceAlarmList } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
const { routerPushByKey } = useRouterPush();

const props = defineProps<{
  id: string;
}>();
const tabValue = ref(1);
const choseTab = data => {
  tabValue.value = data;
  if (data === 1) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    refresh();
  } else if (data === 2) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getAlarmList();
  }
};

const queryParams = ref({
  selected_time: ref<[number, number]>([moment().subtract(7, 'days').valueOf(), moment().valueOf()]),
  alarm_status: null,
  page: 1,
  page_size: 10,
  start_time: '',
  end_time: '',
  device_id: ''
});
const alarmStatusOptions = ref([
  {
    label: '高级报警',
    value: 'H'
  },
  {
    label: '中级报警',
    value: 'M'
  },
  {
    label: '低级报警',
    value: 'L'
  },
  {
    label: '正常',
    value: 'N'
  }
]);
const refresh = () => {
  queryParams.value = {
    selected_time: [moment().subtract(7, 'days').valueOf(), moment().valueOf()],
    alarm_status: null,
    page: 1,
    page_size: 10,
    start_time: '',
    end_time: '',
    device_id: ''
  };
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  getAlarmHistory();
};
const alarmHistory = ref([] as any);
const getAlarmHistory = async () => {
  queryParams.value.device_id = props.id;
  if (queryParams.value.selected_time && queryParams.value.selected_time.length > 0) {
    queryParams.value.start_time = moment(queryParams.value.selected_time[0]).format('YYYY-MM-DDTHH:mm:ssZ');
    queryParams.value.end_time = moment(queryParams.value.selected_time[1]).format('YYYY-MM-DDTHH:mm:ssZ');
  } else {
    queryParams.value.start_time = '';
    queryParams.value.end_time = '';
  }
  const res = await deviceAlarmHistory(queryParams.value);
  alarmHistory.value = res.data.list;
};
const resetQuery = () => {
  queryParams.value.page = 1;
  getAlarmHistory();
};
const showDialog = ref(false);
const closeModal = () => {
  showDialog.value = false;
};
const infoData = ref({} as any);
const getInfo = (data: any) => {
  infoData.value = data;
  showDialog.value = true;
};
const showModal = ref(false);
const description = ref('');
const cancelCallback = () => {
  description.value = '';
  showModal.value = false;
};
const submitCallback = async () => {
  if (description.value === '') {
    window.$message?.error('请输入告警描述');
    return;
  }
  const putData = {
    id: infoData.value.id,
    description: description.value
  };
  await deviceAlarmHistoryPut(putData);
  cancelCallback();
};
const queryData = ref({
  page: 1,
  page_size: 10,
  device_id: ''
});
const alarmTotal = ref(0);
const alarmList = ref([]);
const getAlarmList = async () => {
  queryData.value.device_id = props.id;
  const res = await deviceAlarmList(queryData.value);
  alarmList.value = res.data.list;
  alarmTotal.value = res.data.total;
};
const alarmAdd = () => {
  routerPushByKey('automation_linkage-edit', {
    query: { device_id: props.id }
  });
};
onMounted(() => {
  getAlarmHistory();
});
</script>

<template>
  <div class="w-full">
    <NFlex justify="space-between" class="mb-4">
      <n-button-group>
        <NButton :type="tabValue === 1 ? 'primary' : 'default'" @click="choseTab(1)">告警历史</NButton>
        <NButton :type="tabValue === 2 ? 'primary' : 'default'" @click="choseTab(2)">告警规则</NButton>
      </n-button-group>
      <NFlex v-if="tabValue === 1" class="w-70%" justify="flex-end">
        <NDatePicker
          v-model:value="queryParams.selected_time"
          type="datetimerange"
          clearable
          separator="-"
          class="w-400px"
          @on-update:value="resetQuery()"
        />
        <n-select
          v-model:value="queryParams.alarm_status"
          :options="alarmStatusOptions"
          class="w-150px"
          clearable
          @on-update:value="resetQuery"
        />
        <NButton :bordered="false" class="justify-end" @click="refresh">
          <NIcon size="18">
            <Refresh />
          </NIcon>
          {{ $t('generate.refresh') }}
        </NButton>
      </NFlex>
    </NFlex>
    <div v-if="tabValue === 1" class="history-list">
      <div v-for="(item, index) in alarmHistory" :key="index" class="alarm-item">
        <div class="alarm-time">
          <div class="line-style"></div>
          <span class="alarm-icon" :class="[item.alarm_status !== 'N' ? 'color-ye-bg' : 'color-gre-bg']"></span>
          <span>{{ moment(item['create_at']).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </div>
        <div class="alarm-item-content" :class="[item.alarm_status !== 'N' ? 'color-ye-bg-low' : 'color-gre-bg-low']">
          <NFlex class="mb-30px" justify="space-between">
            <NFlex class="alarm-type" :class="[item.alarm_status !== 'N' ? 'color-ye' : 'color-gre']">
              <NIcon v-if="item.alarm_status !== 'N'" size="22" class="ml-1">
                <HeartBroken />
              </NIcon>
              <NIcon v-if="item.alarm_status === 'N'" size="22" class="ml-1">
                <Heart />
              </NIcon>
              <span>
                {{ alarmStatusOptions.find(data => data.value === item['alarm_status'])?.label || '' }}
              </span>
            </NFlex>
            <NFlex>
              <div>{{ item.name }}</div>
              <!--              <div style="color: #646cff">设备名称</div>-->
            </NFlex>
          </NFlex>
          <div>
            <NButton text @click="getInfo(item)">
              <NIcon size="18">
                <EyeOutline />
              </NIcon>
              详情
            </NButton>
            <NButton text class="ml-8" @click="showModal = true">
              <NIcon size="18">
                <Edit />
              </NIcon>
              维护
            </NButton>
          </div>
        </div>
      </div>
      <n-empty v-if="alarmHistory.length === 0" :description="$t('common.nodata')"></n-empty>
      <n-modal v-model:show="showDialog" :title="$t('generate.alarm-info')" class="max-w-[800px]">
        <NCard>
          <div>
            <NH3>{{ $t('generate.alarm-info') }}</NH3>
          </div>
          <n-form-item label-placement="left" :show-feedback="false" label="告警配置名称:">
            {{ infoData.name }}
          </n-form-item>
          <n-form-item label-placement="left" :show-feedback="false" label="关联场景联动名称:">
            {{ infoData['alarm_config_name'] }}
          </n-form-item>
          <n-form-item label-placement="left" :show-feedback="false" label="告警时间:">
            {{ moment(infoData['create_at']).format('YYYY-MM-DD HH:mm:ss') }}
          </n-form-item>
          <n-form-item label-placement="left" :show-feedback="false" label="告警状态:">
            {{ alarmStatusOptions.find(data => data.value === infoData['alarm_status'])?.label || '' }}
          </n-form-item>
          <n-form-item label-placement="left" :show-feedback="false" label="告警原因:">
            {{ infoData.content }}
          </n-form-item>
          <n-form-item label-placement="left" :show-feedback="false" label="告警描述:">
            {{ infoData.description }}
          </n-form-item>
          <n-form-item label-placement="top" :show-feedback="false" label="告警设备列表:">
            <NTable size="small" :bordered="false" :single-line="false" class="mb-6">
              <thead>
                <tr>
                  <th>序号</th>
                  <th class="min-w-180px">设备编码</th>
                  <th>设备名称</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(device, index) in infoData.alarm_device_list" :key="index">
                  <td class="min-w-100px">{{ index + 1 }}</td>
                  <td>{{ device.id }}</td>
                  <td>{{ device['name'] }}</td>
                </tr>
              </tbody>
            </NTable>
          </n-form-item>
          <NFlex justify="flex-end">
            <NButton @click="closeModal">关闭</NButton>
          </NFlex>
        </NCard>
      </n-modal>
      <n-modal v-model:show="showModal" class="max-w-[600px]">
        <NCard>
          <n-form-item :show-feedback="false" label="告警描述">
            <NInput v-model:value="description" type="textarea" />
          </n-form-item>
          <NFlex justify="flex-end" class="mt-4">
            <NButton @click="cancelCallback">{{ $t('generate.cancel') }}</NButton>
            <NButton @click="submitCallback">{{ $t('common.save') }}</NButton>
          </NFlex>
        </NCard>
      </n-modal>
    </div>
  </div>
  <div v-if="tabValue === 2" class="alarm-list">
    <NCard class="w-full">
      <NFlex justify="flex-end" class="mb-4">
        <NButton type="primary" @click="alarmAdd()">新增告警</NButton>
      </NFlex>
      <n-empty
        v-if="alarmList.length === 0"
        size="huge"
        :description="$t('common.nodata')"
        class="min-h-60 justify-center"
      ></n-empty>
      <NGrid v-else x-gap="20px" y-gap="20px" cols="1 s:2 m:3 l:4" responsive="screen">
        <NGridItem v-for="(item, index) in alarmList" :key="index">
          <NCard hoverable style="height: 160px">
            <NFlex justify="space-between" align="center" class="mb-4">
              <div class="text-16px font-600">
                {{ item['name'] }}
              </div>
            </NFlex>
            <div>{{ item['description'] }}</div>
            <!--            <NFlex justify="flex-end" class="mt-4">-->
            <!--              <NTooltip trigger="hover">-->
            <!--                <template #trigger>-->
            <!--                  <NButton tertiary circle type="warning" @click="linkEdit(item)">-->
            <!--                    <template #icon>-->
            <!--                      <n-icon>-->
            <!--                        <editIcon />-->
            <!--                      </n-icon>-->
            <!--                    </template>-->
            <!--                  </NButton>-->
            <!--                </template>-->
            <!--                {{ $t('common.edit') }}-->
            <!--              </NTooltip>-->
            <!--              <NTooltip trigger="hover">-->
            <!--                <template #trigger>-->
            <!--                  <NButton circle tertiary type="info" @click="openLog(item)">-->
            <!--                    <template #icon>-->
            <!--                      <n-icon>-->
            <!--                        <copyIcon />-->
            <!--                      </n-icon>-->
            <!--                    </template>-->
            <!--                  </NButton>-->
            <!--                </template>-->
            <!--                {{ $t('page.irrigation.time.log.name') }}-->
            <!--              </NTooltip>-->
            <!--              <NTooltip trigger="hover">-->
            <!--                <template #trigger>-->
            <!--                  <NButton circle tertiary type="error" @click="deleteLink(item)">-->
            <!--                    <template #icon>-->
            <!--                      <n-icon>-->
            <!--                        <trashIcon />-->
            <!--                      </n-icon>-->
            <!--                    </template>-->
            <!--                  </NButton>-->
            <!--                </template>-->
            <!--                {{ $t('common.delete') }}-->
            <!--              </NTooltip>-->
            <!--            </NFlex>-->
          </NCard>
        </NGridItem>
      </NGrid>
      <NFlex justify="flex-end" class="mt-4">
        <NPagination
          v-model:page="queryData.page"
          :page-size="queryData.page_size"
          :item-count="alarmTotal"
          @update:page="getAlarmList"
        />
      </NFlex>
    </NCard>
  </div>
</template>

<style scoped lang="scss">
.history-list {
  .alarm-item {
    //padding: 20px;
    .alarm-time {
      display: flex;
      flex-flow: row;
      align-items: center;
      .alarm-icon {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        //background: #dca550;
        display: block;
        margin-right: 20px;
        z-index: 1;
      }
      .line-style {
        position: relative;
        height: 20px; /* 线的高度 */
        width: 1px;
      }
      .line-style::after {
        content: '';
        position: absolute;
        left: 10px;
        right: 0;
        top: 18px;
        background: #e5e7ec;
        width: 1px;
        height: 150px;
      }
    }
    .alarm-item-content {
      //border-left: solid 2px #fdfaf6;
      //background: #fdfaf6;
      margin: 10px 40px;
      padding: 15px 10px;
      .alarm-type {
        //color: #dca550;
        margin-bottom: 30px;
      }
    }
  }
}
.alarm-list {
}
.color-ye {
  color: #dca550;
}
.color-ye-bg {
  background: #dca550;
}
.color-ye-bg-low {
  background: #fdfaf6;
}
.color-gre {
  color: #7ec050;
}
.color-gre-bg {
  background: #7ec050;
}
.color-gre-bg-low {
  background: #f8fcf6;
}
</style>
