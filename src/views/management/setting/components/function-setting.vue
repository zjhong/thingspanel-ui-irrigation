<script setup lang="tsx">
import { ref } from 'vue';
import { $t } from '@/locales';

const btn_yzm = ref(false);
const btn_zc = ref(false);

async function handleSubmit() {
  console.log(`${btn_yzm.value}  ${btn_zc.value}`);
}
</script>

<template>
  <NSpin>
    <NForm label-placement="left" :label-width="140">
      <NGrid :cols="24" :x-gap="18">
        <NFormItemGridItem :span="24" label="是否开启验证码登录">
          <n-switch v-model:value="btn_yzm" />
        </NFormItemGridItem>

        <NFormItemGridItem :span="24" label="是否开启系统注册">
          <n-switch v-model:value="btn_zc" />
        </NFormItemGridItem>

        <NFormItemGridItem :span="24" class="mt-30px">
          <div class="w-120px"></div>
          <NButton class="w-72px" type="primary" @click="handleSubmit">
            {{ $t('common.save') }}
          </NButton>
        </NFormItemGridItem>
      </NGrid>
      <NSpace class="w-full pt-16px" :size="24" justify="start"></NSpace>
    </NForm>
  </NSpin>
</template>

<style lang="scss"></style>
