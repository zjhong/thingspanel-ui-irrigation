<script lang="ts" setup>
import { computed } from 'vue';
// import { getColorPalette } from '@/utils'
// import { CornerBottom, CornerTop } from './components'

type SysSetting = Omit<Api.GeneralSetting.ThemeSetting, 'id'>;
interface Props {
  /** 主题颜色 */
  themeColor: string;
  sysSetting: SysSetting;
}

const props = defineProps<Props>();

// const lightColor = computed(() => getColorPalette(props.themeColor, 3))
// const darkColor = computed(() => getColorPalette(props.themeColor, 6))

const bgColor = computed(() => {
  return props.sysSetting.home_background;
});
</script>

<template>
  <div class="absolute-lt z-1 wh-full overflow-hidden">
    <!--
 <template v-if="!bgColor">
      <div class="absolute -right-300px -top-900px <sm:(-right-100px -top-1170px)">
        <corner-top :start-color="lightColor" :end-color="darkColor" />
      </div>
      <div class="absolute -left-200px -bottom-400px <sm:(-left-100px -bottom-760px)">
        <corner-bottom :start-color="darkColor" :end-color="lightColor" />
      </div>
    </template>
-->
    <NImage
      object-fit="cover"
      style="min-width: 100%; min-height: 100%"
      preview-disabled
      :src="bgColor"
      :img-props="{
        style: {
          minWidth: '100%'
        }
      }"
    />
  </div>
</template>

<style scoped></style>
