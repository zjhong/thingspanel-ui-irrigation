<script setup lang="ts">

import {NButton, NPagination} from "naive-ui";
import AssociatedDevices  from './modules/associated-devices.vue';
import ExtendInfo  from './modules/extend-info.vue';
import AttributeInfo  from './modules/attribute-info.vue';
import ConnectionInfo  from './modules/connection-info.vue';


import { PencilOutline as editIcon } from '@vicons/ionicons5'
import { CopyOutline as copyIcon } from '@vicons/ionicons5'
import { TrashOutline as trashIcon } from '@vicons/ionicons5'
import {ref} from "vue";

const showGroupModal=()=>{

}

</script>

<template>
  <div class="overflow-hidden">
    <NCard title="设备详情名称" style="height: 100%">
      <template #header-extra>
        <NButton type="primary" @click="showGroupModal">编辑</NButton>
      </template>
      <div>
        设备接入类型：直连设备
      </div>
      <div>
        <n-tabs type="line" animated>
          <n-tab-pane name="关联设备" tab="关联设备">
            <AssociatedDevices/>
          </n-tab-pane>
          <n-tab-pane name="属性与功能" tab="属性与功能">
            <AttributeInfo/>
          </n-tab-pane>
          <n-tab-pane name="连接与认证" tab="连接与认证">
            <ConnectionInfo/>
          </n-tab-pane>
          <n-tab-pane name="数据处理" tab="数据处理" :disabled="true">
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
                    aaaa
                  </div>
                  <n-switch v-model:value="active" />
                </div>
                <div class="item-desc">
                  温度大于28度报警
                </div>
                <div class="item-operate">
                  <n-button tertiary circle type="warning">
                    <template #icon>
                      <n-icon><edit-icon /></n-icon>
                    </template>
                  </n-button>
                  <n-button tertiary circle type="info">
                    <template #icon>
                      <n-icon><copy-icon /></n-icon>
                    </template>
                  </n-button>
                  <n-button tertiary circle type="error">
                    <template #icon>
                      <n-icon><trash-icon /></n-icon>
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
      </div>
    </NCard>
  </div>
</template>

<style scoped lang="scss">
:deep(.n-card-header__main){
  width: auto;
  flex: none !important;
}
:deep(.n-card-header__extra){
  flex: 1;
  margin-left: 20px;
}
.alarm-box{
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 0;
  .alarm-item{
    border: solid 1px #000000;
    //margin: 0 10px;
    padding: 12px;
    flex: 0 0 23%;
    margin-right: calc(30% / 3);
    margin-bottom: 20px;
    .item-name{
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: space-between;
    }
    .item-desc{
      margin: 15px 0;
    }
    .item-operate{
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
