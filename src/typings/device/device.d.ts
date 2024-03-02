declare namespace DeviceManagement {
  interface Group {
    id: string;
    parent_id: string;
    tier: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    remark: string | null;
    tenant_id: string;
  }

  interface TreeNode {
    group: Group;
    children?: TreeNode[]; // TreeNode类型的可选数组，用于描述子节点
  }

  // 用于描述包含根节点和可能的子节点的整个树结构
  type TreeStructure = TreeNode[];
}
