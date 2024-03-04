<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMessage } from 'naive-ui';
import { deviceGroupDetail, getDeviceGroup } from '@/service/api/device';
const route = useRoute();
const id = route.query.id;
const message = useMessage();
const geDetails = async () => {
  if (!id) {
    message.error('没有传人的分组id');
  } else {
    const res = await deviceGroupDetail({ id });

    console.log(res);

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
  <div>{{ 'details:' + id }}</div>
</template>

<style scoped></style>
