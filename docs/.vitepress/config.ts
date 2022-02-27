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
        text: '关于个人',
        link: '/',
        activeMatch: '^/$|^/intruduction/'
      },
      {
        text: 'JavaScript',
        link: '/js/',
        activeMatch: '^/js/'
      },
      {
        text: 'Node',
        link: '/node/vite/entry',
        activeMatch: '^/node/'
      },
      {
        text: '算法',
        link: '/algorithm/index',
        activeMatch: '^/algorithm/'
      },
      {
        text: '读后感',
        link: 'study-note'
      },
      {
        text: 'Github',
        link: 'https://github.com/Jouryjc'
      }
    ],
    sidebar: {
      '/introduction/': getIntroduction(),
      '/js/': getJS(),
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

function getNode(): DefaultTheme.SideBarConfig {
  return [
    {
      text: 'Vite 源码解读',
      link: '/node/vite/entry'
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