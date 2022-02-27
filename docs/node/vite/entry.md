# Vite 源码解读

大家好，我是码农小余。Vite 在 2021 年冉冉升起，在构建工具中的排行第一，在整个最受欢迎 TOP 10 中也是排行第二。

![](/Users/yjcjour/Documents/code/blog/docs/node/vite/img/rising-stars.png)

如此火热的构建工具，到底存在哪些魔力呢？接下来小余将整一个 Vite 源码分析系列，带你深入了解这个引领生态的构建工具。

在正式开始之前，先简单分享小余看这种工具源码时的前期准备工作。

## 前期准备

对于如何阅读 Vite 之类的 node CLI 工具的代码可能很多童鞋不清楚，所以在正式进入 debugger 之前，我将从以下三步来准备 debugger 环境：

1. 第一步，fork vite repository & git clone；
2. pnpm build，构建项目；
3. pnpm link，使当前本地包可在系统范围内或其他位置访问；
4. 建立最小 DEMO；
5. 打断点，用 javascript debugger terminal 执行 dev，开启我们的调试；

### fork vite repository & git clone

![](/Users/yjcjour/Documents/code/blog/docs/node/vite/img/fork-repository.png)

Fork repository 后可以在源码中随便添加注释（:warning: 是在源码中，不要在打包构建之后的代码。这样即使不小心执行了 pnpm build，注释还是能够保留）。

Fork 完成之后，就会进入到你个人账号对应的 Vite 项目中，然后就可以执行 git clone xxx 将项目拉到本地。

![](/Users/yjcjour/Documents/code/blog/docs/node/vite/img/git-clone.png)

clone 完成之后，第一步就结束了。

### pnpm build

进入到源码目录里面，可以看到 vite 是用 [pnpm](https://pnpm.io/zh/) 作包管理。所以我们执行

```shell
pnpm install
```

依赖安装完之后，就可以构建工具了。进入到 packages/vite/package.json ，看 scripts 的命令：

```json
{
  "name": "vite",
  "version": "2.8.4",
  "license": "MIT",
  "author": "Evan You",
  "description": "Native-ESM powered web dev build tool",
  "bin": {
    "vite": "bin/vite.js"
  },
  "main": "dist/node/index.js",
  "types": "dist/node/index.d.ts",
 	// ...
  "scripts": {
    "dev": "rimraf dist && rollup -c -w",
    "build": "rimraf dist && npm run lint && run-s build-bundle build-types",
    "build-bundle": "rollup -c",
    "build-types": "run-s build-temp-types patch-types roll-types",
    "build-temp-types": "tsc --emitDeclarationOnly --outDir temp/node -p src/node",
    "ci-build": "rimraf dist && run-s build-bundle build-types",
    "patch-types": "ts-node scripts/patchTypes.ts",
    "roll-types": "api-extractor run && rimraf temp",
    "lint": "eslint --ext .ts src/**",
    "format": "prettier --write --parser typescript \"src/**/*.ts\"",
    "prepublishOnly": "npm run build"
  },
  // ...
}

```

可以看到我们的打包命令是 build，但是 run-s 是什么鬼？它是 [npm-run-all](https://github.com/mysticatea/npm-run-all) 包的一条 CLI。[run-s](https://github.com/mysticatea/npm-run-all/blob/master/docs/run-s.md) 的作用就是按顺序执行 build-bundle、 build-types：

```shell
run-s build-bundle build-types

// 等价于
pnpm run build-bundle && pnpm run build-types
```

了解完 build 的逻辑之后，我们先不执行构建。我们注意 dev 这条命令，相较于 build-bundle，多了一个 -w 参数。我们进到 rollup.config.js 中看有什么逻辑处理：

```javascript
/**
 *
 * @param {boolean} isProduction
 * @returns {import('rollup').RollupOptions}
 */
const createNodeConfig = (isProduction) => {
  /**
   * @type { import('rollup').RollupOptions }
   */
  const nodeConfig = {
    ...sharedNodeOptions,
    input: {
      index: path.resolve(__dirname, 'src/node/index.ts'),
      cli: path.resolve(__dirname, 'src/node/cli.ts')
    },
    output: {
      ...sharedNodeOptions.output,
      // 在 dev 模式下开启 sourcemap
      sourcemap: !isProduction
    },
    external: [
      'fsevents',
      ...Object.keys(require('./package.json').dependencies),
      ...(isProduction
        ? []
        : Object.keys(require('./package.json').devDependencies))
    ],
    plugins: [
      // ...
    ]
  }

  return nodeConfig
}

export default (commandLineArgs) => {
  // watch 模式下 isDev 是 true，isProduction 就是 false
  const isDev = commandLineArgs.watch
  const isProduction = !isDev

  return [
    envConfig,
    clientConfig,
    createNodeConfig(isProduction),
    ...(isProduction ? [terserConfig] : [])
  ]
}
```

可以看到，传了 [w](https://rollupjs.org/guide/en/#command-line-flags) 或者 [watch](https://rollupjs.org/guide/en/#command-line-flags) 参数，就是 DEV 模式。我们要调试源码，自然是需要开启 sourcemap 来查看源码滴。所以我们执行以下命令进行构建：

```sh
pnpm run dev
```

### pnpm link

构建完之后就可以将 vite 命令软链到全局，对于 pnpm CLI 不熟悉的可以看下[官方文档](https://pnpm.io/zh/cli/link)。

### 建立最小 DEMO

这一步非常关键。在一个使用了各种插件，配置了各种参数的大项目去调试，会有大量的逻辑分支干扰去理解主流程，这无疑会增加心智负担，劝退指数 +10086。所以对于我们想探索的功能，建立一个满足条件的最小 DEMO 去进行 Debugger 会顺畅很多，所以我们基于 vanilla 模板去建立 DEMO：

```shell
pnpm create vite main-process -- --template vanilla
```

然后按照提示进行项目初始化：

```shell
cd main-process

pnpm install
```

### 断点 & dev

安装了 DEMO 的依赖，接下来就可以在你想要了解的流程入口打上断点。比如小余想了解 vite dev 下是怎么创建服务的，就在 packages/vite/src/node/cli.ts 的 dev 命令下打个断点：

![](/Users/yjcjour/Documents/code/blog/docs/node/vite/img/create-server.png)

最后进入 DEMO 根目录，用快捷按钮或者在 JavaScript Debug Terminal 执行 dev

![](/Users/yjcjour/Documents/code/blog/docs/node/vite/img/debugger-dev.png)

我们就能顺利进入到断点。如下图所示。

![](/Users/yjcjour/Documents/code/blog/docs/node/vite/img/enter-debugger.png)

至此就完成了前期的准备。

## 总结

本文一步一步分享如何做 CLI 工具的 debugger 前期环境准备，中间接触到了 pnpm 做包管理、npm-run-all 做 npm 命令的管理、rollup 的打包传参等。最后顺利进入到了源码断点，接下来小余将从以下几方面对 Vite 源码进行分享：

- 如何创建 dev 下的 server；
- 解析配置 resolveConfig；
- 插件容器；
- module resolve，模块解析；
- 热更原理；
- 如何实现预编译；

关注码农小余，跟我一起深入学习 Vite 的原理。 
