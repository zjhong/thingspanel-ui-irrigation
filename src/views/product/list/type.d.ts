type productAdd = {
  additional_info?: string;
  description?: string;
  device_type?: string;
  image_url?: string | null;
  image?: any[];
  name: string;
  product_model?: string;
  product_type?: string;
  remark?: string;
  device_config_id?: string;
  product_key?: string;
};
interface productRecord extends productAdd {
  created_at: string;
  id: number;
}
type QueryFormModel = Pick<productRecord, 'name'> & {
  page: number;
  page_size: number;
};

type productDeviceRecord = {
  deviceNumber: string;
  batchNumber: string;
  firmwareVersion: string;
  onlineDate: string;
  activeStatus: string;
  activeDate: string;
  id: number;
};
type productDeviceQueryParams = {
  deviceNumber: string;
  batchNumber: string;
};
