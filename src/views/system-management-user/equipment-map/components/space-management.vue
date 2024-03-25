<!--
 * @Descripttion:
 * @version:
 * @Author: zhaoqi
 * @Date: 2024-03-23 13:13:50
 * @LastEditors: zhaoqi
 * @LastEditTime: 2024-03-26 00:34:21
-->
<!--
 * @Descripttion:
 * @version:
 * @Author: zhaoqi
 * @Date: 2024-03-23 11:36:02
 * @LastEditors: zhaoqi
 * @LastEditTime: 2024-03-24 15:13:13
-->
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useMessage } from "naive-ui";
import GaoDe from "./map/gaode-map.vue";

import { addSpace } from "@/service/api/equipment-map";
import { useNaiveForm } from "@/hooks/common/form";
import addAreaPage from "./add-area.vue";

const message = useMessage();
const { formRef } = useNaiveForm();

type spaceSpaceForm = {
  name: string;
  spaces_id: string;
  sort: string | number;
  location: string;
  scope: string;
  locationText: string;
  description: string;
  dimensionality: string;
};
const spaceForm = reactive<spaceSpaceForm>({
  name: "",
  spaces_id: "",
  sort: 1,
  location: "", //经度
  locationText: "", //经纬度反显
  scope: "",
  description: "",
  dimensionality: "", //维度
});

const rules = {
  name: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入空间名称",
  },
  location: {
    required: true,
    trigger: ["blur", "change"],
    message: "请设置空间位置",
  },
};

function getLocation(e) {
  console.log("8888888地图", e);
  spaceForm.locationText =
    "经度:" +
    e.location.lng +
    " " +
    " " +
    " " +
    " " +
    " " +
    " " +
    "维度:" +
    e.location.lat;
}
function oNscope(val) {
  console.log("地图val", val);
  const scope: any = [];
  let data: any = "";
  val.map((item, index) => {
    data = item.lat + "," + item.lng;
    scope.push(data);
  });
  spaceForm.scope = JSON.stringify(scope);
  console.log("spaceForm.scope", spaceForm.scope);
}

/**
 * 添加空间
 */
const add = async () => {
  const data = {
    name: spaceForm.name,
    sort: spaceForm.sort,
    location: former.value.dimension[0] + "," + former.value.dimension[1],
    scope: spaceForm.scope,
    description: spaceForm.description,
  };
  const res = await addSpace(data);
  if (res) {
    message.success("添加成功");
  } else {
    message.error("添加失败");
  }
};
/**
 * 取消添加空间
 */
function closeModal() {
  spaceForm.scope = "1";
  spaceForm.name = "";
  spaceForm.sort = 1;
  spaceForm.location = "";
  spaceForm.description = "";
}

function handleReset(e) {
  console.log(spaceForm);
  // Object.assign(spaceForm, {
  //   name: "",
  //   sort: "",
  //   location: "",
  //   scope: "",
  //   description: "",
  // });
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      add();
    } else {
      console.log("验证失败");
    }
  });
}
const former = ref({
  mapLocal: "",
  mapAddress: "",
  longitude: "", //地图纬度信息
  latitude: "", //地图经度信息
  scope: "",
  dimension: [121.50861, 31.25141],
});
const getChildList = ref();
function locationChange(e) {
  former.value.dimension[0] = e;
}
function dimensionalityChange(e) {
  former.value.dimension[1] = e;
  getChildList.value.mapInit(former.value.dimension);
}
</script>

<template>
  <n-card title="空间管理">
    <n-tabs type="line" animated>
      <n-tab-pane name="oasis" tab="添加空间">
        <n-scrollbar style="max-height: 550px">
          <NSpace class="w-full pt-4" :size="24" justify="center">
            <NForm
              ref="formRef"
              label-placement="left"
              :label-width="80"
              :model="spaceForm"
              :rules="rules"
            >
              <NGrid :cols="1" :x-gap="18">
                <NFormItemGridItem :span="16" label="空间名称" path="name">
                  <NInput v-model:value="spaceForm.name" />
                </NFormItemGridItem>
                <!-- <NFormItemGridItem
                  :span="18"
                  label="空间位置"
                  path="locationText"
                  class="whitespace-nowrap"
                >
                  <NInput
                    v-model:value="spaceForm.locationText"
                    placeholder=""
                  />
                </NFormItemGridItem> -->
                <NFormItemGridItem
                  :span="18"
                  label="空间位置"
                  path="location"
                  class="whitespace-nowrap"
                >
                  经度<NInput
                    v-model:value="spaceForm.location"
                    placeholder="请输入经度"
                    @change="locationChange"
                  />
                  纬度<NInput
                    v-model:value="spaceForm.dimensionality"
                    placeholder="请输入维度"
                    @change="dimensionalityChange"
                  />
                </NFormItemGridItem>
                <NFormItemGridItem :span="16" label="地图范围" path="scope">
                  <GaoDe
                    v-on:locationValue="getLocation"
                    @update:value="oNscope"
                    :keywords="former.mapLocal"
                    :keyAddress="former.mapAddress"
                    :lnglatArr="former.scope"
                    :isMarkerShow="true"
                    :dimension="former.dimension"
                    ref="getChildList"
                  />
                </NFormItemGridItem>
                <NFormItemGridItem
                  :span="16"
                  label="位置详情"
                  path="description"
                >
                  <NInput
                    v-model:value="spaceForm.description"
                    type="textarea"
                    placeholder=""
                  />
                </NFormItemGridItem>
              </NGrid>
              <NSpace class="w-full pt-16px" :size="24" justify="center">
                <NButton class="w-72px" @click="closeModal">取消</NButton>
                <NButton class="w-72px" type="primary" @click="handleReset"
                  >保存</NButton
                >
              </NSpace>
            </NForm>
          </NSpace>
        </n-scrollbar>
      </n-tab-pane>
      <n-tab-pane name="the beatles" tab="添加区域">
        <addAreaPage />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<style scoped>
.add-box {
  margin-top: 20px;
}
</style>
