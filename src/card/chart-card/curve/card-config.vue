<script lang="ts" setup>
import { inject, reactive, ref } from 'vue';
import { NColorPicker, NSelect } from 'naive-ui';
import type { IConfigCtx } from '@/components/panel/card';
import CurveTheme from './theme';

const ctx = inject<IConfigCtx>('config-ctx')!;

const originalColorGroups = reactive(CurveTheme);

const colorGroups = ref(JSON.parse(JSON.stringify(originalColorGroups))); // Deep copy to preserve original data

const themeOptions = [
  { label: '配色主题1', value: 'colorGroups' },
  { label: '配色主题2', value: 'colorGroups2' }
];

const selectedTheme = ref('');
const themeUpdate = () => {
  ctx.config.colorGroups = {
    colorGroup: colorGroups.value[selectedTheme.value],
    themeNumber: themeOptions.findIndex(option => option.value === selectedTheme.value)
  };
};
const updateColor = (newColor, index, position) => {
  // This method updates the color and ensures reactivity

  colorGroups.value[selectedTheme.value][index][position] = newColor;
  ctx.config.colorGroups = {
    colorGroup: colorGroups.value[selectedTheme.value],
    themeNumber: themeOptions.findIndex(option => option.value === selectedTheme.value)
  };
};
const gradientStyle = group => {
  return `background: linear-gradient(to right, ${group.top}, ${group.bottom});`;
};
</script>

<template>
  <div>
    <NSelect
      v-model:value="selectedTheme"
      :options="themeOptions"
      placeholder="请选择主题"
      class="mb-2"
      @update:value="themeUpdate"
    />
    <div v-if="selectedTheme" class="color-groups">
      <n-grid x-gap="6" y-gap="6" :cols="2">
        <n-gi v-for="(group, index) in colorGroups[selectedTheme]" :key="group.name">
          <div class="color-group">
            <div>{{ index + 1 }}.</div>
            <!-- Top Color Picker Popover -->
            <NColorPicker
              class="w-28px"
              size="small"
              :default-value="group.top"
              @update:value="value => updateColor(value, index, 'top')"
            >
              <template #label>
                <span />
              </template>
            </NColorPicker>
            <div class="gradient-preview" :style="gradientStyle(group)"></div>
            <!-- Bottom Color Picker Popover -->
            <NColorPicker
              class="w-28px"
              size="small"
              :default-value="group.bottom"
              @update:value="value => updateColor(value, index, 'bottom')"
            >
              <template #label>
                <span />
              </template>
            </NColorPicker>
          </div>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<style scoped>
.color-groups {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.color-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gradient-preview {
  height: 20px;
  flex: 1;
  border-radius: 4px;
}

.color-picker {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  border: 1px solid #ccc;
  cursor: pointer;
}
</style>
