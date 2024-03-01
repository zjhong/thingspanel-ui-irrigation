const builtinCards = import.meta.glob('./builtin-card/*/index.ts');
const chartCards = import.meta.glob('./chart-card/*/index.ts');

export const PanelCards = {
  builtin: Object.values(builtinCards).map((b: any) => b.default),
  device: [],
  chart: Object.values(chartCards).map((b: any) => b.default)
};
