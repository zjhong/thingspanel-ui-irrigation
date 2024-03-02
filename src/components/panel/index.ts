import type { ImportGlobFunction } from 'vite';
import type { ViteHotContext } from 'vite/types/hot';

interface importMeta {
  url: string;

  readonly hot?: ViteHotContext;

  readonly env: ImportMetaEnv;

  glob: ImportGlobFunction;
}

const pImportMeta: importMeta = import.meta;

const builtinCards = pImportMeta.glob('./builtin-card/*/index.ts');
const chartCards = pImportMeta.glob('./chart-card/*/index.ts');

export const PanelCards = {
  builtin: Object.values(builtinCards).map((b: any) => b.default),
  device: [],
  chart: Object.values(chartCards).map((b: any) => b.default)
};
