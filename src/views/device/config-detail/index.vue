<script lang="ts" setup>
import {NButton} from "naive-ui";
import AssociatedDevices from './modules/associated-devices.vue';
import ExtendInfo from './modules/extend-info.vue';
import AttributeInfo from './modules/attribute-info.vue';
import ConnectionInfo from './modules/connection-info.vue';
import AlarmInfo from './modules/alarm-info.vue';


import {router} from "@/router";
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {deviceConfigInfo} from "@/service/api/device";

const route = useRoute()
const configId = ref(route.query.id || '' as any)
const configForm = ref({
    id:route.query.id || ''
})
const editConfig = () => {
  router.push({name: 'device_config-edit', query: {id: configId.value}});
}
const getConfig = async () => {
  const res = await deviceConfigInfo({id: configId.value})
  configForm.value = res.data
}

onMounted(async () => {
  // configId.value = <string>route.query.id || ''
  if (configId.value) {
    await getConfig()
  }
})
</script>

<template>
  <div class="overflow-hidden h-full">
    <NCard :title="configForm.name">
      <template #header-extra>
        <NButton type="primary" @click="editConfig">编辑</NButton>
      </template>
      <!--      <NFlex vertical>-->
      <div>
        设备接入类型：
        <template v-if="configForm.device_type==='1'">直连设备</template>
        <template v-if="configForm.device_type==='2'">网关</template>
        <template v-if="configForm.device_type==='3'">网关子设备</template>
      </div>
      <n-tabs animated type="line">
        <n-tab-pane name="关联设备" tab="关联设备">
          <AssociatedDevices :device_config_id="configId"/>
        </n-tab-pane>
        <n-tab-pane name="属性与功能" tab="属性与功能">
          <AttributeInfo :config-info="configForm" @upDateConfig="getConfig"/>
        </n-tab-pane>
        <n-tab-pane name="连接与认证" tab="连接与认证">
          <ConnectionInfo  :config-info="configForm" @upDateConfig="getConfig"/>
        </n-tab-pane>
        <n-tab-pane :disabled="true" name="数据处理" tab="数据处理">
        </n-tab-pane>
        <n-tab-pane name="自动化" tab="自动化" :disabled="true">
        </n-tab-pane>
        <n-tab-pane name="告警" tab="告警">
            <AlarmInfo />
        </n-tab-pane>
        <n-tab-pane name="扩展信息" tab="扩展信息">
            <ExtendInfo :config-info="configForm" @upDateConfig="getConfig"/>
        </n-tab-pane>
        <n-tab-pane name="设备设置" tab="设备设置" :disabled="true">
          <div>

          </div>
        </n-tab-pane>
      </n-tabs>
      <!--      </NFlex>-->
    </NCard>
  </div>
</template>

<style lang="scss" scoped>
:deep(.n-card-header__main) {
  width: auto;
  flex: none !important;
}

:deep(.n-card-header__extra) {
  flex: 1;
  margin-left: 20px;
}

:deep(.n-tabs) {
  height: calc(100% - 80px);
}

</style>
