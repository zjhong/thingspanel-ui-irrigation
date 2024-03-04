<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMessage } from 'naive-ui';
import { deviceGroupDetail, getDeviceGroup } from '@/service/api/device';

const route = useRoute();
const id = route.query.id;
const title = ref('标题');
const message = useMessage();
const geDetails = async () => {
  if (!id) {
    message.error('没有传人的分组id');
  } else {
    const { data, error } = await deviceGroupDetail({ id });

    if (!error && data) {
      title.value = data.detail.name;
    }

    const res2 = await getDeviceGroup({
      page: 1,
      page_size: 10,
      parent_id: id
    });
    console.log(res2);
  }
};

onMounted(geDetails);
</script>

<template>
  <NSpace vertical :size="16">
    <NCard :title="title" style="margin-bottom: 16px">
      <NTabs type="line" animated>
        <NTabPane name="详情" tab="详情"></NTabPane>
        <NTabPane name="编辑" tab="设置">Hey Jude</NTabPane>
      </NTabs>
    </NCard>
  </NSpace>
</template>

<style scoped></style>
