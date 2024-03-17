<script setup lang="ts">
import { useRoute } from 'vue-router';
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
</script>

<template>
  <div>
    <div></div>
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
