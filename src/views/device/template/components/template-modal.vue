<script setup lang="ts">
import { computed, ref,} from 'vue';
import { $t } from '@/locales';
import { initTemplateInfoData, templateInfoData } from '../utils';
import AddInfo from './step/add-info.vue';
import ModelDefinition from './step/model-definition.vue';


const stepCurrent = ref<number>(1);
const DeviceTemplateId = ref<string>('');

const componentsList: { id: number; components: any }[] = [
  { id: 1, components: AddInfo },
  { id: 2, components: ModelDefinition }
];
const SwitchComponents = computed<any>(() => {
  return componentsList.find(item => item.id === stepCurrent.value)?.components;
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
// 提供数据或方法

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
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    stepCurrent.value = 1;
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
    add: $t('device_template.templateInfo'),
    edit: $t('device_template.editTemplateInfo')
  };
  return titles[props.type];
});

defineOptions({ name: 'TableActionModal' });
</script>

<template>
  <NModal v-model:show="modalVisible" preset="card" :title="title" class="w-60%">
    <n-steps :current="stepCurrent" status="process">
      <n-step :title="$t('device_template.templateInfo')" :description="$t('device_template.addDeviceInfo')" />
      <n-step :title="$t('device_template.modelDefinition')"
        :description="$t('device_template.deviceParameterDescribe')" />
      <n-step :title="$t('device_template.webChartConfiguration')"
        :description="$t('device_template.bindTheCorrespondingChart')" />
      <n-step :title="$t('device_template.appChartConfiguration')"
        :description="$t('device_template.editAppDetailsPage')" />
      <n-step :title="$t('device_template.release')" :description="$t('device_template.releaseAppStore')" />
    </n-steps>
    <component :is="SwitchComponents" v-model:stepCurrent="stepCurrent" v-model:modalVisible="modalVisible"
      v-model:DeviceTemplateId="DeviceTemplateId"></component>
    <!--
 <AddInfo v-model:stepCurrent="stepCurrent" v-model:modalVisible="modalVisible"></AddInfo>
    <ModelDefinition v-model:stepCurrent="stepCurrent" v-model:modalVisible="modalVisible"></ModelDefinition>
-->
    <!--
 <n-button @click="modalVisible = false">取消</n-button>
    <n-button @click="Back">上一步</n-button>
-->
    <!--
 <n-button @click="next">下一步</n-button>
    <n-button @click="release">发布</n-button>
-->
  </NModal>
</template>

<style scoped></style>
