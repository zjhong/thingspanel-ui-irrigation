<template>
  <div class="flex-col h-full">
    <n-data-table :columns="columns" :data="tableData" :loading="loading" flex-height min-height="150px" />
    <n-modal v-model:show="visible" preset="card" title="编辑" class="w-700px">
      <n-form ref="formRef" label-placement="left" :label-width="120" :model="editData">
        <n-grid :cols="24" :x-gap="18">
          <n-form-item-grid-item :span="24" label="保留天数">
            <n-input-number v-model:value="editData.retention_days" class="flex-1" />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="备注">
            <n-input v-model:value="editData.remark" type="textarea" placeholder="" />
          </n-form-item-grid-item>
        </n-grid>
        <n-space class="w-full pt-16px" :size="24" justify="center">
          <n-button class="w-72px" type="primary" @click="handleSubmit">编辑</n-button>
        </n-space>
      </n-form>
    </n-modal>
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref } from 'vue'
import type { Ref } from 'vue'
import { NButton, NSpace, NTag } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { dataClearSettingCleanupTypeLabels } from '@/constants'
import { useBoolean, useLoading } from '@/hooks'
import { fetchDataClearList } from '@/service/demo'

const { loading, startLoading, endLoading } = useLoading(false)
const { bool: visible, setTrue: openModal } = useBoolean()

const tableData = ref<GeneralSetting.DataClearSetting[]>([])
function setTableData(data: GeneralSetting.DataClearSetting[]) {
  tableData.value = data
}

async function getTableData() {
  startLoading()
  const { data } = await fetchDataClearList()
  if (data) {
    setTimeout(() => {
      setTableData(data)
      endLoading()
    }, 1000)
  }
}

const columns: Ref<DataTableColumns<GeneralSetting.DataClearSetting>> = ref([
  {
    key: 'id',
    title: 'ID',
    align: 'center',
    width: '100px'
  },
  {
    key: 'cleanup_type',
    title: '清理类型',
    align: 'left',
    render: row => {
      if (row.cleanup_type) {
        const tagTypes: Record<GeneralSetting.CleanupTypeKey, NaiveUI.ThemeColor> = {
          '1': 'success',
          '2': 'warning'
        }
        return <NTag type={tagTypes[row.cleanup_type]}>{dataClearSettingCleanupTypeLabels[row.cleanup_type]}</NTag>
      }
      return <span></span>
    }
  },
  {
    key: 'retention_days',
    title: '保留天数',
    align: 'left'
  },
  {
    key: 'last_cleanup_time',
    title: '上次清理时间',
    align: 'left'
  },
  {
    key: 'last_cleanup_data_time',
    title: '上次清理数据时间节点',
    align: 'left'
  },
  {
    key: 'remark',
    title: '备注',
    align: 'left'
  },
  {
    key: 'actions',
    title: '操作',
    align: 'center',
    width: '100px',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} type="primary" onClick={() => handleEditTable(row.id)}>
            编辑
          </NButton>
        </NSpace>
      )
    }
  }
]) as Ref<DataTableColumns<GeneralSetting.DataClearSetting>>

type FormModel = Pick<GeneralSetting.DataClearSetting, 'retention_days' | 'remark'>

const editData = reactive<FormModel>(createDefaultFormModel())

function createDefaultFormModel(): FormModel {
  return {
    retention_days: 0,
    remark: null
  }
}

function setEditData(data: GeneralSetting.DataClearSetting | null) {
  Object.assign(editData, data)
}

function handleEditTable(rowId: string) {
  const findItem = tableData.value.find(item => item.id === rowId)
  if (findItem) {
    setEditData(findItem)
  }
  openModal()
}

function handleSubmit() {
  console.log('提交')
}

function init() {
  getTableData()
}

init()
</script>
<style lang="scss"></style>
