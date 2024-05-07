<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NButton } from 'naive-ui';
import { CopyOutline as copyIcon, PencilOutline as editIcon, TrashOutline as trashIcon } from '@vicons/ionicons5';
import { $t } from '@/locales';

const alarmList = ref([
  {
    name: '人来自动开灯',
    description: '晚上7点后自动开灯',
    status: true
  },
  {
    name: '打开空调降温',
    description: '气温28度后打开空调降温',
    status: true
  },
  {
    name: '燃气泄露检测',
    description: '检测到燃气超标自动告警通知',
    status: false
  },
  {
    name: '关闭窗帘',
    description: '执行晚安指令时自动关闭窗帘',
    status: false
  },
  {
    name: '油烟机启动',
    description: '检测到燃气灶点火时自动开启油烟机',
    status: true
  }
]);
onMounted(() => {
  alarmList.value = [];
});
</script>

<template>
  <n-empty v-if="alarmList.length === 0" size="huge" description="暂无数据"></n-empty>
  <div v-else class="alarm-box">
    <div v-for="(item, index) in alarmList" :key="index" class="alarm-item">
      <div class="item-name">
        <div>
          {{ item }}
        </div>
        <n-switch />
      </div>
      <div class="item-desc">{{ $t('generate.temperature-alert-above-28') }}</div>
      <NFlex justify="end">
        <NButton circle tertiary type="info">
          <template #icon>
            <n-icon>
              <editIcon />
            </n-icon>
          </template>
        </NButton>
        <NButton circle tertiary type="info">
          <template #icon>
            <n-icon>
              <copyIcon />
            </n-icon>
          </template>
        </NButton>
        <NButton circle tertiary type="error">
          <template #icon>
            <n-icon>
              <trashIcon />
            </n-icon>
          </template>
        </NButton>
      </NFlex>
    </div>
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
