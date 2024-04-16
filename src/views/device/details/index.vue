<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
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

const { query } = useRoute();
const appStore = useAppStore();
const { id } = query;
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
const changeTabs = v => {
  startLoading();

  tabValue.value = v;
  setTimeout(() => {
    endLoading();
  }, 500);
};
onMounted(() => {
  deviceDataStore.fetchData(id as string);
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
        <NH3>{{ deviceDataStore?.deviceData?.name || '--' }}</NH3>

        <NFlex>
          <div class="mr-4">
            <spna class="mr-2">{{ $t('custom.device_details.deviceNumber') }}:</spna>
            <spna>{{ deviceDataStore?.deviceData?.device_number || '--' }}</spna>
          </div>
          <div class="mr-4">
            <spna class="mr-2">{{ $t('custom.device_details.deviceConfig') }}:</spna>
            <spna>{{ deviceDataStore?.deviceData?.device_config_name || '--' }}</spna>
          </div>
          <div class="mr-4">
            <spna class="mr-2">{{ $t('custom.device_details.status') }}:</spna>
            <spna>
              {{
                deviceDataStore?.deviceData?.is_online === 1
                  ? $t('custom.device_details.online')
                  : $t('custom.device_details.offline')
              }}
            </spna>
          </div>
          <div class="mr-4">
            <spna class="mr-2">{{ $t('custom.device_details.alarm') }}:</spna>
            <spna>{{ deviceDataStore?.deviceData?.is_online || $t('custom.device_details.noAlarm') }}</spna>
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
                :id="id as string"
                :device-config-id="deviceDataStore?.deviceData?.device_config_id || ''"
                :location="deviceDataStore?.deviceData?.location || ''"
              />
            </n-spin>
          </n-tab-pane>
        </n-tabs>
      </div>
    </n-card>
  </div>
</template>

<style scoped></style>
