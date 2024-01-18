<template>
  <div>
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, provide, reactive, ref, toRaw } from 'vue'
import type { FormInst } from 'naive-ui'
import { cloneDeep } from 'lodash'
const formRef = ref<FormInst | null>(null)

const props = defineProps<{
  config: Record<string, any>
}>()
const model = reactive<Record<string, any>>({})

onMounted(() => {
  if (props.config) {
    Object.keys(toRaw(props.config)).forEach((key: string) => {
      model[key] = props.config[key]
    })
  }
})

provide('config-ctx', {
  model,
  formRef
})

defineExpose({
  validate: () => (formRef.value ? formRef.value.validate() : null),
  getModel: () => cloneDeep(toRaw(model))
})

// const emit = defineEmits<{
// 	(e: 'update:config', value: Record<string, any>): void
// }>()
//
// watch(
// 	model,
// 	v => {
// 		emit('update:config', v)
// 	},
// 	{ deep: true }
// )
</script>
