<script setup lang="ts">
import { computed, ref } from 'vue';
import { initTemplateInfoData, templateInfoData } from '../utils';
import AddInfo from "./step/add-info.vue";
import ModelDefinition from "./step/model-definition.vue";

// import { $t } from '@/locales';
let stepCurrent = ref<number>(1)
let DeviceTemplateId = ref<string>('')

const componentsList: { id: number; components: any }[] = [
  { id: 1, components: AddInfo },
  { id: 2, components: ModelDefinition }
];
const SwitchComponents = computed<any>(() => {
  return componentsList.find(item => item.id === stepCurrent.value)?.components
});
// const Back: () => void = () => {
//   if (stepCurrent.value > 1) {
//     stepCurrent.value = stepCurrent.value - 1
//   } else {
//     window.$message?.warning('到头了，不可以在点了');
//   }
// }
// const release: () => void = () => {
//   console.log('准备发布了');
// }

export interface Props {
  visible: boolean;
  type: 'add' | 'edit';
  editData?: any;
}
export type ModalType = NonNullable<Props['type']>;

interface Emits {
  (e: 'update:visible', visible: boolean): void;
}

const emit = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {
  type: 'add'
});

const modalVisible = computed({
  get() {
    stepCurrent.value = 1
    if (!props.visible) {
      templateInfoData.value = { ...initTemplateInfoData };
    }
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});

const title = computed(() => {
  const titles: Record<ModalType, string> = {
    add: '添加模板信息',
    edit: '修改模板信息'
  };
  return titles[props.type];
});

defineOptions({ name: 'TableActionModal' });
</script>

<template>
  <NModal v-model:show="modalVisible" preset="card" :title="title" class="w-60%">
    <n-steps :current="stepCurrent" status="process">
      <n-step title="模板信息" description="添加设备的基本信息" />
      <n-step title="模型定义" description="根据系统提供的模型来配置参数以及设备类型" />
      <n-step title="web图表配置" description="绑定相对应的图表" />
      <n-step title="发布" description="发布到应用商店" />
    </n-steps>
    <component :is="SwitchComponents" v-model:stepCurrent="stepCurrent" v-model:modalVisible="modalVisible" v-model:DeviceTemplateId="DeviceTemplateId"></component>
    <!-- <AddInfo v-model:stepCurrent="stepCurrent" v-model:modalVisible="modalVisible"></AddInfo>
    <ModelDefinition v-model:stepCurrent="stepCurrent" v-model:modalVisible="modalVisible"></ModelDefinition> -->
    <!-- <n-button @click="modalVisible = false">取消</n-button>
    <n-button @click="Back">上一步</n-button> -->
    <!-- <n-button @click="next">下一步</n-button>
    <n-button @click="release">发布</n-button> -->
  </NModal>
</template>

<style scoped></style>
