
<script setup lang="tsx">
import { ref, Ref, reactive, watch } from "vue"
import { $t } from "@/locales";
import type { DataTableColumns } from "naive-ui";
import { NButton, NSpace, NPopconfirm } from 'naive-ui';
import { addCommands, putCommands } from '@/service/api/system-data'

const emit = defineEmits(['update:addAndEditModalVisible', 'update:objItem', 'determine']);

const addParameter: Ref<boolean> = ref(false)
const generalOptions: any = reactive(['String', 'Number', 'Boolean'].map(
  (v) => ({
    label: v,
    value: v
  })
))

const props = defineProps({
  addAndEditModalVisible: {
    type: Boolean,
    required: true,
  },
  DeviceTemplateId: {
    type: String,
    required: true
  },
  objItem: {
    type: Object,
    required: true
  }
});

const DeviceTemplateId = ref<string>(props.DeviceTemplateId)
let objItem = reactive<any>(props.objItem)

// 添加参数配置
let addParameterFrom: any = reactive({
  data_name: '',
  data_identifier: '',
  read_write_flag: 'string',
  description: ''
})

const addParameterRules: any = reactive({
  data_name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入属性名称'
  },
  data_identifier: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入属性标识符'
  },
  read_write_flag: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入属性类型'
  },
})

// 表格配置
let eventsData: any = reactive([])
const col: Ref<DataTableColumns<AddDeviceModel.Device>> = ref([
  {
    key: "data_name",
    title: "参数名称",
    align: "center",
  },
  {
    key: "data_identifier",
    title: "参数标识符",
    align: "center",
  },
  {
    key: "read_write_flag",
    title: "参数类型",
    align: "center",
  },
  {
    key: "description",
    title: "描述",
    align: "center",
  }, {
    key: 'actions',
    width: 350,
    title: () => $t('common.action'),
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton quaternary type="primary" size={'small'} onClick={() => edit(row)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => del(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton quaternary type="primary" size={'small'}>
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
]);

console.log(props.objItem, '测试');

// 提交表单
const formRef: any = ref(null)
const formRefs: any = ref(null)

let addFrom: any = reactive({
  device_template_id: DeviceTemplateId,
  data_name: '',
  data_identifier: '',
  description: '',
  params: ''
})

// 监听一下父组件传递过来的编辑数据
watch(objItem, (newVal) => {
  console.log('objItem changed', newVal.id);
  if (objItem.id) {
    addFrom = reactive({
      device_template_id: DeviceTemplateId,
      ...newVal
    })
    eventsData = reactive(JSON.parse(newVal.params))
    console.log(JSON.parse(newVal.params), '父级');

  } else {
    addFrom = reactive({
      device_template_id: DeviceTemplateId,
      data_name: '',
      data_identifier: '',
      description: '',
      params: ''
    })
  }
}, { deep: true, immediate: true });


type Rule = {
  required: boolean;
  trigger: string[];
  message: string;
};

type Rules = {
  data_name: Rule;
  data_identifier: Rule;
};

const fromRules: Rules = {
  data_name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入命令名称'
  },
  data_identifier: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入命令标识符'
  },
}

// 编辑
const addFlag: Ref<boolean> = ref(true)
const edit: (row: Object) => void = (row) => {
  addParameter.value = true
  addFlag.value = false
  addParameterFrom = reactive({ ...row })
  console.log(row, '编辑');
}

// 删除
const del: (id: string) => void = async (id) => {
  const index: number = eventsData.findIndex(item => item.id === id)
  eventsData.splice(index, 1)
  console.log('删除');
}

const addParams: () => void = () => {
  addParameter.value = true
}

// 确定按钮
const submit: () => void = async () => {
  await formRef.value?.validate()
  addFrom.params = JSON.stringify(eventsData)
  if (props.objItem.id) {
    const response: any = await putCommands(addFrom)
    if (response.data) {
      emit('update:objItem', {})
      emit('update:addAndEditModalVisible', false)
      emit('determine')
      window.$message?.success('编辑成功')
    }
    console.log(response, '提交');
  } else {
    const response: any = await addCommands(addFrom)
    if (response.data) {
      emit('update:objItem', {})
      emit('update:addAndEditModalVisible', false)
      emit('determine')
      window.$message?.success('新增成功')
    }
    console.log(response, '提交');
  }
}

// 取消按钮
const clear: () => void = () => {
  emit('update:objItem', {})
  emit('update:addAndEditModalVisible', false)
  console.log(props.objItem, '取消');
}

const addParameterClone: () => void = () => {
  addFlag.value = true
  addParameterFrom = reactive({
    data_name: '',
    data_identifier: '',
    read_write_flag: 'string',
    description: ''
  })
  console.log('新增参数');
}

// 新增确定参数的按钮
const parameterSubmit: () => void = async () => {
  await formRefs.value?.validate()
  if (addFlag.value) {
    eventsData.push({ ...addParameterFrom, id: Math.random()})
    addParameterFrom = reactive({
      data_name: '',
      data_identifier: '',
      read_write_flag: 'string',
      description: ''
    })
  } else {
    const index: number = eventsData.findIndex(item => item.id === addParameterFrom.id)
    eventsData[index] = reactive(addParameterFrom)
    console.log(eventsData, index, '编辑参数');
  }
  addParameter.value = false
  addFlag.value = true
  console.log('新增确定参数');
}
</script>

<template>
  <n-form :model="addFrom" :rules="fromRules" label-placement="left" label-width="100" ref="formRef"
    require-mark-placement="right-hanging" class="addFrom">
    <n-form-item label="命令名称" path="data_name">
      <n-grid :cols="2">
        <n-gi>
          <n-input v-model:value.trim="addFrom.data_name" placeholder="单次控制任务" />
        </n-gi>
      </n-grid>
    </n-form-item>
    <n-form-item label="命令标识符" path="data_identifier">
      <n-grid :cols="2">
        <n-gi>
          <n-input v-model:value.trim="addFrom.data_identifier" placeholder="oneControl" />
        </n-gi>
      </n-grid>
    </n-form-item>
    <div class="box">
      <n-button @click="addParams" class="box-btn">
        <template #icon>
          <SvgIcon local-icon="add" class="more" />
        </template>添加参数
      </n-button>
      <n-data-table :columns="col" :data="eventsData" class="flex-1-hidden m-b4" />
    </div>
    <n-form-item label="命令描述">
      <n-input v-model:value.trim="addFrom.description" placeholder="请输入命令描述" type="textarea" />
    </n-form-item>
  </n-form>
  <div class="box2">
    <n-button @click="clear" class="m-r3">取消</n-button>
    <n-button @click="submit">确定</n-button>
  </div>
  <NModal v-model:show="addParameter" preset="card" title="新增/编辑参数" class="w-30%" @afterLeave="addParameterClone">
    <n-form :model="addParameterFrom" :rules="addParameterRules" label-placement="left" label-width="100" ref="formRefs"
      require-mark-placement="right-hanging" class="addFrom">
      <n-form-item label="参数名称" path="data_name">
        <n-input v-model:value.trim="addParameterFrom.data_name" placeholder="请输入参数名称" />
      </n-form-item>
      <n-form-item label="参数标识符" path="data_identifier">
        <n-input v-model:value.trim="addParameterFrom.data_identifier" placeholder="请输入参数标识符" />
      </n-form-item>
      <n-form-item label="参数类型" path="read_write_flag">
        <n-select v-model:value="addParameterFrom.read_write_flag" :options="generalOptions" placeholder="请选择参数类型" />
      </n-form-item>
      <n-form-item label="参数描述">
        <n-input v-model:value.trim="addParameterFrom.description" placeholder="请输入描述" type="textarea" />
      </n-form-item>
    </n-form>
    <div class="box2">
      <n-button @click="addParameter = false" class="m-r3">取消</n-button>
      <n-button @click="parameterSubmit">确定</n-button>
    </div>
  </NModal>
</template>


<style lang="scss" scoped>
.box {
  position: relative;
  padding-top: 3rem;

  .box-btn {
    position: absolute;
    top: 0;
    right: 0;
  }
}

.box2 {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
