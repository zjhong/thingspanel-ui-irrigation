<template>
  <div class="h-full overflow-auto">
    <AddOrEditDevices ref="the_modal" :edit-data="{}" :is-edit="false" />
    <n-card>
      <n-flex justify="start">
        <n-button type="primary" @click="showModal">+创建分组</n-button>
        <n-input v-model:value="value" autosize placeholder="搜索" style="min-width: 180px" type="text">
          <template #prefix>
            <n-icon>
              <IosSearch />
            </n-icon>
          </template>
        </n-input>
      </n-flex>
      <div style="margin-top: 20px">
        <n-data-table :columns="columns" :data="data" :loading="loading"></n-data-table>
        <n-pagination v-model:page="currentPage" :page-count="totalPages" @update:page="getDevice" />
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { h, onMounted, ref } from 'vue'
// import { useRouter } from 'vue-router'
import { NButton, NDataTable, NFlex, NPagination } from 'naive-ui'
import dayjs from 'dayjs'
import { IosSearch } from '@vicons/ionicons4'
import { getDeviceGroup } from '@/service/api/device'
import { AddOrEditDevices } from './components'

const the_modal = ref()
const value = ref('')

const data = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(0) // 假设总页数为 5，实际应从后端获取
// const router = useRouter()

const viewDetails = (id: string) => {
  console.log(id)
}
const deleteItem = (id: string) => {
  console.log(id)
}
type Song = {
  id: string
  name: string
  description: string
  created_at: string
}
const columns = [
  {
    title: '分组名称',
    key: 'name'
  },
  {
    title: '描述',
    key: 'description'
  },
  {
    title: '创建时间',
    key: 'created_at',
    render(row: Song) {
      return dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: '操作',
    key: 'actions',
    render: (row: Song) => {
      return h('div', {}, [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            style: 'margin-right: 12px',
            onClick: () => viewDetails(row.id)
          },
          '查看'
        ),
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => deleteItem(row.id)
          },
          '删除'
        )
      ])
    }
  }
]
const showModal = () => {
  if (the_modal.value) {
    the_modal.value.showModal = true
  }
}
const getDevice = async () => {
  loading.value = true
  const res = await getDeviceGroup({ page: currentPage.value, page_size: 10 })
  data.value = res.data.list
  totalPages.value = Math.ceil(res.data.total / 10)

  loading.value = false
}

onMounted(getDevice)
</script>
