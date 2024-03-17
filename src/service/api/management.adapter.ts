import type { ElegantRoute } from '@elegant-router/types';
import type { ElegantConstRoute } from '@elegant-router/vue';

/**
 * 递归处理数据
 *
 * @param treeNode
 * @param depth
 */
function processTree(treeNode: Api.Route.MenuRoute): void {
  // 处理当前节点
  treeNode.authority = treeNode.authority ? JSON.parse(treeNode.authority) : [];
  // 递归处理子节点
  if (treeNode.children) {
    for (const childNode of treeNode.children) {
      processTree(childNode);
    }
  }
}

export function adapterOfFetchRouterList(data: Api.Route.Data): Api.Route.MenuRoute[] {
  if (!data?.list) return [];
  return data.list.map(item => {
    processTree(item);
    return item;
  });
}

/** 递归处理数据 */
function replaceKeys(data: ElegantConstRoute[]): ElegantRoute[] {
  return data.map((item: any): ElegantRoute => {
    if (!item.parent_id) {
      if (!item.route_path.includes('$')) {
        if (item.route_path === 'layout.base') {
          item.route_path += '$home';
        } else {
          item.route_path = `layout.base$${item.route_path}`;
        }
      }
    }
    if (item.route_path === 'layout.base' && item.children.length === 0) {
      console.log(item);
      item.route_path += '$home';
    }
    return {
      // id: item.id,
      // parentId: item.parent_id,
      name: item.element_code,
      // elementType: item.element_type,
      path: item.param1 && item.param1[0] === '/' ? item.param1 : (`/${item.param1}` as string),
      component: item.route_path,
      // remark: item.remark,
      meta: {
        title: item.description,
        i18nKey: item.multilingual,
        requiresAuth: true,
        permissions: JSON.parse(item.authority),
        roles: JSON.parse(item.authority),
        icon: item.param2,
        order: item.orders,
        hideInMenu: item.element_type === 5
      },
      children: item.children?.length ? replaceKeys(item.children) : []
    } as ElegantRoute;
  });
}

export function adapterOfFetchUserRouterList(data: ElegantConstRoute[]): ElegantConstRoute[] {
  if (!data.length) return [];
  return replaceKeys(data).map((item: ElegantConstRoute): ElegantConstRoute => {
    if (!item.children || !item.children.length) {
      if (!item.meta) return item;
      item.meta.singleLayout = 'base';
    }
    return item;
  });
}
