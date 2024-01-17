const builtinCards = import.meta.globEager('./builtin-card/*/index.ts')

export const PanelCards = {
  builtin: Object.values(builtinCards).map((b: any) => b.default),
  device: []
}
