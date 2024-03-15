<script setup lang="ts">
import { NButton } from 'naive-ui';
import { CopyOutline as copyIcon, PencilOutline as editIcon, TrashOutline as trashIcon } from '@vicons/ionicons5';
</script>

<template>
  <div class="alarm-box">
    <div v-for="item in 5" :key="item" class="alarm-item">
      <div class="item-name">
        <div>
          {{ item }}
        </div>
        <n-switch />
      </div>
      <div class="item-desc">温度大于28度报警</div>
      <div class="item-operate">
        <NButton circle tertiary type="warning">
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
      </div>
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
