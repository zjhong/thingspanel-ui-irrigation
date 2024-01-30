const builtinCards = import.meta.globEager('./builtin-card/*/index.ts')
const chartCards = import.meta.globEager('./chart-card/*/index.ts')

export const PanelCards = {
  builtin: Object.values(builtinCards).map((b: any) => b.default),
  device: [],
  chart: Object.values(chartCards).map((b: any) => b.default)
}
