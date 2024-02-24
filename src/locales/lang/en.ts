import { productLocaleEn } from '~/src/views/product/locales/en'

const locale: I18nType.Schema = {
  default: '',
  system: {
    title: 'SoybeanAdmin'
  },
  common: {
    add: 'Add',
    addSuccess: 'Add Success',
    edit: 'Edit',
    editSuccess: 'Edit Success',
    delete: 'Delete',
    deleteSuccess: 'Delete Success',
    batchDelete: 'Batch Delete',
    deleteConfirm: '确定删除吗？',
    confirm: 'Confirm',
    cancel: 'Cancel',
    pleaseCheckValue: 'Please check the value is valid',
    action: 'Action',
    refreshTable: '刷新表格',
    remark: 'Remark',
    search: 'Search',
    reset: 'Reset',
    save: 'Save',
    changeTableColumns: '表格列设置'
  },
  routes: {
    dashboard: {
      _value: 'Dashboard',
      analysis: 'Analysis',
      workbench: 'Workbench'
    },
    document: {
      _value: 'Document',
      vue: 'Vue Document',
      vite: 'Vite Document',
      naive: 'NaiveUI Document',
      project: 'Project Document',
      'project-link': 'Project Document(href)'
    },
    component: {
      _value: 'Component',
      button: 'Button',
      card: 'Card',
      table: 'Table'
    },
    plugin: {
      _value: 'Plugin',
      charts: {
        _value: 'Chart',
        echarts: 'ECharts',
        antv: 'AntV'
      },
      copy: 'Copy',
      editor: {
        _value: 'Editor',
        quill: 'Quill',
        markdown: 'Markdown'
      },
      icon: 'Icon',
      map: 'Map',
      print: 'Print',
      swiper: 'Swiper',
      video: 'Video'
    },
    'auth-demo': {
      _value: 'Auth Demo',
      permission: 'Toggle Permission',
      super: 'Super Auth'
    },
    function: {
      _value: 'Function',
      tab: 'System Tab'
    },
    exception: {
      _value: 'Exception',
      403: '403',
      404: '404',
      500: '500'
    },
    'multi-menu': {
      _value: 'Multi Degree Menu',
      first: {
        _value: 'First Degree',
        second: 'Second Degree',
        'second-new': {
          _value: 'Second Degree With Children',
          third: 'Third Degree'
        }
      }
    },
    management: {
      _value: 'System Management',
      auth: 'Menu',
      role: 'Role',
      route: 'Route',
      user: 'User',
      setting: 'Setting'
    },
    about: 'About',
    'rule-engine': 'Rule Engine',
    'data-service': 'Data Service',
    apply: {
      _value: 'Application Management',
      service: 'Service Management'
    },
    product: {
      _value: '产品管理',
      list: '产品列表',
      'update-package': '升级包管理',
      'update-ota': 'OTA升级'
    }
  },
  layout: {
    settingDrawer: {
      title: 'Theme configuration',
      themeModeTitle: 'Theme mode',
      darkMode: 'Dark mode',
      layoutModelTitle: 'Layout mode',
      systemThemeTitle: 'System theme',
      pageFunctionsTitle: 'Page functions',
      pageViewTitle: 'Page view',
      followSystemTheme: 'Follow the system',
      isCustomizeDarkModeTransition: 'Custom dark theme animation transition',
      scrollMode: 'scrollMode',
      scrollModeList: {
        wrapper: 'Outer layer scroll',
        content: 'Main body scroll'
      },
      fixedHeaderAndTab: 'Fixed header and multiple tabs',
      header: {
        inverted: 'darkHead',
        height: 'Head Height',
        crumb: {
          visible: 'Crumb',
          icon: 'Crumb icon'
        }
      },
      tab: {
        visible: 'Multi-page tab',
        height: 'Multiple tab height',
        modeList: {
          mode: 'Multi-tab style',
          chrome: 'Google style',
          button: 'Button style'
        },
        isCache: 'Multiple tab caching'
      },
      sider: {
        inverted: 'Dark sidebar',
        width: 'Sidebar expanded width',
        mixWidth: 'Left hybrid sidebar expanded width'
      },
      menu: {
        horizontalPosition: 'Top menu position',
        horizontalPositionList: {
          flexStart: 'Right',
          center: 'center',
          flexEnd: 'Left'
        }
      },
      footer: {
        inverted: 'Dark bottom',
        visible: 'Show bottom',
        fixed: 'Fixed bottom',
        right: 'Bottom to the right'
      },
      page: {
        animate: 'switch animation',
        animateMode: 'switch animation type',
        animateModeList: {
          zoomFade: 'Gradual change',
          zoomOut: 'Flash',
          fadeSlide: 'Slide',
          fade: 'Fade away',
          fadeBottom: 'Bottom fade',
          fadeScale: 'Resizing fade away'
        }
      },
      systemTheme: {
        moreColors: 'More colors'
      },
      themeConfiguration: {
        title: 'Theme configuration',
        copy: 'Copy the current configuration',
        reset: 'Reset the current configuration',
        resetSuccess: 'The configuration has been reset, please copy it again!',
        operateSuccess: 'Successful operation',
        copySuccess: 'Copy success, please replace the content of src/settings/theme.json!',
        confirmCopy: 'Confirm'
      }
    }
  },
  page: {
    product: productLocaleEn,
    login: {
      common: {
        userNamePlaceholder: 'Please enter user name',
        phonePlaceholder: 'Please enter phone number',
        codePlaceholder: 'Please enter verification code',
        passwordPlaceholder: 'Please enter password',
        confirmPasswordPlaceholder: 'Please enter password again',
        codeLogin: 'Verification code login',
        confirm: 'Confirm',
        back: 'Back',
        validateSuccess: 'Verification passed',
        loginSuccess: 'Login success',
        welcomeBack: 'Welcome back, {userName}!'
      },
      pwdLogin: {
        title: 'Password Login',
        rememberMe: 'Remember me',
        forgetPassword: 'Forget password?',
        register: 'Register account',
        otherAccountLogin: 'Other Account Login',
        otherLoginMode: 'Other Login Mode',
        superAdmin: 'Super Administrator',
        admin: 'Administrator',
        user: 'Ordinary User'
      },
      codeLogin: {
        title: 'Verification Code Login',
        getCode: 'Get verification code',
        imageCodePlaceholder: 'Please enter image verification code'
      },
      register: {
        title: 'Register Account',
        agreement: 'I have read and agree to',
        protocol: '《User Agreement》',
        policy: '《Privacy Policy》'
      },
      resetPwd: {
        title: 'Reset Password'
      },
      bindWeChat: {
        title: 'Bind WeChat'
      }
    },
    user: {
      form: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        status: 'Status',
        password: 'Password',
        confirmPwd: 'Confirm Password'
      }
    },
    management: {
      setting: {
        themeSetting: {
          title: 'General Settings',
          form: {
            systemTitle: 'System title',
            homeAndBackendLogo: 'Home and backend logo',
            loadingPageLogo: 'Loading page logo',
            websiteLogo: 'Website logo',
            background: 'Background'
          },
          changeLogo: 'change logo'
        },
        dataClearSetting: {
          title: 'Data Cleanup Settings',
          form: {
            cleanupType: 'Cleanup Type',
            retentionDays: 'Retention Days',
            lastCleanupTime: 'Last Cleanup Time',
            lastCleanupDataTime: 'Last Cleanup Data Time',
            enabled: 'Enabled'
          }
        }
      },
      auth: {
        form: {
          parent: 'Parent menu',
          title: 'Title',
          multilingual: 'Title(multilingual)',
          name: 'Name',
          path: 'path',
          componentType: 'Component Type',
          icon: 'Icon',
          order: 'Sort',
          type: 'type',
          authority: 'Authority'
        }
      }
    }
  }
}

export default locale
