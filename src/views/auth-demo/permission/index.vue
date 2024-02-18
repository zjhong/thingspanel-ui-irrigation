<template>
  <div class="h-full">
    <n-card title="权限切换" :bordered="false" class="h-full rounded-8px shadow-sm">
      <div class="pb-12px">
        <n-gradient-text type="primary" :size="20">当前用户的权限：{{ auth.userInfo.authority }}</n-gradient-text>
      </div>
      <n-select
        :value="auth.userInfo.authority"
        class="w-120px"
        size="small"
        :options="options"
        @update:value="auth.updateUserRole"
      />
      <div class="py-12px">
        <n-gradient-text type="primary" :size="20">权限指令 v-permission</n-gradient-text>
      </div>
      <div>
        <n-button v-permission="'SYS_ADMIN'" class="mr-12px">super可见</n-button>
        <n-button v-permission="'admin'" class="mr-12px">admin可见</n-button>
        <n-button v-permission="['admin', 'user']">admin和test可见</n-button>
      </div>
      <div class="py-12px">
        <n-gradient-text type="primary" :size="20">权限函数 hasPermission</n-gradient-text>
      </div>
      <n-space>
        <n-button v-if="hasPermission('SYS_ADMIN')">super可见</n-button>
        <n-button v-if="hasPermission('TENANT_ADMIN')">admin可见</n-button>
        <n-button v-if="hasPermission(['TENANT_ADMIN', 'TENANT_USER'])">admin和user可见</n-button>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import type { SelectOption } from 'naive-ui'
import { userRoleOptions } from '@/constants'
import { useAppStore, useAuthStore } from '@/store'
import { usePermission } from '@/composables'

const app = useAppStore()
const auth = useAuthStore()
const { hasPermission } = usePermission()

const options: SelectOption[] = userRoleOptions

watch(
  () => auth.userInfo.authority,
  async () => {
    app.reloadPage()
  }
)
</script>

<style scoped></style>
