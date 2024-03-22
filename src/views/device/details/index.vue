<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDeviceDataStore } from '@/store/modules/device';
import Telemetry from './models/telemetry.vue';
import Join from './models/join.vue';
import DeviceAnalysis from './models/device-analysis.vue';
import Message from './models/message.vue';
import Stats from './models/stats.vue';
import EventReport from './models/event-report.vue';
import CommandDelivery from './models/command-delivery.vue';
import Automate from './models/automate.vue';
import GiveAnAlarm from './models/give-an-alarm.vue';
import Logs from './models/logs.vue';
import User from './models/user.vue';
import Settings from './models/settings.vue';

const { query } = useRoute();
const { id } = query;

const deviceDataStore = useDeviceDataStore();
const components = [
  { key: 'telemetry', name: '遥测', component: Telemetry },
  { key: 'join', name: '连接', component: Join },
  { key: ' device-analysis', name: '设备解析', component: DeviceAnalysis },
  { key: 'message', name: '信息', component: Message },
  { key: 'stats', name: '属性', component: Stats },
  { key: 'event-report', name: '事件(上报)', component: EventReport },
  { key: 'command-delivery', name: '命令(下发)', component: CommandDelivery },
  { key: 'automate', name: '自动化', component: Automate },
  { key: 'give-an-alarm', name: '告警', component: GiveAnAlarm },
  { key: 'logs', name: '日志', component: Logs },
  { key: 'user', name: '用户', component: User },
  { key: 'settings', name: '设置', component: Settings }
];

onMounted(() => {
  deviceDataStore.fetchData(id as string);
});
</script>

<template>
  <div>
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
        <n-descriptions-item label="告警:">{{ deviceDataStore?.deviceData?.remark1 || '无告警' }}</n-descriptions-item>
      </n-descriptions>
    </div>
    <n-divider title-placement="left"></n-divider>
    <div>
      <n-tabs>
        <n-tab-pane v-for="component in components" :key="component.key" :tab="component.name" :name="component.name">
          <component :is="component.component" :id="id as string" />
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<style scoped></style>
