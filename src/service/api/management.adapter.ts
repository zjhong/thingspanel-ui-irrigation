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
    let componentStr: string = '';
    switch (item.param3) {
      case 'basic':
        componentStr = item.children?.length ? 'layout.base' : `layout.base$view.${item.element_code}`;
        break;
      case 'self':
        componentStr = item.parent_id !== '0' ? `view.${item.element_code}` : `layout.base$view.${item.element_code}`;
        break;
      case 'multi':
        componentStr = item.children?.length ? 'layout.multi' : `layout.multi$view.${item.element_code}`;
        break;
      case 'blank':
        componentStr = item.children?.length ? 'layout.blank' : `layout.blank$view.${item.element_code}`;
        break;
      default:
        componentStr = `view.${item.element_code}`;
    }

    return {
      // id: item.id,
      // parentId: item.parent_id,
      name: item.element_code,
      // elementType: item.element_type,
      path: item.param1,

      component: componentStr,
      // remark: item.remark,
      meta: {
        title: item.description,
        i18nTitle: item.multilingual,
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
