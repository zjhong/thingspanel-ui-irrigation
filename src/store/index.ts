import type { App } from 'vue';
import { createPinia } from 'pinia';
import { resetSetupStore } from './plugins';

/** Setup Vue store plugin pinia */
export function setupStore(app: App) {
  console.log(app);
  const store = createPinia();
  console.log(store);
  console.log(
    store.use(() => {
      console.log(store, '99999');
    })
  );
  store.use(resetSetupStore);

  app.use(store);
}
