<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { router } from '@/router';
import type { ICardView } from '@/components/panel/card';
import { fetchHomeData } from '@/service/api';
import { $t } from '@/locales';

const layout = ref<ICardView[]>([]);
const isError = ref<boolean>(false);
const active = ref<boolean>(true);

const getLayout = async () => {
  const { data, error } = await fetchHomeData({});

  isError.value = (error || !(data && data.config)) as boolean;

  if (!isError.value && data) {
    const configJson = JSON.parse(data.config);
    updateConfigData(configJson);
    layout.value = [...configJson, ...layout.value];
  }
};

onMounted(getLayout);

/**
 * Todo: Once all config data in server are updated to use unique number as "i" attribute, we can remove this function.
 * Convert a string to a unique number.
 *
 * @param str
 * @returns
 */
function stringToUniqueNumber(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = hash * 31 + str.charCodeAt(i);
  }
  return hash;
}

/**
 * Todo: Once all config data in server are updated to use unique number as "i" attribute, we can remove this function.
 * The attribute "i" of each config data may be a string instead of a number, so we need to convert it to a unique
 * number to avoid Vue's warning.
 *
 * @param configJson
 */
function updateConfigData(configJson: ICardView[]) {
  for (const item of configJson) {
    if (typeof item.i === 'string') {
      item.i = stringToUniqueNumber(item.i);
    }
  }
}
</script>

<template>
  <div v-if="isError" class="h-full w-full flex-center">
    <n-result status="418" :title="$t('custom.home.title')" :description="$t('custom.home.description')">
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
          {{ active ? '' : $t('custom.home.refresh') }}
        </n-button>
      </template>
    </n-result>
  </div>

  <!--
 <div v-else>


  </div> 
-->
  <CardRender
    v-else
    ref="cr"
    :layout="layout"
    :is-preview="true"
    :col-num="12"
    :default-card-col="4"
    :row-height="85"
    @update:layout="
      data => {
        nextTick(() => {
          layout = data;
        });
      }
    "
  />
</template>

<style scoped></style>
