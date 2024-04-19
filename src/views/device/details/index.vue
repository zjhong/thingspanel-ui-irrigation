<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useLoading } from '@sa/hooks';
import { useDeviceDataStore } from '@/store/modules/device';
import Telemetry from '@/views/device/details/modules/telemetry/telemetry.vue';
import Join from '@/views/device/details/modules/join.vue';
import DeviceAnalysis from '@/views/device/details/modules/device-analysis.vue';
import Message from '@/views/device/details/modules/message.vue';
import Stats from '@/views/device/details/modules/stats.vue';
import EventReport from '@/views/device/details/modules/event-report.vue';
import CommandDelivery from '@/views/device/details/modules/command-delivery.vue';
import Automate from '@/views/device/details/modules/automate.vue';
import GiveAnAlarm from '@/views/device/details/modules/give-an-alarm.vue';
import User from '@/views/device/details/modules/user.vue';
import Settings from '@/views/device/details/modules/settings.vue';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { deviceUpdate } from '@/service/api/device';

const { query } = useRoute();
const appStore = useAppStore();
const { d_id } = query;
const { loading, startLoading, endLoading } = useLoading();
const deviceDataStore = useDeviceDataStore();
const components = [
  { key: 'telemetry', name: () => $t('custom.device_details.telemetry'), component: Telemetry },
  { key: 'join', name: () => $t('custom.device_details.join'), component: Join },
  { key: 'device-analysis', name: () => $t('custom.device_details.deviceAnalysis'), component: DeviceAnalysis },
  { key: 'message', name: () => $t('custom.device_details.message'), component: Message },
  { key: 'stats', name: () => $t('custom.device_details.stats'), component: Stats },
  { key: 'event-report', name: () => $t('custom.device_details.eventReport'), component: EventReport },
  { key: 'command-delivery', name: () => $t('custom.device_details.commandDelivery'), component: CommandDelivery },
  { key: 'automate', name: () => $t('custom.device_details.automate'), component: Automate },
  { key: 'give-an-alarm', name: () => $t('custom.device_details.giveAnAlarm'), component: GiveAnAlarm },
  { key: 'user', name: () => $t('custom.device_details.user'), component: User },
  { key: 'settings', name: () => $t('custom.device_details.settings'), component: Settings }
];

const tabValue = ref<any>('telemetry');
const showDialog = ref(false);
const queryParams = reactive({
  deviceName: deviceDataStore?.deviceData?.name,
  device_number: deviceDataStore?.deviceData?.device_number,
  deviceDescribe: deviceDataStore?.deviceData?.device_config?.description,
  lable: []
});
const changeTabs = v => {
  startLoading();

  tabValue.value = v;
  setTimeout(() => {
    endLoading();
  }, 500);
};
const editConfig = () => {
  showDialog.value = true;
};
const save = () => {
  deviceUpdate(queryParams);
};
onMounted(() => {
  deviceDataStore.fetchData(d_id as string);
});

watch(
  () => appStore.locale,
  () => {
    console.log(appStore.locale);
    let temporary: any;
    // eslint-disable-next-line prefer-const
    temporary = tabValue.value;
    tabValue.value = '';
    setTimeout(() => {
      tabValue.value = temporary;
    }, 50);
  }
);
</script>

<template>
  <div>
    <n-card>
      <div>
        <div style="display: flex">
          <NH3 style="margin-right: 20px">{{ deviceDataStore?.deviceData?.name || '--' }}</NH3>
          <NButton v-show="false" type="primary" @click="editConfig">编辑</NButton>
        </div>

        <n-modal v-model:show="showDialog" title="下发属性" class="w-[400px]">
          <n-card>
            <n-form>
              <div>
                <NH3>修改设备信息</NH3>
              </div>
              <n-form-item label="设备名称*">
                <n-input v-model:value="queryParams.deviceName" />
              </n-form-item>
              <n-form-item label="设备编号*">
                <n-input v-model:value="queryParams.device_number" />
              </n-form-item>
              <n-form-item :label="$t('custom.devicePage.label')" path="lable">
                <n-dynamic-tags v-model:value="queryParams.lable" />
              </n-form-item>
              <n-form-item label="设备描述">
                <!-- <n-input v-model:value="queryParams.deviceDescribe" type="textarea"/> -->
                <NInput v-model:value="queryParams.deviceDescribe" type="textarea" />
              </n-form-item>
              <n-space>
                <n-button @click="showDialog = false">取消</n-button>
                <n-button @click="save">保存</n-button>
              </n-space>
            </n-form>
          </n-card>
        </n-modal>

        <NFlex>
          <div class="mr-4">
            <spna class="mr-2" style="color: #ccc">ID:</spna>
            <spna style="color: #ccc">{{ deviceDataStore?.deviceData?.device_number || '--' }}</spna>
          </div>
          <div class="mr-4" style="color: #ccc">
            <spna class="mr-2">{{ $t('custom.device_details.deviceConfig') }}:</spna>
            <spna style="color: blue">{{ deviceDataStore?.deviceData?.device_config_name || '--' }}</spna>
          </div>
          <div class="mr-4" style="display: flex">
            <!-- <spna class="mr-2">{{ $t('custom.device_details.status') }}:</spna> -->
            <SvgIcon
              local-icon="CellTowerRound"
              style="color: #ccc; margin-right: 5px"
              class="text-20px text-primary"
            />
            <spna style="color: #ccc">
              {{
                deviceDataStore?.deviceData?.is_online === 1
                  ? $t('custom.device_details.online')
                  : $t('custom.device_details.offline')
              }}
            </spna>
          </div>
          <div class="mr-4">
            <!-- <spna class="mr-2">{{ $t('custom.device_details.alarm') }}:</spna> -->
            <spna style="color: #ccc">
              {{ deviceDataStore?.deviceData?.is_online || $t('custom.device_details.noAlarm') }}
            </spna>
          </div>
        </NFlex>
      </div>
      <n-divider title-placement="left"></n-divider>
      <div>
        <n-tabs v-model:value="tabValue" animated type="line" @update:value="changeTabs">
          <n-tab-pane
            v-for="component in components.filter(
              i => !(i.key === 'device-analysis') || deviceDataStore?.deviceData?.parent_id
            )"
            :key="component.key"
            :tab="component.name"
            :name="component.key"
          >
            <n-spin size="small" :show="loading">
              <component
                :is="component.component"
                :id="d_id as string"
                :device-config-id="deviceDataStore?.deviceData?.device_config_id || ''"
              />
            </n-spin>
          </n-tab-pane>
        </n-tabs>
      </div>
    </n-card>
  </div>
</template>

<style scoped></style>
