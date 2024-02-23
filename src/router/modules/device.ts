const device: AuthRoute.Route = {
  name: 'device',
  path: '/device',
  component: 'basic',
  children: [
    {
      name: 'device_manage',
      path: '/device/manage',
      component: 'self',
      meta: {
        title: '设备管理',
        icon: 'material-symbols:device-hub',
        requiresAuth: true
      }
    },
    {
      name: 'device_grouping',
      path: '/device/grouping',
      component: 'self',
      meta: {
        title: '分组管理',
        icon: 'material-symbols:grid-on-outline-sharp',
        requiresAuth: true
      }
    },
    {
      name: 'device_grouping_details',
      path: '/device/grouping/details',
      component: 'self',
      meta: {
        title: '分组详情',
        requiresAuth: true,
        hide: true
      }
    }
  ],
  meta: { title: '设备接入', icon: 'tabler:device-tv', order: 3 }
}

export default device
