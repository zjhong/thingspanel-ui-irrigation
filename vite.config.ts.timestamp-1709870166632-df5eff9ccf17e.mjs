// vite.config.ts
import process3 from "node:process";
import { URL, fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "file:///E:/wbh/zjh/thingspanel-ui1/node_modules/.pnpm/vite@5.1.4_@types+node@20.11.24_sass@1.71.1/node_modules/vite/dist/node/index.js";
import dayjs from "file:///E:/wbh/zjh/thingspanel-ui1/node_modules/.pnpm/dayjs@1.11.10/node_modules/dayjs/dayjs.min.js";

// build/plugins/index.ts
import vue from "file:///E:/wbh/zjh/thingspanel-ui1/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.1.4_vue@3.4.19/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///E:/wbh/zjh/thingspanel-ui1/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.1.4_vue@3.4.19/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import VueDevtools from "file:///E:/wbh/zjh/thingspanel-ui1/node_modules/.pnpm/vite-plugin-vue-devtools@7.0.16_rollup@2.79.1_vite@5.1.4_vue@3.4.19/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import progress from "file:///E:/wbh/zjh/thingspanel-ui1/node_modules/.pnpm/vite-plugin-progress@0.0.7_vite@5.1.4/node_modules/vite-plugin-progress/dist/index.mjs";

// build/plugins/router.ts
import ElegantVueRouter from "file:///E:/wbh/zjh/thingspanel-ui1/node_modules/.pnpm/@elegant-router+vue@0.3.6/node_modules/@elegant-router/vue/dist/vite.mjs";
function setupElegantRouter() {
  return ElegantVueRouter({
    layouts: {
      base: "src/layouts/base-layout/index.vue",
      blank: "src/layouts/blank-layout/index.vue"
    },
    customRoutes: {
      names: ["exception_403", "exception_404", "exception_500"]
    },
    routePathTransformer(routeName, routePath) {
      const key = routeName;
      if (key === "login") {
        const modules = ["pwd-login", "code-login", "register", "reset-pwd", "bind-wechat"];
        const moduleReg = modules.join("|");
        return `/login/:module(${moduleReg})?`;
      }
      return routePath;
    },
    onRouteMetaGen(routeName) {
      const key = routeName;
      const constantRoutes = ["login", "403", "404", "500"];
      const meta = {
        title: key,
        i18nKey: `route.${key}`
      };
      if (constantRoutes.includes(key)) {
        meta.constant = true;
      }
      return meta;
    }
  });
}

// build/plugins/unocss.ts
import process from "node:process";
import path from "node:path";
import unocss from "file:///E:/wbh/zjh/thingspanel-ui1/node_modules/.pnpm/@unocss+vite@0.58.5_rollup@2.79.1_vite@5.1.4/node_modules/@unocss/vite/dist/index.mjs";
import presetIcons from "file:///E:/wbh/zjh/thingspanel-ui1/node_modules/.pnpm/@unocss+preset-icons@0.58.5/node_modules/@unocss/preset-icons/dist/index.mjs";
import { FileSystemIconLoader } from "file:///E:/wbh/zjh/thingspanel-ui1/node_modules/.pnpm/@iconify+utils@2.1.22/node_modules/@iconify/utils/lib/loader/node-loaders.mjs";
function setupUnocss(viteEnv) {
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv;
  const localIconPath = path.join(process.cwd(), "src/assets/svg-icon");
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, "");
  return unocss({
    presets: [
      presetIcons({
        prefix: `${VITE_ICON_PREFIX}-`,
        scale: 1,
        extraProperties: {
          display: "inline-block"
        },
        collections: {
          [collectionName]: FileSystemIconLoader(
            localIconPath,
            (svg) => svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
          )
        },
        warn: true
      })
    ]
  });
}

// build/plugins/unplugin.ts
import process2 from "node:process";
import path2 from "node:path";
import Icons from "file:///E:/wbh/zjh/thingspanel-ui1/node_modules/.pnpm/unplugin-icons@0.18.5/node_modules/unplugin-icons/dist/vite.js";
import IconsResolver from "file:///E:/wbh/zjh/thingspanel-ui1/node_modules/.pnpm/unplugin-icons@0.18.5/node_modules/unplugin-icons/dist/resolver.js";
import Components from "file:///E:/wbh/zjh/thingspanel-ui1/node_modules/.pnpm/unplugin-vue-components@0.26.0_rollup@2.79.1_vue@3.4.19/node_modules/unplugin-vue-components/dist/vite.js";
import { AntDesignVueResolver, NaiveUiResolver } from "file:///E:/wbh/zjh/thingspanel-ui1/node_modules/.pnpm/unplugin-vue-components@0.26.0_rollup@2.79.1_vue@3.4.19/node_modules/unplugin-vue-components/dist/resolvers.js";
import { FileSystemIconLoader as FileSystemIconLoader2 } from "file:///E:/wbh/zjh/thingspanel-ui1/node_modules/.pnpm/unplugin-icons@0.18.5/node_modules/unplugin-icons/dist/loaders.js";
import { createSvgIconsPlugin } from "file:///E:/wbh/zjh/thingspanel-ui1/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.1.4/node_modules/vite-plugin-svg-icons/dist/index.mjs";
function setupUnplugin(viteEnv) {
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv;
  const localIconPath = path2.join(process2.cwd(), "src/assets/svg-icon");
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, "");
  const plugins = [
    Icons({
      compiler: "vue3",
      customCollections: {
        [collectionName]: FileSystemIconLoader2(
          localIconPath,
          (svg) => svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
        )
      },
      scale: 1,
      defaultClass: "inline-block"
    }),
    Components({
      dts: "src/typings/components.d.ts",
      types: [{ from: "vue-router", names: ["RouterLink", "RouterView"] }],
      resolvers: [
        AntDesignVueResolver({
          importStyle: false
        }),
        NaiveUiResolver(),
        IconsResolver({ customCollections: [collectionName], componentPrefix: VITE_ICON_PREFIX })
      ]
    }),
    createSvgIconsPlugin({
      iconDirs: [localIconPath],
      symbolId: `${VITE_ICON_LOCAL_PREFIX}-[dir]-[name]`,
      inject: "body-last",
      customDomId: "__SVG_ICON_LOCAL__"
    })
  ];
  return plugins;
}

// build/plugins/index.ts
function setupVitePlugins(viteEnv) {
  const plugins = [
    vue({
      script: {
        defineModel: true
      }
    }),
    vueJsx(),
    VueDevtools(),
    setupElegantRouter(),
    setupUnocss(viteEnv),
    ...setupUnplugin(viteEnv),
    progress()
  ];
  return plugins;
}

// env.config.ts
function createServiceConfig(env) {
  const mockURL = "https://mock.apifox.com/m1/4080832-0-default";
  const devURL = "http://47.115.210.16:9999/api/v1";
  const testURL = "";
  const prodURL = "http://47.115.210.16:9999/api/v1";
  const serviceConfigMap = {
    dev: {
      baseURL: devURL,
      otherBaseURL: {
        demo: devURL,
        mock: mockURL
      }
    },
    test: {
      baseURL: mockURL,
      otherBaseURL: {
        demo: testURL,
        mock: mockURL
      }
    },
    prod: {
      baseURL: prodURL,
      otherBaseURL: {
        demo: prodURL,
        mock: mockURL
      }
    }
  };
  const { VITE_SERVICE_ENV = "dev" } = env;
  return serviceConfigMap[VITE_SERVICE_ENV];
}
function createProxyPattern(key) {
  if (!key) {
    return "/proxy-default";
  }
  return `/proxy-${key}`;
}

// build/config/proxy.ts
function createViteProxy(env) {
  const isEnableHttpProxy = env.VITE_HTTP_PROXY === "Y";
  if (!isEnableHttpProxy)
    return void 0;
  const { baseURL, otherBaseURL } = createServiceConfig(env);
  const defaultProxyPattern = createProxyPattern();
  const proxy = {
    [defaultProxyPattern]: {
      target: baseURL,
      changeOrigin: true,
      rewrite: (path3) => path3.replace(new RegExp(`^${defaultProxyPattern}`), "")
    }
  };
  const otherURLEntries = Object.entries(otherBaseURL);
  for (const [key, url] of otherURLEntries) {
    const proxyPattern = createProxyPattern(key);
    proxy[proxyPattern] = {
      target: url,
      changeOrigin: true,
      rewrite: (path3) => path3.replace(new RegExp(`^${proxyPattern}`), "")
    };
  }
  return proxy;
}

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///E:/wbh/zjh/thingspanel-ui1/vite.config.ts";
var vite_config_default = defineConfig((configEnv) => {
  const viteEnv = loadEnv(configEnv.mode, process3.cwd());
  const buildTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("./", __vite_injected_original_import_meta_url)),
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/styles/scss/global.scss" as *;`
        }
      }
    },
    plugins: setupVitePlugins(viteEnv),
    define: {
      BUILD_TIME: JSON.stringify(buildTime)
    },
    server: {
      host: "0.0.0.0",
      port: 5002,
      open: true,
      proxy: createViteProxy(viteEnv),
      fs: {
        cachedChecks: false
      }
    },
    preview: {
      port: 9725
    },
    build: {
      reportCompressedSize: false,
      sourcemap: viteEnv.VITE_SOURCE_MAP === "Y",
      commonjsOptions: {
        ignoreTryCatch: false
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYnVpbGQvcGx1Z2lucy9pbmRleC50cyIsICJidWlsZC9wbHVnaW5zL3JvdXRlci50cyIsICJidWlsZC9wbHVnaW5zL3Vub2Nzcy50cyIsICJidWlsZC9wbHVnaW5zL3VucGx1Z2luLnRzIiwgImVudi5jb25maWcudHMiLCAiYnVpbGQvY29uZmlnL3Byb3h5LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcd2JoXFxcXHpqaFxcXFx0aGluZ3NwYW5lbC11aTFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXHdiaFxcXFx6amhcXFxcdGhpbmdzcGFuZWwtdWkxXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi93YmgvempoL3RoaW5nc3BhbmVsLXVpMS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCBwcm9jZXNzIGZyb20gJ25vZGU6cHJvY2Vzcyc7XHJcbmltcG9ydCB7IFVSTCwgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJztcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCBkYXlqcyBmcm9tICdkYXlqcyc7XHJcbmltcG9ydCB7IHNldHVwVml0ZVBsdWdpbnMgfSBmcm9tICcuL2J1aWxkL3BsdWdpbnMnO1xyXG5pbXBvcnQgeyBjcmVhdGVWaXRlUHJveHkgfSBmcm9tICcuL2J1aWxkL2NvbmZpZyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoY29uZmlnRW52ID0+IHtcclxuICBjb25zdCB2aXRlRW52ID0gbG9hZEVudihjb25maWdFbnYubW9kZSwgcHJvY2Vzcy5jd2QoKSkgYXMgdW5rbm93biBhcyBFbnYuSW1wb3J0TWV0YTtcclxuXHJcbiAgY29uc3QgYnVpbGRUaW1lID0gZGF5anMoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGJhc2U6IHZpdGVFbnYuVklURV9CQVNFX1VSTCxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAnfic6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi8nLCBpbXBvcnQubWV0YS51cmwpKSxcclxuICAgICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgY3NzOiB7XHJcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgICBzY3NzOiB7XHJcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEB1c2UgXCIuL3NyYy9zdHlsZXMvc2Nzcy9nbG9iYWwuc2Nzc1wiIGFzICo7YFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IHNldHVwVml0ZVBsdWdpbnModml0ZUVudiksXHJcbiAgICBkZWZpbmU6IHtcclxuICAgICAgQlVJTERfVElNRTogSlNPTi5zdHJpbmdpZnkoYnVpbGRUaW1lKVxyXG4gICAgfSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICAgIHBvcnQ6IDUwMDIsXHJcbiAgICAgIG9wZW46IHRydWUsXHJcbiAgICAgIHByb3h5OiBjcmVhdGVWaXRlUHJveHkodml0ZUVudiksXHJcbiAgICAgIGZzOiB7XHJcbiAgICAgICAgY2FjaGVkQ2hlY2tzOiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcHJldmlldzoge1xyXG4gICAgICBwb3J0OiA5NzI1XHJcbiAgICB9LFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IGZhbHNlLFxyXG4gICAgICBzb3VyY2VtYXA6IHZpdGVFbnYuVklURV9TT1VSQ0VfTUFQID09PSAnWScsXHJcbiAgICAgIGNvbW1vbmpzT3B0aW9uczoge1xyXG4gICAgICAgIGlnbm9yZVRyeUNhdGNoOiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxufSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcd2JoXFxcXHpqaFxcXFx0aGluZ3NwYW5lbC11aTFcXFxcYnVpbGRcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcd2JoXFxcXHpqaFxcXFx0aGluZ3NwYW5lbC11aTFcXFxcYnVpbGRcXFxccGx1Z2luc1xcXFxpbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovd2JoL3pqaC90aGluZ3NwYW5lbC11aTEvYnVpbGQvcGx1Z2lucy9pbmRleC50c1wiO2ltcG9ydCB0eXBlIHsgUGx1Z2luT3B0aW9uIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnO1xuaW1wb3J0IFZ1ZURldnRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scyc7XG5pbXBvcnQgcHJvZ3Jlc3MgZnJvbSAndml0ZS1wbHVnaW4tcHJvZ3Jlc3MnO1xuaW1wb3J0IHsgc2V0dXBFbGVnYW50Um91dGVyIH0gZnJvbSAnLi9yb3V0ZXInO1xuaW1wb3J0IHsgc2V0dXBVbm9jc3MgfSBmcm9tICcuL3Vub2Nzcyc7XG5pbXBvcnQgeyBzZXR1cFVucGx1Z2luIH0gZnJvbSAnLi91bnBsdWdpbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXR1cFZpdGVQbHVnaW5zKHZpdGVFbnY6IEVudi5JbXBvcnRNZXRhKSB7XG4gIGNvbnN0IHBsdWdpbnM6IFBsdWdpbk9wdGlvbiA9IFtcbiAgICB2dWUoe1xuICAgICAgc2NyaXB0OiB7XG4gICAgICAgIGRlZmluZU1vZGVsOiB0cnVlXG4gICAgICB9XG4gICAgfSksXG4gICAgdnVlSnN4KCksXG4gICAgVnVlRGV2dG9vbHMoKSxcbiAgICBzZXR1cEVsZWdhbnRSb3V0ZXIoKSxcbiAgICBzZXR1cFVub2Nzcyh2aXRlRW52KSxcbiAgICAuLi5zZXR1cFVucGx1Z2luKHZpdGVFbnYpLFxuICAgIHByb2dyZXNzKClcbiAgXTtcblxuICByZXR1cm4gcGx1Z2lucztcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcd2JoXFxcXHpqaFxcXFx0aGluZ3NwYW5lbC11aTFcXFxcYnVpbGRcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcd2JoXFxcXHpqaFxcXFx0aGluZ3NwYW5lbC11aTFcXFxcYnVpbGRcXFxccGx1Z2luc1xcXFxyb3V0ZXIudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L3diaC96amgvdGhpbmdzcGFuZWwtdWkxL2J1aWxkL3BsdWdpbnMvcm91dGVyLnRzXCI7aW1wb3J0IHR5cGUgeyBSb3V0ZU1ldGEgfSBmcm9tICd2dWUtcm91dGVyJztcbmltcG9ydCBFbGVnYW50VnVlUm91dGVyIGZyb20gJ0BlbGVnYW50LXJvdXRlci92dWUvdml0ZSc7XG5pbXBvcnQgdHlwZSB7IFJvdXRlS2V5IH0gZnJvbSAnQGVsZWdhbnQtcm91dGVyL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwRWxlZ2FudFJvdXRlcigpIHtcbiAgcmV0dXJuIEVsZWdhbnRWdWVSb3V0ZXIoe1xuICAgIGxheW91dHM6IHtcbiAgICAgIGJhc2U6ICdzcmMvbGF5b3V0cy9iYXNlLWxheW91dC9pbmRleC52dWUnLFxuICAgICAgYmxhbms6ICdzcmMvbGF5b3V0cy9ibGFuay1sYXlvdXQvaW5kZXgudnVlJ1xuICAgIH0sXG4gICAgY3VzdG9tUm91dGVzOiB7XG4gICAgICBuYW1lczogWydleGNlcHRpb25fNDAzJywgJ2V4Y2VwdGlvbl80MDQnLCAnZXhjZXB0aW9uXzUwMCddXG4gICAgfSxcbiAgICByb3V0ZVBhdGhUcmFuc2Zvcm1lcihyb3V0ZU5hbWUsIHJvdXRlUGF0aCkge1xuICAgICAgY29uc3Qga2V5ID0gcm91dGVOYW1lIGFzIFJvdXRlS2V5O1xuXG4gICAgICBpZiAoa2V5ID09PSAnbG9naW4nKSB7XG4gICAgICAgIGNvbnN0IG1vZHVsZXM6IFVuaW9uS2V5LkxvZ2luTW9kdWxlW10gPSBbJ3B3ZC1sb2dpbicsICdjb2RlLWxvZ2luJywgJ3JlZ2lzdGVyJywgJ3Jlc2V0LXB3ZCcsICdiaW5kLXdlY2hhdCddO1xuXG4gICAgICAgIGNvbnN0IG1vZHVsZVJlZyA9IG1vZHVsZXMuam9pbignfCcpO1xuXG4gICAgICAgIHJldHVybiBgL2xvZ2luLzptb2R1bGUoJHttb2R1bGVSZWd9KT9gO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcm91dGVQYXRoO1xuICAgIH0sXG4gICAgb25Sb3V0ZU1ldGFHZW4ocm91dGVOYW1lKSB7XG4gICAgICBjb25zdCBrZXkgPSByb3V0ZU5hbWUgYXMgUm91dGVLZXk7XG5cbiAgICAgIGNvbnN0IGNvbnN0YW50Um91dGVzOiBSb3V0ZUtleVtdID0gWydsb2dpbicsICc0MDMnLCAnNDA0JywgJzUwMCddO1xuXG4gICAgICBjb25zdCBtZXRhOiBQYXJ0aWFsPFJvdXRlTWV0YT4gPSB7XG4gICAgICAgIHRpdGxlOiBrZXksXG4gICAgICAgIGkxOG5LZXk6IGByb3V0ZS4ke2tleX1gIGFzIEFwcC5JMThuLkkxOG5LZXlcbiAgICAgIH07XG5cbiAgICAgIGlmIChjb25zdGFudFJvdXRlcy5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgIG1ldGEuY29uc3RhbnQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWV0YTtcbiAgICB9XG4gIH0pO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx3YmhcXFxcempoXFxcXHRoaW5nc3BhbmVsLXVpMVxcXFxidWlsZFxcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFx3YmhcXFxcempoXFxcXHRoaW5nc3BhbmVsLXVpMVxcXFxidWlsZFxcXFxwbHVnaW5zXFxcXHVub2Nzcy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovd2JoL3pqaC90aGluZ3NwYW5lbC11aTEvYnVpbGQvcGx1Z2lucy91bm9jc3MudHNcIjtpbXBvcnQgcHJvY2VzcyBmcm9tICdub2RlOnByb2Nlc3MnO1xuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJztcbmltcG9ydCB1bm9jc3MgZnJvbSAnQHVub2Nzcy92aXRlJztcbmltcG9ydCBwcmVzZXRJY29ucyBmcm9tICdAdW5vY3NzL3ByZXNldC1pY29ucyc7XG5pbXBvcnQgeyBGaWxlU3lzdGVtSWNvbkxvYWRlciB9IGZyb20gJ0BpY29uaWZ5L3V0aWxzL2xpYi9sb2FkZXIvbm9kZS1sb2FkZXJzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwVW5vY3NzKHZpdGVFbnY6IEVudi5JbXBvcnRNZXRhKSB7XG4gIGNvbnN0IHsgVklURV9JQ09OX1BSRUZJWCwgVklURV9JQ09OX0xPQ0FMX1BSRUZJWCB9ID0gdml0ZUVudjtcblxuICBjb25zdCBsb2NhbEljb25QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdzcmMvYXNzZXRzL3N2Zy1pY29uJyk7XG5cbiAgLyoqIFRoZSBuYW1lIG9mIHRoZSBsb2NhbCBpY29uIGNvbGxlY3Rpb24gKi9cbiAgY29uc3QgY29sbGVjdGlvbk5hbWUgPSBWSVRFX0lDT05fTE9DQUxfUFJFRklYLnJlcGxhY2UoYCR7VklURV9JQ09OX1BSRUZJWH0tYCwgJycpO1xuXG4gIHJldHVybiB1bm9jc3Moe1xuICAgIHByZXNldHM6IFtcbiAgICAgIHByZXNldEljb25zKHtcbiAgICAgICAgcHJlZml4OiBgJHtWSVRFX0lDT05fUFJFRklYfS1gLFxuICAgICAgICBzY2FsZTogMSxcbiAgICAgICAgZXh0cmFQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaydcbiAgICAgICAgfSxcbiAgICAgICAgY29sbGVjdGlvbnM6IHtcbiAgICAgICAgICBbY29sbGVjdGlvbk5hbWVdOiBGaWxlU3lzdGVtSWNvbkxvYWRlcihsb2NhbEljb25QYXRoLCBzdmcgPT5cbiAgICAgICAgICAgIHN2Zy5yZXBsYWNlKC9ePHN2Z1xccy8sICc8c3ZnIHdpZHRoPVwiMWVtXCIgaGVpZ2h0PVwiMWVtXCIgJylcbiAgICAgICAgICApXG4gICAgICAgIH0sXG4gICAgICAgIHdhcm46IHRydWVcbiAgICAgIH0pXG4gICAgXVxuICB9KTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcd2JoXFxcXHpqaFxcXFx0aGluZ3NwYW5lbC11aTFcXFxcYnVpbGRcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcd2JoXFxcXHpqaFxcXFx0aGluZ3NwYW5lbC11aTFcXFxcYnVpbGRcXFxccGx1Z2luc1xcXFx1bnBsdWdpbi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovd2JoL3pqaC90aGluZ3NwYW5lbC11aTEvYnVpbGQvcGx1Z2lucy91bnBsdWdpbi50c1wiO2ltcG9ydCBwcm9jZXNzIGZyb20gJ25vZGU6cHJvY2Vzcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xuaW1wb3J0IHR5cGUgeyBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJztcbmltcG9ydCBJY29ucyBmcm9tICd1bnBsdWdpbi1pY29ucy92aXRlJztcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gJ3VucGx1Z2luLWljb25zL3Jlc29sdmVyJztcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnO1xuaW1wb3J0IHsgQW50RGVzaWduVnVlUmVzb2x2ZXIsIE5haXZlVWlSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycyc7XG5pbXBvcnQgeyBGaWxlU3lzdGVtSWNvbkxvYWRlciB9IGZyb20gJ3VucGx1Z2luLWljb25zL2xvYWRlcnMnO1xuaW1wb3J0IHsgY3JlYXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1zdmctaWNvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXBVbnBsdWdpbih2aXRlRW52OiBFbnYuSW1wb3J0TWV0YSkge1xuICBjb25zdCB7IFZJVEVfSUNPTl9QUkVGSVgsIFZJVEVfSUNPTl9MT0NBTF9QUkVGSVggfSA9IHZpdGVFbnY7XG5cbiAgY29uc3QgbG9jYWxJY29uUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnc3JjL2Fzc2V0cy9zdmctaWNvbicpO1xuXG4gIC8qKiBUaGUgbmFtZSBvZiB0aGUgbG9jYWwgaWNvbiBjb2xsZWN0aW9uICovXG4gIGNvbnN0IGNvbGxlY3Rpb25OYW1lID0gVklURV9JQ09OX0xPQ0FMX1BSRUZJWC5yZXBsYWNlKGAke1ZJVEVfSUNPTl9QUkVGSVh9LWAsICcnKTtcblxuICBjb25zdCBwbHVnaW5zOiBQbHVnaW5PcHRpb25bXSA9IFtcbiAgICBJY29ucyh7XG4gICAgICBjb21waWxlcjogJ3Z1ZTMnLFxuICAgICAgY3VzdG9tQ29sbGVjdGlvbnM6IHtcbiAgICAgICAgW2NvbGxlY3Rpb25OYW1lXTogRmlsZVN5c3RlbUljb25Mb2FkZXIobG9jYWxJY29uUGF0aCwgc3ZnID0+XG4gICAgICAgICAgc3ZnLnJlcGxhY2UoL148c3ZnXFxzLywgJzxzdmcgd2lkdGg9XCIxZW1cIiBoZWlnaHQ9XCIxZW1cIiAnKVxuICAgICAgICApXG4gICAgICB9LFxuICAgICAgc2NhbGU6IDEsXG4gICAgICBkZWZhdWx0Q2xhc3M6ICdpbmxpbmUtYmxvY2snXG4gICAgfSksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICBkdHM6ICdzcmMvdHlwaW5ncy9jb21wb25lbnRzLmQudHMnLFxuICAgICAgdHlwZXM6IFt7IGZyb206ICd2dWUtcm91dGVyJywgbmFtZXM6IFsnUm91dGVyTGluaycsICdSb3V0ZXJWaWV3J10gfV0sXG4gICAgICByZXNvbHZlcnM6IFtcbiAgICAgICAgQW50RGVzaWduVnVlUmVzb2x2ZXIoe1xuICAgICAgICAgIGltcG9ydFN0eWxlOiBmYWxzZVxuICAgICAgICB9KSxcbiAgICAgICAgTmFpdmVVaVJlc29sdmVyKCksXG4gICAgICAgIEljb25zUmVzb2x2ZXIoeyBjdXN0b21Db2xsZWN0aW9uczogW2NvbGxlY3Rpb25OYW1lXSwgY29tcG9uZW50UHJlZml4OiBWSVRFX0lDT05fUFJFRklYIH0pXG4gICAgICBdXG4gICAgfSksXG4gICAgY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xuICAgICAgaWNvbkRpcnM6IFtsb2NhbEljb25QYXRoXSxcbiAgICAgIHN5bWJvbElkOiBgJHtWSVRFX0lDT05fTE9DQUxfUFJFRklYfS1bZGlyXS1bbmFtZV1gLFxuICAgICAgaW5qZWN0OiAnYm9keS1sYXN0JyxcbiAgICAgIGN1c3RvbURvbUlkOiAnX19TVkdfSUNPTl9MT0NBTF9fJ1xuICAgIH0pXG4gIF07XG5cbiAgcmV0dXJuIHBsdWdpbnM7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXHdiaFxcXFx6amhcXFxcdGhpbmdzcGFuZWwtdWkxXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFx3YmhcXFxcempoXFxcXHRoaW5nc3BhbmVsLXVpMVxcXFxlbnYuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi93YmgvempoL3RoaW5nc3BhbmVsLXVpMS9lbnYuY29uZmlnLnRzXCI7LyoqXG4gKiBDcmVhdGUgc2VydmljZSBjb25maWcgYnkgY3VycmVudCBlbnZcbiAqXG4gKiBAcGFyYW0gZW52IFRoZSBjdXJyZW50IGVudlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2VydmljZUNvbmZpZyhlbnY6IEVudi5JbXBvcnRNZXRhKSB7XG4gIGNvbnN0IG1vY2tVUkwgPSAnaHR0cHM6Ly9tb2NrLmFwaWZveC5jb20vbTEvNDA4MDgzMi0wLWRlZmF1bHQnO1xuICBjb25zdCBkZXZVUkwgPSAnaHR0cDovLzQ3LjExNS4yMTAuMTY6OTk5OS9hcGkvdjEnO1xuICBjb25zdCB0ZXN0VVJMID0gJyc7XG4gIGNvbnN0IHByb2RVUkwgPSAnaHR0cDovLzQ3LjExNS4yMTAuMTY6OTk5OS9hcGkvdjEnO1xuXG4gIGNvbnN0IHNlcnZpY2VDb25maWdNYXA6IEFwcC5TZXJ2aWNlLlNlcnZpY2VDb25maWdNYXAgPSB7XG4gICAgZGV2OiB7XG4gICAgICBiYXNlVVJMOiBkZXZVUkwsXG4gICAgICBvdGhlckJhc2VVUkw6IHtcbiAgICAgICAgZGVtbzogZGV2VVJMLFxuICAgICAgICBtb2NrOiBtb2NrVVJMXG4gICAgICB9XG4gICAgfSxcbiAgICB0ZXN0OiB7XG4gICAgICBiYXNlVVJMOiBtb2NrVVJMLFxuICAgICAgb3RoZXJCYXNlVVJMOiB7XG4gICAgICAgIGRlbW86IHRlc3RVUkwsXG4gICAgICAgIG1vY2s6IG1vY2tVUkxcbiAgICAgIH1cbiAgICB9LFxuICAgIHByb2Q6IHtcbiAgICAgIGJhc2VVUkw6IHByb2RVUkwsXG4gICAgICBvdGhlckJhc2VVUkw6IHtcbiAgICAgICAgZGVtbzogcHJvZFVSTCxcbiAgICAgICAgbW9jazogbW9ja1VSTFxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCB7IFZJVEVfU0VSVklDRV9FTlYgPSAnZGV2JyB9ID0gZW52O1xuXG4gIHJldHVybiBzZXJ2aWNlQ29uZmlnTWFwW1ZJVEVfU0VSVklDRV9FTlZdO1xufVxuXG4vKipcbiAqIEdldCBwcm94eSBwYXR0ZXJuIG9mIHNlcnZpY2UgdXJsXG4gKlxuICogQHBhcmFtIGtleSBJZiBub3Qgc2V0LCB3aWxsIHVzZSB0aGUgZGVmYXVsdCBrZXlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVByb3h5UGF0dGVybihrZXk/OiBBcHAuU2VydmljZS5PdGhlckJhc2VVUkxLZXkpIHtcbiAgaWYgKCFrZXkpIHtcbiAgICByZXR1cm4gJy9wcm94eS1kZWZhdWx0JztcbiAgfVxuXG4gIHJldHVybiBgL3Byb3h5LSR7a2V5fWA7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXHdiaFxcXFx6amhcXFxcdGhpbmdzcGFuZWwtdWkxXFxcXGJ1aWxkXFxcXGNvbmZpZ1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcd2JoXFxcXHpqaFxcXFx0aGluZ3NwYW5lbC11aTFcXFxcYnVpbGRcXFxcY29uZmlnXFxcXHByb3h5LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi93YmgvempoL3RoaW5nc3BhbmVsLXVpMS9idWlsZC9jb25maWcvcHJveHkudHNcIjtpbXBvcnQgdHlwZSB7IFByb3h5T3B0aW9ucyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgY3JlYXRlUHJveHlQYXR0ZXJuLCBjcmVhdGVTZXJ2aWNlQ29uZmlnIH0gZnJvbSAnLi4vLi4vZW52LmNvbmZpZyc7XG5cbi8qKlxuICogU2V0IGh0dHAgcHJveHlcbiAqXG4gKiBAcGFyYW0gZW52IC0gVGhlIGN1cnJlbnQgZW52XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWaXRlUHJveHkoZW52OiBFbnYuSW1wb3J0TWV0YSkge1xuICBjb25zdCBpc0VuYWJsZUh0dHBQcm94eSA9IGVudi5WSVRFX0hUVFBfUFJPWFkgPT09ICdZJztcblxuICBpZiAoIWlzRW5hYmxlSHR0cFByb3h5KSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gIGNvbnN0IHsgYmFzZVVSTCwgb3RoZXJCYXNlVVJMIH0gPSBjcmVhdGVTZXJ2aWNlQ29uZmlnKGVudik7XG5cbiAgY29uc3QgZGVmYXVsdFByb3h5UGF0dGVybiA9IGNyZWF0ZVByb3h5UGF0dGVybigpO1xuXG4gIGNvbnN0IHByb3h5OiBSZWNvcmQ8c3RyaW5nLCBQcm94eU9wdGlvbnM+ID0ge1xuICAgIFtkZWZhdWx0UHJveHlQYXR0ZXJuXToge1xuICAgICAgdGFyZ2V0OiBiYXNlVVJMLFxuICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgcmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChgXiR7ZGVmYXVsdFByb3h5UGF0dGVybn1gKSwgJycpXG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG90aGVyVVJMRW50cmllcyA9IE9iamVjdC5lbnRyaWVzKG90aGVyQmFzZVVSTCk7XG5cbiAgZm9yIChjb25zdCBba2V5LCB1cmxdIG9mIG90aGVyVVJMRW50cmllcykge1xuICAgIGNvbnN0IHByb3h5UGF0dGVybiA9IGNyZWF0ZVByb3h5UGF0dGVybihrZXkgYXMgQXBwLlNlcnZpY2UuT3RoZXJCYXNlVVJMS2V5KTtcblxuICAgIHByb3h5W3Byb3h5UGF0dGVybl0gPSB7XG4gICAgICB0YXJnZXQ6IHVybCxcbiAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgIHJld3JpdGU6IHBhdGggPT4gcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoYF4ke3Byb3h5UGF0dGVybn1gKSwgJycpXG4gICAgfTtcbiAgfVxuXG4g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
