<!--
 * @Descripttion:
 * @version:
 * @Author: zhaoqi
 * @Date: 2024-03-23 09:35:32
 * @LastEditors: zhaoqi
 * @LastEditTime: 2024-03-25 15:41:08
-->
<script lang="ts" setup>
import { NButton } from "naive-ui";
import { ref, reactive } from "vue";
import type { Ref } from "vue";
import type { DataTableColumns } from "naive-ui";
import { spacesData } from "@/service/api/equipment-map";
import overview from "./components/overview.vue";
import particulars from "./components/particulars.vue";
import spaceManagement from "./components/space-management.vue";
const queryParams = reactive({
  name: "",
  status: null,
});
/**
 *
 * @param e 重置
 */
function handleReset(e) {
  queryParams.name = "";
}
/**
 * 搜索列表
 */
const listData = ref([]);
/**
 * 列表
 */
async function spacesDataList() {
  const name = { name: queryParams.name };
  const { data } = await spacesData(name);

  if (data) {
    console.log("列表", data);
    listData.value = data.list;
  }
}
function nameInput() {
  console.log(111111, queryParams.name);
  spacesDataList();
}
function selectClick(index) {
  console.log("index", index);
}
const onLine: any = ref([
  {
    value: "on-line",
    label: "在线",
  },
  {
    value: "off-line",
    label: "离线",
  },
]);
const normal: any = ref([
  {
    value: "warning",
    label: "告警",
  },
  {
    value: "normal",
    label: "正常",
  },
]);
const onLineValue = ref(null);
const normalValue = ref(null);
/**
 * 在线离线选择

 */
function onLineChecked() {
  console.log("选项111111", onLineValue.value);
}
/**
 * 在线离线选择,已选择点击取消选中
 */
function onLineCheckeds() {
  console.log("选项2222", onLineValue.value);
  onLineValue.value = null;
}
/**
 * 告警正常选择

 */
function normalValueChecked() {
  console.log("选项111111", onLineValue.value);
}
/**
 * 告警正常选择选择,已选择点击取消选中
 */
function normalValueCheckeds() {
  console.log("选项2222", onLineValue.value);
  normalValue.value = null;
}

interface ColumnsData {
  name: string;
  state: string;
  warning: string;
}
const data = [
  {
    name: "设备1",
    state: "在线",
    warning: "正常",
  },
];
const columns: Ref<DataTableColumns<ColumnsData>> = ref([
  {
    key: "name",
    title: "设备名称",
    align: "center",
  },
  {
    key: "state",
    title: "状态",
    align: "center",
    ellipsis: {
      tooltip: true,
    },
  },
  {
    key: "warning",
    title: "告警",
    align: "center",
    ellipsis: {
      tooltip: true,
    },
  },
]) as Ref<DataTableColumns<ColumnsData>>;
</script>

<template>
  <div class="h-full">
    <!--    菜单-->
    <NCard title="设备地图" :bordered="false" class="rounded-8px shadow-sm">
      <div class="particulars">
        <div class="w-100 search-criteria">
          <n-radio-group v-model:value="onLineValue" name="radiogroup">
            <n-space>
              <n-radio
                v-for="song in onLine"
                :key="song.value"
                v-model:value="song.value"
                @change="onLineChecked"
                @click="onLineCheckeds"
              >
                {{ song.label }}
              </n-radio>
            </n-space>
          </n-radio-group>

          <NSpace class="pb-16px">
            <n-radio-group v-model:value="normalValue" name="radiogroup">
              <n-space>
                <n-radio
                  v-for="song in normal"
                  :key="song.value"
                  :value="song.value"
                  @change="normalValueChecked"
                  @click="normalValueCheckeds"
                >
                  {{ song.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </NSpace>
          <NCard class="search-box">
            <NForm
              ref="queryFormRef"
              :model="queryParams"
              label-placement="left"
            >
              <div class="search">
                <NInput
                  v-model:value="queryParams.name"
                  placeholder="搜索空间或区域"
                  class="search-input"
                  @change="nameInput"
                />
                <NButton class="w-72px" type="primary" @click="handleReset"
                  >重置</NButton
                >
              </div>
            </NForm>
            <div class="collapse" v-if="listData.length > 0">
              <n-collapse>
                <n-collapse-item title="全部">
                  <n-collapse>
                    <n-collapse-item
                      v-for="item in listData"
                      :key="item"
                      :title="item.space_name"
                      :name="item.space_id"
                    >
                      <div
                        class="test-box"
                        v-for="items in item.districts"
                        :key="items"
                        @click="selectClick(items.district_id)"
                      >
                        {{ items.district_name }}
                      </div>
                    </n-collapse-item>
                  </n-collapse>
                </n-collapse-item>
              </n-collapse>
            </div>
            <div v-if="listData.length === 0">暂无数据</div>
          </NCard>

          <!--    筛选设备-->
          <div class="device-type">
            <NCard title="" class="rounded-8px shadow-sm type-lf">
              <div><span class="type"> 所有设备类型</span><span>8</span></div>
              <div><span class="type">阀门</span><span>1</span></div>
              <div><span class="type">水泵</span><span>2</span></div>
              <div><span class="type">土壤传感器</span><span>1</span></div>
              <div><span class="type">水泵变频器</span><span>1</span></div>
              <div><span class="type">摄像头</span><span>1</span></div>
              <div><span class="type">灌溉控制器</span><span>1</span></div>
            </NCard>
            <NCard title="" class="rounded-8px shadow-sm type-rg">
              <n-data-table :columns="columns" :data="data" :bordered="false" />
            </NCard>
          </div>
        </div>

        <!-- 添加空间模块 -->
        <div class="add-space">
          <n-card>
            <n-tabs type="line" animated placement="left" size="large">
              <n-tab-pane name="设备总览" tab="设备总览">
                <overview />
              </n-tab-pane>
              <n-tab-pane name="设备详情" tab="设备详情">
                <particulars />
              </n-tab-pane>
              <n-tab-pane name="空间/区域管理" tab="空间/区域管理">
                <spaceManagement />
              </n-tab-pane>
            </n-tabs>
          </n-card>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.particulars {
  display: flex;
}
.search-criteria {
  width: 50%;
  height: 100%;
}
.search {
  display: flex;
}
.search-input {
  margin-right: 15px;
}
.collapse {
  margin-top: 15px;
}
.device-type {
  display: flex;
  margin-top: 15px;
}
.type {
  margin-right: 15px;
}
.search-box {
  width: 50%;
  height: 100%;
}
.type-lf {
  width: 40%;
  margin-right: 10%;
  height: 100%;
}
.type-rg {
  width: 40%;
  height: 100%;
}
.add-space {
  width: 50%;
}
.test-box {
  padding: 10px;
}
.test-box:hover {
  color: rgb(47, 16, 189);
  cursor: pointer;
}
</style>
