# 插件容器，管理着你的插件

大家好，我是码农小余。上一小节我们了解 ModuleGraph，知道它在解析、加载、转换模块时都会用到 pluginContainer 的 API。但是具体 pluginContainer 有哪些能力？Vite 的插件与 rollup 的插件又有什么关系？本文就来揭晓这些问题的答案。

按照惯例，我们先举一个插件最小 [DEMO](https://github.com/Jouryjc/vite/tree/main/examples/plugin-container)：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { VitePluginBaz } from './plugins/vite-plugin-baz'

export default defineConfig({
  plugins: [
    VitePluginBaz(),
    
    {
      name: 'foo',

      buildStart (ctx) {
        console.log('foo')
      }
    },
    async () => {
      return {
        name: 'bar',

        buildStart (ctx) {
          console.log(ctx.name)
          console.log('bar plugin')
        }
      }
    }
  ]
})

// ./plugins/vite-plugin-baz
import { Plugin } from 'vite'

export const VitePluginBaz = (): Plugin => {
  return {
    name: 'baz',

    buildStart (ctx) {
      console.log('baz')
    }
  }
}
```

上述代码，我们在 vite.config.ts 中使用了 3 个插件——foo、bar、baz。foo、bar 直接在 vite.config.ts 中定义，baz 从外部文件引入，并都定义 buildStart 钩子。

```typescript
// 接收传入配置创建服务
export async function createServer(
  inlineConfig: InlineConfig = {}
): Promise<ViteDevServer> {
  // 从 CLI + 默认参数中获取 development 或 server 的 config
  const config = await resolveConfig(inlineConfig, 'serve', 'development')

  // ...
  const watcher = chokidar.watch(path.resolve(root), {
    // ...
  }) as FSWatcher
  
  // 初始化模块图谱
  const moduleGraph: ModuleGraph = new ModuleGraph((url, ssr) =>
    container.resolveId(url, undefined, { ssr })
  )
  
  // 创建插件容器
  const container = await createPluginContainer(config, moduleGraph, watcher)

  // ...
  
  if (!middlewareMode && httpServer) {
   
    httpServer.listen = (async (port: number, ...args: any[]) => {
      if (!isOptimized) {
        try {
          // 插件容器初始化
          await container.buildStart({})
          // ...
        }
        // ...
      }
      return listen(port, ...args)
    }) as any
  }

  return server
}
```

经过 resolveConfig 处理之后，紧接着 chokidar.watch 实例了一个文件监控实例，通过 ModuleGraph 类实例化一个模块图，之后就看到了本小节的核心——通过 createPluginContainer 创建插件容器，传入了整个配置 config、模块图 moduleGraph 和文件监控实例 watcher。

下面是例子中 3 个参数的截图：

**config**：resolveConfig 返回的结果：

![](./img/plugin-container/config-image.png)

**moduleGraph**：ModuleGraph 的一个实例：

![](./img/plugin-container/module-graph.png)

**watcher**：通过 chokidar 兼容当前目录的实例：

![](./img/plugin-container/watcher.png)

有了上述三个参数，我们就能通过调用 createPluginContainer 创建插件容器：

```typescript
/**
 * 创建插件容器
 * @param config 解析后的配置 
 * @param moduleGraph 模块依赖对象
 * @param watcher 文件监听实例
 * @returns 容器对象
 */
export async function createPluginContainer(
  { plugins, logger, root, build: { rollupOptions } }: ResolvedConfig,
  moduleGraph?: ModuleGraph,
  watcher?: FSWatcher
): Promise<PluginContainer> {
  // ...
  // 监听文件数组
  const watchFiles = new Set<string>()

  // 获取 rollup 的版本
  const rollupPkgPath = resolve(require.resolve('rollup'), '../../package.json')

  // 最小上下文信息
  const minimalContext: MinimalPluginContext = {
    meta: {
      rollupVersion: JSON.parse(fs.readFileSync(rollupPkgPath, 'utf-8'))
        .version,
      watchMode: true
    }
  }

  // 使用了不兼容 vite 的插件告警函数
  function warnIncompatibleMethod(method: string, plugin: string) {
    // ...
  }

  const ModuleInfoProxy: ProxyHandler<ModuleInfo> = {
    // ...
  }

  // same default value of "moduleInfo.meta" as in Rollup
  const EMPTY_OBJECT = Object.freeze({})

  function getModuleInfo(id: string) {
    // ...
  }

  function updateModuleInfo(id: string, { meta }: { meta?: object | null }) {
    // ...
  }

  // 插件上下文插件，实现了 rollup 插件的接口
  class Context implements PluginContext {
    meta = minimalContext.meta
    ssr = false
    _activePlugin: Plugin | null
    _activeId: string | null = null
    _activeCode: string | null = null
    _resolveSkips?: Set<Plugin>
    _addedImports: Set<string> | null = null

    constructor(initialPlugin?: Plugin) {
      this._activePlugin = initialPlugin || null
    }

    /**
     * 编译代码
     */
    parse(code: string, opts: any = {}) {
      // ...
    }

    async resolve(
      id: string,
      importer?: string,
      options?: { skipSelf?: boolean }
    ) {
      // ...
    }

    getModuleInfo(id: string) {
      return getModuleInfo(id)
    }

    getModuleIds() {
      return moduleGraph
        ? moduleGraph.idToModuleMap.keys()
        : Array.prototype[Symbol.iterator]()
    }

    /**
     * 添加热更监听文件
     */
    addWatchFile(id: string) {
      watchFiles.add(id)
      ;(this._addedImports || (this._addedImports = new Set())).add(id)
      if (watcher) ensureWatchedFile(watcher, id, root)
    }

    /**
     * 获取全部热更文件
     */
    getWatchFiles() {
      return [...watchFiles]
    }

    emitFile(assetOrFile: EmittedFile) {
      warnIncompatibleMethod(`emitFile`, this._activePlugin!.name)
      return ''
    }

    setAssetSource() {
      warnIncompatibleMethod(`setAssetSource`, this._activePlugin!.name)
    }

    getFileName() {
      warnIncompatibleMethod(`getFileName`, this._activePlugin!.name)
      return ''
    }

    warn(
      e: string | RollupError,
      position?: number | { column: number; line: number }
    ) {
      // ...
    }

    error(
      e: string | RollupError,
      position?: number | { column: number; line: number }
    ): never (
      throw formatError(e, position, this)
    }
  }

  function formatError(
    e: string | RollupError,
    position: number | { column: number; line: number } | undefined,
    ctx: Context
  ) {
    // ...
  }

	// 文件编译上下文插件
  class TransformContext extends Context {
    // ...
  }

  let closed = false

  // 定义插件容器 -> rollup 构建钩子
  const container: PluginContainer = {
    options: await (async () => {
      // ...
    })(),

    getModuleInfo,

    async buildStart() {
      // ...
    },

    async resolveId(rawId, importer = join(root, 'index.html'), options) {
      // ...
    },

    async load(id, options) {
      // ...
    },

    async transform(code, id, options) {
      // ...
    },

    async close() {
      // ...
    }
  }

  return container
}
```

直接看上面的代码逻辑非常清晰，定义了 Context 和 TransformContext 两个类，TransformContext 是 Context 的子类，Context 实现了 PluginContext 接口。PluginContext 是从 rollup 包导入的。所以 vite 的插件跟 rollup 的插件基本一致，但也不是完全兼容。

对于不兼容的方法通过 warnIncompatibleMethod 发出告警，比如 emitFile、setAssetSource、getFileName 这几个方法都是在 Vite 的插件上下文中不能使用的，如果无意使用它们，也会得到对应的 warning 信息。我们来试试，在 vite-plugin-baz 插件中调用一下 getFileName：

```typescript
// ./plugins/vite-plugin-baz
import { Plugin } from 'vite'

export const VitePluginBaz = (): Plugin => {
  return {
    name: 'baz',

    buildStart (ctx) {
      console.log('baz')
      const filename = this.getFileName()
      console.log(filename)
    }
  }
}
```

执行 dev ，我们会得到以下 warning：

![](./img/plugin-container/incompatible-hook-api.png)

关于 container 的 API 与 MinimalPluginContext、Context 和 TransformContext 的关系，我们可以用下面这张图去总结：

![](./img/plugin-container/container-context-transformcontext.png)

pluginContainer 暴露了 options、getModuleInfo、buildStart、resolveId、load、close、transform 等我们在写 Vite 插件时非常熟悉的钩子；除了这些跟 rollup 如出一辙的钩子之外，我们在 [你知道 Vite 默默地帮你配置什么吗？](./你知道 Vite 默默地帮你配置什么吗？.md) 中还知道 config、configResolved 钩子，在 [敲下命令后，Vite 做了哪些事？](./敲下命令后，Vite 做了哪些事？.md) 中知道 transformIndexHtml 和 configureServer 钩子，在后续的 `揭开 HMR 面纱，了解它的技术原理（上）`中会接触到热更时的钩子 handleHotUpdate。 

这些钩子的实现大部分都依赖于 rollup 插件钩子的实现，现在就通过分析钩子源码，具体看看 Vite 是如何利用 Rollup 能力的。

### options

```typescript
const minimalContext: MinimalPluginContext = {
  meta: {
    rollupVersion: JSON.parse(fs.readFileSync(rollupPkgPath, 'utf-8'))
    .version,
    watchMode: true
  }
}

// ...

options: await (async () => {
  // 用户从 build.rollupOptions 自定义 Rollup 底层配置
  let options = rollupOptions
  // 调用插件的 options 方法，调用上下文是 minimalContext
  for (const plugin of plugins) {
    if (!plugin.options) continue
    options =
      (await plugin.options.call(minimalContext, options)) || options
  }
  // https://rollupjs.org/guide/en/#acorninjectplugins
  // 能够给 rollup 底层的编译器配置插件
  if (options.acornInjectPlugins) {
    parser = acorn.Parser.extend(options.acornInjectPlugins as any)
  }
  return {
    acorn,
    acornInjectPlugins: [],
    ...options
  }
})(),
```

options 是一个异步的立即执行函数，从 build.rollupOptions 中获取 rollupOptions 的配置项，然后作为参数调用插件的 options 钩子。执行插件钩子函数上下文是 minimalContext，它的 meta 属性出自 rollup 中的 PluginContextMeta 类型。还能够通过 [acornInjectPlugins](https://rollupjs.org/guide/en/#acorninjectplugins) 给底层的 acorn 编译器注入插件。最终返回编译器、acorn 插件列表以及最终传给 rollup.rollup 选项参数。

### getModuleInfo

```typescript
const ModuleInfoProxy: ProxyHandler<ModuleInfo> = {
  get(info: any, key: string) {
    if (key in info) {
      return info[key]
    }
    throw Error(
      `[vite] The "${key}" property of ModuleInfo is not supported.`
    )
  }
}

// same default value of "moduleInfo.meta" as in Rollup
const EMPTY_OBJECT = Object.freeze({})

function getModuleInfo(id: string) {
  // 通过 id 去获取模块
  const module = moduleGraph?.getModuleById(id)
  if (!module) {
    return null
  }
  // module.info 的类型来自 rollup 的 ModuleInfo
  if (!module.info) {
    // 不存在的话通过 Proxy 给出友好的提示信息
    module.info = new Proxy(
      { id, meta: module.meta || EMPTY_OBJECT } as ModuleInfo,
      ModuleInfoProxy
    )
  }
  return module.info
}
```

getModuleInfo 钩子通过 moduleGraph.getModuleById 完成模块获取功能。如果没有获取到对应的 module.info，就会通过代理 `{ id, meta: module.meta || EMPTY_OBJECT }` 对象返回 info 属性。代理的作用是在获取不存在的属性时给出 Error 提示。

### buildStart

```typescript
async buildStart() {
  await Promise.all(
    // 递归调用插件的 buildStart 钩子，可以是 promise 函数
    // 上下文是 rollup 插件上下文 Context 实例，参数是
    plugins.map((plugin) => {
      if (plugin.buildStart) {
        return plugin.buildStart.call(
          new Context(plugin) as any,
          container.options as NormalizedInputOptions
        )
      }
    })
  )
},
```

buildStart 钩子在服务启动前调用，钩子逻辑很清晰，循环调用每个插件的 buildStart 钩子，并且执行上下文是 Context 的实例，参数是立即执行函数 container.options 的返回值。

### resovleId

```typescript
/**
 * 解析模块 id
 * @param {string} rawId 在代码中的 id 写法
 * @param {string} importer 引入者，默认是根路径的 index.html
 * @param {PluginContainer.resolveId}
 */
async resolveId(rawId, importer = join(root, 'index.html'), options) {
  const skip = options?.skip
  const ssr = options?.ssr
  // 创建函数执行上下文，根据上图 Context 是 Vite 继承于 rollup 的 PluginContext
  const ctx = new Context()
  ctx.ssr = !!ssr
  ctx._resolveSkips = skip

  let id: string | null = null
  const partial: Partial<PartialResolvedId> = {}
  // 循环调用插件的 resolveId 钩子
  for (const plugin of plugins) {
    // 未定义 resolveId 钩子函数
    if (!plugin.resolveId) continue
    // 跳过
    if (skip?.has(plugin)) continue

    ctx._activePlugin = plugin

    // 执行插件的 resolveId 函数
    const result = await plugin.resolveId.call(
      ctx as any,
      rawId,
      importer,
      { ssr }
    )
    if (!result) continue

    // 处理返回值
    if (typeof result === 'string') {
      id = result
    } else {
      id = result.id
      Object.assign(partial, result)
    }

    // resolveId() is hookFirst - first non-null result is returned.
    break
  }

  // ...

  if (id) {
    partial.id = isExternalUrl(id) ? id : normalizePath(id)
    return partial as PartialResolvedId
  } else {
    return null
  }
}
```

resolveId 非常重要，在整个 Vite 流程随处可见。不管是预构建、 css、请求编译、转换流程等都能够看到 id 的解析，都是通过调用插件的 resolveId 函数。上述代码可以看到，执行 resolveId 的上下文也是 Context 的实例，参数是对应模块的 id 以及引用这个模块的对象 importer，最后返回的 id 如果是外链，就直接返回；否则就做路径的规范化，输出绝对路径。

### load

```typescript
function updateModuleInfo(id: string, { meta }: { meta?: object | null }) {
  if (meta) {
    const moduleInfo = getModuleInfo(id)
    if (moduleInfo) {
      moduleInfo.meta = { ...moduleInfo.meta, ...meta }
    }
  }
}

async load(id, options) {
  const ssr = options?.ssr
  const ctx = new Context()
  ctx.ssr = !!ssr
  
  for (const plugin of plugins) {
    if (!plugin.load) continue
    ctx._activePlugin = plugin
    const result = await plugin.load.call(ctx as any, id, { ssr })
    if (result != null) {
      if (isObject(result)) {
        updateModuleInfo(id, result)
      }
      return result
    }
  }
  return null
}
```

在 [模块之间的依赖关系是一个图](模块之间的依赖关系是一个图.md) 中我们讲到了在模块编译转换时，会触发 load 钩子去获取模块代码和 map。load 钩子也非常简单，拿到模块 id，依次调用所有插件的 load 钩子，执行上下文依然是 Context 实例。如果返回值不为空并且是对象的话，就去更新模块的 meta 属性。对于模块有任何的自定义属性，都可以在 load 钩子中返回 meta 字段去存储。

### close

```typescript
 async close() {
   // 已经关闭了，就啥都不用处理了
   if (closed) return
   const ctx = new Context()
   // 循环调用插件的 buildEnd 钩子
   await Promise.all(
     plugins.map((p) => p.buildEnd && p.buildEnd.call(ctx as any))
   )
   // 循坏调用插件的 closeBundle 钩子
   await Promise.all(
     plugins.map((p) => p.closeBundle && p.closeBundle.call(ctx as any))
   )
   closed = true
 }
```

Vite 将 rollup 插件的 buildEnd 和 closeBundle 两个钩子都封装在 close 函数中。 [buildEnd](https://rollupjs.org/guide/en/#buildend)、[closeBundle](https://rollupjs.org/guide/en/#closebundle) 执行的上下文是 Context 实例 ，也复用了 rollup 的插件能力；

### transform

```typescript
async transform(code, id, options) {
 	// ...
  // 通过 TransformContext 创建转换上下文
  const ctx = new TransformContext(id, code, inMap as SourceMap)
  
  for (const plugin of plugins) {
    if (!plugin.transform) continue
   
    // ...
    let result: TransformResult | string | undefined
    try {
      result = await plugin.transform.call(ctx as any, code, id, { ssr })
    } catch (e) {
      ctx.error(e)
    }
    if (!result) continue
    // ...
    if (isObject(result)) {
      if (result.code !== undefined) {
        code = result.code
        if (result.map) {
          ctx.sourcemapChain.push(result.map)
        }
      }
      updateModuleInfo(id, result)
    } else {
      code = result
    }
  }
  return {
    code,
    map: ctx._getCombinedSourcemap()
  }
}
```

transform 钩子用于对 load 钩子返回的 code 做最后的转换。跟上述钩子不一样时，transform 钩子函数执行上下文是 TransformContext 的实例。TransformContext 继承 Context，有更多关于 sourcemap 的处理能力。调用 transform 获取 result 后，将 result.map 推到 sourcemapChain 中，然后跟 load 钩子一样也可以更新模块的 meta 属性，最终返回 code、map。

## 总结

在 createServer 主流程中，我们知道了在解析完配置、创建 moduleGraph、文件监听器后，就会创建插件容器。

在 createPluginContainer 内部，定义了 3 个 Vite 的上下文，分别是 MinimalPluginContext、Context 以及 TransformContext。MinimalPluginContext 直接复用 rollup，Context 复用了 rollup 的 PluginContext 的绝大部分能力，但是也有不兼容的情况，比如 emitFile、setAssetSource、getFileName 这三个钩子在 Vite 中都不使用。

然后我们通过深入插件容器中的每一个 API，知道了插件容器就是在管理 config.plugins，执行到对应的钩子时，就会去遍历 config.plugins 列表依次调用钩子函数，函数执行上下文都基于 rollup，这就完成了能力复用。现在再回头看 Vite 与 rollup 的插件关系图：

![](./img/plugin-container/container-context-transformcontext.png)

是否更加明确了？
