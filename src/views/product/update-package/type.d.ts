type productPackageRecord = productPackageEdit & {
  id: number
}

type productPackageEdit = {
  id?: number
  additional_info: string
  description: string
  module: string
  name: string
  package_type: number
  package_url: string
  product_id: string
  remark: string
  signature_type: string
  target_version: string
  version: string
}
