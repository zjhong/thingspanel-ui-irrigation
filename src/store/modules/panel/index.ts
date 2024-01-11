import { markRaw } from 'vue'
import { defineStore } from 'pinia'
import { useMessage } from 'naive-ui'
import type { ICardDefine } from '@/components/panel/card'
import { BuiltinPanels } from '@/components/panel/builtin-card'

export const usePanelStore = defineStore('panel-store', {
  state: () => {
    const builtinPanelsMap = new Map<string, ICardDefine>()
    const message = useMessage()
    for (const item of BuiltinPanels) {
      if (builtinPanelsMap.get(item.id)) {
        message.warning(`重复的看板id: ${item.id}`)
      }
      item.component = markRaw(item.component)
      builtinPanelsMap.set(item.id, item)
    }
    return {
      builtinPanelsMap
    }
  },
  actions: {}
})
