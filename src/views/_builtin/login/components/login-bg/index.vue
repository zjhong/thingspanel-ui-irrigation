<template>
  <div class="absolute-lt z-1 wh-full overflow-hidden">
    <!-- <template v-if="!bgColor">
      <div class="absolute -right-300px -top-900px <sm:(-right-100px -top-1170px)">
        <corner-top :start-color="lightColor" :end-color="darkColor" />
      </div>
      <div class="absolute -left-200px -bottom-400px <sm:(-left-100px -bottom-760px)">
        <corner-bottom :start-color="darkColor" :end-color="lightColor" />
      </div>
    </template> -->
    <n-image object-fit="cover" preview-disabled :src="url.origin + bgColor?.slice(1)" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
// import { getColorPalette } from '@/utils'
// import { CornerBottom, CornerTop } from './components'
// eslint-disable-next-line import/order
import { getServiceEnvConfig } from '~/.env-config'
const url = ref(new URL(getServiceEnvConfig(import.meta.env).url))
type SysSetting = Omit<ApiGeneralSetting.ThemeSetting, 'id'>
interface Props {
  /** 主题颜色 */
  themeColor: string
  sysSetting: SysSetting
}

const props = defineProps<Props>()

// const lightColor = computed(() => getColorPalette(props.themeColor, 3))
// const darkColor = computed(() => getColorPalette(props.themeColor, 6))

const bgColor = computed(() => {
  return props.sysSetting.home_background
})
</script>

<style scoped></style>
