const about: AuthRoute.Route = {
  name: 'about',
  path: '/about',
  component: 'self',
  meta: {
    title: '关于',
    i18nTitle: 'routes.about',
    requiresAuth: true,
    keepAlive: true,
    singleLayout: 'basic',
    permissions: ['SYS_ADMIN', 'TENANT_ADMIN', 'TENANT_USER'],
    icon: 'fluent:book-information-24-regular',
    order: 10
  }
}

export default about
