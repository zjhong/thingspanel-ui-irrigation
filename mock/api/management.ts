import { mock } from 'mockjs';
import type { MockMethod } from 'vite-plugin-mock';

const apis: MockMethod[] = [
  {
    url: '/mock/getAllUserList',
    method: 'post',
    response: (): App.Service.MockServiceResult<Api.UserManagement.User[]> => {
      const data = mock({
        'list|1000': [
          {
            id: '@id',
            userName: '@cname',
            'age|18-56': 56,
            'gender|1': ['0', '1', null],
            phone:
              /^[1](([3][0-9])|([4][01456789])|([5][012356789])|([6][2567])|([7][0-8])|([8][0-9])|([9][012356789]))[0-9]{8}$/,
            'email|1': ['@email("qq.com")', null],
            'userStatus|1': ['1', '2', '3', '4', null]
          }
        ]
      });

      return {
        code: 200,
        message: 'ok',
        data: data.list
      };
    }
  },
  {
    url: '/mock/getRuleEngineList',
    method: 'get',
    response: (): App.Service.MockServiceResult<Api.RuleEngine.Rule[]> => {
      const data = mock({
        'list|200': [
          {
            id: '@id',
            name: '@cname',
            'status|1': ['1', '2', null]
          }
        ]
      });

      return {
        code: 200,
        message: 'ok',
        data: data.list
      };
    }
  },
  {
    url: '/mock/getDataServiceList',
    method: 'get',
    response: (): App.Service.MockServiceResult<Api.RuleEngine.Rule[]> => {
      const data = mock({
        'list|200': [
          {
            id: '@id',
            name: '@cname',
            appKey: '@key',
            'signMode|1': ['1', '2', null],
            ip: '@ip',
            'flag|1': ['1', '2', null],
            dataInterval: '@number',
            desc: '@string',
            createTime: '@createTime',
            'status|1': ['1', '2', null]
          }
        ]
      });

      return {
        code: 200,
        message: 'ok',
        data: data.list
      };
    }
  },
  {
    url: '/mock/getServiceManagementList',
    method: 'get',
    response: (): App.Service.MockServiceResult<Api.ApplyManagement.Service[]> => {
      const data = mock({
        'list|200': [
          {
            id: '@id',
            name: '@cname',
            'serviceType|1': ['1', '2', '3', null],
            desc: '@sentence',
            author: '@cname',
            version: '@float',
            'status|1': ['1', '2', null]
          }
        ]
      });

      return {
        code: 200,
        message: 'ok',
        data: data.list
      };
    }
  },
  {
    url: '/mock/getThemeSetting',
    method: 'get',
    response: (): App.Service.MockServiceResult<Api.ApplyManagement.Service> => {
      const data = mock({
        id: '@id',
        system_name: '@cname',
        logo_one: '@image',
        logo_two: '@image',
        logo_three: '@image',
        home_background: '@image'
      });
      return {
        code: 200,
        message: 'ok',
        data
      };
    }
  },
  {
    url: '/mock/getDataClearList',
    method: 'get',
    response: (): App.Service.MockServiceResult<Api.GeneralSetting.DataClearSetting[]> => {
      const data = mock({
        'list|2': [
          {
            id: '@id',
            'cleanup_type|1': ['1', '2'],
            retention_days: '@integer',
            last_cleanup_time: '@datetime',
            last_cleanup_data_time: '@datetime',
            desc: '@sentence'
          }
        ]
      });
      return {
        code: 200,
        message: 'ok',
        data: data.list
      };
    }
  }
];

export default apis;
