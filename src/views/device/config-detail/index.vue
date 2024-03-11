<script lang="ts" setup>

import {NButton} from "naive-ui";
import AssociatedDevices from './modules/associated-devices.vue';
import ExtendInfo from './modules/extend-info.vue';
import AttributeInfo from './modules/attribute-info.vue';
import ConnectionInfo from './modules/connection-info.vue';


import {CopyOutline as copyIcon, PencilOutline as editIcon, TrashOutline as trashIcon} from '@vicons/ionicons5'
import {router} from "@/router";
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {deviceConfigInfo} from "@/service/api/device";

const route = useRoute()
const configId = ref(route.query.id || '' as any)
const configForm = ref({})
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
          <AttributeInfo :device_template_id="configForm.device_template_id || ''"/>
        </n-tab-pane>
        <n-tab-pane name="连接与认证" tab="连接与认证">
          <ConnectionInfo key="ConnectionInfo"/>
        </n-tab-pane>
        <n-tab-pane :disabled="true" name="数据处理" tab="数据处理">
          <div>

          </div>
        </n-tab-pane>
        <n-tab-pane name="自动化" tab="自动化">
          <div>

          </div>
        </n-tab-pane>
        <n-tab-pane name="告警" tab="告警">
          <div class="alarm-box">
            <div v-for="item in 5" class="alarm-item">
              <div class="item-name">
                <div>
                  {{ item }}
                </div>
                <n-switch/>
              </div>
              <div class="item-desc">
                温度大于28度报警
              </div>
              <div class="item-operate">
                <n-button circle tertiary type="warning">
                  <template #icon>
                    <n-icon>
                      <editIcon/>
                    </n-icon>
                  </template>
                </n-button>
                <n-button circle tertiary type="info">
                  <template #icon>
                    <n-icon>
                      <copyIcon/>
                    </n-icon>
                  </template>
                </n-button>
                <n-button circle tertiary type="error">
                  <template #icon>
                    <n-icon>
                      <trashIcon/>
                    </n-icon>
                  </template>
                </n-button>
              </div>
            </div>
          </div>
        </n-tab-pane>
        <n-tab-pane name="扩展信息" tab="扩展信息">
          <div>
            <ExtendInfo/>
          </div>
        </n-tab-pane>
        <n-tab-pane name="设备设置" tab="设备设置">
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

.alarm-box {
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 0;

  .alarm-item {
    border: solid 1px #000000;
    //margin: 0 10px;
    padding: 12px;
    flex: 0 0 23%;
    margin-right: calc(30% / 3);
    margin-bottom: 20px;

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
}
</style>
