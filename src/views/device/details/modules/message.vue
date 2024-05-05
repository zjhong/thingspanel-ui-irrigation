<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { deviceConfigInfo, deviceDetail, deviceLocation } from '@/service/api';
import TencentMap from './public/tencent-map.vue'; // 路径根据实际位置调整
const props = defineProps<{
  id: string;
  deviceConfigId: string;
}>();
const latitude = ref('');
const longitude = ref('');
const isShow = ref(false);
const additionInfo = ref<any>({});
const { query } = useRoute();

const onPositionSelected = position => {
  latitude.value = position.lat.toString();
  longitude.value = position.lng.toString();
  isShow.value = false;
};

const openMapAndGetPosition = () => {
  isShow.value = true;
};
const getConfigInfo = async () => {
  const result = await deviceDetail(query.d_id as string);
  const location = result?.data?.location || '';
  const deviceAdditionalInfo = JSON.parse(result?.data?.additional_info || '');
  const locationData = location?.split(',') || [];
  latitude.value = locationData[1] || '';
  longitude.value = locationData[0] || '';

  if (props.deviceConfigId) {
    const resultData = await deviceConfigInfo({ id: props.deviceConfigId });
    const tempAdditionalInfo = resultData?.data?.additional_info || '';
    if (tempAdditionalInfo) {
      const extendedInfo = deviceAdditionalInfo?.extendedInfo || [];
      additionInfo.value = (JSON.parse(tempAdditionalInfo) || []).map(item => {
        return {
          name: item.name,
          value: extendedInfo.find(info => info.name === item.name)?.value || item.default_value
        };
      });
    }
  }
};

const handleSave = () => {
  deviceLocation({
    id: props.id,
    location: `${longitude.value},${latitude.value}`,
    additional_info: JSON.stringify({ extendedInfo: additionInfo.value })
  });
};

onMounted(getConfigInfo);
</script>

<template>
  <div>
    <NCard title="设备位置" class="mb-4">
      <n-space>
        <NInput v-model:value="longitude" placeholder="经度" class="w-140px" />
        <NInput v-model:value="latitude" placeholder="纬度" class="w-140px" />

        <NButton @click="openMapAndGetPosition">定位</NButton>
      </n-space>
    </NCard>

    <NCard title="扩展信息" class="mb-4">
      <template v-for="item in additionInfo" :key="item.name">
        <NFlex justify="space-between" class="mb-24px items-center">
          <div class="flex items-center">
            <div class="w-60px">{{ item.name }}:</div>
            <NInput v-model:value="item.value" />
          </div>
        </NFlex>
      </template>
    </NCard>

    <NButton @click="handleSave">保存</NButton>
    <NModal v-model:show="isShow" class="w-440px flex-center">
      <NCard>
        <TencentMap
          v-show="isShow"
          :longitude="longitude"
          :latitude="latitude"
          @position-selected="onPositionSelected"
        />
      </NCard>
    </NModal>
  </div>
</template>
