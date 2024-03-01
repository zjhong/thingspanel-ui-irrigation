const builtinCards = import.meta.glob('./builtin-card/*/index.Vue');
const chartCards = import.meta.glob('./chart-card/*/index.Vue');

export const PanelCards = {
  builtin: Object.values(builtinCards).map((b: any) => b.default),
  device: [],
  chart: Object.values(chartCards).map((b: any) => b.default)
};
