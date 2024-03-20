<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { router } from '@/router';
import type { ICardView } from '@/components/panel/card';
import { fetchHomeData } from '@/service/api';

const layout = ref<ICardView[]>([]);
const isError = ref<boolean>(false);
const active = ref<boolean>(true);

const getLayout = async () => {
  const { data, error } = await fetchHomeData({});

  isError.value = (error || !(data && data.config)) as boolean;

  if (!isError.value && data) {
    const configJson = JSON.parse(data.config);
    layout.value = [...configJson, ...layout.value];
  }
};

onMounted(getLayout);
</script>

<template>
  <div v-if="isError" class="h-full w-full flex-center">
    <n-result status="418" title="首页未配置或配置异常" description="一切尽在不言中">
      <template #footer>
        <n-button
          type="primary"
          :disabled="active"
          @click="
            () => {
              router.go(0);
            }
          "
        >
          <n-countdown
            v-if="active"
            :duration="60000"
            :render="props => props.seconds + 's'"
            :active="active"
            @finish="active = false"
          />
          {{ active ? '' : '刷新' }}
        </n-button>
      </template>
    </n-result>
  </div>

  <CardRender v-else v-model:layout="layout" :is-preview="true" :col-num="12" :default-card-col="4" :row-height="65" />
</template>

<style scoped></style>
