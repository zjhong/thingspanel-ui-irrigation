<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NButton, NCard, NFlex, NGrid, NGridItem, NPagination } from 'naive-ui';
import { deviceAlarmList } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
const { routerPushByKey } = useRouterPush();

const props = defineProps<{
  // eslint-disable-next-line vue/prop-name-casing
  config_id: string;
}>();
const queryData = ref({
  page: 1,
  page_size: 10,
  device_config_id: ''
});
const alarmTotal = ref(0);
const alarmList = ref([]);
const getAlarmList = async () => {
  queryData.value.device_config_id = props.config_id;
  const res = await deviceAlarmList(queryData.value);
  alarmList.value = res.data.list || [];
  alarmTotal.value = res.data.total;
};
const alarmAdd = () => {
  routerPushByKey('automation_linkage-edit', {
    query: { device_config_id: props.config_id }
  });
};
onMounted(() => {
  getAlarmList();
});
</script>

<template>
  <div class="alarm-list">
    <NCard class="w-full">
      <NFlex justify="flex-end" class="mb-4">
        <NButton type="primary" @click="alarmAdd()">新增告警</NButton>
      </NFlex>
      <n-empty
        v-if="alarmList.length === 0"
        size="huge"
        description="暂无数据"
        class="min-h-60 justify-center"
      ></n-empty>
      <NGrid v-else x-gap="20px" y-gap="20px" cols="1 s:2 m:3 l:4" responsive="screen">
        <NGridItem v-for="(item, index) in alarmList" :key="index">
          <NCard hoverable style="height: 160px">
            <NFlex justify="space-between" align="center" class="mb-4">
              <div class="text-16px font-600">
                {{ item['name'] }}
              </div>
            </NFlex>
            <div>{{ item['description'] }}</div>
            <!--            <NFlex justify="flex-end" class="mt-4">-->
            <!--              <NTooltip trigger="hover">-->
            <!--                <template #trigger>-->
            <!--                  <NButton tertiary circle type="warning" @click="linkEdit(item)">-->
            <!--                    <template #icon>-->
            <!--                      <n-icon>-->
            <!--                        <editIcon />-->
            <!--                      </n-icon>-->
            <!--                    </template>-->
            <!--                  </NButton>-->
            <!--                </template>-->
            <!--                {{ $t('common.edit') }}-->
            <!--              </NTooltip>-->
            <!--              <NTooltip trigger="hover">-->
            <!--                <template #trigger>-->
            <!--                  <NButton circle tertiary type="info" @click="openLog(item)">-->
            <!--                    <template #icon>-->
            <!--                      <n-icon>-->
            <!--                        <copyIcon />-->
            <!--                      </n-icon>-->
            <!--                    </template>-->
            <!--                  </NButton>-->
            <!--                </template>-->
            <!--                {{ $t('page.irrigation.time.log.name') }}-->
            <!--              </NTooltip>-->
            <!--              <NTooltip trigger="hover">-->
            <!--                <template #trigger>-->
            <!--                  <NButton circle tertiary type="error" @click="deleteLink(item)">-->
            <!--                    <template #icon>-->
            <!--                      <n-icon>-->
            <!--                        <trashIcon />-->
            <!--                      </n-icon>-->
            <!--                    </template>-->
            <!--                  </NButton>-->
            <!--                </template>-->
            <!--                {{ $t('common.delete') }}-->
            <!--              </NTooltip>-->
            <!--            </NFlex>-->
          </NCard>
        </NGridItem>
      </NGrid>
      <NFlex justify="flex-end" class="mt-4">
        <NPagination
          v-model:page="queryData.page"
          :page-size="queryData.page_size"
          :item-count="alarmTotal"
          @update:page="getAlarmList"
        />
      </NFlex>
    </NCard>
  </div>
</template>

<style scoped lang="scss">
.alarm-box {
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 40px;

  .alarm-item {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    //margin: 0 10px;
    padding: 18px;
    flex: 0 0 23%;
    margin-right: calc(30% / 3);
    margin-bottom: 30px;

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
