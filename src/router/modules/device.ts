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
    }
  ],
  meta: { title: '设备', icon: 'tabler:device-tv', order: 3 }
}

export default device
