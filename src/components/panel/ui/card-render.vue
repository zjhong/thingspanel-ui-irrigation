<script setup lang="ts">
import { GridItem, GridLayout } from 'vue3-drr-grid-layout';
import { v4 as uuidv4 } from 'uuid';
import type { ICardData, ICardView } from '@/components/panel/card';
import './gird.css';
import { $t } from '@/locales';

const props = defineProps<{
  layout: ICardView[];
  colNum: number;
  defaultCardCol: number;
  rowHeight: number;
  isPreview?: boolean;
}>();

const countSpace = (data: ICardView[], y: number) => {
  const cols = data.filter(d => d.y === y).sort((a, b) => (a.x > b.x ? 1 : -1));
  let start = 0;
  for (const c of cols) {
    if (c.x - start > 0) {
      start += c.x - start;
    }
    start += c.w;
  }
  return start;
};

const emit = defineEmits<{
  (e: 'update:layout', layout: ICardView[] | any): void;
  (e: 'edit', view: ICardView): void;
  // (e: 'remove', view: ICardView): void;
}>();

defineExpose({
  addCard: (data: ICardData) => {
    const yList: number[] = [];
    const layout = props.layout;
    const layoutData = layout.sort((a, b) => {
      return a.y > b.y ? 1 : -1;
    });
    layoutData.forEach(item => {
      if (!yList.includes(item.y)) yList.push(item.y);
    });
    let y = yList.shift() || 0;
    let x = 0;
    const max = yList[yList.length - 1] || 0;
    while (y <= max) {
      const space = countSpace(layoutData, y);
      if (space <= 8) {
        x = space;
        break;
      } else {
        y = yList.shift() || y + 1;
      }
    }
    emit('update:layout', [
      ...layout,
      {
        x,
        y,
        w: props.defaultCardCol,
        h: 4,
        i: uuidv4(),
        data
      }
    ]);
  }
});

const removeLayout = (i: number) => {
  emit(
    'update:layout',
    props.layout.filter(item => item.i !== i)
  );
};
</script>

<template>
  <GridLayout
    :layout="layout"
    :col-num="colNum"
    :row-height="rowHeight"
    :auto-size="true"
    :margin="[10, 10]"
    class="w-full"
    @update:layout="data => emit('update:layout', data)"
  >
    <template #default="{ gridItemProps }">
      <GridItem
        v-for="item in layout"
        :key="item.i"
        :static="isPreview"
        v-bind="gridItemProps"
        :min-h="2"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
      >
        <div class="relative h-full w-full">
          <NIcon
            v-if="!isPreview"
            class="absolute right-8 top-1.5 z-50 cursor-pointer cursor-pointer opacity-50 duration-200 hover:opacity-100"
            @click="emit('edit', item)"
          >
            <SvgIcon icon="uil:setting" class="text-base" />
          </NIcon>
          <NPopconfirm
            v-if="!isPreview"
            :show-icon="false"
            :negative-button-props="{ size: 'tiny' }"
            :positive-button-props="{ size: 'tiny' }"
            :on-positive-click="() => removeLayout(item.i)"
          >
            <template #trigger>
              <NIcon
                class="absolute right-2 top-1.5 z-50 cursor-pointer cursor-pointer opacity-50 duration-200 hover:opacity-100"
              >
                <SvgIcon icon="material-symbols:delete-outline" class="text-base" />
              </NIcon>
            </template>
            <span>{{ $t('generate.confirm-delete-dashboard') }}</span>
          </NPopconfirm>
          <CardItem :data="item.data!" :view="isPreview" />
        </div>
      </GridItem>
    </template>
  </GridLayout>
</template>

<style scoped>
.relative {
  width: 100%;
}
</style>
