<template>
  <router-link :to="routeHomePath" class="flex-center w-full nowrap-hidden">
    <system-logo class="text-32px text-primary" />
    <h2 v-show="showTitle" class="pl-8px text-16px font-bold text-primary transition duration-300 ease-in-out">
      <!-- {{ $t('system.title') }} -->
      {{ sysSetting.system_name }}
    </h2>
  </router-link>
</template>

<script setup lang="ts">
import { routePath } from '@/router'
import { useSysSettingStore } from '@/store'
// import { $t } from '@/locales'

defineOptions({ name: 'GlobalLogo' })

interface Props {
  /** 显示名字 */
  showTitle: boolean
}

defineProps<Props>()

const sysSetting = useSysSettingStore()
const routeHomePath = routePath('root')
</script>

<style scoped></style>
