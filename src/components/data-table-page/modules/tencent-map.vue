<script setup lang="tsx">
import { createApp, onMounted, ref, watchEffect } from 'vue';
import { NCard } from 'naive-ui';
import { useScriptTag } from '@vueuse/core';
import dayjs from 'dayjs';
import { TENCENT_MAP_SDK_URL } from '@/constants/map-sdk';
import { $t } from '@/locales';
import { telemetryLatestApi } from '@/service/api/system-data';
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
const telemetryValue = ref<any>([]);
// 获取最新一条设备遥测数据
const telemetryData: (id: string) => void = async id => {
  // const params = {
  //   page: 1,
  //   page_size: 10,
  //   device_template_id: id
  // }
  const data: any = await telemetryLatestApi(id);
  telemetryValue.value = data.data;
  console.log(telemetryValue.value, '最新的遥测数据');
};

async function renderMap() {
  await load(true);
  if (!domRef.value) return;
  if (!map) {
    map = new TMap.Map(domRef.value, {
      center: new TMap.LatLng(39.98412, 116.307484),
      zoom: 11,
      maxZoom: 13,
      minZoom: 3,
      viewMode: '3D'
    });
    map.on('click', async () => {
      // 在短暂的时间窗口内忽略点击事件
      console.log(1);
      if (ignoreMapClick) {
        ignoreMapClick = false; // 重置标志
        return;
      }
      // 执行正常的点击处理逻辑
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      console.log(2);
      infoWindow.close();
      console.log(3);
    });
  }

  if (multiMarker) {
    multiMarker.setMap(null); // 移除旧的MultiMarker
  }
  const markers: any = [];
  props.devices.map(device => {
    if (device?.location) {
      const locations = device.location.split(',');
      const latitude = Number(locations[1] || 0);
      const longitude = Number(locations[0] || 0);

      markers.push({
        position: new TMap.LatLng(latitude, longitude),
        id: device.id,
        data: device
      });
    }
  });
  console.log(markers.length);
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
    telemetryData(evt.geometry.data.id);

    ignoreMapClick = true;
    setTimeout(() => {
      ignoreMapClick = false;
    }, 10);
    // 创建一个新的 Vue 实例
    const app = createApp({
      render() {
        const statusText: any = {
          0: $t('custom.devicePage.online'),
          1: $t('custom.devicePage.offline')
        };
        // 在模板中使用 Naive UI 的组件
        return (
          <NCard
            header-style="padding:10px"
            title={`${$t('custom.devicePage.deviceName')}：${evt.geometry.data.name}`}
            class="h-130px min-w-200px"
          >
            <div>
              {$t('custom.devicePage.lastPushTime')}：
              {evt.geometry.data.ts ? dayjs(evt.geometry.data.ts).format('YYYY-MM-DD HH:mm:ss') : '-'}
            </div>
            <div>
              {'当前设备的温度和湿度'}：{evt?.geometry?.humidity ?? 0}%~{evt?.geometry?.temperature ?? 0}%
            </div>
            <div>
              {$t('generate.status')}：{statusText[evt.geometry.data.is_online]}
            </div>
          </NCard>
        );
      }
    });
    setTimeout(() => {
      evt.geometry.humidity = telemetryValue.value[0]?.value ?? 0;
      evt.geometry.temperature = telemetryValue.value[1]?.value ?? 0;

      // 挂载这个实例，并获取它的 HTML
      const html = app.mount(document.createElement('div')).$el.outerHTML;
      // 设置infoWindow
      infoWindow.open(); // 打开信息窗
      infoWindow.setPosition(evt.geometry.position); // 设置信息窗位置
      infoWindow.setContent(html); // 设置信息窗内容
      evt.originalEvent.stopPropagation();
      console.log(evt, telemetryValue.value, '点击了弹窗');
    }, 10);
  });
}

onMounted(() => {
  renderMap();
});

watchEffect(() => {
  renderMap();
});
</script>

<template>
  <div ref="domRef" class="h-full w-full"></div>
</template>

<style scoped></style>
