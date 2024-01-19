const functionRoute: AuthRoute.Route = {
  name: 'apply',
  path: '/apply',
  component: 'basic',
  meta: {
    title: '应用管理',
    i18nTitle: 'routes.apply._value',
    icon: 'mdi:apps-box',
    order: 13
  },
  children: [
    {
      name: 'apply_service',
      path: '/apply/service',
      component: 'self',
      meta: {
        title: '服务管理',
        i18nTitle: 'routes.apply.service',
        requiresAuth: true
      }
    }
  ]
}

export default functionRoute
