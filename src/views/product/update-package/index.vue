<template>
	<div class="overflow-hidden h-full">
		<n-card :title="$t('page.product.update-package.packageList')" :bordered="false" class="h-full rounded-8px shadow-sm">
			<div class="flex-col h-full">
				<n-form ref="queryFormRef" inline label-placement="left" :model="queryParams">
					<n-form-item :label="$t('page.product.list.deviceConfig')" path="email">
						<n-input v-model:value="queryParams.product_id" />
					</n-form-item>
					<n-form-item :label="$t('page.product.update-package.packageName')" path="name">
						<n-input v-model:value="queryParams.name" />
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
							{{ $t('common.add') }}
						</n-button>
					</n-space>
					<n-space align="center" :size="18">
						<n-button size="small" type="primary" @click="getTableData">
							<icon-mdi-refresh class="mr-4px text-16px" :class="{ 'animate-spin': loading }" />
							{{ $t('common.refreshTable') }}
						</n-button>
						<column-setting v-model:columns="columns" />
					</n-space>
				</n-space>
				<n-data-table remote :columns="columns" :data="tableData" :loading="loading" :pagination="pagination" flex-height
					class="flex-1-hidden" />
				<table-package-modal v-model:visible="visible" :type="modalType" :edit-data="(editData as any)"
					@success="getTableData" />
			</div>
		</n-card>
	</div>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue'
import type { Ref } from 'vue'
import { NButton, NPopconfirm, NSpace } from 'naive-ui'
import type { DataTableColumns, PaginationProps } from 'naive-ui'
import { useBoolean, useLoading } from '@/hooks'
import { $t } from '@/locales'
import { deleteOtaPackage, getOtaPackageList } from '@/service/product/update-package'
import TablePackageModal from './components/table-package-modal.vue'
import type { ModalType } from './components/table-package-modal.vue'
import ColumnSetting from './components/column-setting.vue'
const { loading, startLoading, endLoading } = useLoading(false)
const { bool: visible, setTrue: openModal } = useBoolean()

const queryParams = reactive({
	name: '',
	product_id: '',
	page: 1,
	page_size: 10
})

const tableData = ref<productPackageRecord[]>([])
function setTableData(data: productPackageRecord[]) {
	tableData.value = data
}

const pagination: PaginationProps = reactive({
	page: 1,
	pageSize: 10,
	showSizePicker: true,
	pageSizes: [10, 15, 20, 25, 30],
	onChange: (page: number) => {
		pagination.page = page
		queryParams.page = page
		getTableData()
	},
	onUpdatePageSize: (pageSize: number) => {
		pagination.pageSize = pageSize
		pagination.page = 1
		queryParams.page = 1
		queryParams.page_size = pageSize
		getTableData()
	}
})
function handleQuery() {
	init()
}
function handleReset() {
	Object.assign(queryParams, {
		deviceNumber: '',
		batchNumber: '',
		page: 1
	})
	handleQuery()
}
async function getTableData() {
	startLoading()
	const { data } = await getOtaPackageList(queryParams)
	if (data) {
		const list: productPackageRecord[] = data.list
		setTableData(list)
		pagination.pageCount = Math.ceil(data.total / queryParams.page_size)
		endLoading()
	}
}

const columns: Ref<DataTableColumns<productPackageRecord>> = ref([
	{
		key: 'name',
		title: $t('page.product.update-package.packageName')
	},
	{
		key: 'target_version',
		title: $t('page.product.update-package.version')
	},
	{
		key: 'version',
		title: $t('page.product.update-package.versionCode')
	},
	{
		key: 'product _id',
		title: $t('page.product.update-package.deviceConfig')
	},
	{
		key: 'package_type',
		title: $t('page.product.update-package.type')
	},
	{
		key: 'module',
		title: $t('page.product.update-package.moduleName')
	},
	{
		key: 'created_at',
		title: $t('page.product.update-package.createTime')
	},
	{
		key: 'description',
		title: $t('page.product.update-package.desc')
	},
	{
		key: 'actions',
		title: $t('common.action'),
		align: 'center',
		width: '300px',
		render: row => {
			return (
				<NSpace justify={'center'}>
					<NButton size={'small'} type="primary" onClick={() => handleEditTable(row.id)}>
						{$t('common.edit')}
					</NButton>
					<NPopconfirm onPositiveClick={() => handleDeleteTable(row.id)}>
						{{
							default: () => $t('common.deleteConfirm'),
							trigger: () => (
								<NButton type="error" size={'small'}>
									{$t('common.delete')}
								</NButton>
							)
						}}
					</NPopconfirm>
				</NSpace>
			)
		}
	}
]) as Ref<DataTableColumns<productPackageRecord>>

const modalType = ref<ModalType>('add')

function setModalType(type: ModalType) {
	modalType.value = type
}

const editData = ref<productPackageRecord | null>(null)

function setEditData(data: productPackageRecord | null) {
	editData.value = data
}

function handleAddTable() {
	openModal()
	setEditData(null)
	setModalType('add')
}

function handleEditTable(rowId: number) {
	const findItem = tableData.value.find(item => item.id === rowId)
	if (findItem) {
		setEditData(findItem)
	}
	setModalType('edit')
	openModal()
}

async function handleDeleteTable(rowId: number) {
	const data = await deleteOtaPackage(rowId)
	if (!data.error) {
		window.$message?.success($t('common.deleteSuccess'))
		getTableData()
	}
}

function init() {
	getTableData()
}

// 初始化
init()
</script>

<style scoped></style>
