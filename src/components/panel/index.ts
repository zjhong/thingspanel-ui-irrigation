const builtinCards = import.meta.globEager('./builtin-card/*/index.Vue')
const chartCards = import.meta.globEager('./chart-card/*/index.Vue')

export const PanelCards = {
  builtin: Object.values(builtinCards).map((b: any) => b.default),
  device: [],
  chart: Object.values(chartCards).map((b: any) => b.default)
}
