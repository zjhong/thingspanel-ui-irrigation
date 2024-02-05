const ruleEngine: AuthRoute.Route = {
  name: 'rule-engine',
  path: '/rule-engine',
  component: 'self',
  meta: {
    title: '规则引擎',
    i18nTitle: 'routes.rule-engine',
    requiresAuth: true,
    keepAlive: true,
    singleLayout: 'basic',
    icon: 'icon-park-outline:rectangular-vertebra',
    order: 11
  }
}

export default ruleEngine
