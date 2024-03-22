<script setup lang="tsx">
import { ref, reactive } from "vue"

interface AddFrom {
  name: string;
  templateTage: string[];
  templateVersion: string;
  author: string;
  content: string;
}

const addFrom: AddFrom = reactive({
  name: '',
  templateTage: ['标签1', '标签2', '内容长标签'],
  templateVersion: '',
  author: '',
  content: '',
});

type Rule = {
  required: boolean;
  trigger: string[];
  message: string;
};

type Rules = {
  name: Rule;
};

const fromRules: Rules = {
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入 inputValue'
  }
}

// addTags
let tageFlag = ref<boolean>(false)
let addTageText = ref<string>('')
const addTags: () => void = () => {
  tageFlag.value = true
  console.log('点击了添加');
}
const tagBlur: () => void = () => {
  if (addTageText.value !== '') {
    addFrom.templateTage.push(addTageText.value)
    console.log(addFrom.templateTage, '点击了添加');
    addTageText.value = ''
    tageFlag.value = false
  }
}
const tagsClose: () => void = () => {
  console.log('删除标签');

}

// upload
// const customRequest: () => void = () => {
//   console.log('上传');
// }
</script>

<template>
  <div class="flex flex-justify-between">
    <n-form :model="addFrom" :rules="fromRules" label-placement="left" label-width="100"
      require-mark-placement="right-hanging" class="addFrom">
      <n-form-item label="模板名称" path="name">
        <n-input v-model:value.trim="addFrom.name" placeholder="请输入模板名称" />
      </n-form-item>
      <n-form-item label="模板标签">
        <n-tag size="small" class="tag" closable @close="tagsClose" v-for="(item, index) in addFrom.templateTage"
          :key="index">
          {{ item }}
        </n-tag>
        <n-tag size="small" class="tag addTage" closable @click="addTags" v-if="!tageFlag">
          添加标签
          <template #icon>
            <SvgIcon local-icon="add" class="more" />
          </template>
        </n-tag>
        <n-input v-model:value.trim="addTageText" @blur="tagBlur" placeholder="请输入作者名称" autofocus v-else />
      </n-form-item>
      <n-form-item label="作者名称">
        <n-input v-model:value.trim="addFrom.author" placeholder="请输入作者名称" />
      </n-form-item>
      <n-form-item label="模板版本">
        <n-input v-model:value.trim="addFrom.templateVersion" placeholder="请输入模板版本" />
      </n-form-item>
      <n-form-item label="说明">
        <n-input v-model:value.trim="addFrom.content" type="textarea" placeholder="请输入说明" />
      </n-form-item>
    </n-form>
    <!-- <n-upload action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f" :default-file-list="fileList"
      :custom-request="customRequest" class="upload">
      <n-upload-dragger>
        <n-icon size="35" :depth="3">
          <SvgIcon local-icon="picture" class="more" />
        </n-icon>
      </n-upload-dragger>
      <n-button-group>
        <n-upload-trigger #="{ handleClick }" abstract>
          <n-button @click.stop="handleClick" class="m-t3" style="pointer-events: auto;">
            上传
          </n-button>
        </n-upload-trigger>
      </n-button-group>
    </n-upload> -->
  </div>
</template>
<style lang="scss" scoped>
.upload {
  width: 200px;
  height: 150px;
  pointer-events: none;
  margin-right: 100px;
}

:deep(.n-button-group) {
  display: grid;
  justify-items: end;
}

.tag {
  min-width: max-content;
  padding-left: .5rem;
  max-width: 7rem;
  height: 1.5rem;
  border-radius: 1rem;
  margin-right: .4rem;
}

.addTage {
  cursor: pointer;
}

.addFrom {
  min-width: 700px;
}
</style>
