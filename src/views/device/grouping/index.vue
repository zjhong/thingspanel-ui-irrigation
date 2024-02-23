<template>
  <div class="h-full overflow-auto">
    <!-- Add or edit device modal component with props for edit mode and data -->
    <AddOrEditDevices ref="the_modal" :is-edit="false" :refresh-data="getDevice" />
    <n-card>
      <n-flex justify="start">
        <!-- Button to trigger modal for creating a new device group -->
        <n-button type="primary" @click="showModal">+创建分组</n-button>
        <!-- Input for search functionality -->
        <n-input
          v-model:value="searchValue"
          :disabled="isRequestPending"
          autosize
          placeholder="请输入设备分组名称"
          style="min-width: 180px"
          type="text"
          @input="handleInput"
        >
          <template #prefix>
            <n-icon>
              <IosSearch />
            </n-icon>
          </template>
        </n-input>
      </n-flex>
      <div style="margin-top: 20px">
        <!-- Data table to display device groups -->
        <n-data-table :columns="columns" :data="data" :loading="loading"></n-data-table>
        <!-- Pagination component -->
        <n-pagination v-model:page="currentPage" :page-count="totalPages" @update:page="getDevice" />
      </div>
    </n-card>
  </div>
</template>

<script lang="tsx" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
// Import UI components from Naive UI
import { NButton, NDataTable, NFlex, NPagination, NPopconfirm } from 'naive-ui'
import dayjs from 'dayjs'
import { IosSearch } from '@vicons/ionicons4'
import { debounce } from 'lodash'
import { getDeviceGroup, deleteDeviceGroup } from '@/service/api/device'
import { AddOrEditDevices } from './components'

const the_modal = ref()
const searchValue = ref('')
const isRequestPending = ref(false)
const data = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(0) // 假设总页数为 5，实际应从后端获取

// 使用 lodash 的 debounce 函数来延迟搜索请求的发送
const debouncedSearch = debounce(async () => {
  if (isRequestPending.value) {
    return // 如果当前有请求正在进行，则不执行新的请求
  }

  isRequestPending.value = true
  loading.value = true
  const res = await getDeviceGroup({
    page: currentPage.value,
    page_size: 10,
    name: searchValue.value.trim() || undefined
  })
  data.value = res.data.list
  totalPages.value = Math.ceil(res.data.total / 10)

  loading.value = false

  // eslint-disable-next-line require-atomic-updates
  isRequestPending.value = false
}, 500) // 设置延迟为 500 毫秒

// 监听输入变化并调用 debounced 函数
const handleInput = () => {
  debouncedSearch()
}
// Async function to fetch device groups from the backend
const getDevice = async () => {
  loading.value = true
  const res = await getDeviceGroup({ page: currentPage.value, page_size: 10 })
  data.value = res.data.list
  totalPages.value = Math.ceil(res.data.total / 10)

  loading.value = false
}
const router = useRouter()

// Function to view device group details
const viewDetails = (id: string) => {
  console.log('2', id)
  router.push(`/device/grouping/details?id=${id}`)
}
// Function to delete a device group
const deleteItem = async (id: string) => {
  await deleteDeviceGroup({ id })
  await getDevice()
}

// Define columns for the data table
const columns = [
  {
    title: '分组名称',
    key: 'name',
    ellipsis: {
      tooltip: {
        width: 320
      }
    }
  },
  {
    title: '描述',
    key: 'description',
    ellipsis: {
      tooltip: {
        width: 320
      }
    }
  },
  {
    title: '创建时间',
    key: 'created_at',
    render(row: { id: string; name: string; description: string; created_at: string; [key: string]: any }) {
      return dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render: (row: { id: string; name: string; description: string; created_at: string; [key: string]: any }) => {
      return (
        <NFlex justify={'start'}>
          <NButton
            size={'small'}
            onClick={() => {
              viewDetails(row.id)
            }}
          >
            查看
          </NButton>
          <NPopconfirm
            onPositiveClick={() => {
              deleteItem(row.id)
            }}
          >
            {{
              default: () => '确认删除',
              trigger: () => <NButton size={'small'}>删除</NButton>
            }}
          </NPopconfirm>
        </NFlex>
      )
    }
  }
]
// Function to show the modal for adding or editing device groups
const showModal = () => {
  if (the_modal.value) {
    the_modal.value.showModal = true
  }
}

onMounted(getDevice) // Fetch device groups on component mount
</script>
