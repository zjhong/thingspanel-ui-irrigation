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

  interface DetailData {
    detail: {
      created_at: string;
      description: string;
      id: string;
      name: string;
      parent_id: string;
      remark: string;
      tenant_id: string;
      tier: number;
      updated_at: string;
    };
    tier: {
      group_path: string;
    };
  }

  interface GroupDeviceData {
    any;
  }

  interface DeviceData {
    id: string;
    activate_flag: string;
    current_version: string;
    device_config_id: string;
    device_number: string;
    device_type: number;
    group_id: string;
    is_enabled: string;
    lable: string;
    name: string;
    product_id: string;
    protocol: string;
  }

  interface DeviceDatas {
    list: DeviceData[];
    total: number;
  }

  interface ConfigData {
    id: string;
    name: string;
    device_template_id: string;
    device_type: string;
    protocol_type: string;
    voucher_type: string;
    protocol_config: string;
    device_conn_type: string;
    additional_info: string;
    description: string;
    tenant_id: string;
    created_at: string;
    updated_at: string;
    remark: null;
    device_count: number;
  }

  interface ConfigDatas {
    list: ConfigData[];
    total: number;
  }
}
