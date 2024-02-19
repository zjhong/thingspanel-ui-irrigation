/**
 * 递归处理数据
 * @param treeNode
 * @param depth
 */
function processTree(treeNode: ApiCustomRoute.Route): void {
  // 处理当前节点
  treeNode.authority = treeNode.authority ? JSON.parse(treeNode.authority) : []
  // 递归处理子节点
  if (treeNode.children) {
    for (const childNode of treeNode.children) {
      processTree(childNode)
    }
  }
}

export function adapterOfFetchRouterList(data: ApiCustomRoute.Data): ApiCustomRoute.Route[] {
  if (!data?.list) return []
  return data.list.map(item => {
    processTree(item)
    return item
  })
}

/**
 * 递归处理数据
 * @param treeNode
 * @param depth
 */
function replaceKeys(data: AuthRoute.Route[]): AuthRoute.Route[] {
  return data.map((item: any): AuthRoute.Route => {
    return {
      // id: item.id,
      // parentId: item.parent_id,
      name: item.element_code,
      // elementType: item.element_type,
      path: item.param1,
      component: item.param3,
      // remark: item.remark,
      meta: {
        title: item.description,
        i18nTitle: item.multilingual,
        requiresAuth: true,
        permissions: JSON.parse(item.authority),
        singleLayout: ['data-service', 'rule-engine'].includes(item.element_code) ? 'basic' : '',
        icon: item.param2,
        order: item.orders
      },
      children: item.children ? replaceKeys(item.children) : []
    } as AuthRoute.Route
  })
}

export function adapterOfFetchUserRouterList(data: AuthRoute.Route[]) {
  if (!data.length) return []
  return replaceKeys(data)
}
