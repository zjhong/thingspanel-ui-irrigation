<!--<script setup lang="ts"></script>-->

<!--<template>-->
<!--  <div>测试页</div>-->
<!--</template>-->

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import Codemirror from 'codemirror-editor-vue3';
// language
// import "codemirror/mode/javascript/javascript.js";
// // import "codemirror/mode/clike/clike.js";
// import "codemirror/addon/lint/javascript-lint";
// import "codemirror/addon/lint/lint.css";
// import "codemirror/addon/lint/lint.js";
// import "codemirror/addon/lint/json-lint";

const code = ref(`function findSequence(goal) {
  function find(start, history) {
    if (start == goal)
      return history;
    else if (start > goal)
      return null;
    else
      return find(start + 5, "(" + history + " + 5)") ||
             find(start * 3, "(" + history + " * 3)");
  }
  return find(1, "1");
}`);

const props = defineProps<{
  lang: string;
}>();

watch(
  () => props.lang,
  lang => {
    import('codemirror/mode/clike/clike.js');
    console.log(lang);
  },
  {
    immediate: true
  }
);
const cmOptions = reactive({
  mode: props.lang,
  // mode: "application/json",
  lineNumbers: false,
  lineWiseCopyCut: true
  // gutters: ["CodeMirror-lint-markers"],
});
console.log(' cmOptions', cmOptions);

const cminstance = ref();
const onReady = cm => {
  cminstance.value = cm;
  cminstance.value.focus();
  console.log(cm.getValue());
};

defineExpose({
  setTheme: (theme: string) => {
    cminstance.value?.setOption('theme', theme);
  }
});
</script>

<template>
  <NCard>
    <NForm>
      <NFormItem label="代码" path="code">
        <Codemirror
          v-model:value="code"
          KeepCursorInEnd
          :options="cmOptions"
          :height="300"
          class="cm-component"
          :border="true"
          @ready="onReady"
        />
      </NFormItem>
    </NForm>
  </NCard>
</template>

<style scoped>
.cm-component {
  font-family: monospace;
}
</style>
