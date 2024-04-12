<script setup lang="ts">
import { defineExpose, onMounted, ref } from 'vue';
import { NButton, NDataTable, NForm, NFormItem, NInput, NModal, NPagination } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { Refresh } from '@vicons/ionicons5';
import type { FlatResponseFailData, FlatResponseSuccessData } from '@sa/axios';
import { commandDataById } from '@/service/api';

const props = defineProps<{
  id: string;
  noRefresh?: boolean;
  isCommand?: boolean;
  buttonName?: string;
  tableColumns: any[] | undefined;
  submitApi?: (params: any) => Promise<FlatResponseSuccessData | FlatResponseFailData>;
  fetchDataApi: (params: any) => Promise<FlatResponseSuccessData | FlatResponseFailData>;
}>();
const tableData = ref<any[] | undefined>();
const page_coune = ref(0);
const the_page = ref(1);
const showDialog = ref(false);
const textValue = ref('');
const commandValue = ref('');
const options = ref();
const { loading, startLoading, endLoading } = useLoading();

const fetchDataFunction = async () => {
  startLoading();

  const { data, error } = await props.fetchDataApi({
    page: !props.noRefresh ? the_page.value : undefined,
    page_size: !props.noRefresh ? 4 : undefined,
    device_id: props.id
  });

  if (!error) {
    tableData.value = data?.value || data || [];
    if (data?.count) {
      page_coune.value = Math.ceil(data.count / 4);
    }

    endLoading();
  }
};

const openDialog = () => {
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
  textValue.value = '';
};

const submit = async () => {
  let parms;
  if (props.isCommand) {
    parms = { device_id: props.id, value: textValue.value, identify: commandValue.value };
  } else {
    parms = { device_id: props.id, value: textValue.value };
  }

  if (props.submitApi) {
    await props.submitApi(parms);
  }
  await fetchDataFunction();
  closeDialog();
};
const updatePage = (page: number) => {
  the_page.value = page;
  fetchDataFunction();
};
const refresh = () => {
  the_page.value = 1;
  fetchDataFunction();
};

defineExpose({ refresh });
const getOptions = async show => {
  if (show) {
    const res = await commandDataById(props.id);
    options.value = res.data;
  }
};
onMounted(fetchDataFunction);
</script>

<template>
  <div>
    <NFlex :justify="buttonName ? 'space-between' : 'end'">
      <NButton v-if="buttonName" type="primary" @click="openDialog">{{ buttonName }}</NButton>
      <NButton v-if="!noRefresh" :bordered="false" class="justify-end" @click="refresh">
        <NIcon size="18">
          <Refresh />
        </NIcon>
        刷新
      </NButton>
    </NFlex>
    <NModal v-if="submitApi" v-model:show="showDialog" title="下发属性" class="bg- w-400px">
      <n-card>
        <NForm>
          <NFormItem v-if="isCommand" label="命令标识符" required :options="options">
            <NSelect
              v-model:value="commandValue"
              label-field="data_name"
              value-field="data_identifier"
              :options="options"
              @update:show="getOptions"
            />
            <span class="ml-4 mr-4">或</span>
            <NInput v-model:value="commandValue" placeholder="或在此输入" />
          </NFormItem>
          <NFormItem label="属性">
            <NInput v-model:value="textValue" type="textarea" />
          </NFormItem>
          <NFlex justify="end">
            <NButton @click="closeDialog">取消</NButton>
            <NButton type="primary" @click="submit">下发</NButton>
          </NFlex>
        </NForm>
      </n-card>
    </NModal>
    <NDataTable class="mb-4 mt-4" :loading="loading" :columns="tableColumns" :data="tableData" />
    <NPagination v-if="!noRefresh" :page-count="page_coune" :page="the_page" :page-size="4" @update:page="updatePage" />
  </div>
</template>
