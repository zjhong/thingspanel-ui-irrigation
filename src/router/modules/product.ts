const product: AuthRoute.Route = {
  name: 'product',
  path: '/product',
  component: 'basic',
  meta: { title: 'product', icon: 'mdi:menu' },
  children: [
    {
      name: 'product_list',
      path: '/product/list',
      component: 'self',
      meta: { title: 'product_list', icon: 'mdi:menu' }
    },
    {
      name: 'product_update-package',
      path: '/product/update-package',
      component: 'self',
      meta: { title: 'product_update-package', icon: 'mdi:menu' }
    },
    {
      name: 'product_update-ota',
      path: '/product/update-ota',
      component: 'self',
      meta: { title: 'product_update-ota', icon: 'mdi:menu' }
    }
  ]
}

export default product
