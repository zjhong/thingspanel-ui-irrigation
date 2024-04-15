<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { deviceConfigInfo, deviceLocation } from '@/service/api';
import TencentMap from './public/tencent-map.vue'; // 路径根据实际位置调整
const props = defineProps<{
  id: string;
  deviceConfigId: string;
}>();
const latitude = ref('');
const longitude = ref('');
const isShow = ref(false);

const onPositionSelected = position => {
  latitude.value = position.lat.toString();
  longitude.value = position.lng.toString();
  isShow.value = false;
};

const openMapAndGetPosition = () => {
  isShow.value = true;
};
const getConfigInfo = async () => {
  const res = deviceConfigInfo({ id: props.deviceConfigId });
  console.log(res);
};

const handleSave = () => {
  deviceLocation({ id: props.id, location: `${latitude.value},${longitude.value}` });
};

onMounted(getConfigInfo);
</script>

<template>
  <div>
    <NCard title="设备位置" class="mb-4">
      <n-space>
        <NInput v-model:value="latitude" placeholder="纬度" class="w-140px" />
        <NInput v-model:value="longitude" placeholder="经度" class="w-140px" />
        <NButton @click="openMapAndGetPosition">定位</NButton>
      </n-space>
    </NCard>

    <NCard title="扩展信息" class="mb-4"></NCard>

    <NButton @click="handleSave">保存</NButton>
    <NModal v-model:show="isShow" class="w-440px flex-center">
      <NCard>
        <TencentMap @position-selected="onPositionSelected" />
      </NCard>
    </NModal>
  </div>
</template>
