<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
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

const { query } = useRoute();
const { id } = query;

const deviceDataStore = useDeviceDataStore();
const components = [
  { key: 'telemetry', name: '遥测', component: Telemetry },
  { key: 'join', name: '连接', component: Join },
  { key: 'device-analysis', name: '子设备', component: DeviceAnalysis },
  { key: 'message', name: '信息', component: Message },
  { key: 'stats', name: '属性', component: Stats },
  { key: 'event-report', name: '事件(上报)', component: EventReport },
  { key: 'command-delivery', name: '命令(下发)', component: CommandDelivery },
  { key: 'automate', name: '自动化', component: Automate },
  { key: 'give-an-alarm', name: '告警', component: GiveAnAlarm },
  { key: 'user', name: '用户', component: User },
  { key: 'settings', name: '设置', component: Settings }
];

onMounted(() => {
  console.log(id);
  deviceDataStore.fetchData(id as string);
});
</script>

<template>
  <div>
    <n-card>
      <div>
        <NH3>{{ deviceDataStore?.deviceData?.name || '--' }}</NH3>

        <n-descriptions label-placement="left" :column="6">
          <n-descriptions-item label="设备编号：">
            {{ deviceDataStore?.deviceData?.device_number || '--' }}
          </n-descriptions-item>
          <n-descriptions-item label="设备配置：">
            {{ deviceDataStore?.deviceData?.protocol_config || '--' }}
          </n-descriptions-item>
          <n-descriptions-item label=" 状态：">
            {{ deviceDataStore?.deviceData?.is_online === 1 ? '在线' : '离线' }}
          </n-descriptions-item>
          <n-descriptions-item label="告警:">
            {{ deviceDataStore?.deviceData?.remark1 || '无告警' }}
          </n-descriptions-item>
        </n-descriptions>
      </div>
      <n-divider title-placement="left"></n-divider>
      <div>
        <n-tabs type="line">
          <n-tab-pane
            v-for="component in components.filter(
              i => !(i.key === 'device-analysis') || deviceDataStore?.deviceData?.parent_id
            )"
            :key="component.key"
            :tab="component.name"
            :name="component.name"
          >
            <component
              :is="component.component"
              :id="id as string"
              :device-config-id="deviceDataStore?.deviceData?.device_config_id || ''"
            />
          </n-tab-pane>
        </n-tabs>
      </div>
    </n-card>
  </div>
</template>

<style scoped></style>
