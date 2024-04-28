<script setup lang="ts">
import { reactive } from 'vue';
const form = reactive({});
const rules = reactive({});
interface Props {
  dynamicForm?: object | any;
}

const props = withDefaults(defineProps<Props>(), {
  dynamicForm: null
});
console.log(props, '接收动态表单');
</script>

<template>
  <div class="connection-box">
    动态表单
    <NForm :model="form" :rules="rules" label-placement="left" label-width="auto" class="w-300"></NForm>
  </div>
</template>

<style scoped lang="scss"></style>
