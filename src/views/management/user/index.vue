<template>
  <div class="overflow-hidden">
    <n-card title="用户管理" :bordered="false" class="h-full rounded-8px shadow-sm">
      <div class="flex-col h-full">
        <n-form ref="queryFormRef" inline label-placement="left" :model="queryParams">
          <n-form-item label="邮箱" path="email">
            <n-input v-model:value="queryParams.email" />
          </n-form-item>
          <n-form-item label="姓名" path="userName">
            <n-input v-model:value="queryParams.userName" />
          </n-form-item>
          <n-form-item label="账户状态" path="userStatus">
            <n-select v-model:value="queryParams.userStatus" clearable class="w-200px" :options="userStatusOptions" />
          </n-form-item>
          <n-form-item>
            <n-button class="w-72px" type="primary" @click="handleQuery">搜索</n-button>
            <n-button class="w-72px ml-20px" type="primary" @click="handleReset">重置</n-button>
          </n-form-item>
        </n-form>
        <n-space class="pb-12px" justify="space-between">
          <n-space>
            <n-button type="primary" @click="handleAddTable">
              <icon-ic-round-plus class="mr-4px text-20px" />
              新增
            </n-button>
            <!-- <n-button type="error">
              <icon-ic-round-delete class="mr-4px text-20px" />
              删除
            </n-button>
            <n-button type="success">
              <icon-uil:export class="mr-4px text-20px" />
              导出Excel
            </n-button> -->
          </n-space>
          <n-space align="center" :size="18">
            <n-button size="small" type="primary" @click="getTableData">
              <icon-mdi-refresh class="mr-4px text-16px" :class="{ 'animate-spin': loading }" />
              刷新表格
            </n-button>
            <column-setting v-model:columns="columns" />
          </n-space>
        </n-space>
        <n-data-table
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :pagination="pagination"
          flex-height
          class="flex-1-hidden"
        />
        <table-action-modal v-model:visible="visible" :type="modalType" :edit-data="editData" />
        <edit-password-modal v-model:visible="editPwdVisible" :edit-data="editData"></edit-password-modal>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue'
import type { Ref } from 'vue'
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui'
import type { DataTableColumns, PaginationProps } from 'naive-ui'
import { genderLabels, userStatusLabels, userStatusOptions } from '@/constants'
import { fetchUserList } from '@/service'
import { useBoolean, useLoading } from '@/hooks'
import TableActionModal from './components/table-action-modal.vue'
import EditPasswordModal from './components/edit-password-modal.vue'
import type { ModalType } from './components/table-action-modal.vue'
import ColumnSetting from './components/column-setting.vue'

const { loading, startLoading, endLoading } = useLoading(false)
const { bool: visible, setTrue: openModal } = useBoolean()
const { bool: editPwdVisible, setTrue: openEditPwdModal } = useBoolean()

type QueryFormModel = Pick<UserManagement.User, 'email' | 'userName' | 'userStatus'>

const queryParams = reactive<QueryFormModel>({
  email: '',
  userName: '',
  userStatus: null
})

const tableData = ref<UserManagement.User[]>([])
function setTableData(data: UserManagement.User[]) {
  tableData.value = data
}

async function getTableData() {
  startLoading()
  const { data } = await fetchUserList(queryParams)
  if (data) {
    setTimeout(() => {
      setTableData(data)
      endLoading()
    }, 1000)
  }
}

const columns: Ref<DataTableColumns<UserManagement.User>> = ref([
  // {
  //   type: 'selection',
  //   align: 'center'
  // },
  {
    key: 'email',
    title: '邮箱',
    align: 'center'
  },
  {
    key: 'userName',
    title: '用户名',
    align: 'center'
  },
  {
    key: 'phone',
    title: '手机号码',
    align: 'center'
  },
  {
    key: 'userStatus',
    title: '账户状态',
    align: 'center',
    render: row => {
      if (row.userStatus) {
        const tagTypes: Record<UserManagement.UserStatusKey, NaiveUI.ThemeColor> = {
          '1': 'success',
          '2': 'error',
          '3': 'warning',
          '4': 'default'
        }
        return <NTag type={tagTypes[row.userStatus]}>{userStatusLabels[row.userStatus]}</NTag>
      }
      return <span></span>
    }
  },
  {
    key: 'gender',
    title: '性别',
    align: 'center',
    render: row => {
      if (row.gender) {
        const tagTypes: Record<UserManagement.GenderKey, NaiveUI.ThemeColor> = {
          '0': 'success',
          '1': 'warning'
        }

        return <NTag type={tagTypes[row.gender]}>{genderLabels[row.gender]}</NTag>
      }

      return <span></span>
    }
  },
  {
    key: 'remark',
    title: '备注',
    align: 'center'
  },
  {
    key: 'actions',
    title: '操作',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton type="warning" size={'small'} onClick={() => handleEditPwd(row.id)}>
            修改密码
          </NButton>
          <NButton type="primary" size={'small'} onClick={() => handleEditTable(row.id)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row.id)}>
            {{
              default: () => '确认删除',
              trigger: () => (
                <NButton type="error" size={'small'}>
                  删除
                </NButton>
              )
            }}
          </NPopconfirm>
        </NSpace>
      )
    }
  }
]) as Ref<DataTableColumns<UserManagement.User>>

const modalType = ref<ModalType>('add')

function setModalType(type: ModalType) {
  modalType.value = type
}

const editData = ref<UserManagement.User | null>(null)

function setEditData(data: UserManagement.User | null) {
  editData.value = data
}

function handleAddTable() {
  openModal()
  setModalType('add')
}

function handleEditPwd(rowId: string) {
  const findItem = tableData.value.find(item => item.id === rowId)
  if (findItem) {
    setEditData(findItem)
  }
  openEditPwdModal()
}

function handleEditTable(rowId: string) {
  const findItem = tableData.value.find(item => item.id === rowId)
  if (findItem) {
    setEditData(findItem)
  }
  setModalType('edit')
  openModal()
}

function handleDeleteTable(rowId: string) {
  window.$message?.info(`点击了删除，rowId为${rowId}`)
}

const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  }
})

function handleQuery() {
  init()
}

function handleReset() {
  Object.assign(queryParams, {
    email: '',
    userName: '',
    userStatus: null
  })
  handleQuery()
}

function init() {
  getTableData()
}

// 初始化
init()
</script>

<style scoped></style>
