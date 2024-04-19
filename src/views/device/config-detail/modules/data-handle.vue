<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { type FormInst, NButton, useDialog } from 'naive-ui';
import { PencilOutline as editIcon, TrashOutline as trashIcon } from '@vicons/ionicons5';
import Codemirror from 'codemirror-editor-vue3';
import 'codemirror/mode/javascript/javascript.js';
import {
  dataScriptAdd,
  dataScriptDel,
  dataScriptEdit,
  dataScriptQuiz,
  getDataScriptList,
  setDeviceScriptEnable
} from '@/service/api/device';

// const message = useMessage();
const dialog = useDialog();

interface Props {
  configInfo?: object | any;
}

const props = withDefaults(defineProps<Props>(), {
  configInfo: null
});
const configFormRef = ref<HTMLElement & FormInst>();

const modalTitle = ref('添加');
const configForm = ref(defaultConfigForm());
const scripTypeOpt = ref([
  {
    label: '遥测上报预处理',
    value: 'A'
  },
  {
    label: '遥测下发预处理',
    value: 'B'
  },
  {
    label: '属性上报预处理',
    value: 'C'
  },
  {
    label: '属性下发预处理',
    value: 'D'
  }
]);

function defaultConfigForm() {
  return {
    id: null,
    content: '',
    description: null,
    device_config_id: null,
    enable_flag: 'Y',
    analog_input: null,
    last_analog_input: null,
    name: null,
    remark: null,
    script_type: null,
    resolt_analog_input: ''
  };
}

const configFormRules = ref({
  name: {
    required: true,
    message: '请输入标题',
    trigger: 'blur'
  },
  enable_flag: {
    required: true,
    message: '请选择',
    trigger: 'change'
  },
  script_type: {
    required: true,
    message: '请选择处理类型',
    trigger: 'change'
  }
});
const showModal = ref(false);

const openModal = (type: any, item: any) => {
  modalTitle.value = type;
  if (modalTitle.value === '编辑') {
    // 查询详情
    configForm.value = JSON.parse(JSON.stringify(item));
  }
  showModal.value = true;
};
const bodyStyle = ref({
  width: '600px'
});
const queryData = ref({
  device_config_id: '',
  script_type: '',
  page: 1,
  page_size: 10
});

interface DataScriptItem {
  id: string;
  name: string;
  content: string;
  description: string;
  device_config_id: string;
  enable_flag: string;
  script_type: string;
}

const dataScriptList = ref<Array<DataScriptItem>>([]);
const dataScriptTotal = ref(0);
const queryDataScriptList = async () => {
  queryData.value.device_config_id = props.configInfo.id;
  const res = await getDataScriptList(queryData.value);
  dataScriptList.value = res.data.list;
  dataScriptTotal.value = res.data.total;
};
const findScriptType = (scriptType: any) => {
  if (scriptType) {
    return scripTypeOpt.value.find((data: any) => {
      return scriptType === data.value;
    })?.label;
  }
  return '';
};
const searchDataScript = () => {
  queryData.value.page = 1;
  queryDataScriptList();
};

const handleChange = async (item: object) => {
  console.log(item);
  await setDeviceScriptEnable(item);
};
const handleClose = () => {
  configFormRef.value?.restoreValidation();
  configForm.value = defaultConfigForm();
  showModal.value = false;
};
// 提交表单
const handleSubmit = async () => {
  await configFormRef?.value?.validate();
  configForm.value.device_config_id = props.configInfo.id;
  if (!configForm.value.id) {
    const res = await dataScriptAdd(configForm.value);
    if (!res.error) {
      // message.success('新增成功');
      searchDataScript();
    }
  } else {
    const res = await dataScriptEdit(configForm.value);
    if (!res.error) {
      // message.success('修改成功');
      searchDataScript();
    }
  }
  handleClose();
};
const deleteData = async (item: any) => {
  dialog.warning({
    title: '提示',
    content: '请确认是否删除该数据处理？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      await dataScriptDel({ id: item.id });
      // message.success('操作成功');
      searchDataScript();
    }
  });
};
const doQuiz = async () => {
  const postData = {
    content: '',
    analog_input: '',
    topic: ''
  };
  const result = await dataScriptQuiz(postData);
  if (result?.data?.code === 200) {
    configForm.value.resolt_analog_input = result?.data?.message || '';
  }
};

const cmRef = ref();
const cmOptions = {
  mode: 'text/javascript',
  lineNumbers: false
};

const onChange = (val, cm) => {
  console.log(val);
  console.log(cm.getValue());
};

const onInput = val => {
  console.log(val);
};

const onReady = cm => {
  console.log(cm.focus());
};

onMounted(() => {
  queryDataScriptList();
});
</script>

<template>
  <NFlex class="mb-6">
    <n-select
      v-model:value="queryData.script_type"
      :options="scripTypeOpt"
      class="max-w-40"
      @update-value="queryDataScriptList"
    />
    <NButton type="primary" @click="openModal('新增', null)">新增数据处理</NButton>
  </NFlex>
  <n-empty v-if="dataScriptList.length === 0" size="huge" description="暂无数据"></n-empty>
  <div v-else class="alarm-box">
    <div v-for="(item, index) in dataScriptList" :key="index" class="alarm-item">
      <div class="item-name">
        <div>
          {{ item.name }}
        </div>
        <NSwitch
          v-model:value="item.enable_flag"
          checked-value="Y"
          unchecked-value="N"
          @update-value="handleChange(item)"
        />
      </div>
      <div class="description item-desc">{{ item.description }}</div>
      <div class="item-desc">{{ findScriptType(item.script_type) }}</div>
      <NFlex justify="end">
        <NButton tertiary circle type="info" @click="openModal('编辑', item)">
          <template #icon>
            <n-icon>
              <editIcon />
            </n-icon>
          </template>
        </NButton>
        <NButton circle tertiary type="error" @click="deleteData(item)">
          <template #icon>
            <n-icon>
              <trashIcon />
            </n-icon>
          </template>
        </NButton>
      </NFlex>
    </div>
  </div>
  <n-modal
    v-model:show="showModal"
    preset="dialog"
    :title="`${modalTitle}数据处理`"
    :show-icon="false"
    :style="bodyStyle"
    :closable="false"
  >
    <NForm ref="configFormRef" :model="configForm" :rules="configFormRules" label-placement="left" label-width="auto">
      <NFormItem label="标题" path="name">
        <NInput v-model:value="configForm.name" placeholder="请输入标题" />
      </NFormItem>
      <NFormItem label="处理类型" path="script_type">
        <NSelect v-model:value="configForm.script_type" :options="scripTypeOpt" placeholder="请选择处理类型"></NSelect>
      </NFormItem>
      <NFormItem label="描述" path="description">
        <NInput v-model:value="configForm.description" type="textarea" placeholder="请输入描述" />
      </NFormItem>
      <NFormItem label="解析脚本" path="content">
        <Codemirror
          ref="cmRef"
          v-model:value="configForm.content"
          :options="cmOptions"
          border
          height="200"
          @change="onChange"
          @input="onInput"
          @ready="onReady"
        ></Codemirror>
        <!--        <NInput v-model:value="configForm.content" type="textarea" placeholder="请输入解析脚本" />-->
      </NFormItem>
      <NFormItem v-if="0" label="是否启用" path="enable_flag">
        <NSwitch v-model:value="configForm.enable_flag" checked-value="Y" unchecked-value="N" />
      </NFormItem>
      <NFormItem label="模拟输入" path="last_analog_input">
        <NInput v-model:value="configForm.last_analog_input" type="textarea" />
      </NFormItem>
      <NFormItem label="调试运行结果" path="resolt_analog_input">
        <NInput v-model:value="configForm.resolt_analog_input" :disabled="true" type="textarea" />
      </NFormItem>
      <NButton type="primary" @click="doQuiz">调试</NButton>
    </NForm>
    <NFlex justify="end">
      <NButton @click="handleClose">取消</NButton>
      <NButton type="primary" @click="handleSubmit">保存</NButton>
    </NFlex>
  </n-modal>
</template>

<style scoped lang="scss">
.alarm-box {
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 40px;

  .alarm-item {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    //margin: 0 10px;
    padding: 18px;
    flex: 0 0 23%;
    margin-right: calc(30% / 3);
    margin-bottom: 30px;

    .item-name {
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: space-between;
    }

    .item-desc {
      margin: 15px 0;
    }

    .item-operate {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: center;
    }
  }
}

.description {
  height: 40px;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
