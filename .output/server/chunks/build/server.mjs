import { version, unref, inject, useSSRContext, defineComponent, ref, onUpdated, mergeProps, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, withDirectives, vShow, createApp, effectScope, reactive, hasInjectionContext, getCurrentInstance, provide, onErrorCaptured, onServerPrefetch, resolveDynamicComponent, toRef, computed, h, isReadonly, isRef, isShallow, isReactive, toRaw, defineAsyncComponent } from 'vue';
import { d as useRuntimeConfig$1, $ as $fetch, w as withQuery, l as hasProtocol, p as parseURL, m as isScriptProtocol, j as joinURL, n as sanitizeStatusCode, o as createHooks, h as createError$1, q as isEqual, t as toRouteMatcher, r as createRouter, v as defu, x as stringifyParsedURL, y as stringifyQuery, z as parseQuery } from '../runtime.mjs';
import { getActiveHead } from 'unhead';
import { defineHeadPlugin } from '@unhead/shared';
import { gsap } from 'gsap';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { FreeMode, Navigation, Thumbs, Mousewheel, EffectFade, EffectCube, Parallax } from 'swiper/modules';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';

function createContext$1(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als && currentInstance === void 0) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers$1.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers$1.delete(onLeave);
      }
    }
  };
}
function createNamespace$1(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext$1({ ...defaultOpts, ...opts });
      }
      contexts[key];
      return contexts[key];
    }
  };
}
const _globalThis$1 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey$2 = "__unctx__";
const defaultNamespace = _globalThis$1[globalKey$2] || (_globalThis$1[globalKey$2] = createNamespace$1());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey$1 = "__unctx_async_handlers__";
const asyncHandlers$1 = _globalThis$1[asyncHandlersKey$1] || (_globalThis$1[asyncHandlersKey$1] = /* @__PURE__ */ new Set());

const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
const nuxtAppCtx = /* @__PURE__ */ getContext("nuxt-app", {
  asyncContext: false
});
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.11.1";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: reactive({
      data: {},
      state: {},
      once: /* @__PURE__ */ new Set(),
      _errors: {},
      ...{ serverRendered: true }
    }),
    static: {
      data: {}
    },
    runWithContext: (fn) => nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn)),
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: {},
    _payloadRevivers: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
      nuxtApp.ssrContext._payloadReducers = {};
      nuxtApp.payload.path = nuxtApp.ssrContext.url;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin) {
  if (plugin.hooks) {
    nuxtApp.hooks.addHooks(plugin.hooks);
  }
  if (typeof plugin === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  var _a, _b;
  const resolvedPlugins = [];
  const unresolvedPlugins = [];
  const parallels = [];
  const errors = [];
  let promiseDepth = 0;
  async function executePlugin(plugin) {
    var _a2;
    const unresolvedPluginsForThisPlugin = ((_a2 = plugin.dependsOn) == null ? void 0 : _a2.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.includes(name))) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin).then(async () => {
        if (plugin._name) {
          resolvedPlugins.push(plugin._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin._name)) {
              dependsOn.delete(plugin._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      });
      if (plugin.parallel) {
        parallels.push(promise.catch((e) => errors.push(e)));
      } else {
        await promise;
      }
    }
  }
  for (const plugin of plugins2) {
    if (((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext) && ((_b = plugin.env) == null ? void 0 : _b.islands) === false) {
      continue;
    }
    await executePlugin(plugin);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (errors.length) {
    throw errors[0];
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin) {
  if (typeof plugin === "function") {
    return plugin;
  }
  const _name = plugin._name || plugin.name;
  delete plugin.name;
  return Object.assign(plugin.setup || (() => {
  }), plugin, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
// @__NO_SIDE_EFFECTS__
function tryUseNuxtApp() {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance = nuxtAppInstance || nuxtAppCtx.tryUse();
  return nuxtAppInstance || null;
}
// @__NO_SIDE_EFFECTS__
function useNuxtApp() {
  const nuxtAppInstance = /* @__PURE__ */ tryUseNuxtApp();
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return (/* @__PURE__ */ useNuxtApp()).$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a;
  return (_a = /* @__PURE__ */ useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, (/* @__PURE__ */ useNuxtApp())._route);
  }
  return (/* @__PURE__ */ useNuxtApp())._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if ((/* @__PURE__ */ useNuxtApp())._processingMiddleware) {
      return true;
    }
  } catch {
    return true;
  }
  return false;
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : withQuery(to.path || "/", to.query || {}) + (to.hash || "");
  if (options == null ? void 0 : options.open) {
    return Promise.resolve();
  }
  const isExternal = (options == null ? void 0 : options.external) || hasProtocol(toPath, { acceptRelative: true });
  if (isExternal) {
    if (!(options == null ? void 0 : options.external)) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const protocol = parseURL(toPath).protocol;
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = /* @__PURE__ */ useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(/"/g, "%22");
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? void 0 : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: location2 }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options == null ? void 0 : options.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef((/* @__PURE__ */ useNuxtApp()).payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const error2 = useError();
    if (false)
      ;
    error2.value = error2.value || nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
version.startsWith("3");
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function resolveUnrefHeadInput(ref2, lastKey = "") {
  if (ref2 instanceof Promise)
    return ref2;
  const root = resolveUnref(ref2);
  if (!ref2 || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r) => resolveUnrefHeadInput(r, lastKey));
  if (typeof root === "object") {
    return Object.fromEntries(
      Object.entries(root).map(([k, v]) => {
        if (k === "titleTemplate" || k.startsWith("on"))
          return [k, unref(v)];
        return [k, resolveUnrefHeadInput(v, k)];
      })
    );
  }
  return root;
}
defineHeadPlugin({
  hooks: {
    "entries:resolve": function(ctx) {
      for (const entry2 of ctx.entries)
        entry2.resolvedInput = resolveUnrefHeadInput(entry2.input);
    }
  }
});
const headSymbol = "usehead";
const _global = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey$1 = "__unhead_injection_handler__";
function setHeadInjectionHandler(handler) {
  _global[globalKey$1] = handler;
}
function injectHead() {
  if (globalKey$1 in _global) {
    return _global[globalKey$1]();
  }
  const head = inject(headSymbol);
  if (!head && "production" !== "production")
    console.warn("Unhead is missing Vue context, falling back to shared context. This may have unexpected results.");
  return head || getActiveHead();
}
const unhead_KgADcZ0jPj = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    setHeadInjectionHandler(
      // need a fresh instance of the nuxt app to avoid parallel requests interfering with each other
      () => (/* @__PURE__ */ useNuxtApp()).vueApp._context.provides.usehead
    );
    nuxtApp.vueApp.use(head);
  }
});
async function getRouteRules(url) {
  {
    const _routeRulesMatcher = toRouteMatcher(
      createRouter({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(url).reverse());
  }
}
function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als && currentInstance === void 0) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      contexts[key];
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
_globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  manifest_45route_45rule
];
function getRouteFromPath(fullPath) {
  if (typeof fullPath === "object") {
    fullPath = stringifyParsedURL({
      pathname: fullPath.path || "",
      search: stringifyQuery(fullPath.query || {}),
      hash: fullPath.hash || ""
    });
  }
  const url = parseURL(fullPath.toString());
  return {
    path: url.pathname,
    fullPath,
    query: parseQuery(url.search),
    hash: url.hash,
    // stub properties for compat with vue-router
    params: {},
    name: void 0,
    matched: [],
    redirectedFrom: void 0,
    meta: {},
    href: fullPath
  };
}
const router_CaKIoANnI2 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  setup(nuxtApp) {
    const initialURL = nuxtApp.ssrContext.url;
    const routes = [];
    const hooks = {
      "navigate:before": [],
      "resolve:before": [],
      "navigate:after": [],
      error: []
    };
    const registerHook = (hook, guard) => {
      hooks[hook].push(guard);
      return () => hooks[hook].splice(hooks[hook].indexOf(guard), 1);
    };
    (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const route = reactive(getRouteFromPath(initialURL));
    async function handleNavigation(url, replace) {
      try {
        const to = getRouteFromPath(url);
        for (const middleware of hooks["navigate:before"]) {
          const result = await middleware(to, route);
          if (result === false || result instanceof Error) {
            return;
          }
          if (typeof result === "string" && result.length) {
            return handleNavigation(result, true);
          }
        }
        for (const handler of hooks["resolve:before"]) {
          await handler(to, route);
        }
        Object.assign(route, to);
        if (false)
          ;
        for (const middleware of hooks["navigate:after"]) {
          await middleware(to, route);
        }
      } catch (err) {
        for (const handler of hooks.error) {
          await handler(err);
        }
      }
    }
    const currentRoute = computed(() => route);
    const router = {
      currentRoute,
      isReady: () => Promise.resolve(),
      // These options provide a similar API to vue-router but have no effect
      options: {},
      install: () => Promise.resolve(),
      // Navigation
      push: (url) => handleNavigation(url),
      replace: (url) => handleNavigation(url),
      back: () => (void 0).history.go(-1),
      go: (delta) => (void 0).history.go(delta),
      forward: () => (void 0).history.go(1),
      // Guards
      beforeResolve: (guard) => registerHook("resolve:before", guard),
      beforeEach: (guard) => registerHook("navigate:before", guard),
      afterEach: (guard) => registerHook("navigate:after", guard),
      onError: (handler) => registerHook("error", handler),
      // Routes
      resolve: getRouteFromPath,
      addRoute: (parentName, route2) => {
        routes.push(route2);
      },
      getRoutes: () => routes,
      hasRoute: (name) => routes.some((route2) => route2.name === name),
      removeRoute: (name) => {
        const index = routes.findIndex((route2) => route2.name === name);
        if (index !== -1) {
          routes.splice(index, 1);
        }
      }
    };
    nuxtApp.vueApp.component("RouterLink", defineComponent({
      functional: true,
      props: {
        to: {
          type: String,
          required: true
        },
        custom: Boolean,
        replace: Boolean,
        // Not implemented
        activeClass: String,
        exactActiveClass: String,
        ariaCurrentValue: String
      },
      setup: (props, { slots }) => {
        const navigate = () => handleNavigation(props.to, props.replace);
        return () => {
          var _a;
          const route2 = router.resolve(props.to);
          return props.custom ? (_a = slots.default) == null ? void 0 : _a.call(slots, { href: props.to, navigate, route: route2 }) : h("a", { href: props.to, onClick: (e) => {
            e.preventDefault();
            return navigate();
          } }, slots);
        };
      }
    }));
    nuxtApp._route = route;
    nuxtApp._middleware = nuxtApp._middleware || {
      global: [],
      named: {}
    };
    const initialLayout = nuxtApp.payload.state._layout;
    nuxtApp.hooks.hookOnce("app:created", async () => {
      router.beforeEach(async (to, from) => {
        var _a;
        to.meta = reactive(to.meta || {});
        if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
          to.meta.layout = initialLayout;
        }
        nuxtApp._processingMiddleware = true;
        if (!((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext)) {
          const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
          {
            const routeRules = await nuxtApp.runWithContext(() => getRouteRules(to.path));
            if (routeRules.appMiddleware) {
              for (const key in routeRules.appMiddleware) {
                const guard = nuxtApp._middleware.named[key];
                if (!guard) {
                  return;
                }
                if (routeRules.appMiddleware[key]) {
                  middlewareEntries.add(guard);
                } else {
                  middlewareEntries.delete(guard);
                }
              }
            }
          }
          for (const middleware of middlewareEntries) {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            {
              if (result === false || result instanceof Error) {
                const error = result || createError$1({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`,
                  data: {
                    path: initialURL
                  }
                });
                delete nuxtApp._processingMiddleware;
                return nuxtApp.runWithContext(() => showError(error));
              }
            }
            if (result === true) {
              continue;
            }
            if (result || result === false) {
              return result;
            }
          }
        }
      });
      router.afterEach(() => {
        delete nuxtApp._processingMiddleware;
      });
      await router.replace(initialURL);
      if (!isEqual(route.fullPath, initialURL)) {
        await nuxtApp.runWithContext(() => navigateTo(route.fullPath));
      }
    });
    return {
      provide: {
        route,
        router
      }
    };
  }
});
function definePayloadReducer(name, reduce) {
  {
    (/* @__PURE__ */ useNuxtApp()).ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = {
  NuxtError: (data) => isNuxtError(data) && data.toJSON(),
  EmptyShallowRef: (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  EmptyRef: (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  ShallowRef: (data) => isRef(data) && isShallow(data) && data.value,
  ShallowReactive: (data) => isReactive(data) && isShallow(data) && toRaw(data),
  Ref: (data) => isRef(data) && data.value,
  Reactive: (data) => isReactive(data) && toRaw(data)
};
const revive_payload_server_eJ33V7gbc6 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const reducer in reducers) {
      definePayloadReducer(reducer, reducers[reducer]);
    }
  }
});
const components_plugin_KR1HBZs4kY = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const gsap_qE0fizvEy0 = /* @__PURE__ */ defineNuxtPlugin(() => {
  return {
    provide: {
      gsap
    }
  };
});
const plugins = [
  unhead_KgADcZ0jPj,
  router_CaKIoANnI2,
  revive_payload_server_eJ33V7gbc6,
  components_plugin_KR1HBZs4kY,
  gsap_qE0fizvEy0
];
const _imports_0 = "" + __buildAssetsURL("logo_b.CNx2sKOU.png");
const _imports_1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABXCAYAAACTFMIVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANiSURBVHgB7ZuNcZwwEIW/dOAStgR3EEpICXQQd4A6iDswHTip4CYVuATcgdOBg8wx/rvzIWkXBOibeeMZ2yctC+zj0AoKhUKhUCgUCoVCoVAoTOWqV9Pr0Oup1/NRD71uewl5IAxx+rjGOP1PH3fNQnHe8D5p59SwLA2XY+wYjieroN7qnuFqnRM/34GwOGc52deEBfX2LAvzIMf5YuKsMOY3cYGNSbzGlopppeWcDhiTEtwoq3pzQ3psTxjzrKQGXX6hF5spj+gFqmEuMWZxqcyY4tALdgxYiEOIN4tzusOYK4Og/Xih5lKhU4+1TmYQgn4Svaaai4ZZLJa8EcEmic2FeTXNYrHkjfjb+R79Azrw+YC0zWLUEt+SPuGwvSoEm6vdkRFWdalG3yyejuNmh3dSf9DPGavD/utkEkK+SXwgn3eUX2JlLilqycAsQnHkkTzHirEwl6nK1ixCWcJcOjI3i1CE+ZK4GrMIZQ5zaVmhWYTisEmeY0dMXRbdlVmEIqTXRf/5TZlFKEJ8EjdrFqH4ou9bQYpZJOIoZpHMV+ayW7MIRfhcF3dvFqEIr0ksZhGJN4mazM3i24nf+YB/MtwyXv+O+sPQXPTItql6/ej1nSEXj0f9ZXD/s/h/nrJseMc2HyEqLj+T+r/Xpz4shD3QdmyrLoW+t2w+DtAGDrAlZ4xdrK/GAarIAUbN2l+sSOpi/WEcyJGWwJOXdOYIOi94/ThRt+8pZdEmMYEKvVdpLyXsVmkwr468zUV7kevlgqmUB/VJzNFctDu7Ht4OflAe3CsXc7Hq7Ko/TtIZTNKwLMKMnV1Wq2ZLmUvFQp1dTnlSr455zcWq3W5ybV88gAQs2oCjXqlZtWRYmYuVWbQklCBhHeYizGgWoczZTB5DxUragB26QXp1pCVxdbXaKuCKcLIxi1CszKWZNn2eZhGKsEwShYzNIpS5zaVio3tGHPpJ7HifxDU/2E/C0lxWaxahrGGnkldLxm/OhbyT6FgB/uy25JW4VXZ2OfJIXseK1681m8ljtInOLmGZutiyoR4eYd4kOjZITDN5qHbRBuywSV7HjtqAtc1ll23Agk5dbNnxnhEhLYmOQpS5lD0jJ3AUs0im5mtzKXtGJiCcrostZYPhZIThaitmkYg3l5qM+Q/CFIcOrZqL4QAAAABJRU5ErkJggg==";
const _imports_2 = "" + __buildAssetsURL("logo_w.DT95hPmS.png");
const _imports_3 = "" + __buildAssetsURL("2023_04.C3O4u7n6.jpg");
const _imports_4 = "" + __buildAssetsURL("2022_01.DIXu_qjO.jpg");
const _imports_5 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGUAAAAfCAMAAADJG/NaAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAAFiUAABYlAUlSJPAAAABIUExURUdwTP///////////////////////////////////////////////////////////////////////////////////////////wV68vgAAAAXdFJOUwBwgDAQ72BAIN/P4H+Qv8BQsJ+gr49flNL2hAAAAmVJREFUSMeVVuma6yAIjfvSZm1nfP83nSZqAMX79fKrlbB4OIDTRER7PQ1kqNF++l60eId0SnzbRuXmaC7N0Wjcs9oc2zcx1JKQBOzNBqxRKAa1cU3WxWyFI5Eaed4fL43mdvZsbX5JlHcJDnh2BrczH1qFKfX56UwMLlB1CXe3fZC0ZNXSa+QosTT34Eg4CoxFTpmLH687MooUoMx93NuVdF4JU/54VMG0fjSv+tlpI2syUnk1V00le8U5IPZXVDIZJSqMJfd+ofixBFHExlN6BVyokv1R8kBRiq+9MBd86fJTdBpMDNJDlA0ebu8bvoEvRd06hCUQQ5LRQT6pKAX6E5cU3AbKqNyAW+racYLbU8Kd+M0EMOzakyi12NfE8IYpCtQl8+FAWCwEfJxxyczkNCPye7exn5S9hBm8Cya6oTNl73og20Rchwi82FEmGLtnbZaL6LrpgsgwB9lETK/5/n4dxSiYukSTacclZ2MgS81cHX1fx7ugXFHN1Robj5kkIcltsETWwo4XTWZDwOQsIEZ6adI4DpJU7A4zopk89X/L68DY1FFsQggVvBByYr+mv8hHHqgLoPiiX0nHDeLOjeqMuRisVRrFk6GCgqzIJrJRdrIqACwcZSb4xWbvBW4kNiLwDjObq+JRlGu66zoTLN3TEWw00LDf7nZwjkBejsWQdcit45Ph7gFSTs+fmt3spScko7DjFd48vcipTqPVzqkk6c+eSCAbOXUjUnCvNEk8DB8wCIiRJ7zlZoqJYI8TbSvaOeIfFjc77XqfPaRunyP8m5N0jvvuke43+RFh/+dh38kfvFORHzet1kQAAAAASUVORK5CYII=";
const _imports_6 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGcAAAAfCAMAAADN7iNnAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAAFiUAABYlAUlSJPAAAABIUExURUdwTP///////////////////////////////////////////////////////////////////////////////////////////wV68vgAAAAXdFJOUwCAcDAQ72AgQN/Pv3+QULCfwKCv4F+PYGB5TwAAAnlJREFUSMeVVum6qzAINJFsWjXa9vr+b3pdYjJkOd85/Ox0gMAAdh0zMtQ1rImQ+ROF5Nvtpw1vnUF2GtSF+Ayxr4fj58yZvwH31iyNftzBHPrTDpEeonCOTe/YGPBKFLlnFjEaMyS6e+WcbwC+quWsoER3xuWACkX/V1DUXaFv6UyGypTIPt7QWCKildo+XZmpElC3M1fh3GnXMhgubxVgdyey1ZCeORPW9PJJ5ywCPRmsBxIdnBzxpCN6008PcuRG8XHoTGNtbmkKaJBmpdoggyGE6RnnQCyjWIwTgvrQeYgTvC0dI5mUtSwQDSU8DJ+ANUxxiIcE5PDWw9MgTirBwuMYoHdMfK4rcuvTHy1HwvitRRwN0iEex6UqTjw3cG5YnGfIzi6QvawvgNife/48vHRkTcCsCeeCQhtdtlDpxTuPG3bEkVN80ywAIWdgErtL7JyL85rHTwnsjqCgz3YfUP4lZ4BfZ9wS1IoSMrBsaUTt2J84wUTaEdK0ojzLH/qBcqM6h7lbcBuZxpFZA7Dxfsx5eSRszI0XR4vDNsdWcnbl1COvXG65yl2NwxWi2DSzw7SmV35Q/FEGsjxZntK3wmWZcnRxTB02mccxbNVAmNUWffF85nXHT0n2/A/rz4jtSXfJMZmPrCMzU2iss5rtYwbiXLufPG74dM2HxKH8xFg8ZdWTeWcQxTn6UeHJrB7tS++RMry9Y2e29gUQZkRUAN0+9C3KzaG99QlQgwSbWGZr67PBsRPFbGl81Ylye/GPncqDwjqQNY7go5nLcWpWpwz0ph84Uat6jb99BGXqrX+nGthtarLdL83M56qS2nS/NrLy4szA+Q+7d5lLDKVfcwAAAABJRU5ErkJggg==";
const _imports_7 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGcAAAAfCAMAAADN7iNnAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAAFiUAABYlAUlSJPAAAABIUExURUdwTP///////////////////////////////////////////////////////////////////////////////////////////wV68vgAAAAXdFJOUwBwgL8Q72BAIN8wz3+QUMCfsKDgj69fHoG61gAAAmZJREFUSMelVtl26yAQMxhswPGStAn//6f1wiJh6D33dJ6ayjMaxCx0HZkyqmtYE1Hmv1yUeFt/2PQeCmicJ30iW4GMj+izLRxs2OzpontBabjeg1mMN1hEHLCwz5hZHhqRR3YRvrCEqb5AUrhH6fOJOdsCmJouKZwpfbwOon/fXPSlkNM3RAZl7jS+v6DeN5wqqfm5nlnKrYIEqJbBqYKpAN4eyKuGLBRMjsaJeOpDBBUzWHckBTh8ZExHOuPmiChIYF2MSyUkUJurNCVc0EBSvSCDKdA48jGli8Ff4QRbR9CYoz1DHedoCvMkZAYJc4STJ3zkmEcxJSB7NAdHA54sTqiw+FOAe0fFZ/nPs2DzhyMjof3WHHjh1I4zKOaxWcWZZMPghnhiKQ+ZZ6TGvL7TSajdNlCkp0vArENu+hoZ4RKsycVyDa6Px184YXtsOc2T5gkQ+kzc9dm+Pct7n39WgaCKa2dp+ExFtDx/XcPjUiDeh44flIO05pNsseV0u8/yMPzhPrDcVN2HaHBliK6xZNbg8uL7WEp5BAzml2qw2LGx5XTiL8qtrHJb8zlOiRvjjfwffT/Mbl9clBPR4l7YMBjuBToMLlMCmMfQqAGalYIBjZb0DjH14yeemVScis1oizLPNHPx2kmIXsZoBnjO2a82bO2c9JR9FG9zkQDXXNpXjzzTDt96Ta1dW9pnvVfX7Nx6AYQekRVgaC/66rspDRDlW0+AGiSpY8nWZtIOVxTZs/Gqk9SxFXV0DemaJ5XcmmU5zr6hqGmLMzcVPYtkTf/7yt3Qt0rnN3H+YWaRu4nBdH+yH5b/mvN+Vy1jAAAAAElFTkSuQmCC";
const _imports_8 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAAAfCAMAAAArx+gjAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAAFiUAABYlAUlSJPAAAABIUExURUdwTP///////////////////////////////////////////////////////////////////////////////////////////wV68vgAAAAXdFJOUwC/YHDv34BAIBAwz5BQf8Cwn6Dgj69f5RN0qAAAAk5JREFUSMeNVuma6yAIjbtmaZp2Znz/N71pIgqI9yv/EsDDcgSniUiKaRrIUJPi9KUk8+vyR5ZfzVRhXeylOZgmPMDn2LoDH+oSD9+zykgcPko7rJkRAPUJLOviBhAmM3nU5BTT1JMe3OePQLzK321gXU+Kjits6clP52JxU+qRd9q6R8jqtlS9xo+iymtDqAHY+9sJ5newEvhyZScosqt9aJHtNAkf4mxs+fhknQB8PzVQ3Pzx8RCJn+O8guauYXh1mSnSGI+aoUltXgh8KQgz8YnT5g9aE3MZlLiPkiSCKAc9C0kbRCIHII2XaUNaXyESRUOaE2JGCSEIoXkJe8JNa63TtItzMwxUY2prK8QPJlSiEK6VbSV1wudGAgGXR1cbu3lMKOjFTYcDlUCRgqNYIawSY2mZqxXc4/Tsrgon9IqwYWQMvOKCeHemZ1fEFD4d0wMuhUuogjDFRa/ms9zVLAzgE40ZXym3uoKB4NX5TD01JGOY2IZ0rHol2Ycupg1n1i+FPZJxvI68TAPIL7YTGRnpQrJAIE4oTmEn+TDfuvL+bJ/CKe/Kdtxt06+Yo1/rllLDDLYjhYhkZiCEPQgPAXkodfm+SS8UbkUbRW6T3hpBnBifWx9AIoK4BnaCW6/pul2aD66WIdSQFtvN/WddsoeyZLFJWzWnIaHU0NwLCj3exAKhDGlMv54llSeXkMguECqQxhB5Dl5XnlzC4fODDQIjmXtaUk64NQ9LSGKw/zGvRNR7/ff2iVV68EpsXdy/e03HzZ9i9NfP707+AXyPjEPh43/GAAAAAElFTkSuQmCC";
const _imports_9 = "" + __buildAssetsURL("close.BJrnftKv.png");
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const modules = ref([FreeMode, Navigation, Thumbs]);
    const thumbsSwiper = ref(null);
    const thumbsSwiperSP = ref(null);
    const setThumbsSwiper = (swiper) => {
      thumbsSwiper.value = swiper;
    };
    const setThumbsSwiperSP = (swiper) => {
      thumbsSwiperSP.value = swiper;
    };
    const backnumberInfo = ref(
      [
        [2024, 4],
        [2023, 4],
        [2022, 1],
        [2021, 3]
      ]
    );
    const currentYear = ref(0);
    const isOverlayDisplay = ref(false);
    const iscontentsDisplay = ref(true);
    const isDisplay = () => {
      iscontentsDisplay.value = false;
      setTimeout(() => {
        iscontentsDisplay.value = true;
      }, 200);
    };
    onUpdated(() => {
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Swiper = Swiper;
      const _component_SwiperSlide = SwiperSlide;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "scroll_container" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Swiper, {
        modules: ["SwiperMousewheel" in _ctx ? _ctx.SwiperMousewheel : unref(Mousewheel), "SwiperEffectFade" in _ctx ? _ctx.SwiperEffectFade : unref(EffectFade), "SwiperEffectCube" in _ctx ? _ctx.SwiperEffectCube : unref(EffectCube), "SwiperParallax" in _ctx ? _ctx.SwiperParallax : unref(Parallax)],
        direction: "vertical",
        autoHeight: true,
        slidesPerView: 1,
        mousewheel: {
          enabled: true
        },
        speed: 1e3,
        parallax: true,
        breakpoints: {
          768: {
            direction: "horizontal"
          }
        }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_SwiperSlide, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="scroll_contents fv only-pc" data-swiper-parallax-x="90%" data-swiper-parallax-opacity="0"${_scopeId2}><img class="fv__logo"${ssrRenderAttr("src", _imports_0)} data-swiper-parallax-x="-70%"${_scopeId2}><img class="fv__scroll"${ssrRenderAttr("src", _imports_1)}${_scopeId2}></div><div class="scroll_contents fv only-sp" data-swiper-parallax-y="90%" data-swiper-parallax-opacity="0"${_scopeId2}><img class="fv__logo"${ssrRenderAttr("src", _imports_0)} data-swiper-parallax-y="-70%"${_scopeId2}><img class="fv__scroll"${ssrRenderAttr("src", _imports_1)}${_scopeId2}></div>`);
                } else {
                  return [
                    createVNode("div", {
                      class: "scroll_contents fv only-pc",
                      "data-swiper-parallax-x": "90%",
                      "data-swiper-parallax-opacity": "0"
                    }, [
                      createVNode("img", {
                        class: "fv__logo",
                        src: _imports_0,
                        "data-swiper-parallax-x": "-70%"
                      }),
                      createVNode("img", {
                        class: "fv__scroll",
                        src: _imports_1
                      })
                    ]),
                    createVNode("div", {
                      class: "scroll_contents fv only-sp",
                      "data-swiper-parallax-y": "90%",
                      "data-swiper-parallax-opacity": "0"
                    }, [
                      createVNode("img", {
                        class: "fv__logo",
                        src: _imports_0,
                        "data-swiper-parallax-y": "-70%"
                      }),
                      createVNode("img", {
                        class: "fv__scroll",
                        src: _imports_1
                      })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_SwiperSlide, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="scroll_contents pick_up_01 only-pc" data-swiper-parallax-x="90%" data-swiper-parallax-opacity="0"${_scopeId2}><img class="header__logo"${ssrRenderAttr("src", _imports_2)}${_scopeId2}><img class="pick_up_01__banner slide-in"${ssrRenderAttr("src", _imports_3)} data-swiper-parallax-x="-70%"${_scopeId2}></div><div class="scroll_contents pick_up_01 only-sp" data-swiper-parallax-y="90%" data-swiper-parallax-opacity="0"${_scopeId2}><img class="header__logo"${ssrRenderAttr("src", _imports_2)}${_scopeId2}><img class="pick_up_01__banner slide-in"${ssrRenderAttr("src", _imports_3)} data-swiper-parallax-y="-70%"${_scopeId2}></div>`);
                } else {
                  return [
                    createVNode("div", {
                      class: "scroll_contents pick_up_01 only-pc",
                      "data-swiper-parallax-x": "90%",
                      "data-swiper-parallax-opacity": "0"
                    }, [
                      createVNode("img", {
                        class: "header__logo",
                        src: _imports_2
                      }),
                      createVNode("img", {
                        class: "pick_up_01__banner slide-in",
                        src: _imports_3,
                        "data-swiper-parallax-x": "-70%"
                      })
                    ]),
                    createVNode("div", {
                      class: "scroll_contents pick_up_01 only-sp",
                      "data-swiper-parallax-y": "90%",
                      "data-swiper-parallax-opacity": "0"
                    }, [
                      createVNode("img", {
                        class: "header__logo",
                        src: _imports_2
                      }),
                      createVNode("img", {
                        class: "pick_up_01__banner slide-in",
                        src: _imports_3,
                        "data-swiper-parallax-y": "-70%"
                      })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_SwiperSlide, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="scroll_contents pick_up_02 only-pc" data-swiper-parallax-x="90%" data-swiper-parallax-opacity="0"${_scopeId2}><img class="header__logo"${ssrRenderAttr("src", _imports_2)}${_scopeId2}><img class="pick_up_02__banner slide-in"${ssrRenderAttr("src", _imports_4)} data-swiper-parallax-x="-70%"${_scopeId2}></div><div class="scroll_contents pick_up_02 only-sp" data-swiper-parallax-y="90%" data-swiper-parallax-opacity="0"${_scopeId2}><img class="header__logo"${ssrRenderAttr("src", _imports_2)}${_scopeId2}><img class="pick_up_02__banner slide-in"${ssrRenderAttr("src", _imports_4)} data-swiper-parallax-y="-70%"${_scopeId2}></div>`);
                } else {
                  return [
                    createVNode("div", {
                      class: "scroll_contents pick_up_02 only-pc",
                      "data-swiper-parallax-x": "90%",
                      "data-swiper-parallax-opacity": "0"
                    }, [
                      createVNode("img", {
                        class: "header__logo",
                        src: _imports_2
                      }),
                      createVNode("img", {
                        class: "pick_up_02__banner slide-in",
                        src: _imports_4,
                        "data-swiper-parallax-x": "-70%"
                      })
                    ]),
                    createVNode("div", {
                      class: "scroll_contents pick_up_02 only-sp",
                      "data-swiper-parallax-y": "90%",
                      "data-swiper-parallax-opacity": "0"
                    }, [
                      createVNode("img", {
                        class: "header__logo",
                        src: _imports_2
                      }),
                      createVNode("img", {
                        class: "pick_up_02__banner slide-in",
                        src: _imports_4,
                        "data-swiper-parallax-y": "-70%"
                      })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_SwiperSlide, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="scroll_contents gallery only-pc" data-swiper-parallax-x="90%" data-swiper-parallax-opacity="0"${_scopeId2}><img class="header__logo"${ssrRenderAttr("src", _imports_2)}${_scopeId2}><div class="gallery__wrap" data-swiper-parallax-x="-70%"${_scopeId2}><div class="gallery__links"${_scopeId2}><a${_scopeId2}><img${ssrRenderAttr("src", _imports_5)}${_scopeId2}></a><a${_scopeId2}><img${ssrRenderAttr("src", _imports_6)}${_scopeId2}></a><a${_scopeId2}><img${ssrRenderAttr("src", _imports_7)}${_scopeId2}></a><a${_scopeId2}><img${ssrRenderAttr("src", _imports_8)}${_scopeId2}></a></div><div class="${ssrRenderClass([{ contentsDisplay: unref(iscontentsDisplay) }, "gallery__contents"])}"${_scopeId2}><div${_scopeId2}><a class="swiperClose" style="${ssrRenderStyle(unref(isOverlayDisplay) ? null : { display: "none" })}"${_scopeId2}><img${ssrRenderAttr("src", _imports_9)}${_scopeId2}></a>`);
                  _push3(ssrRenderComponent(_component_Swiper, {
                    class: [{ OverlayDisplay: unref(isOverlayDisplay) }, "mySwiper2 gallery__overlay"],
                    style: {
                      "--swiper-navigation-color": "#fff",
                      "--swiper-navigation-size": "30px"
                    },
                    loop: true,
                    spaceBetween: 10,
                    navigation: true,
                    thumbs: { swiper: unref(thumbsSwiper) },
                    modules: unref(modules)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(unref(backnumberInfo)[unref(currentYear)][1], (n) => {
                          _push4(ssrRenderComponent(_component_SwiperSlide, { key: n }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<img class="gallery__overlayImage slide-in"${ssrRenderAttr("src", "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg")}${_scopeId4}>`);
                              } else {
                                return [
                                  createVNode("img", {
                                    class: "gallery__overlayImage slide-in",
                                    src: "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg"
                                  }, null, 8, ["src"])
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                      } else {
                        return [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(backnumberInfo)[unref(currentYear)][1], (n) => {
                            return openBlock(), createBlock(_component_SwiperSlide, { key: n }, {
                              default: withCtx(() => [
                                createVNode("img", {
                                  class: "gallery__overlayImage slide-in",
                                  src: "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg"
                                }, null, 8, ["src"])
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Swiper, {
                    onSwiper: setThumbsSwiper,
                    spaceBetween: 20,
                    freeMode: true,
                    modules: unref(modules),
                    class: "mySwiper"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(unref(backnumberInfo)[unref(currentYear)][1], (n) => {
                          _push4(ssrRenderComponent(_component_SwiperSlide, { key: n }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<a${_scopeId4}><img${ssrRenderAttr("src", "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg")}${_scopeId4}></a>`);
                              } else {
                                return [
                                  createVNode("a", {
                                    onClick: ($event) => isOverlayDisplay.value = !unref(isOverlayDisplay)
                                  }, [
                                    createVNode("img", {
                                      src: "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg"
                                    }, null, 8, ["src"])
                                  ], 8, ["onClick"])
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                      } else {
                        return [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(backnumberInfo)[unref(currentYear)][1], (n) => {
                            return openBlock(), createBlock(_component_SwiperSlide, { key: n }, {
                              default: withCtx(() => [
                                createVNode("a", {
                                  onClick: ($event) => isOverlayDisplay.value = !unref(isOverlayDisplay)
                                }, [
                                  createVNode("img", {
                                    src: "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg"
                                  }, null, 8, ["src"])
                                ], 8, ["onClick"])
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div></div></div><div class="scroll_contents gallery only-sp" data-swiper-parallax-y="90%" data-swiper-parallax-opacity="0"${_scopeId2}><img class="header__logo"${ssrRenderAttr("src", _imports_2)}${_scopeId2}><div class="gallery__wrap" data-swiper-parallax-y="-70%"${_scopeId2}><div class="gallery__links"${_scopeId2}><a${_scopeId2}><img${ssrRenderAttr("src", _imports_5)}${_scopeId2}></a><a${_scopeId2}><img${ssrRenderAttr("src", _imports_6)}${_scopeId2}></a><a${_scopeId2}><img${ssrRenderAttr("src", _imports_7)}${_scopeId2}></a><a${_scopeId2}><img${ssrRenderAttr("src", _imports_8)}${_scopeId2}></a></div><div class="${ssrRenderClass([{ contentsDisplay: unref(iscontentsDisplay) }, "gallery__contents"])}"${_scopeId2}><a class="swiperClose" style="${ssrRenderStyle(unref(isOverlayDisplay) ? null : { display: "none" })}"${_scopeId2}><img${ssrRenderAttr("src", _imports_9)}${_scopeId2}></a>`);
                  _push3(ssrRenderComponent(_component_Swiper, {
                    class: [{ OverlayDisplay: unref(isOverlayDisplay) }, "mySwiper2 gallery__overlay"],
                    style: {
                      "--swiper-navigation-color": "#fff",
                      "--swiper-navigation-size": "24px"
                    },
                    loop: true,
                    spaceBetween: 10,
                    navigation: true,
                    thumbs: { swiper: unref(thumbsSwiperSP) },
                    modules: unref(modules)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(unref(backnumberInfo)[unref(currentYear)][1], (n) => {
                          _push4(ssrRenderComponent(_component_SwiperSlide, { key: n }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<img class="gallery__overlayImage slide-in"${ssrRenderAttr("src", "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg")}${_scopeId4}>`);
                              } else {
                                return [
                                  createVNode("img", {
                                    class: "gallery__overlayImage slide-in",
                                    src: "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg"
                                  }, null, 8, ["src"])
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                      } else {
                        return [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(backnumberInfo)[unref(currentYear)][1], (n) => {
                            return openBlock(), createBlock(_component_SwiperSlide, { key: n }, {
                              default: withCtx(() => [
                                createVNode("img", {
                                  class: "gallery__overlayImage slide-in",
                                  src: "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg"
                                }, null, 8, ["src"])
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Swiper, {
                    onSwiper: setThumbsSwiperSP,
                    autoHeight: true,
                    spaceBetween: 20,
                    freeMode: true,
                    modules: unref(modules),
                    width: 300,
                    class: "mySwiper"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(unref(backnumberInfo)[unref(currentYear)][1], (n) => {
                          _push4(ssrRenderComponent(_component_SwiperSlide, { key: n }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<a${_scopeId4}><img${ssrRenderAttr("src", "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg")}${_scopeId4}></a>`);
                              } else {
                                return [
                                  createVNode("a", {
                                    onClick: ($event) => isOverlayDisplay.value = !unref(isOverlayDisplay)
                                  }, [
                                    createVNode("img", {
                                      src: "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg"
                                    }, null, 8, ["src"])
                                  ], 8, ["onClick"])
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                      } else {
                        return [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(backnumberInfo)[unref(currentYear)][1], (n) => {
                            return openBlock(), createBlock(_component_SwiperSlide, { key: n }, {
                              default: withCtx(() => [
                                createVNode("a", {
                                  onClick: ($event) => isOverlayDisplay.value = !unref(isOverlayDisplay)
                                }, [
                                  createVNode("img", {
                                    src: "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg"
                                  }, null, 8, ["src"])
                                ], 8, ["onClick"])
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div></div>`);
                } else {
                  return [
                    createVNode("div", {
                      class: "scroll_contents gallery only-pc",
                      "data-swiper-parallax-x": "90%",
                      "data-swiper-parallax-opacity": "0"
                    }, [
                      createVNode("img", {
                        class: "header__logo",
                        src: _imports_2
                      }),
                      createVNode("div", {
                        class: "gallery__wrap",
                        "data-swiper-parallax-x": "-70%"
                      }, [
                        createVNode("div", { class: "gallery__links" }, [
                          createVNode("a", {
                            onClick: ($event) => {
                              currentYear.value = 0;
                              isDisplay();
                            }
                          }, [
                            createVNode("img", { src: _imports_5 })
                          ], 8, ["onClick"]),
                          createVNode("a", {
                            onClick: ($event) => {
                              currentYear.value = 1;
                              isDisplay();
                            }
                          }, [
                            createVNode("img", { src: _imports_6 })
                          ], 8, ["onClick"]),
                          createVNode("a", {
                            onClick: ($event) => {
                              currentYear.value = 2;
                              isDisplay();
                            }
                          }, [
                            createVNode("img", { src: _imports_7 })
                          ], 8, ["onClick"]),
                          createVNode("a", {
                            onClick: ($event) => {
                              currentYear.value = 3;
                              isDisplay();
                            }
                          }, [
                            createVNode("img", { src: _imports_8 })
                          ], 8, ["onClick"])
                        ]),
                        createVNode("div", {
                          class: ["gallery__contents", { contentsDisplay: unref(iscontentsDisplay) }]
                        }, [
                          createVNode("div", null, [
                            withDirectives(createVNode("a", {
                              class: "swiperClose",
                              onClick: ($event) => isOverlayDisplay.value = !unref(isOverlayDisplay)
                            }, [
                              createVNode("img", { src: _imports_9 })
                            ], 8, ["onClick"]), [
                              [vShow, unref(isOverlayDisplay)]
                            ]),
                            createVNode(_component_Swiper, {
                              class: [{ OverlayDisplay: unref(isOverlayDisplay) }, "mySwiper2 gallery__overlay"],
                              style: {
                                "--swiper-navigation-color": "#fff",
                                "--swiper-navigation-size": "30px"
                              },
                              loop: true,
                              spaceBetween: 10,
                              navigation: true,
                              thumbs: { swiper: unref(thumbsSwiper) },
                              modules: unref(modules)
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(unref(backnumberInfo)[unref(currentYear)][1], (n) => {
                                  return openBlock(), createBlock(_component_SwiperSlide, { key: n }, {
                                    default: withCtx(() => [
                                      createVNode("img", {
                                        class: "gallery__overlayImage slide-in",
                                        src: "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg"
                                      }, null, 8, ["src"])
                                    ]),
                                    _: 2
                                  }, 1024);
                                }), 128))
                              ]),
                              _: 1
                            }, 8, ["class", "thumbs", "modules"]),
                            createVNode(_component_Swiper, {
                              onSwiper: setThumbsSwiper,
                              spaceBetween: 20,
                              freeMode: true,
                              modules: unref(modules),
                              class: "mySwiper"
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(unref(backnumberInfo)[unref(currentYear)][1], (n) => {
                                  return openBlock(), createBlock(_component_SwiperSlide, { key: n }, {
                                    default: withCtx(() => [
                                      createVNode("a", {
                                        onClick: ($event) => isOverlayDisplay.value = !unref(isOverlayDisplay)
                                      }, [
                                        createVNode("img", {
                                          src: "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg"
                                        }, null, 8, ["src"])
                                      ], 8, ["onClick"])
                                    ]),
                                    _: 2
                                  }, 1024);
                                }), 128))
                              ]),
                              _: 1
                            }, 8, ["modules"])
                          ])
                        ], 2)
                      ])
                    ]),
                    createVNode("div", {
                      class: "scroll_contents gallery only-sp",
                      "data-swiper-parallax-y": "90%",
                      "data-swiper-parallax-opacity": "0"
                    }, [
                      createVNode("img", {
                        class: "header__logo",
                        src: _imports_2
                      }),
                      createVNode("div", {
                        class: "gallery__wrap",
                        "data-swiper-parallax-y": "-70%"
                      }, [
                        createVNode("div", { class: "gallery__links" }, [
                          createVNode("a", {
                            onClick: ($event) => {
                              currentYear.value = 0;
                              isDisplay();
                            }
                          }, [
                            createVNode("img", { src: _imports_5 })
                          ], 8, ["onClick"]),
                          createVNode("a", {
                            onClick: ($event) => {
                              currentYear.value = 1;
                              isDisplay();
                            }
                          }, [
                            createVNode("img", { src: _imports_6 })
                          ], 8, ["onClick"]),
                          createVNode("a", {
                            onClick: ($event) => {
                              currentYear.value = 2;
                              isDisplay();
                            }
                          }, [
                            createVNode("img", { src: _imports_7 })
                          ], 8, ["onClick"]),
                          createVNode("a", {
                            onClick: ($event) => {
                              currentYear.value = 3;
                              isDisplay();
                            }
                          }, [
                            createVNode("img", { src: _imports_8 })
                          ], 8, ["onClick"])
                        ]),
                        createVNode("div", {
                          class: ["gallery__contents", { contentsDisplay: unref(iscontentsDisplay) }]
                        }, [
                          withDirectives(createVNode("a", {
                            class: "swiperClose",
                            onClick: ($event) => isOverlayDisplay.value = !unref(isOverlayDisplay)
                          }, [
                            createVNode("img", { src: _imports_9 })
                          ], 8, ["onClick"]), [
                            [vShow, unref(isOverlayDisplay)]
                          ]),
                          createVNode(_component_Swiper, {
                            class: [{ OverlayDisplay: unref(isOverlayDisplay) }, "mySwiper2 gallery__overlay"],
                            style: {
                              "--swiper-navigation-color": "#fff",
                              "--swiper-navigation-size": "24px"
                            },
                            loop: true,
                            spaceBetween: 10,
                            navigation: true,
                            thumbs: { swiper: unref(thumbsSwiperSP) },
                            modules: unref(modules)
                          }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(backnumberInfo)[unref(currentYear)][1], (n) => {
                                return openBlock(), createBlock(_component_SwiperSlide, { key: n }, {
                                  default: withCtx(() => [
                                    createVNode("img", {
                                      class: "gallery__overlayImage slide-in",
                                      src: "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg"
                                    }, null, 8, ["src"])
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ]),
                            _: 1
                          }, 8, ["class", "thumbs", "modules"]),
                          createVNode(_component_Swiper, {
                            onSwiper: setThumbsSwiperSP,
                            autoHeight: true,
                            spaceBetween: 20,
                            freeMode: true,
                            modules: unref(modules),
                            width: 300,
                            class: "mySwiper"
                          }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(backnumberInfo)[unref(currentYear)][1], (n) => {
                                return openBlock(), createBlock(_component_SwiperSlide, { key: n }, {
                                  default: withCtx(() => [
                                    createVNode("a", {
                                      onClick: ($event) => isOverlayDisplay.value = !unref(isOverlayDisplay)
                                    }, [
                                      createVNode("img", {
                                        src: "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg"
                                      }, null, 8, ["src"])
                                    ], 8, ["onClick"])
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ]),
                            _: 1
                          }, 8, ["modules"])
                        ], 2)
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_SwiperSlide, null, {
                default: withCtx(() => [
                  createVNode("div", {
                    class: "scroll_contents fv only-pc",
                    "data-swiper-parallax-x": "90%",
                    "data-swiper-parallax-opacity": "0"
                  }, [
                    createVNode("img", {
                      class: "fv__logo",
                      src: _imports_0,
                      "data-swiper-parallax-x": "-70%"
                    }),
                    createVNode("img", {
                      class: "fv__scroll",
                      src: _imports_1
                    })
                  ]),
                  createVNode("div", {
                    class: "scroll_contents fv only-sp",
                    "data-swiper-parallax-y": "90%",
                    "data-swiper-parallax-opacity": "0"
                  }, [
                    createVNode("img", {
                      class: "fv__logo",
                      src: _imports_0,
                      "data-swiper-parallax-y": "-70%"
                    }),
                    createVNode("img", {
                      class: "fv__scroll",
                      src: _imports_1
                    })
                  ])
                ]),
                _: 1
              }),
              createVNode(_component_SwiperSlide, null, {
                default: withCtx(() => [
                  createVNode("div", {
                    class: "scroll_contents pick_up_01 only-pc",
                    "data-swiper-parallax-x": "90%",
                    "data-swiper-parallax-opacity": "0"
                  }, [
                    createVNode("img", {
                      class: "header__logo",
                      src: _imports_2
                    }),
                    createVNode("img", {
                      class: "pick_up_01__banner slide-in",
                      src: _imports_3,
                      "data-swiper-parallax-x": "-70%"
                    })
                  ]),
                  createVNode("div", {
                    class: "scroll_contents pick_up_01 only-sp",
                    "data-swiper-parallax-y": "90%",
                    "data-swiper-parallax-opacity": "0"
                  }, [
                    createVNode("img", {
                      class: "header__logo",
                      src: _imports_2
                    }),
                    createVNode("img", {
                      class: "pick_up_01__banner slide-in",
                      src: _imports_3,
                      "data-swiper-parallax-y": "-70%"
                    })
                  ])
                ]),
                _: 1
              }),
              createVNode(_component_SwiperSlide, null, {
                default: withCtx(() => [
                  createVNode("div", {
                    class: "scroll_contents pick_up_02 only-pc",
                    "data-swiper-parallax-x": "90%",
                    "data-swiper-parallax-opacity": "0"
                  }, [
                    createVNode("img", {
                      class: "header__logo",
                      src: _imports_2
                    }),
                    createVNode("img", {
                      class: "pick_up_02__banner slide-in",
                      src: _imports_4,
                      "data-swiper-parallax-x": "-70%"
                    })
                  ]),
                  createVNode("div", {
                    class: "scroll_contents pick_up_02 only-sp",
                    "data-swiper-parallax-y": "90%",
                    "data-swiper-parallax-opacity": "0"
                  }, [
                    createVNode("img", {
                      class: "header__logo",
                      src: _imports_2
                    }),
                    createVNode("img", {
                      class: "pick_up_02__banner slide-in",
                      src: _imports_4,
                      "data-swiper-parallax-y": "-70%"
                    })
                  ])
                ]),
                _: 1
              }),
              createVNode(_component_SwiperSlide, null, {
                default: withCtx(() => [
                  createVNode("div", {
                    class: "scroll_contents gallery only-pc",
                    "data-swiper-parallax-x": "90%",
                    "data-swiper-parallax-opacity": "0"
                  }, [
                    createVNode("img", {
                      class: "header__logo",
                      src: _imports_2
                    }),
                    createVNode("div", {
                      class: "gallery__wrap",
                      "data-swiper-parallax-x": "-70%"
                    }, [
                      createVNode("div", { class: "gallery__links" }, [
                        createVNode("a", {
                          onClick: ($event) => {
                            currentYear.value = 0;
                            isDisplay();
                          }
                        }, [
                          createVNode("img", { src: _imports_5 })
                        ], 8, ["onClick"]),
                        createVNode("a", {
                          onClick: ($event) => {
                            currentYear.value = 1;
                            isDisplay();
                          }
                        }, [
                          createVNode("img", { src: _imports_6 })
                        ], 8, ["onClick"]),
                        createVNode("a", {
                          onClick: ($event) => {
                            currentYear.value = 2;
                            isDisplay();
                          }
                        }, [
                          createVNode("img", { src: _imports_7 })
                        ], 8, ["onClick"]),
                        createVNode("a", {
                          onClick: ($event) => {
                            currentYear.value = 3;
                            isDisplay();
                          }
                        }, [
                          createVNode("img", { src: _imports_8 })
                        ], 8, ["onClick"])
                      ]),
                      createVNode("div", {
                        class: ["gallery__contents", { contentsDisplay: unref(iscontentsDisplay) }]
                      }, [
                        createVNode("div", null, [
                          withDirectives(createVNode("a", {
                            class: "swiperClose",
                            onClick: ($event) => isOverlayDisplay.value = !unref(isOverlayDisplay)
                          }, [
                            createVNode("img", { src: _imports_9 })
                          ], 8, ["onClick"]), [
                            [vShow, unref(isOverlayDisplay)]
                          ]),
                          createVNode(_component_Swiper, {
                            class: [{ OverlayDisplay: unref(isOverlayDisplay) }, "mySwiper2 gallery__overlay"],
                            style: {
                              "--swiper-navigation-color": "#fff",
                              "--swiper-navigation-size": "30px"
                            },
                            loop: true,
                            spaceBetween: 10,
                            navigation: true,
                            thumbs: { swiper: unref(thumbsSwiper) },
                            modules: unref(modules)
                          }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(backnumberInfo)[unref(currentYear)][1], (n) => {
                                return openBlock(), createBlock(_component_SwiperSlide, { key: n }, {
                                  default: withCtx(() => [
                                    createVNode("img", {
                                      class: "gallery__overlayImage slide-in",
                                      src: "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg"
                                    }, null, 8, ["src"])
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ]),
                            _: 1
                          }, 8, ["class", "thumbs", "modules"]),
                          createVNode(_component_Swiper, {
                            onSwiper: setThumbsSwiper,
                            spaceBetween: 20,
                            freeMode: true,
                            modules: unref(modules),
                            class: "mySwiper"
                          }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(backnumberInfo)[unref(currentYear)][1], (n) => {
                                return openBlock(), createBlock(_component_SwiperSlide, { key: n }, {
                                  default: withCtx(() => [
                                    createVNode("a", {
                                      onClick: ($event) => isOverlayDisplay.value = !unref(isOverlayDisplay)
                                    }, [
                                      createVNode("img", {
                                        src: "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg"
                                      }, null, 8, ["src"])
                                    ], 8, ["onClick"])
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ]),
                            _: 1
                          }, 8, ["modules"])
                        ])
                      ], 2)
                    ])
                  ]),
                  createVNode("div", {
                    class: "scroll_contents gallery only-sp",
                    "data-swiper-parallax-y": "90%",
                    "data-swiper-parallax-opacity": "0"
                  }, [
                    createVNode("img", {
                      class: "header__logo",
                      src: _imports_2
                    }),
                    createVNode("div", {
                      class: "gallery__wrap",
                      "data-swiper-parallax-y": "-70%"
                    }, [
                      createVNode("div", { class: "gallery__links" }, [
                        createVNode("a", {
                          onClick: ($event) => {
                            currentYear.value = 0;
                            isDisplay();
                          }
                        }, [
                          createVNode("img", { src: _imports_5 })
                        ], 8, ["onClick"]),
                        createVNode("a", {
                          onClick: ($event) => {
                            currentYear.value = 1;
                            isDisplay();
                          }
                        }, [
                          createVNode("img", { src: _imports_6 })
                        ], 8, ["onClick"]),
                        createVNode("a", {
                          onClick: ($event) => {
                            currentYear.value = 2;
                            isDisplay();
                          }
                        }, [
                          createVNode("img", { src: _imports_7 })
                        ], 8, ["onClick"]),
                        createVNode("a", {
                          onClick: ($event) => {
                            currentYear.value = 3;
                            isDisplay();
                          }
                        }, [
                          createVNode("img", { src: _imports_8 })
                        ], 8, ["onClick"])
                      ]),
                      createVNode("div", {
                        class: ["gallery__contents", { contentsDisplay: unref(iscontentsDisplay) }]
                      }, [
                        withDirectives(createVNode("a", {
                          class: "swiperClose",
                          onClick: ($event) => isOverlayDisplay.value = !unref(isOverlayDisplay)
                        }, [
                          createVNode("img", { src: _imports_9 })
                        ], 8, ["onClick"]), [
                          [vShow, unref(isOverlayDisplay)]
                        ]),
                        createVNode(_component_Swiper, {
                          class: [{ OverlayDisplay: unref(isOverlayDisplay) }, "mySwiper2 gallery__overlay"],
                          style: {
                            "--swiper-navigation-color": "#fff",
                            "--swiper-navigation-size": "24px"
                          },
                          loop: true,
                          spaceBetween: 10,
                          navigation: true,
                          thumbs: { swiper: unref(thumbsSwiperSP) },
                          modules: unref(modules)
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(backnumberInfo)[unref(currentYear)][1], (n) => {
                              return openBlock(), createBlock(_component_SwiperSlide, { key: n }, {
                                default: withCtx(() => [
                                  createVNode("img", {
                                    class: "gallery__overlayImage slide-in",
                                    src: "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg"
                                  }, null, 8, ["src"])
                                ]),
                                _: 2
                              }, 1024);
                            }), 128))
                          ]),
                          _: 1
                        }, 8, ["class", "thumbs", "modules"]),
                        createVNode(_component_Swiper, {
                          onSwiper: setThumbsSwiperSP,
                          autoHeight: true,
                          spaceBetween: 20,
                          freeMode: true,
                          modules: unref(modules),
                          width: 300,
                          class: "mySwiper"
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(backnumberInfo)[unref(currentYear)][1], (n) => {
                              return openBlock(), createBlock(_component_SwiperSlide, { key: n }, {
                                default: withCtx(() => [
                                  createVNode("a", {
                                    onClick: ($event) => isOverlayDisplay.value = !unref(isOverlayDisplay)
                                  }, [
                                    createVNode("img", {
                                      src: "https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/" + unref(backnumberInfo)[unref(currentYear)][0] + "_0" + n + ".jpg"
                                    }, null, 8, ["src"])
                                  ], 8, ["onClick"])
                                ]),
                                _: 2
                              }, 1024);
                            }), 128))
                          ]),
                          _: 1
                        }, 8, ["modules"])
                      ], 2)
                    ])
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-CtAlqvht.mjs').then((r) => r.default || r));
    const _Error = defineAsyncComponent(() => import('./error-500-DNEIr9Dd.mjs').then((r) => r.default || r));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ErrorComponent = _sfc_main$1;
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RootComponent = _sfc_main;
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(RootComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error = nuxt.payload.error || createError(error);
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { useRuntimeConfig as a, entry$1 as default, injectHead as i, navigateTo as n, resolveUnrefHeadInput as r, useRouter as u };
//# sourceMappingURL=server.mjs.map
