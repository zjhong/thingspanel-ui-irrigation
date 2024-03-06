type productPackageRecord = productPackageEdit & {
  id: string;
};

type productPackageEdit = {
  id?: string;
  additional_info: string;
  description: string;
  module: string;
  name: string;
  package_type: number;
  package_url: string;
  device_configs_id: string;
  remark: string;
  signature_type: string;
  target_version: string;
  version: string;
};
