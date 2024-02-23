<template>
  <div class="flex-col h-full">
    <n-data-table :columns="columns" :data="tableData" :loading="loading" flex-height min-height="150px" />
    <n-modal v-model:show="visible" preset="card" :title="$t('common.edit')" class="w-700px">
      <n-form ref="formRef" label-placement="left" :label-width="120" :model="editData">
        <n-grid :cols="24" :x-gap="18">
          <n-form-item-grid-item :span="24" :label="$t('page.management.setting.dataClearSetting.form.retentionDays')">
            <n-input-number v-model:value="editData.retention_days" class="flex-1" />
          </n-form-item-grid-item>
          <n-form-item-grid-item
            :span="24"
            :label="$t('page.management.setting.dataClearSetting.form.enabled')"
            path="enabled"
          >
            <n-radio-group v-model:value="editData.enabled">
              <n-radio v-for="item in dataClearSettingEnabledTypeOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </n-radio>
            </n-radio-group>
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" :label="$t('common.remark')">
            <n-input v-model:value="editData.remark" type="textarea" placeholder="" />
          </n-form-item-grid-item>
        </n-grid>
        <n-space class="w-full pt-16px" :size="24" justify="center">
          <n-button class="w-72px" type="primary" @click="handleSubmit">{{ $t('common.edit') }}</n-button>
        </n-space>
      </n-form>
    </n-modal>
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref } from 'vue'
import type { Ref } from 'vue'
import { NButton, NSpace, NTag } from 'naive-ui'
import type { DataTableColumns, FormInst } from 'naive-ui'
import dayjs from 'dayjs'
import { dataClearSettingCleanupTypeLabels, dataClearSettingEnabledTypeOptions } from '@/constants'
import { fetchDataClearList, editDataClear } from '@/service'
import { useBoolean, useLoading } from '@/hooks'
import { deepClone } from '@/utils'
import { $t } from '~/src/locales'

const { loading, startLoading, endLoading } = useLoading(false)
const { bool: visible, setTrue: openModal, setFalse: closeModal } = useBoolean()

const tableData = ref<GeneralSetting.DataClearSetting[]>([])
function setTableData(data: GeneralSetting.DataClearSetting[]) {
  tableData.value = data
}

type QueryFormModel = {
  page: number
  page_size: number
}

const queryParams = reactive<QueryFormModel>({
  page: 1,
  page_size: 10
})

async function getTableData() {
  startLoading()
  const { data } = await fetchDataClearList(queryParams)
  if (data) {
    const list: ApiGeneralSetting.DataClearSetting[] = data.list
    setTableData(list)
    endLoading()
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
    key: 'data_type',
    title: () => $t('page.management.setting.dataClearSetting.form.cleanupType'),
    align: 'left',
    render: row => {
      if (row.data_type) {
        const tagTypes: Record<GeneralSetting.CleanupTypeKey, NaiveUI.ThemeColor> = {
          '1': 'success',
          '2': 'warning'
        }
        return <NTag type={tagTypes[row.data_type]}>{dataClearSettingCleanupTypeLabels[row.data_type]}</NTag>
      }
      return <span></span>
    }
  },
  {
    key: 'retention_days',
    title: () => $t('page.management.setting.dataClearSetting.form.retentionDays'),
    align: 'left'
  },
  {
    key: 'last_cleanup_time',
    title: () => $t('page.management.setting.dataClearSetting.form.lastCleanupTime'),
    align: 'left',
    render: row => {
      return <span>{dayjs(row.last_cleanup_time).format('YYYY-MM-DD HH:mm:ss')}</span>
    }
  },
  {
    key: 'last_cleanup_data_time',
    title: () => $t('page.management.setting.dataClearSetting.form.lastCleanupDataTime'),
    align: 'left',
    render: row => {
      return <span>{dayjs(row.last_cleanup_data_time).format('YYYY-MM-DD HH:mm:ss')}</span>
    }
  },
  {
    key: 'remark',
    title: () => $t('common.remark'),
    align: 'left'
  },
  {
    key: 'actions',
    title: () => $t('common.action'),
    align: 'center',
    width: '100px',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} type="primary" onClick={() => handleEditTable(row)}>
            {$t('common.edit')}
          </NButton>
        </NSpace>
      )
    }
  }
]) as Ref<DataTableColumns<GeneralSetting.DataClearSetting>>

const formRef = ref<HTMLElement & FormInst>()

type FormModel = Pick<GeneralSetting.DataClearSetting, 'retention_days' | 'enabled' | 'remark'>

const editData = reactive<FormModel>(createDefaultFormModel())

function createDefaultFormModel(): FormModel {
  return {
    retention_days: 0,
    enabled: '1',
    remark: null
  }
}

function setEditData(data: GeneralSetting.DataClearSetting | null) {
  Object.assign(editData, data)
}

function handleEditTable(row: any) {
  setEditData(row)
  openModal()
}

async function handleSubmit() {
  await formRef.value?.validate()
  const formData = deepClone(editData)
  const data: any = await editDataClear(formData)
  if (!data.error) {
    window.$message?.success(data.msg)
    getTableData()
  }
  closeModal()
}

function init() {
  getTableData()
}

init()
</script>
<style lang="scss"></style>
