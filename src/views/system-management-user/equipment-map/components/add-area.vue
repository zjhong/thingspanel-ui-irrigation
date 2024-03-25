<script setup lang="tsx">
import { ref, reactive } from "vue";
import { useMessage } from "naive-ui";
import GaoDes from "./map/gaode-maps.vue";
import { addArea } from "@/service/api/equipment-map";
import type { UploadFileInfo } from "naive-ui";
import { createServiceConfig } from "~/env.config";

const { otherBaseURL } = createServiceConfig(import.meta.env);
const url = ref(new URL(otherBaseURL.demo));
const message = useMessage();
type spaceAreaForm = {
  name: string;
  spaces_id: string;
  sort: string | number;
  location: string;
  scope: string;
  image_url: string;
  description: string;
  remark: string;
  area: string;
  water_requirement: string;
  crop_type: string;
  soil_type: string;
  irrigation_type: string;
  locationTexe: string;
  dimensionality: string;
};
const fileList = ref([]);
const spaces = ref([
  {
    label: "A空间",
    value: "A",
  },
  {
    label: "B空间",
    value: "B",
  },
]);
const areaForm = reactive<spaceAreaForm>({
  name: "",
  spaces_id: "",
  sort: 1,
  location: "",
  scope: "",
  image_url: "",
  description: "",
  remark: "",
  area: "",
  water_requirement: "",
  crop_type: "",
  soil_type: "",
  irrigation_type: "",
  locationTexe: "",
  dimensionality: "",
});

const areaRules = {
  spaces_id: {
    required: true,
    trigger: ["blur", "input"],
    message: "请选择所属空间",
  },
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
function getLocationClick(e) {
  console.log("地图22222", e);
  areaForm.locationTexe =
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
  const scope: any = [];
  let data: any = "";
  val.map((item, index) => {
    data = item.lat + "," + item.lng;
    scope.push(data);
  });
  areaForm.scope = JSON.stringify(scope);
  console.log("spaceForm.scope", areaForm.scope);
}
/**
 *
 * @param e 添加区域
 */
const addAreas = async () => {
  const data = { ...areaForm };
  data.location = former.value.dimension[0] + "," + former.value.dimension[1];
  const res = await addArea(data);

  if (res) {
    message.success("添加成功");
    (areaForm.name = ""),
      (areaForm.spaces_id = ""),
      (areaForm.sort = 1),
      (areaForm.location = ""),
      (areaForm.scope = ""),
      (areaForm.image_url = ""),
      (areaForm.description = ""),
      (areaForm.remark = ""),
      (areaForm.area = ""),
      (areaForm.water_requirement = ""),
      (areaForm.crop_type = ""),
      (areaForm.soil_type = ""),
      (areaForm.irrigation_type = ""),
      (areaForm.locationTexe = "");
  } else {
    message.error("添加失败");
  }
};
/**
 * 添加区域
 */
function addAreaClick(e) {
  console.log("添加区域");
  addAreas();
  // Object.assign(areaForm, {
  //   name: "",
  //   spaces_id: "",
  //   sort: "",
  //   location: "",
  //   scope: "",
  //   image_url: "",
  //   description: "",
  //   remark: "",
  // });
  // e.preventDefault();
  // formRef.value?.validate((errors) => {
  //   if (!errors) {
  //     add();
  //   } else {
  //     console.log("验证失败");
  //   }
  // });
}
const former = ref({
  mapLocal: "",
  mapAddress: "",
  longitude: "", //地图纬度信息
  latitude: "", //地图经度信息
  dimension: [121.50861, 31.25141],
});
function closeModal() {
  console.log("取消");
}
async function beforeUpload(data: {
  file: UploadFileInfo;
  fileList: UploadFileInfo[];
}) {
  console.log(1111, data);
  if (data.file.file?.type !== "image/png") {
    message.error("只能上传png格式的图片文件，请重新上传");
    return false;
  }
}
function handlePictureCardPreview(file) {
  console.log(9999, file);
}
const getChildList = ref();
function locationChange(e) {
  former.value.dimension[0] = e;
}
function dimensionalityChange(e) {
  former.value.dimension[1] = e;
  former.value.mapAddress = "";
  getChildList.value.mapInit(former.value.dimension);
}
</script>

<template>
  <NCard>
    <n-scrollbar style="max-height: 550px">
      <NSpace class="space-box" :size="24">
        <NForm
          ref="formRef"
          label-placement="left"
          :label-width="80"
          :model="areaForm"
          :rules="areaRules"
        >
          <NGrid :cols="1" :x-gap="24">
            <NFormItemGridItem :span="1" label="所属空间" path="spaces_id">
              <NSelect
                v-model:value="areaForm.spaces_id"
                class="w-200px"
                :options="spaces"
              />
            </NFormItemGridItem>
            <NFormItemGridItem :span="1" label="区域名称" path="name">
              <NInput v-model:value="areaForm.name" placeholder="" />
            </NFormItemGridItem>

            <!-- <NFormItemGridItem
              label="区域位置"
              path="locationText"
              class="whitespace-nowrap"
            >
              <NInput v-model:value="areaForm.locationTexe" placeholder="" />
            </NFormItemGridItem> -->
            <NFormItemGridItem
              :span="18"
              label="空间位置"
              path="location"
              class="whitespace-nowrap"
            >
              经度<NInput
                v-model:value="areaForm.location"
                placeholder="请输入经度"
                @change="locationChange"
              />
              纬度<NInput
                v-model:value="areaForm.dimensionality"
                placeholder="请输入维度"
                @change="dimensionalityChange"
              />
            </NFormItemGridItem>
            <NFormItemGridItem label="地图范围" path="scope">
              <GaoDes
                v-on:locationValue="getLocationClick"
                :keywords="former.mapLocal"
                :keyAddress="former.mapAddress"
                :isMarkerShow="true"
                @update:value="oNscope"
                :dimension="former.dimension"
                ref="getChildList"
              />
            </NFormItemGridItem>
            <NFormItemGridItem label="区域图片" path="image_url">
              <n-upload
                :action="url + '/file/up'"
                :default-file-list="fileList"
                list-type="image-card"
                @before-upload="beforeUpload"
                @preview="handlePictureCardPreview"
              >
              </n-upload>
            </NFormItemGridItem>
            <NFormItemGridItem label="区域面积" path="area" class="text-nowrap">
              <NInput
                v-model:value="areaForm.area"
                placeholder=""
                class="mr-2"
              />公顷
            </NFormItemGridItem>
            <NFormItemGridItem
              label-width="120"
              label="作物所需供水量"
              path="water_requirement"
            >
              <NInput
                v-model:value="areaForm.water_requirement"
                placeholder=""
                class="mr-2"
              />升
            </NFormItemGridItem>
            <NFormItemGridItem label="种植作物" path="crop_type">
              <NInput v-model:value="areaForm.crop_type" placeholder="" />
            </NFormItemGridItem>
            <NFormItemGridItem label="土壤类型" path="soil_type">
              <NInput v-model:value="areaForm.soil_type" placeholder="" />
            </NFormItemGridItem>
            <NFormItemGridItem label="灌溉类型" path="irrigation_type">
              <NInput v-model:value="areaForm.irrigation_type" placeholder="" />
            </NFormItemGridItem>
            <NFormItemGridItem label="位置详情" path="description">
              <NInput
                v-model:value="areaForm.description"
                type="textarea"
                :rows="5"
                placeholder=""
              />
            </NFormItemGridItem>
          </NGrid>
          <NSpace class="w-full" :size="24" justify="center">
            <NButton class="w-72px" @click="closeModal">取消</NButton>
            <NButton class="w-72px" type="primary" @click="addAreaClick"
              >保存</NButton
            >
          </NSpace>
        </NForm>
      </NSpace>
    </n-scrollbar>
  </NCard>
</template>

<style scoped>
:deep(.space-box) {
  display: block !important;
}
</style>
