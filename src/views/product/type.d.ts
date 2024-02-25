type ProductLocal = {
  list: {
    productList: string
    productName: string
    deviceType: string
    productNumber: string
    deviceConfig: string
    productDesc: string
    createTime: string
    operate: string
    edit: string
    register: string
    delete: string
    addProduct: string
    editProduct: string
    productNamePlaceholder: string
    productTypePlaceholder: string
    productNumberPlaceholder: string
    productDescPlaceholder: string
    deviceConfigPlaceholder: string
    productKey: string
    productImage: string
    preRegister: string
    deviceNumber: string
    batchNumber: string
    firmwareVersion: string
    onlineDate: string
    activeStatus: string
    activeDate: string
  }
  'update-package': {
    packageList: string
    packageName: string
    packageNamePlaceholder: string
    version: string
    versionPlaceholder: string
    versionCode: string
    versionCodePlaceholder: string
    deviceConfig: string
    type: string
    typePlaceholder: string
    moduleName: string
    createTime: string
    desc: string
    packageAdd: string
    packageEdit: string
    diff: string
    full: string
    product: string
    productPlaceholder: string
    signMode: string
    signModePlaceholder: string
    package: string
    packagePlaceholder: string
    customInfo: string
  }
  'update-ota': Record<string, string>
}
