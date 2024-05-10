<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import BgImage from '@/assets/imgs/bg.jpg';
// import { getColorPalette } from '@/utils'
// import { CornerBottom, CornerTop } from './components'

type SysSetting = Omit<Api.GeneralSetting.ThemeSetting, 'id'>;
interface Props {
  /** 主题颜色 */
  // themeColor: string;
  sysSetting: SysSetting;
}

const props = defineProps<Props>();
const isBgLoaded = ref(false);

// const lightColor = computed(() => getColorPalette(props.themeColor, 3))
// const darkColor = computed(() => getColorPalette(props.themeColor, 6))
const gradientColors = [
  'rgba(1, 63, 146, 1)',
  'rgba(46, 119, 196, 1)',
  'rgba(72, 140, 211, 1)',
  'rgba(187, 202, 225, 1)'
];
const gradientStyle = computed(() => {
  const gradientString = `linear-gradient(180deg, ${gradientColors.join(' 0%, ')} 100%)`;
  return { background: gradientString };
});
const imageStyle = computed(() => {
  return {
    'min-width': '100%',
    'min-height': '100%',
    opacity: isBgLoaded.value ? '0.9' : '1'
  };
});
const imageProps = computed(() => {
  return {
    style: {
      'min-width': '100%'
    }
  };
});

const bgColor = computed(() => props.sysSetting.home_background);

const assetImage = new Image();
assetImage.src = BgImage;
assetImage.onload = () => {
  isBgLoaded.value = true;
};

const preloadBgImage = () => {
  const imageUrl = bgColor.value;
  if (imageUrl) {
    const bgImage = new Image();
    bgImage.src = imageUrl;
    bgImage.onload = () => {
      isBgLoaded.value = true;
    };
    bgImage.onerror = () => {
      isBgLoaded.value = false;
    };
  }
};

onMounted(() => {
  preloadBgImage();
});
</script>

<template>
  <div class="absolute-lt z-1 wh-full overflow-hidden" :style="gradientStyle">
    <!--
 <template v-if="!bgColor">
      <div class="absolute -right-300px -top-900px <sm:(-right-100px -top-1170px)">
        <corner-top :start-color="lightColor" :end-color="darkColor" />
      </div>
      <div class="absolute -left-200px -bottom-400px <sm:(-left-100px -bottom-760px)">
        <corner-bottom :start-color="darkColor" :end-color="lightColor" />
      </div>
    </template>
-->
    <NImage
      object-fit="cover"
      :style="imageStyle"
      preview-disabled
      :src="isBgLoaded ? bgColor : assetImage.src"
      :img-props="imageProps"
    />
  </div>
</template>

<style scoped></style>
