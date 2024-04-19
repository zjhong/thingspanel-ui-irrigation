/** The global namespace for the app */
declare namespace App {
  /** Theme namespace */
  namespace Theme {
    type ColorPaletteNumber = import('@sa/color-palette').ColorPaletteNumber;

    /** Theme token */
    type ThemeToken = {
      colors: ThemeTokenColor;
      boxShadow: {
        header: string;
        sider: string;
        tab: string;
      };
    };

    /** Theme setting */
    interface ThemeSetting {
      /** Theme scheme */
      themeScheme: UnionKey.ThemeScheme;
      /** Theme color */
      themeColor: string;
      /** Other color */
      otherColor: OtherColor;
      /** Whether info color is followed by the primary color */
      isInfoFollowPrimary: boolean;
      /** Layout */
      layout: {
        /** Layout mode */
        mode: UnionKey.ThemeLayoutMode;
        /** Scroll mode */
        scrollMode: UnionKey.ThemeScrollMode;
      };
      /** Page */
      page: {
        /** Whether to show the page transition */
        animate: boolean;
        /** Page animate mode */
        animateMode: UnionKey.ThemePageAnimateMode;
      };
      /** Header */
      header: {
        /** Header height */
        height: number;
        /** Header breadcrumb */
        breadcrumb: {
          /** Whether to show the breadcrumb */
          visible: boolean;
          /** Whether to show the breadcrumb icon */
          showIcon: boolean;
        };
      };
      /** Tab */
      tab: {
        /** Whether to show the tab */
        visible: boolean;
        /**
         * Whether to cache the tab
         *
         * If cache, the tabs will get from the local storage when the page is refreshed
         */
        cache: boolean;
        /** Tab height */
        height: number;
        /** Tab mode */
        mode: UnionKey.ThemeTabMode;
      };
      /** Fixed header and tab */
      fixedHeaderAndTab: boolean;
      /** Sider */
      sider: {
        /** Inverted sider */
        inverted: boolean;
        /** Sider width */
        width: number;
        /** Collapsed sider width */
        collapsedWidth: number;
        /** Sider width when the layout is 'vertical-mix' or 'horizontal-mix' */
        mixWidth: number;
        /** Collapsed sider width when the layout is 'vertical-mix' or 'horizontal-mix' */
        mixCollapsedWidth: number;
        /** Child menu width when the layout is 'vertical-mix' or 'horizontal-mix' */
        mixChildMenuWidth: number;
      };
      /** Footer */
      footer: {
        /** Whether to show the footer */
        visible: boolean;
        /** Whether fixed the footer */
        fixed: boolean;
        /** Footer height */
        height: number;
        /** Whether float the footer to the right when the layout is 'horizontal-mix' */
        right: boolean;
      };
    }

    interface OtherColor {
      info: string;
      success: string;
      warning: string;
      error: string;
    }

    interface ThemeColor extends OtherColor {
      primary: string;
    }

    type ThemeColorKey = keyof ThemeColor;

    type ThemePaletteColor = {
      [key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string;
    };

    type BaseToken = Record<string, Record<string, string>>;

    interface ThemeTokenColor extends ThemePaletteColor {
      nprogress: string;
      container: string;
      layout: string;
      inverted: string;
      base_text: string;

      [key: string]: string;
    }
  }

  /** Global namespace */
  namespace Global {
    type VNode = import('vue').VNode;
    type RouteLocationNormalizedLoaded = import('vue-router').RouteLocationNormalizedLoaded;
    type RouteKey = import('@elegant-router/types').RouteKey;
    type RouteMap = import('@elegant-router/types').RouteMap;
    type RoutePath = import('@elegant-router/types').RoutePath;
    type LastLevelRouteKey = import('@elegant-router/types').LastLevelRouteKey;

    /** The global header props */
    interface HeaderProps {
      /** Whether to show the logo */
      showLogo?: boolean;
      /** Whether to show the menu toggler */
      showMenuToggler?: boolean;
      /** Whether to show the menu */
      showMenu?: boolean;
    }

    /** The global menu */
    interface Menu {
      /**
       * The menu key
       *
       * Equal to the route key
       */
      key: string;
      /** The menu label */
      label: string;
      /** The menu i18n key */
      i18nKey?: I18n.I18nKey;
      /** The route key */
      routeKey: RouteKey;
      /** The route path */
      routePath: RoutePath;
      /** The menu icon */
      icon?: () => VNode;
      /** The menu children */
      children?: Menu[];
      remark: string;
    }

    type Breadcrumb = Omit<Menu, 'children'> & {
      options?: Breadcrumb[];
    };

    /** Tab route */
    type TabRoute = Pick<RouteLocationNormalizedLoaded, 'name' | 'path' | 'meta'> &
      Partial<Pick<RouteLocationNormalizedLoaded, 'fullPath' | 'query' | 'matched'>>;

    /** The global tab */
    type Tab = {
      /** The tab id */
      id: string;
      /** The tab label */
      label: string;
      /**
       * The new tab label
       *
       * If set, the tab label will be replaced by this value
       */
      newLabel?: string;
      /**
       * The old tab label
       *
       * when reset the tab label, the tab label will be replaced by this value
       */
      oldLabel?: string;
      /** The tab route key */
      routeKey: LastLevelRouteKey;
      /** The tab route path */
      routePath: RouteMap[LastLevelRouteKey];
      /** The tab route full path */
      fullPath: string;
      /** The tab fixed index */
      fixedIndex?: number;
      /**
       * Tab icon
       *
       * Iconify icon
       */
      icon?: string;
      /**
       * Tab local icon
       *
       * Local icon
       */
      localIcon?: string;
      /** I18n key */
      i18nKey?: I18n.I18nKey;
    };

    /** Form rule */
    type FormRule = import('naive-ui').FormItemRule;

    /** The global dropdown key */
    type DropdownKey = 'closeCurrent' | 'closeOther' | 'closeLeft' | 'closeRight' | 'closeAll';
  }

  /**
   * I18n namespace
   *
   * Locales type
   */
  namespace I18n {
    type RouteKey = import('@elegant-router/types').RouteKey;

    type LangType = 'en-US' | 'zh-CN';

    type LangOption = {
      label: string;
      key: LangType;
    };

    type I18nRouteKey = Exclude<RouteKey, 'root' | 'not-found'>;

    type FormMsg = {
      required: string;
      invalid: string;
    };

    type Schema = {
      default: string;
      system: {
        title: string;
      };
      common: {
        complete: string;
        action: string;
        input: string;
        select: string;
        remark: string;
        add: string;
        save: string;
        addSuccess: string;
        backToHome: string;
        batchDelete: string;
        cancel: string;
        check: string;
        columnSetting: string;
        confirm: string;
        delete: string;
        deleteSuccess: string;
        confirmDelete: string;
        edit: string;
        index: string;
        logout: string;
        logoutConfirm: string;
        lookForward: string;
        modify: string;
        modifySuccess: string;
        operate: string;
        pleaseCheckValue: string;
        refresh: string;
        reset: string;
        search: string;
        tip: string;
        update: string;
        updateSuccess: string;
        refreshTable: string;
        changeTableColumns: string;
        userCenter: string;
        export: string;
        description: string;
        yesOrNo: {
          yes: string;
          no: string;
        };
        debug: string;
        send: string;
        creationTime: string;
      };
      theme: {
        themeSchema: { title: string } & Record<UnionKey.ThemeScheme, string>;
        layoutMode: { title: string } & Record<UnionKey.ThemeLayoutMode, string>;
        themeColor: {
          title: string;
          followPrimary: string;
        } & Theme.ThemeColor;
        scrollMode: { title: string } & Record<UnionKey.ThemeScrollMode, string>;
        page: {
          animate: string;
          mode: { title: string } & Record<UnionKey.ThemePageAnimateMode, string>;
        };
        fixedHeaderAndTab: string;
        header: {
          height: string;
          breadcrumb: {
            visible: string;
            showIcon: string;
          };
        };
        tab: {
          visible: string;
          cache: string;
          height: string;
          mode: { title: string } & Record<UnionKey.ThemeTabMode, string>;
        };
        sider: {
          inverted: string;
          width: string;
          collapsedWidth: string;
          mixWidth: string;
          mixCollapsedWidth: string;
          mixChildMenuWidth: string;
        };
        footer: {
          visible: string;
          fixed: string;
          height: string;
          right: string;
        };
        themeDrawerTitle: string;
        pageFunTitle: string;
        configOperation: {
          copyConfig: string;
          copySuccessMsg: string;
          resetConfig: string;
          resetSuccessMsg: string;
        };
      };
      route: Record<I18nRouteKey, string>;
      page: {
        product: ProductLocal;
        login: {
          common: {
            loginOrRegister: string;
            userNamePlaceholder: string;
            phonePlaceholder: string;
            codePlaceholder: string;
            passwordPlaceholder: string;
            confirmPasswordPlaceholder: string;
            codeLogin: string;
            confirm: string;
            back: string;
            validateSuccess: string;
            loginSuccess: string;
            welcomeBack: string;
          };
          pwdLogin: {
            title: string;
            rememberMe: string;
            forgetPassword: string;
            register: string;
            otherAccountLogin: string;
            otherLoginMode: string;
            superAdmin: string;
            admin: string;
            user: string;
          };
          codeLogin: {
            title: string;
            getCode: string;
            imageCodePlaceholder: string;
          };
          register: {
            title: string;
            agreement: string;
            protocol: string;
            policy: string;
          };
          resetPwd: {
            title: string;
          };
          bindWeChat: {
            title: string;
          };
        };
        about: {
          title: string;
          introduction: string;
          projectInfo: {
            title: string;
            version: string;
            latestBuildTime: string;
            githubLink: string;
            previewLink: string;
          };
          prdDep: string;
          devDep: string;
        };
        home: {
          greeting: string;
          weatherDesc: string;
          projectCount: string;
          todo: string;
          message: string;
          downloadCount: string;
          registerCount: string;
          schedule: string;
          study: string;
          work: string;
          rest: string;
          entertainment: string;
          visitCount: string;
          turnover: string;
          dealCount: string;
          projectNews: {
            title: string;
            moreNews: string;
            desc1: string;
            desc2: string;
            desc3: string;
            desc4: string;
            desc5: string;
          };
          creativity: string;
        };
        function: {
          tab: {
            tabOperate: {
              title: string;
              addTab: string;
              addTabDesc: string;
              closeTab: string;
              closeCurrentTab: string;
              closeAboutTab: string;
              addMultiTab: string;
              addMultiTabDesc1: string;
              addMultiTabDesc2: string;
            };
            tabTitle: {
              title: string;
              changeTitle: string;
              change: string;
              resetTitle: string;
              reset: string;
            };
          };
          multiTab: {
            routeParam: string;
            backTab: string;
          };
        };
        manage: {
          common: {
            status: {
              enable: string;
              disable: string;
            };
          };
          role: {
            title: string;
            roleName: string;
            roleCode: string;
            roleStatus: string;
            roleDesc: string;
            form: {
              roleName: string;
              roleCode: string;
              roleStatus: string;
              roleDesc: string;
            };
            addRole: string;
            editRole: string;
          };
          user: {
            title: string;
            userName: string;
            userGender: string;
            nickName: string;
            userPhone: string;
            userEmail: string;
            userStatus: string;
            userRole: string;
            password: string;
            confirmPwd: string;
            enter: string;
            form: {
              userName: string;
              userGender: string;
              nickName: string;
              userPhone: string;
              userEmail: string;
              userStatus: string;
              userRole: string;
            };
            addUser: string;
            editUser: string;
            gender: {
              male: string;
              female: string;
            };
            status: {
              freeze: string;
              normal: string;
            };
          };
          menu: {
            title: string;
            id: string;
            parentId: string;
            authority: string;
            menuType: string;
            menuName: string;
            componentType: string;
            routeName: string;
            routePath: string;
            page: string;
            layout: string;
            i18nKey: string;
            icon: string;
            localIcon: string;
            iconTypeTitle: string;
            order: string;
            keepAlive: string;
            href: string;
            hideInMenu: string;
            activeMenu: string;
            multiTab: string;
            fixedIndexInTab: string;
            button: string;
            buttonCode: string;
            buttonDesc: string;
            menuStatus: string;
            form: {
              parent: string;
              title: string;
              multilingual: string;
              name: string;
              path: string;
              route_path: string;
              componentType: string;
              type: string;
              authority: string;
              menuType: string;
              menuName: string;
              routeName: string;
              routePath: string;
              page: string;
              layout: string;
              i18nKey: string;
              icon: string;
              localIcon: string;
              order: string;
              keepAlive: string;
              href: string;
              hideInMenu: string;
              activeMenu: string;
              multiTab: string;
              fixedInTab: string;
              fixedIndexInTab: string;
              button: string;
              buttonCode: string;
              buttonDesc: string;
              menuStatus: string;
            };
            addMenu: string;
            editMenu: string;
            addChildMenu: string;
            type: {
              directory: string;
              menu: string;
            };
            iconType: {
              iconify: string;
              local: string;
            };
          };
          setting: {
            themeSetting: {
              title: string;
              form: {
                systemTitle: string;
                homeAndBackendLogo: string;
                loadingPageLogo: string;
                websiteLogo: string;
                background: string;
              };
              changeLogo: string;
            };
            dataClearSetting: {
              title: string;
              form: {
                cleanupType: string;
                retentionDays: string;
                lastCleanupTime: string;
                lastCleanupDataTime: string;
                enabled: string;
              };
              type: {
                equipmentData: string;
                operationLog: string;
              };
            };
          };
          notification: {
            enableDisableService: string;
            email: {
              title: string;
              form: {
                sendMailServer: string;
                sendPort: string;
                senderMail: string;
                authorizationCodeOrPassword: string;
                ssl: string;
                inbox: string;
                message: string;
              };
            };
            shortMessage: {
              title: string;
            };
          };
        };
        irrigation: {
          name: string;
          duration: string;
          hour: string;
          minute: string;
          irrigationDuration: string;
          capacity: string;
          areaOrSpace: string;
          diviceName: string;
          controlType: string;
          planStatus: string;
          distribute: string;
          log: string;
          addIrrigationPlan: string;
          time: {
            device: string;
            name: string;
            planName: string;
            repeatTime: string;
            orderCode: string;
            irrigationTime: string;
            doorOpeing: string;
            week: {
              monday: string;
              tuesday: string;
              wednesday: string;
              thursday: string;
              friday: string;
              saturday: string;
              sunday: string;
            };
            log: {
              name: string;
              commandIssuanceTime: string;
              instructionContent: string;
              result: string;
              operationType: string;
              detail: string;
            };
          };
          group: {
            name: string;
            controlModel: string;
            startTime: string;
            runDetail: string;
            deviceName: string;
            orderNumber: string;
            addGroupPlane: string;
            planName: string;
            deviceType: string;
            addDevice: string;
            duration: string;
            singleControl: string;
            loopControl: string;
            cycleNumber: string;
            intervalDuration: string;
            clickToAdd: string;
            choosedDevice: string;
            chooseDevices: string;
            deviceCode: string;
            log: {
              planDetail: string;
              runTime: string;
              operationType: string;
              runResult: string;
              detail: string;
            };
            detail: {
              commandIssuanceTime: string;
              spaceOrArea: string;
              orderContent: string;
              result: string;
              detail: string;
              actionType: string;
            };
          };
          rotation: {
            addRotationPlane: string;
            name: string;
            waterPumpEquipment: string;
            waterPumpDoorOpening: string;
            waterPumpPressure: string;
            rotationDuration: string;
            addRotationDevice: string;
            valveStatus: string;
            pressure: string;
            chooseDevice: string;
          };
        };
        apply: {
          service: {
            form: {
              serviceName: string;
              deviceType: string;
              protocolType: string;
              accessAddress: string;
              httpAddress: string;
              subTopicPrefix: string;
              additionalInfo: string;
            };
          };
        };
      };
      form: {
        required: string;
        userName: FormMsg;
        phone: FormMsg;
        pwd: FormMsg;
        code: FormMsg;
        email: FormMsg;
      };
      dropdown: Record<Global.DropdownKey, string>;

      icon: {
        themeConfig: string;
        themeSchema: string;
        lang: string;
        fullscreen: string;
        fullscreenExit: string;
        reload: string;
        collapse: string;
        expand: string;
        pin: string;
        unpin: string;
      };
      dashboard_panel: {
        addKanBan: string;
        cardName: {
          date: {
            january: string;
            february: string;
            march: string;
            april: string;
            may: string;
            june: string;
            july: string;
            august: string;
            september: string;
            october: string;
            november: string;
            december: string;
          };
          week: {
            mon: string;
            tue: string;
            wed: string;
            thur: string;
            fri: string;
            sat: string;
            sun: string;
          };
          bugNum: string;
          deviceNum: string;
          userNum: string;
          regionNum: string;
          tenantNumLine: string;
          deviceNumPie: string;
          weatherOverview: string;
          irrigationArea: string;
          weatherStation: string;
          tenant: string;
          onLine: string;
          offline: string;
          onlineRate: string;
          yesterdayAdd: string;
          lastMonthAdd: string;
          active: string;
          notActive: string;
          activationRate: string;
          sevenDayWeather: string;
          spaceNum: string;
          thisMonth: string;
          areaName: string;
          corn: string;
          SprinklerIrrigationDitchIrrigation: string;
          irrigationTypes: string;
          hectare: string;
          regionalArea: string;
          sandyLoamSoil: string;
          soil: string;
          soilMoisture: string;
          temperature: string;
          Conductivity: string;
          potassiumContent: string;
          phosphorusContent: string;
          nitrogenContent: string;
          weatherStationData: string;
          historyData: string;
          windSpeed: string;
          windDirection: string;
          humidity: string;
          pressure: string;
          rainfall: string;
        };
      };
      device_template: {
        templateInfo: string;
        editTemplateInfo: string;
        addDeviceInfo: string;
        modelDefinition: string;
        deviceParameterDescribe: string;
        webChartConfiguration: string;
        bindTheCorrespondingChart: string;
        appChartConfiguration: string;
        editAppDetailsPage: string;
        release: string;
        releaseAppStore: string;
        enterTemplateName: string;
        templateName: string;
        templateTage: string;
        authorName: string;
        enterAuthorName: string;
        templateVersion: string;
        entertemplateVersion: string;
        illustrate: string;
        enterIllustrate: string;
        selectCover: string;
        nextStep: string;
        cancellation: string;
        addTage: string;
        back: string;
        add: string;
        confirm: string;
        telemetry: string;
        attributes: string;
        events: string;
        command: string;
        addAndEditTelemetry: string;
        addAndEditAttributes: string;
        addAndEditEvents: string;
        addAndEditCommand: string;
        table_header: {
          dataName: string;
          dataIdentifier: string;
          readAndWriteSign: string;
          dataType: string;
          unit: string;
          description: string;
          attributeName: string;
          attributeIdentifier: string;
          eventName: string;
          eventIdentifier: string;
          eventParameters: string;
          commandName: string;
          commandIdentifier: string;
          commandParameters: string;
          pleaseEnterADataName: string;
          pleaseEnterTheDataIdentifier: string;
          pleaseEnterTheDataType: string;
          pleaseEnterTheUnit: string;
          PleaseEnterADescription: string;
          pleaseEnterTheAttributeName: string;
          pleaseEnterTheAttributeIdentifier: string;
          pleaseEnterTheAttributeType: string;
          attributeType: string;
          addEditParameters: string;
          parameterName: string;
          PleaseEnterTheParameterName: string;
          ParameterIdentifier: string;
          PleaseEnterTheParameterIdentifier: string;
          ParameterType: string;
          PleaseSelectParameterType: string;
          singleControlTask: string;
          addParameters: string;
          commandDescription: string;
          pleaseEnterACommandDescription: string;
          pleaseEnterTheCommandName: string;
          pleaseEnterTheCommandIdentifier: string;
          PleaseEnterTheCommandType: string;
          eventDescription: string;
          PleaseEventDescription: string;
          singleControlTaskl: string;
          PleaseEventName: string;
          PleaseEeventIdentifier: string;
        };
      };
      custom: {
        home: {
          title: string;
          description: string;
          refresh: string;
        };

        groupPage: {
          groupName: string;
          description: string;
          createdAt: string;
          actions: string;
          view: string;
          confirmDelete: string;
          delete: string;
          removeFromGroup: string;
          createGroupButton: string;
          deviceGroupPlaceholder: string;
          selectParentGroup: string;
          enterGroupName: string;
          group: string;
          addGroup: string;
          editGroup: string;
          confirm: string;
          cancel: string;
          modificationSuccess: string;
          additionSuccess: string;
        };

        devicePage: {
          deviceName: string;
          deviceNumber: string;
          deviceConfig: string;
          unlimitedDeviceConfig: string;
          online: string;
          offline: string;
          alarmed: string;
          notAlarmed: string;
          lastPushTime: string;
          serviceProtocol: string;
          details: string;
          delete: string;
          group: string;
          unlimitedOnlineStatus: string;
          unlimitedAlarmStatus: string;
          alarm: string;
          noAlarm: string;
          unlimitedAccessType: string;
          byProtocol: string;
          byService: string;
          deviceNameOrNumber: string;
          manualAdd: string;
          addByNumber: string;
          addDevice: string;
          createDevice: string;
          configureDevice: string;
          configurationComplete: string;
          enterDeviceNumber: string;
          deviceNumberAvailable: string;
          finish: string;
          onlineStatus: string;
          alarmStatus: string;
          accessServiceProtocol: string;
          onlineOption: string;
          offlineOption: string;
          alarmOption: string;
          noAlarmOption: string;
          step1Title: string;
          tips: string;
          step1Desc: string;
          step2Title: string;
          step2Desc: string;
          step3Title: string;
          step3Desc: string;
          enterDeviceName: string;
          validationFailed: string;
          label: string;
          selectDeviceConfig: string;
          inputDeviceName: string;
          submit: string;
          connectInfo: string;
          success: string;
          deviceConfigSuccess: string;
          close: string;
          fail: string;
          deviceConfigFail: string;
          back: string;
          saveAndNext: string;
        };
        grouping_details: {
          previousPage: string;
          previousLevel: string;
          backToGroupList: string;
          groupLevel: string;
          groupId: string;
          description: string;
          createTime: string;
          subGroup: string;
          addSubGroup: string;
          device: string;
          addDeviceToGroup: string;
          detail: string;
          setting: string;
          edit: string;
          noGroupId: string;
          operationSuccess: string;
          operationFail: string;
          cancel: string;
          confirm: string;
        };
        device_details: {
          telemetry: string;
          join: string;
          deviceAnalysis: string;
          message: string;
          stats: string;
          eventReport: string;
          commandDelivery: string;
          automate: string;
          giveAnAlarm: string;
          user: string;
          settings: string;
          deviceNumber: string;
          deviceConfig: string;
          status: string;
          online: string;
          offline: string;
          alarm: string;
          noAlarm: string;
        };
      };
    };

    type GetI18nKey<T extends Record<string, unknown>, K extends keyof T = keyof T> = K extends string
      ? T[K] extends Record<string, unknown>
        ? `${K}.${GetI18nKey<T[K]>}`
        : K
      : never;

    type I18nKey = GetI18nKey<Schema>;

    type TranslateOptions<Locales extends string> = import('vue-i18n').TranslateOptions<Locales>;

    interface $T {
      (key: I18nKey): string;

      (key: I18nKey, plural: number, options?: TranslateOptions<LangType>): string;

      (key: I18nKey, defaultMsg: string, options?: TranslateOptions<I18nKey>): string;

      (key: I18nKey, list: unknown[], options?: TranslateOptions<I18nKey>): string;

      (key: I18nKey, list: unknown[], plural: number): string;

      (key: I18nKey, list: unknown[], defaultMsg: string): string;

      (key: I18nKey, named: Record<string, unknown>, options?: TranslateOptions<LangType>): string;

      (key: I18nKey, named: Record<string, unknown>, plural: number): string;

      (key: I18nKey, named: Record<string, unknown>, defaultMsg: string): string;
    }
  }

  /** Service namespace */
  namespace Service {
    /** The backend service env type */
    type EnvType = 'dev' | 'test' | 'prod';

    /** Other baseURL key */
    type OtherBaseURLKey = 'demo' | 'mock';

    /** The backend service config */
    interface ServiceConfig<T extends OtherBaseURLKey = OtherBaseURLKey> {
      /** The backend service base url */
      baseURL: string;
      /** Other backend service base url map */
      otherBaseURL: Record<T, string>;
    }

    /** The backend service config map */
    type ServiceConfigMap = Record<EnvType, ServiceConfig>;

    /** The backend service response data */
    type Response<T = unknown> = {
      /** The backend service response code */
      code: string;
      /** The backend service response message */
      msg: string;
      /** The backend service response data */
      data: T;
    };

    /** The demo backend service response data */
    type DemoResponse<T = unknown> = {
      /** The backend service response code */
      status: string;
      /** The backend service response message */
      message: string;
      /** The backend service response data */
      result: T;
    };
    /**
     * 请求的错误类型：
     *
     * - axios: axios错误：网络错误, 请求超时, 默认的兜底错误
     * - http: 请求成功，响应的http状态码非200的错误
     * - backend: 请求成功，响应的http状态码为200，由后端定义的业务错误
     */
    type RequestErrorType = 'axios' | 'http' | 'backend';

    /** 请求错误 */
    interface RequestError {
      /** 请求服务的错误类型 */
      type: RequestErrorType;
      /** 错误码 */
      code: string | number;
      /** 错误信息 */
      msg: string;
    }

    /** The demo backend service response data */
    type DEVResponse<T = unknown> = {
      error?: RequestError;
      /** The backend service response code */
      code: number;
      /** The backend service response message */
      message: string;
      /** The backend service response data */
      data: T;
    };

    /** 后端接口返回的数据结构配置 */
    interface BackendResultConfig {
      /** 表示后端请求状态码的属性字段 */
      codeKey: string;
      /** 表示后端请求数据的属性字段 */
      dataKey: string;
      /** 表示后端消息的属性字段 */
      msgKey: string;
      /** 后端业务上定义的成功请求的状态 */
      successCode: number | string;
    }

    /** 自定义的请求成功结果 */
    interface SuccessResult<T = any> {
      /** 请求错误 */
      error: null;
      /** 请求数据 */
      data: T;
    }

    /** 自定义的请求失败结果 */
    interface FailedResult {
      /** 请求错误 */
      error: RequestError;
      /** 请求数据 */
      data: null;
    }

    /** 自定义的请求结果 */
    type RequestResult<T = any> = SuccessResult<T> | FailedResult;

    /** 多个请求数据结果 */
    type MultiRequestResult<T extends any[]> = T extends [infer First, ...infer Rest]
      ? [First] extends [any]
        ? Rest extends any[]
          ? [Service.RequestResult<First>, ...MultiRequestResult<Rest>]
          : [Service.RequestResult<First>]
        : Rest extends any[]
          ? MultiRequestResult<Rest>
          : []
      : [];

    /** 请求结果的适配器函数 */
    type ServiceAdapter<T = any, A extends any[] = any> = (...args: A) => T;

    /** mock示例接口类型：后端接口返回的数据的类型 */
    interface MockServiceResult<T = any> {
      /** 状态码 */
      code: string | number;
      /** 接口数据 */
      data: T;
      /** 接口消息 */
      message: string;
    }

    /** mock的响应option */
    interface MockOption {
      url: Record<string, any>;
      body: Record<string, any>;
      query: Record<string, any>;
      headers: Record<string, any>;
    }
  }
}
