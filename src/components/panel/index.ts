const builtinCards = import.meta.glob('./builtin-card/*/index.ts', { eager: true });
const chartCards = import.meta.glob('./chart-card/*/index.ts', { eager: true });

export const PanelCards = {
  builtin: Object.values(builtinCards).map((b: any) => {
    console.log(b, b.default, '09887889');

    return b.default;
  }),
  device: [],
  chart: Object.values(chartCards).map((b: any) => {
    console.log(b, b.default, '09887889');
    return b.default;
  })
};
