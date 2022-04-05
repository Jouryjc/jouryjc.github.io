# 授人予渔，如何调试 CLI 代码？

大家好，我是码农小余。在正式开始之前，先来了解调试 CLI 工具源码时的前期准备工作。读者可以跟着步骤在自己的 PC 上准备好调试环境，每读完一个小节，建议都去单独调试、走一遍流程，学习效果会更佳哦！

![](/Users/yjcjour/Documents/code/blog/docs/node/vite/img/ready/visualstudiocodelogo.png)

## 前期准备

对于如何阅读 Vite 之类的 node CLI 工具的代码可能很多童鞋不清楚，所以在正式进入 debugger 之前，我将从以下三步来准备 debugger 环境：

1. 第一步，fork vite repository & git clone；
2. pnpm build，构建项目；
3. pnpm link，使当前本地包可在系统范围内或其他位置访问；
4. ⚠️ 建立最小 DEMO；
5. 打断点，用 javascript debugger terminal 执行 dev，开启我们的调试；

### fork vite repository & git clone

![](/Users/yjcjour/Documents/code/blog/docs/node/vite/img/fork-repository.png)

Fork repository 后可以在源码中随便添加注释（:warning:注意是在源码中，不要在构建之后的代码写过多的注释。这样即使不小心执行了 pnpm build，注释还是能够保留）。

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

可以看到我们的打包命令是 build，但是 run-s 是什么鬼？它是 [npm-run-all](https://github.com/mysticatea/npm-run-all) 的一条命令。[run-s](https://github.com/mysticatea/npm-run-all/blob/master/docs/run-s.md) 的作用就是按顺序执行 build-bundle、 build-types：

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

可以看到，传了 [w](https://rollupjs.org/guide/en/#command-line-flags) 或者 [watch](https://rollupjs.org/guide/en/#command-line-flags) 参数，就是 DEV 模式。我们要调试源码，自然是需要开启 sourcemap 功能来辅助定位源码位置。所以我们执行以下命令进行构建：

```sh
pnpm run dev
```

### pnpm link

构建完之后就可以将 vite 命令软链到全局，进入到 packages/vite 下，执行

```sh
pnpm link --global
```

对于 pnpm CLI 不熟悉的可以看下[官方文档](https://pnpm.io/zh/cli/link)。

### ⚠️ 建立最小 DEMO

这一步非常关键。在一个使用了各种插件，配置了各种参数的大项目去调试，会有大量的逻辑分支干扰去理解主流程，这无疑会增加心智负担，劝退指数 +10086。所以对于我们想探索的功能，建立一个满足条件的最小 DEMO 去进行调试，屏蔽干扰项，只关注核心主流程，调试过程就会顺畅许多，所以我们基于 vanilla 模板去建立 DEMO：

```shell
pnpm create vite main-process -- --template vanilla
```

然后按照提示进行项目初始化：

```shell
cd main-process

pnpm install
```

### 断点 & dev

安装了 DEMO 的依赖，接下来就可以在你想要了解的流程入口打上断点。比如小余想了解 vite dev 下是怎么创建服务的，在 packages/vite/src/node/cli.ts 找到 dev 这个 action，标记一个断点：

![](/Users/yjcjour/Documents/code/blog/docs/node/vite/img/create-server.png)

标记完断点之后，我们一般还可以先查看 CLI 工具的 help 参数，执行

```sh
vite --help
```

会得到下面截图的信息：

![](/Users/yjcjour/Documents/code/blog/docs/node/vite/img/vite-help.png)

依据截图，我们知道小册调试的是 2.8.4 版本的 vite；最最最关键的是下面这两个参数——debug 和 filter，debug 开启调试日志。我们知道 vite 源码中有大量的 debug('xxx') 之类的日志信息，这部分能够很好地帮助我们理解源码。filter 能帮过滤日志信息，类似 linux 的 grep 命令。

最后进入 DEMO 根目录，用快捷按钮或者在 JavaScript Debug Terminal 执行 dev：

![](/Users/yjcjour/Documents/code/blog/docs/node/vite/img/debugger-dev.png)

上图中可以看到，我们在 vite 上加了 debug 参数，这是开启了 debug 模式，有大量的辅助日志帮助我们梳理、理解整个流程（小技巧，当自己开发的命令行工具，也要考虑**可调试性**这一块的需求，考虑怎样的日志记录能够让你迅速定位到异常。）如下图所示：

![](/Users/yjcjour/Documents/code/blog/docs/node/vite/img/ready/vite-debug-mode.png)

最后顺利进入到断点。如下图所示：

![](/Users/yjcjour/Documents/code/blog/docs/node/vite/img/enter-debugger.png)

到这里就完成了前期的准备工作。

## 总结

本文一步一步分享如何做 CLI 工具的 debugger 前期环境准备，中间接触到了我们工作中可能会用到的内容：

- pnpm 做包管理；
- npm-run-all 做 npm 命令的管理；

最后顺利进入到了源码断点。 下一小节，我们就正式进入源码，了解 Vite 是如何创建 server 的。
