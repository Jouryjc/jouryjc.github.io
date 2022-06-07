import { defineConfig } from "vitepress"
import type { DefaultTheme } from 'vitepress'

export default defineConfig({
  title: '码农小余',
  description: '分享前端技术，算法、工程化、源码。',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.jpeg' }]],
  lang: 'zh-CN',
  lastUpdated: true,
  themeConfig: {
    algolia: {
      apiKey: '454c6ed73928b8b50793971d46ea544b',
      appId: 'DZVGLVDGU2',
      indexName: 'jouryjc-blog'
    },

    nav: [
      {
        text: '关于个人',
        link: '/',
        activeMatch: '^/$|^/introduction/'
      },
      {
        text: 'JavaScript',
        link: '/js/',
        activeMatch: '^/js/'
      },
      {
        text: 'TypeScript',
        link: '/typescript/utils',
        activeMatch: '^/typescript/'
      },
      {
        text: 'Node',
        link: '/node/vite/starting',
        activeMatch: '^/node/'
      },
      // {
      //   text: '算法',
      //   link: '/algorithm/index',
      //   activeMatch: '^/algorithm/'
      // },
      // {
      //   text: '读后感',
      //   link: '/study-note/2022'
      // },
      {
        text: 'Github',
        link: 'https://github.com/Jouryjc'
      }
    ],
    sidebar: {
      '/introduction/': getIntroduction(),
      '/js/': getJS(),
      '/typescript/': getTypeScript(),
      '/node/': getNode(),
      '/algorithm/': getAlgorithm(),
      '/study-note/': getStudyNote(),
      '/': getIntroduction(),
    }
  }
})

function getIntroduction(): DefaultTheme.SideBarConfig {
  return [
    {
      text: '关于我',
      link: '/'
    }
  ]
}

function getJS(): DefaultTheme.SideBarConfig {
  return []
}

function getTypeScript (): DefaultTheme.SideBarConfig {
  return [
    {
      text: '工具函数',
      link: '/typescript/utils.md'
    }
  ]
}

function getNode(): DefaultTheme.SideBarConfig {
  return [
    {
      text: '开端',
      link: '/node/vite/starting'
    },
    {
      text: '授人予渔，如何调试 CLI 代码？',
      link: '/node/vite/debug-cli'
    },
    {
      text: '敲下命令后，Vite 做了哪些事？',
      link: '/node/vite/create-server'
    },
    {
      text: '模块之间的依赖关系是一个图',
      link: '/node/vite/module-graph'
    },
    {
      text: '插件容器，管理着你的插件',
      link: '/node/vite/plugin-container'
    },
    {
      text: '客户端 HMR 的 API，你真熟悉了吗？',
      link: '/node/vite/hmr-client-api'
    },
    {
      text: '揭开 HMR 面纱，了解它在 client 端的实现',
      link: '/node/vite/hmr-client-source'
    },
    {
      text: '揭开 HMR 面纱，了解它在 node 端的实现',
      link: '/node/vite/hmr-node-source'
    },
    {
      text: 'Esbuild 是如何进行预构建的？',
      link: '/node/vite/esbuild-prebundle'
    }
  ]
}

function getAlgorithm(): DefaultTheme.SideBarConfig {
  return [
    {
      text: '刷题指南',
      link: '/algorithm/index'
    },
    {
      text: 'leetcode206-反转链表',
      link: '/algorithm/reverse-list'
    }
  ]
}

function getStudyNote(): DefaultTheme.SideBarConfig {
  return []
}