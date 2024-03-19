<script setup lang="ts">
import { computed } from 'vue';
import { initTemplateInfoData, templateInfoData } from '../utils';
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
  <NModal v-model:show="modalVisible" preset="card" :title="title" class="w-60%"></NModal>
</template>

<style scoped></style>
