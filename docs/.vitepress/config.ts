import { defineConfig } from "vitepress"
import type { DefaultTheme } from 'vitepress'

export default defineConfig({
  title: '码农小余博客',
  description: '分享前端技术，算法、工程化、源码。',
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
        text: '个人主页',
        link: '/',
        activeMatch: '^/$|^/intruduction/'
      },
      {
        text: 'JavaScript',
        link: '/js/',
        activeMatch: '^/js/'
      },
      {
        text: '算法',
        link: '/algorithm/',
        activeMatch: '^/algorithm/'
      },
      {
        text: '读后感',
        link: 'study-note'
      }
    ],
    sidebar: {
      '/introduction/': getIntroduction(),
      '/js/': getJS(),
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

function getAlgorithm(): DefaultTheme.SideBarConfig {
  return []
}

function getStudyNote(): DefaultTheme.SideBarConfig {
  return []
}