<script setup lang="tsx">
import { createApp, onMounted, ref, watchEffect } from 'vue';
import { NCard } from 'naive-ui';
import { useScriptTag } from '@vueuse/core';
import { TENCENT_MAP_SDK_URL } from '@/constants/map-sdk';

defineOptions({ name: 'TencentMap' });

const props = defineProps<{ devices: any[] }>();

const { load } = useScriptTag(TENCENT_MAP_SDK_URL);

const domRef = ref<HTMLDivElement | null>(null);
let map: any = null;
let multiMarker: any = null;
let infoWindow: any = null;
const showMarker = (markerArr, bounds) => {
  // 判断标注点是否在范围内
  markerArr.forEach(item => {
    // 若坐标点不在范围内，扩大bounds范围
    if (bounds.isEmpty() || !bounds.contains(item.position)) {
      bounds.extend(item.position);
    }
  });
  // 设置地图可视范围
  map.fitBounds(bounds, {
    padding: 100 // 自适应边距
  });
};
let ignoreMapClick = false;

async function renderMap(devices) {
  await load(true);
  if (!domRef.value) return;
  if (!map) {
    map = new TMap.Map(domRef.value, {
      center: new TMap.LatLng(39.98412, 116.307484),
      zoom: 11,
      viewMode: '3D'
    });
    map.on('click', () => {
      // 在短暂的时间窗口内忽略点击事件
      console.log(1);
      if (ignoreMapClick) {
        ignoreMapClick = false; // 重置标志
        return;
      }
      // 执行正常的点击处理逻辑
      console.log(2);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      infoWindow.close();
      console.log(3);
    });
  }

  if (multiMarker) {
    multiMarker.setMap(null); // 移除旧的MultiMarker
  }

  const markers = devices.map(device => {
    const locations = device.location && device.location.split(',');
    const latitude = !Number.isNaN(Number(locations[1]))
      ? Number(locations[1])
      : 39 + Number((Math.random() * (0.999999 - 0.000001) + 0.000001).toFixed(6));

    const longitude = !Number.isNaN(Number(locations[0]))
      ? Number(locations[0])
      : 116 + Number((Math.random() * (0.999999 - 0.000001) + 0.000001).toFixed(6));
    console.log(latitude, longitude);
    return {
      position: new TMap.LatLng(latitude, longitude),
      id: device.id,
      data: device
    };
  });

  multiMarker = new TMap.MultiMarker({
    map,
    styles: {
      marker: new TMap.MarkerStyle({
        width: 20,
        height: 30,
        anchor: { x: 10, y: 30 },
        color: '#333'
      })
    },
    geometries: markers
  });
  const bounds = new TMap.LatLngBounds();
  showMarker(markers, bounds);
  infoWindow = new TMap.InfoWindow({
    map,
    position: new TMap.LatLng(39.984104, 116.307503),
    offset: { x: 0, y: -32 }, // 设置信息窗相对position偏移像素
    enableCustom: true
  });
  infoWindow.close();
  // 监听地图的点击事件

  multiMarker.on('click', (evt: any) => {
    ignoreMapClick = true;
    setTimeout(() => {
      ignoreMapClick = false;
    }, 10);
    // 创建一个新的 Vue 实例
    const app = createApp({
      render() {
        // 在模板中使用 Naive UI 的组件
        return (
          <NCard title={`设备名称：${evt.geometry.data.name}`} class="h-130px w-200px">
            上次推送时间：{evt.geometry.data.ts || '-'}
            <br />
            状态：{evt.geometry.data.ts}
          </NCard>
        );
      }
    });

    // 挂载这个实例，并获取它的 HTML
    const html = app.mount(document.createElement('div')).$el.outerHTML;
    // 设置infoWindow

    infoWindow.open(); // 打开信息窗
    infoWindow.setPosition(evt.geometry.position); // 设置信息窗位置
    infoWindow.setContent(html); // 设置信息窗内容
    console.log(evt);
    evt.originalEvent.stopPropagation();
  });
}

onMounted(() => {
  renderMap(props.devices);
});

watchEffect(() => {
  renderMap(props.devices);
});
</script>

<template>
  <div ref="domRef" class="h-full w-full"></div>
</template>

<style scoped></style>
