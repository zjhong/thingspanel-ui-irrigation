<script setup lang="tsx">
import { ref, reactive, defineEmits, watch } from "vue"
import type { UploadFileInfo } from 'naive-ui';
import { localStg } from '@/utils/storage';
import { createServiceConfig } from '~/env.config';


interface AddFrom {
  name: string;
  templateTage: string[];
  version: string;
  author: string;
  remark: string;
  path: string;
  lable: string;
}

const props = defineProps({
  modelValue: {
    type: Object as () => AddFrom,
    required: true,
  },
});

const addFrom: any = reactive(props.modelValue)

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
    message: '请输入模板名称'
  }
}
const emit = defineEmits(['update:modelValue']);

watch(addFrom, (newValue) => {
  console.log(newValue, '监听');
  emit('update:modelValue', newValue);
}, { deep: true });

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
const tagsClose: (index: number) => void = (index) => {
  addFrom.templateTage.splice(index, 1)
}

// upload
const { otherBaseURL } = createServiceConfig(import.meta.env);
const url: any = ref(new URL(otherBaseURL.demo));
let pngPath: any = ref('')

const customRequest = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  if (!event || !event.target) return;

  const xhr = event.target as XMLHttpRequest;
  const response = JSON.parse(xhr.response);
  addFrom.path = response.data.path

  const relativePath = response.data.path.replace(/^\.\//, '');
  pngPath.value = url.value.origin + '/' + relativePath;
  console.log(pngPath.value, file);
};
</script>

<template>
  <div class="flex flex-justify-between">
    <n-form :model="addFrom" :rules="fromRules" label-placement="left" label-width="100"
      require-mark-placement="right-hanging" class="addFrom">
      <n-form-item label="模板名称" path="name">
        <n-input v-model:value.trim="addFrom.name" placeholder="请输入模板名称" />
      </n-form-item>
      <n-form-item label="模板标签" class="tag-item">
        <n-tag size="small" class="tag" closable @close="tagsClose(index)" v-for="(item, index) in addFrom.templateTage"
          :key="index">
          {{ item }}
        </n-tag>
        <n-tag size="small" class="tag addTage" @click="addTags" v-if="!tageFlag">
          添加标签
          <template #icon>
            <SvgIcon local-icon="add" class="more" />
          </template>
        </n-tag>
        <n-input class="tag-ipt" v-model:value.trim="addTageText" @blur="tagBlur" placeholder="请输入标签名称" autofocus
          v-else />
      </n-form-item>
      <n-form-item label="作者名称">
        <n-input v-model:value.trim="addFrom.author" placeholder="请输入作者名称" />
      </n-form-item>
      <n-form-item label="模板版本">
        <n-input v-model:value.trim="addFrom.version" placeholder="请输入模板版本" />
      </n-form-item>
      <n-form-item label="说明">
        <n-input v-model:value.trim="addFrom.remark" type="textarea" placeholder="请输入说明" />
      </n-form-item>
    </n-form>
    <n-upload :action="url + '/file/up'" :headers="{ 'x-token': localStg.get('token') || '' }" :data="{ type: 'image' }"
      class="upload" @finish="customRequest" :show-file-list="false" accept='image/png, image/jpeg, image/jpg, image/gif'>
      <n-upload-dragger>
        <img :src="pngPath" class="slt" v-if="pngPath && pngPath !== ''" />
        <n-icon size="35" :depth="3" v-else>
          <SvgIcon local-icon="picture" class="more" />
        </n-icon>
      </n-upload-dragger>
      <n-button-group>
        <n-upload-trigger #="{ handleClick }" abstract>
          <n-button @click.stop="handleClick" class="m-t4 upload-btn">
            选择封面
          </n-button>
        </n-upload-trigger>
      </n-button-group>
    </n-upload>
  </div>
</template>
<style lang="scss" scoped>
.upload {
  width: 200px;
  height: 150px;
  pointer-events: none;
  margin-right: 100px;
  position: relative;

  .n-upload-dragger {
    width: 200px;
    height: 150px;
  }

  .slt {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 150px;
  }
}

:deep(.n-button-group) {
  display: grid;
  justify-items: end;
}

.tag {
  min-width: max-content;
  padding-left: .5rem;
  max-width: 1rem;
  height: 2.3rem;
  border-radius: .6rem;
  margin-right: .4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
}

.tag-ipt {
  width: 10rem;
  height: 2.3rem;
}

.tag-item {
  :deep(.n-form-item-blank) {
    align-items: stretch;
    flex-wrap: wrap;
  }
}

.addTage {
  cursor: pointer;
  padding-right: 1rem;
}

.addFrom {
  min-width: 700px;
}

.upload-btn {
  pointer-events: auto;
}
</style>
