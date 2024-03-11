/* eslint-disable */
/* prettier-ignore */
// Generated by elegant-router
// Read more: https://github.com/soybeanjs/elegant-router

import type { GeneratedRoute } from '@elegant-router/types';

export const generatedRoutes: GeneratedRoute[] = [
  {
    name: '403',
    path: '/403',
    component: 'layout.blank$view.403',
    meta: {
      title: '403',
      i18nKey: 'route.403',
      constant: true
    }
  },
  {
    name: '404',
    path: '/404',
    component: 'layout.blank$view.404',
    meta: {
      title: '404',
      i18nKey: 'route.404',
      constant: true
    }
  },
  {
    name: '500',
    path: '/500',
    component: 'layout.blank$view.500',
    meta: {
      title: '500',
      i18nKey: 'route.500',
      constant: true
    }
  },
  {
    name: 'about',
    path: '/about',
    component: 'layout.base$view.about',
    meta: {
      title: 'about',
      i18nKey: 'route.about',
      icon: 'fluent:book-information-24-regular',
      order: 10
    }
  },
  {
    name: 'apply',
    path: '/apply',
    component: 'layout.base',
    meta: {
      title: 'apply',
      i18nKey: 'route.apply'
    },
    children: [
      {
        name: 'apply_service',
        path: '/apply/service',
        component: 'view.apply_service',
        meta: {
          title: 'apply_service',
          i18nKey: 'route.apply_service'
        }
      }
    ]
  },
  {
    name: 'component',
    path: '/component',
    component: 'layout.base',
    meta: {
      title: 'component',
      i18nKey: 'route.component'
    },
    children: [
      {
        name: 'component_button',
        path: '/component/button',
        component: 'view.component_button',
        meta: {
          title: 'component_button',
          i18nKey: 'route.component_button'
        }
      },
      {
        name: 'component_card',
        path: '/component/card',
        component: 'view.component_card',
        meta: {
          title: 'component_card',
          i18nKey: 'route.component_card'
        }
      },
      {
        name: 'component_table',
        path: '/component/table',
        component: 'view.component_table',
        meta: {
          title: 'component_table',
          i18nKey: 'route.component_table'
        }
      }
    ]
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    component: 'layout.base',
    meta: {
      title: 'dashboard',
      i18nKey: 'route.dashboard'
    },
    children: [
      {
        name: 'dashboard_analysis',
        path: '/dashboard/analysis',
        component: 'view.dashboard_analysis',
        meta: {
          title: 'dashboard_analysis',
          i18nKey: 'route.dashboard_analysis'
        }
      },
      {
        name: 'dashboard_mobile-panel',
        path: '/dashboard/mobile-panel',
        component: 'view.dashboard_mobile-panel',
        meta: {
          title: 'dashboard_mobile-panel',
          i18nKey: 'route.dashboard_mobile-panel'
        }
      },
      {
        name: 'dashboard_panel',
        path: '/dashboard/panel',
        component: 'view.dashboard_panel',
        meta: {
          title: 'dashboard_panel',
          i18nKey: 'route.dashboard_panel'
        }
      },
      {
        name: 'dashboard_workbench',
        path: '/dashboard/workbench',
        component: 'view.dashboard_workbench',
        meta: {
          title: 'dashboard_workbench',
          i18nKey: 'route.dashboard_workbench'
        }
      }
    ]
  },
  {
    name: 'data-service',
    path: '/data-service',
    component: 'layout.base',
    meta: {
      title: 'data-service',
      i18nKey: 'route.data-service'
    },
    children: [
      {
        name: 'data-service_rule-engine',
        path: '/data-service/rule-engine',
        component: 'view.data-service_rule-engine',
        meta: {
          title: 'data-service_rule-engine',
          i18nKey: 'route.data-service_rule-engine'
        }
      }
    ]
  },
  {
    name: 'device',
    path: '/device',
    component: 'layout.base',
    meta: {
      title: 'device',
      i18nKey: 'route.device'
    },
    children: [
      {
        name: 'device_config',
        path: '/device/config',
        component: 'view.device_config',
        meta: {
          title: 'device_config',
          i18nKey: 'route.device_config'
        }
      },
      {
        name: 'device_config-detail',
        path: '/device/config-detail',
        component: 'view.device_config-detail',
        meta: {
          title: 'device_config-detail',
          i18nKey: 'route.device_config-detail'
        }
      },
      {
        name: 'device_config-edit',
        path: '/device/config-edit',
        component: 'view.device_config-edit',
        meta: {
          title: 'device_config-edit',
          i18nKey: 'route.device_config-edit'
        }
      },
      {
        name: 'device_details',
        path: '/device/details',
        component: 'view.device_details',
        meta: {
          title: 'device_details',
          i18nKey: 'route.device_details'
        }
      },
      {
        name: 'device_grouping',
        path: '/device/grouping',
        component: 'view.device_grouping',
        meta: {
          title: 'device_grouping',
          i18nKey: 'route.device_grouping'
        }
      },
      {
        name: 'device_grouping-details',
        path: '/device/grouping-details',
        component: 'view.device_grouping-details',
        meta: {
          title: 'device_grouping-details',
          i18nKey: 'route.device_grouping-details'
        }
      },
      {
        name: 'device_manage',
        path: '/device/manage',
        component: 'view.device_manage',
        meta: {
          title: 'device_manage',
          i18nKey: 'route.device_manage'
        }
      }
    ]
  },
  {
    name: 'function',
    path: '/function',
    component: 'layout.base',
    meta: {
      title: 'function',
      i18nKey: 'route.function',
      icon: 'icon-park-outline:all-application',
      order: 6
    },
    children: [
      {
        name: 'function_hide-child',
        path: '/function/hide-child',
        meta: {
          title: 'function_hide-child',
          i18nKey: 'route.function_hide-child',
          icon: 'material-symbols:filter-list-off'
        },
        redirect: '/function/hide-child/one',
        children: [
          {
            name: 'function_hide-child_one',
            path: '/function/hide-child/one',
            component: 'view.function_hide-child_one',
            meta: {
              title: 'function_hide-child_one',
              i18nKey: 'route.function_hide-child_one',
              icon: 'material-symbols:filter-list-off',
              hideInMenu: true,
              activeMenu: 'function_hide-child'
            }
          },
          {
            name: 'function_hide-child_three',
            path: '/function/hide-child/three',
            component: 'view.function_hide-child_three',
            meta: {
              title: 'function_hide-child_three',
              i18nKey: 'route.function_hide-child_three',
              hideInMenu: true,
              activeMenu: 'function_hide-child'
            }
          },
          {
            name: 'function_hide-child_two',
            path: '/function/hide-child/two',
            component: 'view.function_hide-child_two',
            meta: {
              title: 'function_hide-child_two',
              i18nKey: 'route.function_hide-child_two',
              hideInMenu: true,
              activeMenu: 'function_hide-child'
            }
          }
        ]
      },
      {
        name: 'function_multi-tab',
        path: '/function/multi-tab',
        component: 'view.function_multi-tab',
        meta: {
          title: 'function_multi-tab',
          i18nKey: 'route.function_multi-tab',
          icon: 'ic:round-tab',
          multiTab: true,
          hideInMenu: true,
          activeMenu: 'function_tab'
        }
      },
      {
        name: 'function_tab',
        path: '/function/tab',
        component: 'view.function_tab',
        meta: {
          title: 'function_tab',
          i18nKey: 'route.function_tab',
          icon: 'ic:round-tab'
        }
      }
    ]
  },
  {
    name: 'home',
    path: '/home',
    component: 'layout.base$view.home',
    meta: {
      title: 'home',
      i18nKey: 'route.home',
      icon: 'mdi:monitor-dashboard',
      order: 1
    }
  },
  {
    name: 'login',
    path: '/login/:module(pwd-login|code-login|register|reset-pwd|bind-wechat)?',
    component: 'layout.blank$view.login',
    props: true,
    meta: {
      title: 'login',
      i18nKey: 'route.login',
      constant: true
    }
  },
  {
    name: 'manage',
    path: '/manage',
    component: 'layout.base',
    meta: {
      title: 'manage',
      i18nKey: 'route.manage',
      icon: 'carbon:cloud-service-management',
      order: 9,
      roles: ['R_ADMIN']
    },
    children: [
      {
        name: 'manage_menu',
        path: '/manage/menu',
        component: 'view.manage_menu',
        meta: {
          title: 'manage_menu',
          i18nKey: 'route.manage_menu',
          icon: 'material-symbols:route',
          order: 3,
          roles: ['R_ADMIN'],
          keepAlive: true
        }
      },
      {
        name: 'manage_role',
        path: '/manage/role',
        component: 'view.manage_role',
        meta: {
          title: 'manage_role',
          i18nKey: 'route.manage_role',
          icon: 'carbon:user-role',
          order: 2,
          roles: ['R_ADMIN']
        }
      },
      {
        name: 'manage_user',
        path: '/manage/user',
        component: 'view.manage_user',
        meta: {
          title: 'manage_user',
          i18nKey: 'route.manage_user',
          icon: 'ic:round-manage-accounts',
          order: 1,
          roles: ['R_ADMIN']
        }
      },
      {
        name: 'manage_user-detail',
        path: '/manage/user-detail/:id',
        component: 'view.manage_user-detail',
        props: true,
        meta: {
          title: 'manage_user-detail',
          i18nKey: 'route.manage_user-detail',
          hideInMenu: true,
          roles: ['R_ADMIN'],
          activeMenu: 'manage_user'
        }
      }
    ]
  },
  {
    name: 'management',
    path: '/management',
    component: 'layout.base',
    meta: {
      title: 'management',
      i18nKey: 'route.management'
    },
    children: [
      {
        name: 'management_auth',
        path: '/management/auth',
        component: 'view.management_auth',
        meta: {
          title: 'management_auth',
          i18nKey: 'route.management_auth'
        }
      },
      {
        name: 'management_role',
        path: '/management/role',
        component: 'view.management_role',
        meta: {
          title: 'management_role',
          i18nKey: 'route.management_role'
        }
      },
      {
        name: 'management_route',
        path: '/management/route',
        component: 'view.management_route',
        meta: {
          title: 'management_route',
          i18nKey: 'route.management_route'
        }
      },
      {
        name: 'management_setting',
        path: '/management/setting',
        component: 'view.management_setting',
        meta: {
          title: 'management_setting',
          i18nKey: 'route.management_setting'
        }
      },
      {
        name: 'management_user',
        path: '/management/user',
        component: 'view.management_user',
        meta: {
          title: 'management_user',
          i18nKey: 'route.management_user'
        }
      }
    ]
  },
  {
    name: 'multi-menu',
    path: '/multi-menu',
    component: 'layout.base',
    meta: {
      title: 'multi-menu',
      i18nKey: 'route.multi-menu',
      order: 8
    },
    children: [
      {
        name: 'multi-menu_first',
        path: '/multi-menu/first',
        meta: {
          title: 'multi-menu_first',
          i18nKey: 'route.multi-menu_first',
          order: 1
        },
        children: [
          {
            name: 'multi-menu_first_child',
            path: '/multi-menu/first/child',
            component: 'view.multi-menu_first_child',
            meta: {
              title: 'multi-menu_first_child',
              i18nKey: 'route.multi-menu_first_child'
            }
          }
        ]
      },
      {
        name: 'multi-menu_second',
        path: '/multi-menu/second',
        meta: {
          title: 'multi-menu_second',
          i18nKey: 'route.multi-menu_second',
          order: 2
        },
        children: [
          {
            name: 'multi-menu_second_child',
            path: '/multi-menu/second/child',
            meta: {
              title: 'multi-menu_second_child',
              i18nKey: 'route.multi-menu_second_child'
            },
            children: [
              {
                name: 'multi-menu_second_child_home',
                path: '/multi-menu/second/child/home',
                component: 'view.multi-menu_second_child_home',
                meta: {
                  title: 'multi-menu_second_child_home',
                  i18nKey: 'route.multi-menu_second_child_home'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'plugin',
    path: '/plugin',
    component: 'layout.base',
    meta: {
      title: 'plugin',
      i18nKey: 'route.plugin'
    },
    children: [
      {
        name: 'plugin_charts',
        path: '/plugin/charts',
        meta: {
          title: 'plugin_charts',
          i18nKey: 'route.plugin_charts'
        },
        children: [
          {
            name: 'plugin_charts_antv',
            path: '/plugin/charts/antv',
            component: 'view.plugin_charts_antv',
            meta: {
              title: 'plugin_charts_antv',
              i18nKey: 'route.plugin_charts_antv'
            }
          },
          {
            name: 'plugin_charts_echarts',
            path: '/plugin/charts/echarts',
            component: 'view.plugin_charts_echarts',
            meta: {
              title: 'plugin_charts_echarts',
              i18nKey: 'route.plugin_charts_echarts'
            }
          }
        ]
      },
      {
        name: 'plugin_copy',
        path: '/plugin/copy',
        component: 'view.plugin_copy',
        meta: {
          title: 'plugin_copy',
          i18nKey: 'route.plugin_copy'
        }
      },
      {
        name: 'plugin_editor',
        path: '/plugin/editor',
        meta: {
          title: 'plugin_editor',
          i18nKey: 'route.plugin_editor'
        },
        children: [
          {
            name: 'plugin_editor_markdown',
            path: '/plugin/editor/markdown',
            component: 'view.plugin_editor_markdown',
            meta: {
              title: 'plugin_editor_markdown',
              i18nKey: 'route.plugin_editor_markdown'
            }
          },
          {
            name: 'plugin_editor_quill',
            path: '/plugin/editor/quill',
            component: 'view.plugin_editor_quill',
            meta: {
              title: 'plugin_editor_quill',
              i18nKey: 'route.plugin_editor_quill'
            }
          }
        ]
      },
      {
        name: 'plugin_icon',
        path: '/plugin/icon',
        component: 'view.plugin_icon',
        meta: {
          title: 'plugin_icon',
          i18nKey: 'route.plugin_icon'
        }
      },
      {
        name: 'plugin_map',
        path: '/plugin/map',
        component: 'view.plugin_map',
        meta: {
          title: 'plugin_map',
          i18nKey: 'route.plugin_map'
        }
      },
      {
        name: 'plugin_print',
        path: '/plugin/print',
        component: 'view.plugin_print',
        meta: {
          title: 'plugin_print',
          i18nKey: 'route.plugin_print'
        }
      },
      {
        name: 'plugin_swiper',
        path: '/plugin/swiper',
        component: 'view.plugin_swiper',
        meta: {
          title: 'plugin_swiper',
          i18nKey: 'route.plugin_swiper'
        }
      },
      {
        name: 'plugin_video',
        path: '/plugin/video',
        component: 'view.plugin_video',
        meta: {
          title: 'plugin_video',
          i18nKey: 'route.plugin_video'
        }
      }
    ]
  },
  {
    name: 'product',
    path: '/product',
    component: 'layout.base',
    meta: {
      title: 'product',
      i18nKey: 'route.product'
    },
    children: [
      {
        name: 'product_list',
        path: '/product/list',
        component: 'view.product_list',
        meta: {
          title: 'product_list',
          i18nKey: 'route.product_list'
        }
      },
      {
        name: 'product_update-ota',
        path: '/product/update-ota',
        component: 'view.product_update-ota',
        meta: {
          title: 'product_update-ota',
          i18nKey: 'route.product_update-ota'
        }
      },
      {
        name: 'product_update-package',
        path: '/product/update-package',
        component: 'view.product_update-package',
        meta: {
          title: 'product_update-package',
          i18nKey: 'route.product_update-package'
        }
      }
    ]
  },
  {
    name: 'rule-engine',
    path: '/rule-engine',
    component: 'layout.base$view.rule-engine',
    meta: {
      title: 'rule-engine',
      i18nKey: 'route.rule-engine'
    }
  },
  {
    name: 'test',
    path: '/test',
    component: 'layout.base$view.test',
    meta: {
      title: 'test',
      i18nKey: 'route.test'
    }
  },
  {
    name: 'user-center',
    path: '/user-center',
    component: 'layout.base$view.user-center',
    meta: {
      title: 'user-center',
      i18nKey: 'route.user-center',
      hideInMenu: true
    }
  }
];
