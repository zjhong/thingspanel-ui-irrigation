declare namespace PageRoute {
  /**
   * the root route key
   * @translate 根路由
   */
  type RootRouteKey = 'root'

  /**
   * the not found route, which catch the invalid route path
   * @translate 未找到路由(捕获无效路径的路由)
   */
  type NotFoundRouteKey = 'not-found'

  /**
   * the route key
   * @translate 页面路由
   */
  type RouteKey =
    | '403'
    | '404'
    | '500'
    | 'constant-page'
    | 'login'
    | 'not-found'
    | 'about'
    | 'apply'
    | 'apply_service'
    | 'auth-demo'
    | 'auth-demo_permission'
    | 'auth-demo_super'
    | 'component'
    | 'component_button'
    | 'component_card'
    | 'component_table'
    | 'dashboard'
    | 'dashboard_analysis'
    | 'dashboard_mobile-panel'
    | 'dashboard_panel'
    | 'dashboard_workbench'
    | 'data-service'
    | 'device'
    | 'device_grouping'
    | 'device_grouping_details'
    | 'device_manage'
    | 'exception'
    | 'exception_403'
    | 'exception_404'
    | 'exception_500'
    | 'function'
    | 'function_tab-detail'
    | 'function_tab-multi-detail'
    | 'function_tab'
    | 'function_websocket'
    | 'management'
    | 'management_auth'
    | 'management_role'
    | 'management_route'
    | 'management_setting'
    | 'management_user'
    | 'multi-menu'
    | 'multi-menu_first'
    | 'multi-menu_first_second-new'
    | 'multi-menu_first_second-new_third'
    | 'multi-menu_first_second'
    | 'plugin'
    | 'plugin_charts'
    | 'plugin_charts_antv'
    | 'plugin_charts_echarts'
    | 'plugin_copy'
    | 'plugin_editor'
    | 'plugin_editor_markdown'
    | 'plugin_editor_quill'
    | 'plugin_icon'
    | 'plugin_map'
    | 'plugin_print'
    | 'plugin_swiper'
    | 'plugin_video'
    | 'product'
    | 'product_list'
    | 'product_update-ota'
    | 'product_update-package'
    | 'rule-engine'

  /**
   * last degree route key, which has the page file
   * @translate 最后一级路由(该级路有对应的页面文件)
   */
  type LastDegreeRouteKey = Extract<
    RouteKey,
    | '403'
    | '404'
    | '500'
    | 'constant-page'
    | 'login'
    | 'not-found'
    | 'about'
    | 'apply_service'
    | 'auth-demo_permission'
    | 'auth-demo_super'
    | 'component_button'
    | 'component_card'
    | 'component_table'
    | 'dashboard_analysis'
    | 'dashboard_mobile-panel'
    | 'dashboard_panel'
    | 'dashboard_workbench'
    | 'data-service'
    | 'device_grouping_details'
    | 'device_grouping'
    | 'device_manage'
    | 'exception_403'
    | 'exception_404'
    | 'exception_500'
    | 'function_tab-detail'
    | 'function_tab-multi-detail'
    | 'function_tab'
    | 'function_websocket'
    | 'management_auth'
    | 'management_role'
    | 'management_route'
    | 'management_setting'
    | 'management_user'
    | 'multi-menu_first_second-new_third'
    | 'multi-menu_first_second'
    | 'plugin_charts_antv'
    | 'plugin_charts_echarts'
    | 'plugin_copy'
    | 'plugin_editor_markdown'
    | 'plugin_editor_quill'
    | 'plugin_icon'
    | 'plugin_map'
    | 'plugin_print'
    | 'plugin_swiper'
    | 'plugin_video'
    | 'product_list'
    | 'product_update-ota'
    | 'product_update-package'
    | 'rule-engine'
  >
}
