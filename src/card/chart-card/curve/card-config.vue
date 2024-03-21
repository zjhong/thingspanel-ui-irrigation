<script lang="ts" setup>
import { inject, reactive, ref } from 'vue';
import { NColorPicker, NPopover, NSelect } from 'naive-ui';
import type { IConfigCtx } from '@/components/panel/card';

const ctx = inject<IConfigCtx>('config-ctx')!;
console.log(ctx);
const originalColorGroups = reactive({
  colorGroups: [
    { name: 'Sunrise Glow', top: 'rgb(255, 227, 157)', bottom: 'rgb(255, 182, 185)' },
    { name: 'Sky Reflection', top: 'rgb(157, 236, 255)', bottom: 'rgb(102, 153, 255)' },
    { name: 'Spring Meadow', top: 'rgb(182, 255, 187)', bottom: 'rgb(153, 255, 204)' },
    { name: 'Peach Blossom', top: 'rgb(255, 197, 157)', bottom: 'rgb(255, 159, 128)' },
    { name: 'Mint Breeze', top: 'rgb(206, 255, 157)', bottom: 'rgb(159, 255, 128)' },
    { name: 'Lavender Mist', top: 'rgb(255, 157, 224)', bottom: 'rgb(255, 128, 191)' },
    { name: 'Wisteria Whisper', top: 'rgb(197, 157, 255)', bottom: 'rgb(159, 128, 255)' },
    { name: 'Apricot Cream', top: 'rgb(255, 224, 157)', bottom: 'rgb(255, 204, 128)' },
    { name: 'Celestial Blue', top: 'rgb(157, 224, 255)', bottom: 'rgb(128, 204, 255)' }
  ],
  colorGroups2: [
    { name: 'Sunlit Terra', top: 'rgb(235, 154, 88)', bottom: 'rgb(255, 221, 175)' },
    { name: 'Twilight Sapphire', top: 'rgb(33, 68, 115)', bottom: 'rgb(174, 198, 207)' },
    { name: 'Mint Whisper', top: 'rgb(199, 233, 192)', bottom: 'rgb(232, 240, 232)' },
    { name: 'Apricot Glow', top: 'rgb(255, 175, 95)', bottom: 'rgb(255, 204, 153)' },
    { name: 'Meadow Breeze', top: 'rgb(155, 215, 112)', bottom: 'rgb(215, 255, 179)' },
    { name: 'Dusk Rose', top: 'rgb(217, 136, 128)', bottom: 'rgb(239, 187, 204)' },
    { name: 'Canyon Echo', top: 'rgb(193, 108, 61)', bottom: 'rgb(252, 204, 166)' },
    { name: 'Ocean Drift', top: 'rgb(62, 133, 145)', bottom: 'rgb(181, 222, 213)' },
    { name: 'Dawn Blush', top: 'rgb(255, 133, 102)', bottom: 'rgb(255, 226, 148)' }
  ]
});
const colorGroups = ref(JSON.parse(JSON.stringify(originalColorGroups))); // Deep copy to preserve original data

const themeOptions = [
  { label: 'Color Group 1', value: 'colorGroups' },
  { label: 'Color Group 2', value: 'colorGroups2' }
];

const selectedTheme = ref('');
const popoverState = ref({});
const togglePopover = (index, position) => {
  const key = `${index}-${position}`;
  popoverState.value[key] = !popoverState.value[key];
};
const updatePopoverVisibility = (index, position, status) => {
  const key = `${index}-${position}`;
  popoverState.value[key] = status;
};

const updateTheme = newValue => {
  // Reset to original values of the selected theme to ensure we're not keeping any edits
  colorGroups.value[newValue] = JSON.parse(JSON.stringify(originalColorGroups[newValue]));
};

const updateColor = (newColor, index, position) => {
  // This method updates the color and ensures reactivity
  colorGroups.value[selectedTheme.value][index][position] = newColor;
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
      placeholder="Select a theme"
      @update:value="updateTheme"
    />
    <div v-if="selectedTheme" class="color-groups">
      <div v-for="(group, index) in colorGroups[selectedTheme]" :key="group.name" class="color-group">
        <div>{{ index + 1 }}.</div>
        <!-- Top Color Picker Popover -->
        <NPopover
          :show="popoverState[`${index}-top`]"
          trigger="click"
          @update:show="status => updatePopoverVisibility(index, 'top', status)"
        >
          <template #trigger>
            <div
              class="color-picker"
              :style="{ backgroundColor: group.top }"
              @click.stop="() => togglePopover(index, 'top')"
            ></div>
          </template>
          <template #content>
            <NColorPicker
              v-model:value="colorGroups[selectedTheme][index].top"
              show-alpha
              @update:value="value => updateColor(value, index, 'top')"
            />
          </template>
        </NPopover>
        <div class="gradient-preview" :style="gradientStyle(group)"></div>
        <!-- Bottom Color Picker Popover -->
        <NPopover
          :show="popoverState[`${index}-bottom`]"
          trigger="click"
          @update:show="status => updatePopoverVisibility(index, 'bottom', status)"
        >
          <template #trigger>
            <div
              class="color-picker"
              :style="{ backgroundColor: group.bottom }"
              @click.stop="() => togglePopover(index, 'bottom')"
            ></div>
          </template>
          <template #content>
            <NColorPicker
              v-model:value="colorGroups[selectedTheme][index].bottom"
              show-alpha
              @update:value="value => updateColor(value, index, 'bottom')"
            />
          </template>
        </NPopover>
      </div>
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
  width: 100px;
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
