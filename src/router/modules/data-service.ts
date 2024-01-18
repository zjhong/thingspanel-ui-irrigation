const dataService: AuthRoute.Route = {
  name: 'data-service',
  path: '/data-service',
  component: 'self',
  meta: {
    title: '数据服务',
    i18nTitle: 'routes.data-service',
    requiresAuth: true,
    keepAlive: true,
    singleLayout: 'basic',
    permissions: ['super', 'admin', 'user'],
    icon: 'icon-park-outline:data-server',
    order: 12
  }
}

export default dataService
