import type { MockMethod } from 'vite-plugin-mock';
import type { LastLevelRouteKey } from '@elegant-router/types';
import { routeModel, userModel } from '../model';

const apis: MockMethod[] = [
  {
    url: '/mock/getUserRoutes',
    method: 'post',
    response: (options: App.Service.MockOption): App.Service.MockServiceResult => {
      const { userId = undefined } = options.body;

      const routeHomeName: LastLevelRouteKey = 'dashboard_analysis';

      const role = userModel.find(item => item.id === userId)?.authority || 'TENANT_USER';

      const filterRoutes = routeModel[role];

      return {
        code: 200,
        message: 'ok',
        data: {
          routes: filterRoutes,
          home: routeHomeName
        }
      };
    }
  },
  {
    url: '/mock/getAllRoutes',
    method: 'post',
    response: (options: App.Service.MockOption): App.Service.MockServiceResult => {
      const { userId = undefined } = options.body;
      const role = userModel.find(item => item.id === userId)?.authority || 'TENANT_USER';
      const filterRoutes = routeModel[role];
      return {
        code: 200,
        message: 'ok',
        data: filterRoutes
      };
    }
  }
];

export default apis;
