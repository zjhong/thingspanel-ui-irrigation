import { cen } from './你新增的路由相关的国际化';
import { productLocaleEn } from '~/src/views/product/locales/en';

const local: App.I18n.Schema = {
  default: '',
  system: {
    title: 'ThingsPanel'
  },
  common: {
    complete: 'Complete',
    remark: '',
    action: 'Action',
    add: 'Add',
    save: 'save',
    addSuccess: 'Add Success',
    backToHome: 'Back to home',
    batchDelete: 'Batch Delete',
    cancel: 'Cancel',
    check: 'Check',
    columnSetting: 'Column Setting',
    confirm: 'Confirm',
    delete: 'Delete',
    deleteSuccess: 'Delete Success',
    confirmDelete: 'Are you sure you want to delete?',
    edit: 'Edit',
    index: 'Index',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to log out?',
    lookForward: 'Coming soon',
    modify: 'Modify',
    modifySuccess: 'Modify Success',
    operate: 'Operate',
    pleaseCheckValue: 'Please check whether the value is valid',
    refresh: 'Refresh',
    reset: 'Reset',
    search: 'Search',
    tip: 'Tip',
    update: 'Update',
    updateSuccess: 'Update Success',
    changeTableColumns: 'Table Column Settings',
    refreshTable: 'Refresh Table',
    userCenter: 'User Center',
    export: 'export',
    yesOrNo: {
      yes: 'Yes',
      no: 'No'
    },
    debug: 'Debug',
    send: 'Send'
  },
  theme: {
    themeSchema: {
      title: 'Theme Schema',
      light: 'Light',
      dark: 'Dark',
      auto: 'Follow System'
    },
    layoutMode: {
      title: 'Layout Mode',
      vertical: 'Vertical Menu Mode',
      horizontal: 'Horizontal Menu Mode',
      'vertical-mix': 'Vertical Mix Menu Mode',
      'horizontal-mix': 'Horizontal Mix menu Mode'
    },
    themeColor: {
      title: 'Theme Color',
      primary: 'Primary',
      info: 'Info',
      success: 'Success',
      warning: 'Warning',
      error: 'Error',
      followPrimary: 'Follow Primary'
    },
    scrollMode: {
      title: 'Scroll Mode',
      wrapper: 'Wrapper',
      content: 'Content'
    },
    page: {
      animate: 'Page Animate',
      mode: {
        title: 'Page Animate Mode',
        fade: 'Fade',
        'fade-slide': 'Slide',
        'fade-bottom': 'Fade Zoom',
        'fade-scale': 'Fade Scale',
        'zoom-fade': 'Zoom Fade',
        'zoom-out': 'Zoom Out',
        none: 'None'
      }
    },
    fixedHeaderAndTab: 'Fixed Header And Tab',
    header: {
      height: 'Header Height',
      breadcrumb: {
        visible: 'Breadcrumb Visible',
        showIcon: 'Breadcrumb Icon Visible'
      }
    },
    tab: {
      visible: 'Tab Visible',
      cache: 'Tab Cache',
      height: 'Tab Height',
      mode: {
        title: 'Tab Mode',
        chrome: 'Chrome',
        button: 'Button'
      }
    },
    sider: {
      inverted: 'Dark Sider',
      width: 'Sider Width',
      collapsedWidth: 'Sider Collapsed Width',
      mixWidth: 'Mix Sider Width',
      mixCollapsedWidth: 'Mix Sider Collapse Width',
      mixChildMenuWidth: 'Mix Child Menu Width'
    },
    footer: {
      visible: 'Footer Visible',
      fixed: 'Fixed Footer',
      height: 'Footer Height',
      right: 'Right Footer'
    },
    themeDrawerTitle: 'Theme Configuration',
    pageFunTitle: 'Page Function',
    configOperation: {
      copyConfig: 'Copy Config',
      copySuccessMsg: 'Copy Success, Please replace the variable "themeSettings" in "src/theme/settings.ts"',
      resetConfig: 'Reset Config',
      resetSuccessMsg: 'Reset Success'
    }
  },
  route: {
    login: 'Login',
    403: 'No Permission',
    404: 'Page Not Found',
    500: 'Server Error',
    home: 'Home',
    'user-center': 'User Center',
    about: 'About',
    function: 'System Function',
    function_tab: 'Tab',
    'function_multi-tab': 'Multi Tab',
    'function_hide-child': 'Hide Child',
    'function_hide-child_one': 'Hide Child',
    'function_hide-child_two': 'Two',
    'function_hide-child_three': 'Three',
    manage: 'System Manage2',
    manage_user: 'User Manage2',
    'manage_user-detail': 'User Detail',
    manage_role: 'Role Manage2',
    manage_menu: 'Menu Manage2',
    'multi-menu': 'Multi Menu',
    'multi-menu_first': 'Menu One',
    'multi-menu_first_child': 'Menu One Child',
    'multi-menu_second': 'Menu Two',
    'multi-menu_second_child': 'Menu Two Child',
    'multi-menu_second_child_home': 'Menu Two Child Home',
    exception: 'Exception',
    exception_403: '403',
    exception_404: '404',
    exception_500: '500',
    component: 'Component',
    component_button: 'Button',
    component_card: 'Card',
    component_table: 'Table',
    ...cen,
    'alarm_warning-message': 'alarmWarningMessage',
    device_template: 'deviceTemplate',
    'personal-center': 'personalCenter',
    'edit-area': 'editArea',
    'new-area': 'newArea'
  },
  page: {
    product: productLocaleEn,
    login: {
      common: {
        loginOrRegister: 'Login / Register',
        userNamePlaceholder: 'Please enter user name',
        phonePlaceholder: 'Please enter phone number',
        codePlaceholder: 'Please enter verification code',
        passwordPlaceholder: 'Please enter password',
        confirmPasswordPlaceholder: 'Please enter password again',
        codeLogin: 'Verification code login',
        confirm: 'Confirm',
        back: 'Back',
        validateSuccess: 'Verification passed',
        loginSuccess: 'Login successfully',
        welcomeBack: 'Welcome back, {userName} !'
      },
      pwdLogin: {
        title: 'Password Login',
        rememberMe: 'Remember me',
        forgetPassword: 'Forget password?',
        register: 'Register',
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
        title: 'Register',
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
    about: {
      title: 'About',
      introduction: `Soybean Admin is an elegant and powerful admin template, based on the latest front-end technology stack, including Vue3, Vite5, TypeScript, Pinia and UnoCSS. It has built-in rich theme configuration and components, strict code specifications, and an automated file routing system. In addition, it also uses the online mock data solution based on ApiFox. Soybean Admin provides you with a one-stop admin solution, no additional configuration, and out of the box. It is also a best practice for learning cutting-edge technologies quickly.`,
      projectInfo: {
        title: 'Project Info',
        version: 'Version',
        latestBuildTime: 'Latest Build Time',
        githubLink: 'Github Link',
        previewLink: 'Preview Link'
      },
      prdDep: 'Production Dependency',
      devDep: 'Development Dependency'
    },
    home: {
      greeting: 'Good morning, {userName}, today is another day full of vitality!',
      weatherDesc: 'Today is cloudy to clear, 20℃ - 25℃!',
      projectCount: 'Project Count',
      todo: 'Todo',
      message: 'Message',
      downloadCount: 'Download Count',
      registerCount: 'Register Count',
      schedule: 'Work and rest Schedule',
      study: 'Study',
      work: 'Work',
      rest: 'Rest',
      entertainment: 'Entertainment',
      visitCount: 'Visit Count',
      turnover: 'Turnover',
      dealCount: 'Deal Count',
      projectNews: {
        title: 'Project News',
        moreNews: 'More News',
        desc1: 'Soybean created the open source project soybean-admin on May 28, 2021!',
        desc2: 'Yanbowe submitted a bug to soybean-admin, the multi-tab bar will not adapt.',
        desc3: 'Soybean is ready to do sufficient preparation for the release of soybean-admin!',
        desc4: 'Soybean is busy writing project documentation for soybean-admin!',
        desc5: 'Soybean just wrote some of the workbench pages casually, and it was enough to see!'
      },
      creativity: 'Creativity'
    },
    function: {
      tab: {
        tabOperate: {
          title: 'Tab Operation',
          addTab: 'Add Tab',
          addTabDesc: 'To about page',
          closeTab: 'Close Tab',
          closeCurrentTab: 'Close Current Tab',
          closeAboutTab: 'Close "About" Tab',
          addMultiTab: 'Add Multi Tab',
          addMultiTabDesc1: 'To MultiTab page',
          addMultiTabDesc2: 'To MultiTab page(with query params)'
        },
        tabTitle: {
          title: 'Tab Title',
          changeTitle: 'Change Title',
          change: 'Change',
          resetTitle: 'Reset Title',
          reset: 'Reset'
        }
      },
      multiTab: {
        routeParam: 'Route Param',
        backTab: 'Back function_tab'
      }
    },
    manage: {
      common: {
        status: {
          enable: 'Enable',
          disable: 'Disable'
        }
      },
      role: {
        title: 'Role List',
        roleName: 'Role Name',
        roleCode: 'Role Code',
        roleStatus: 'Role Status',
        roleDesc: 'Role Description',
        form: {
          roleName: 'Please enter role name',
          roleCode: 'Please enter role code',
          roleStatus: 'Please select role status',
          roleDesc: 'Please enter role description'
        },
        addRole: 'Add Role',
        editRole: 'Edit Role'
      },
      user: {
        title: 'User List',
        userName: 'User Name',
        userGender: 'Gender',
        nickName: 'Nick Name',
        userPhone: 'Phone Number',
        userEmail: 'Email',
        userStatus: 'User Status',
        userRole: 'User Role',
        password: 'Password',
        confirmPwd: 'Confirm Password',
        form: {
          userName: 'Please enter user name',
          userGender: 'Please select gender',
          nickName: 'Please enter nick name',
          userPhone: 'Please enter phone number',
          userEmail: 'Please enter email',
          userStatus: 'Please select user status',
          userRole: 'Please select user role'
        },
        addUser: 'Add User',
        editUser: 'Edit User',
        gender: {
          male: 'Male',
          female: 'Female'
        }
      },
      menu: {
        authority: '',
        componentType: '',
        title: 'Menu List',
        id: 'ID',
        parentId: 'Parent ID',
        menuType: 'Menu Type',
        menuName: 'Menu Name',
        routeName: 'Route Name',
        routePath: 'Route Path',
        page: 'Page Component',
        layout: 'Layout Component',
        i18nKey: 'I18n Key',
        icon: 'Icon',
        localIcon: 'Local Icon',
        iconTypeTitle: 'Icon Type',
        order: 'Order',
        keepAlive: 'Keep Alive',
        href: 'Href',
        hideInMenu: 'Hide In Menu',
        activeMenu: 'Active Menu',
        multiTab: 'Multi Tab',
        fixedIndexInTab: 'Fixed Index In Tab',
        button: 'Button',
        buttonCode: 'Button Code',
        buttonDesc: 'Button Desc',
        menuStatus: 'Menu Status',
        form: {
          parent: 'Parent menu',
          title: 'Title',
          multilingual: 'Title(multilingual)',
          name: 'Name',
          path: 'path',
          route_path: 'ComponentPath',
          componentType: 'Component Type',
          icon: 'Icon',
          order: 'Sort',
          type: 'type',
          authority: 'Authority',
          menuType: 'Please select menu type',
          menuName: 'Please enter menu name',
          routeName: 'Please enter route name',
          routePath: 'Please enter route path',
          page: 'Please select page component',
          layout: 'Please select layout component',
          i18nKey: 'Please enter i18n key',
          localIcon: 'Please enter local icon name',
          keepAlive: 'Please select whether to cache route',
          href: 'Please enter href',
          hideInMenu: 'Please select whether to hide menu',
          activeMenu: 'Please enter the route name of the highlighted menu',
          multiTab: 'Please select whether to support multiple tabs',
          fixedInTab: 'Please select whether to fix in the tab',
          fixedIndexInTab: 'Please enter the index fixed in the tab',
          button: 'Please select whether it is a button',
          buttonCode: 'Please enter button code',
          buttonDesc: 'Please enter button description',
          menuStatus: 'Please select menu status'
        },
        addMenu: 'Add Menu',
        editMenu: 'Edit Menu',
        addChildMenu: 'Add Child Menu',
        type: {
          directory: 'Directory',
          menu: 'Menu'
        },
        iconType: {
          iconify: 'Iconify Icon',
          local: 'Local Icon'
        }
      },
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
      notification: {
        enableDisableService: 'Enable/Disable the service',
        email: {
          title: 'EMAIL',
          form: {
            sendMailServer: 'Send mail server',
            sendPort: 'Send port',
            senderMail: 'Sender email',
            authorizationCodeOrPassword: 'Authorization code/Password',
            ssl: 'Open SSL',
            inbox: 'Inbox',
            message: 'Message'
          }
        },
        shortMessage: {
          title: 'SME'
        }
      }
    },
    irrigation: {
      name: 'Name',
      duration: 'Duration',
      hour: 'Hour',
      minute: 'Minute',
      irrigationDuration: 'Irrigation Duration',
      capacity: 'Capacity',
      areaOrSpace: 'AreaOrSpace',
      diviceName: 'DiviceName',
      controlType: 'ControlType',
      planStatus: 'PlanStatus',
      distribute: 'Distribute',
      log: 'Log',
      addIrrigationPlan: 'Add Irrigation Plan',
      time: {
        device: 'Device',
        name: 'Irrigation Time',
        planName: 'Plan Name',
        repeatTime: 'Repeat Time',
        orderCode: 'Order Code',
        irrigationTime: 'Irrigation Time',
        doorOpeing: 'Door Opening',
        week: {
          monday: 'monday',
          tuesday: 'Tuesday',
          wednesday: 'Wednesday',
          thursday: 'Thursday',
          friday: 'Friday',
          saturday: 'Saturday',
          sunday: 'Sunday'
        },
        log: {
          name: 'Log',
          commandIssuanceTime: 'Command Issuance Time',
          instructionContent: 'Instruction Content',
          result: 'Result',
          operationType: 'Operation Type',
          detail: 'Detail'
        }
      },
      group: {
        name: 'Group Irrigation',
        controlModel: 'Control Model',
        startTime: 'Start Time',
        runDetail: 'Run Detail',
        deviceName: 'Device Name',
        orderNumber: 'Order Number',
        addGroupPlane: 'AddGroup Plane',
        planName: 'Plan Name',
        deviceType: 'Device Type',
        addDevice: 'Add Device',
        duration: 'Irrigation Duration',
        singleControl: 'Single Control',
        loopControl: 'Loop Control',
        cycleNumber: 'Cycle Number',
        intervalDuration: 'Interval Duration',
        clickToAdd: 'Click To Add',
        choosedDevice: 'Choosed Device',
        chooseDevices: 'Choose Devices',
        deviceCode: 'Device Code',
        log: {
          planDetail: 'Plan Log',
          runTime: 'Run Time',
          operationType: 'Operation Type',
          runResult: 'Run Result',
          detail: 'Detail'
        },
        detail: {
          commandIssuanceTime: 'Command Issuance Time',
          spaceOrArea: 'SpaceOrArea',
          orderContent: 'Order Content',
          result: 'Result',
          detail: 'Detail',
          actionType: 'ActionType'
        }
      },
      rotation: {
        addRotationPlane: 'Add Rotation Plane',
        name: 'Rotation Plan',
        waterPumpEquipment: 'Water Pump Equipment',
        waterPumpDoorOpening: 'Water Pump DoorOpening',
        waterPumpPressure: 'Water Pump Pressure',
        rotationDuration: 'Rotation Duration',
        addRotationDevice: 'Add Rotation Device',
        valveStatus: 'Valve Status',
        pressure: 'Pressure',
        chooseDevice: 'Choose Device'
      }
    }
  },
  form: {
    required: 'Cannot be empty',
    userName: {
      required: 'Please enter user name',
      invalid: 'User name format is incorrect'
    },
    phone: {
      required: 'Please enter phone number',
      invalid: 'Phone number format is incorrect'
    },
    pwd: {
      required: 'Please enter password',
      invalid: 'Password format is incorrect'
    },
    code: {
      required: 'Please enter verification code',
      invalid: 'Verification code format is incorrect'
    },
    email: {
      required: 'Please enter email',
      invalid: 'Email format is incorrect'
    }
  },
  dropdown: {
    closeCurrent: 'Close Current',
    closeOther: 'Close Other',
    closeLeft: 'Close Left',
    closeRight: 'Close Right',
    closeAll: 'Close All'
  },
  icon: {
    themeConfig: 'Theme Configuration',
    themeSchema: 'Theme Schema',
    lang: 'Switch Language',
    fullscreen: 'Fullscreen',
    fullscreenExit: 'Exit Fullscreen',
    reload: 'Reload Page',
    collapse: 'Collapse Menu',
    expand: 'Expand Menu',
    pin: 'Pin',
    unpin: 'Unpin'
  },
  dashboard_panel: {
    addKanBan: 'NewKanban',
    cardName: {
      date: {
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December'
      },
      week: {
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thur: 'Thur',
        fri: 'Fri',
        sat: 'Sat',
        sun: 'Sun'
      },
      bugNum: 'WarnNum',
      deviceNum: 'DeviceNum',
      userNum: 'UserNum',
      regionNum: 'RegionNum',
      tenantNumLine: 'TenantNumLine',
      deviceNumPie: 'DeviceNumPie',
      weatherOverview: 'WeatherOverview',
      irrigationArea: 'IrrigationArea',
      weatherStation: 'WeatherStation',
      tenant: 'Tenant',
      onLine: 'OnLine',
      offline: 'Offline',
      onlineRate: 'OnlineRate',
      yesterdayAdd: 'YesterdayAdd',
      lastMonthAdd: 'LastMonthAdd',
      thisMonth: 'thisMonth',
      active: 'Active',
      notActive: 'NotActive',
      activationRate: 'ActivationRate',
      sevenDayWeather: 'RecentFiveWeatherOverview',
      spaceNum: 'SpaceNum',
      areaName: 'AreaName',
      corn: 'Corn',
      SprinklerIrrigationDitchIrrigation: 'SprinklerIrrigationDitchIrrigation',
      irrigationTypes: 'IrrigationTypes',
      hectare: 'Hectare',
      regionalArea: 'RegionalArea',
      sandyLoamSoil: 'SandyLoamSoil',
      soil: 'Soil',
      soilMoisture: 'SoilMoisture',
      temperature: 'Temperature',
      Conductivity: 'Conductivity',
      potassiumContent: 'PotassiumContent',
      phosphorusContent: 'PhosphorusContent',
      nitrogenContent: 'NitrogenContent',
      weatherStationData: 'WeatherStationData',
      historyData: 'HistoryData',
      windSpeed: 'WindSpeed',
      windDirection: 'WindDirection',
      humidity: 'Humidity',
      pressure: 'Pressure',
      rainfall: 'Rainfall'
    }
  },
  device_template: {
    templateInfo: 'TemplateInfo',
    editTemplateInfo: 'EditTemplateInfo',
    addDeviceInfo: 'AddDeviceInfo',
    modelDefinition: 'ModelDefinition',
    deviceParameterDescribe: 'DeviceParameterDescribe',
    webChartConfiguration: 'WebChartConfiguration',
    bindTheCorrespondingChart: 'BindTheCorrespondingChart',
    appChartConfiguration: 'AppChartConfiguration',
    editAppDetailsPage: 'EditAppDetailsPage',
    release: 'Release',
    releaseAppStore: 'ReleaseAppStore',
    enterTemplateName: 'EnterTemplateName',
    templateName: 'TemplateName',
    templateTage: 'TemplateTage',
    authorName: 'AuthorName',
    enterAuthorName: 'EnterAuthorName',
    templateVersion: 'TemplateVersion',
    entertemplateVersion: 'EntertemplateVersion',
    illustrate: 'Illustrate',
    enterIllustrate: 'EnterIllustrate',
    selectCover: 'SelectCover',
    nextStep: 'NextStep',
    cancellation: 'Cancellation',
    addTage: 'AddTage',
    back: 'Back',
    add: 'Add',
    confirm: 'Confirm',
    telemetry: 'Telemetry',
    attributes: 'Attributes',
    events: 'Events',
    command: 'Command',
    addAndEditTelemetry: 'AddAndEditTelemetry',
    addAndEditAttributes: 'AddAndEditAttributes',
    addAndEditEvents: 'AddAndEditEvents',
    addAndEditCommand: 'AddAndEditCommand',
    table_header: {
      dataName: 'DataName',
      dataIdentifier: 'DataIdentifier',
      readAndWriteSign: 'ReadAndWriteSign',
      dataType: 'DataType',
      unit: 'Unit',
      description: 'Description',
      attributeName: 'AttributeName',
      attributeIdentifier: 'AttributeIdentifier',
      eventName: 'EventName',
      eventIdentifier: 'EventIdentifier',
      eventParameters: 'EventParameters',
      commandName: 'CommandName',
      commandIdentifier: 'CommandIdentifier',
      commandParameters: 'CommandParameters',
      pleaseEnterADataName: 'PleaseEnterADataName',
      pleaseEnterTheDataIdentifier: 'PleaseEnterTheDataIdentifier',
      pleaseEnterTheDataType: 'PleaseEnterTheDataType',
      pleaseEnterTheUnit: 'PleaseEnterTheUnit',
      PleaseEnterADescription: 'PleaseEnterADescription',
      pleaseEnterTheAttributeName: 'PleaseEnterTheAttributeName',
      pleaseEnterTheAttributeIdentifier: 'PleaseEnterTheAttributeIdentifier',
      pleaseEnterTheAttributeType: 'PleaseEnterTheAttributeType',
      attributeType: 'PttributeType',
      addEditParameters: 'AddEditParameters',
      parameterName: 'ParameterName',
      PleaseEnterTheParameterName: 'PleaseEnterTheParameterName',
      ParameterIdentifier: 'ParameterIdentifier',
      PleaseEnterTheParameterIdentifier: 'PleaseEnterTheParameterIdentifier',
      ParameterType: 'ParameterType',
      PleaseSelectParameterType: 'PleaseSelectParameterType',
      singleControlTask: 'AingleControlTask',
      addParameters: 'AddParameters',
      commandDescription: 'CommandDescription',
      pleaseEnterACommandDescription: 'PleaseEnterACommandDescription',
      pleaseEnterTheCommandName: 'PleaseEnterTheCommandName',
      pleaseEnterTheCommandIdentifier: 'PleaseEnterTheCommandIdentifier',
      PleaseEnterTheCommandType: 'PleaseEnterTheCommandType',
      eventDescription: 'EventDescription',
      PleaseEventDescription: 'PleaseEventDescription',
      singleControlTaskl: 'SingleControlTaskl',
      PleaseEventName: 'PleaseEventName',
      PleaseEeventIdentifier: 'PleaseEeventIdentifier'
    }
  }
};

export default local;
