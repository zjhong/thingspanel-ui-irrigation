import { defineStore } from 'pinia'
import { fetchThemeSetting } from '@/service'

type SysSetting = Omit<ApiGeneralSetting.ThemeSetting, 'id'>
export const useSysSettingStore = defineStore('sys-setting', {
  state: (): SysSetting => ({
    system_name: '',
    logo_background: '',
    logo_loading: '',
    logo_cache: '',
    home_background: ''
  }),
  actions: {
    async initSysSetting() {
      const { error, data } = await fetchThemeSetting()
      // const { error, data } = await fetchUserRoutes(id)
      if (!error && data) {
        const list: ApiGeneralSetting.ThemeSetting[] = data.list
        if (list.length) {
          const setting: ApiGeneralSetting.ThemeSetting = list[0]
          Object.assign(this.$state, setting)
        }
      }
    }
  }
})
