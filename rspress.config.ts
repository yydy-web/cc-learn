import * as path from 'node:path';
import { defineConfig } from '@rspress/core';
import { pluginLlms } from '@rspress/plugin-llms';
import rspressPluginMermaid from 'rspress-plugin-mermaid';
import { pluginSitemap } from '@rspress/plugin-sitemap';
import readingTime from 'rspress-plugin-reading-time';
import ga from 'rspress-plugin-google-analytics';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Claude Code 教程',
  description: '一份由浅入深的 Claude Code 使用指南',
  icon: '/cc-learn-icon.png',
  logo: {
    light: '/cc-learn-light-logo.png',
    dark: '/cc-learn-dark-logo.png',
  },
  plugins: [
    pluginLlms(),
    rspressPluginMermaid(),
    pluginSitemap({
      siteUrl: 'https://claude-learn.pages.dev',
    }),
    readingTime({
      defaultLocale: 'zh-CN',
    }),
    ga({
      id: 'G-ZH0VPEP4C9',
    }),
  ],
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/Muromi-Rikka/cc-learn',
      },
    ],
    llmsUI: {
      viewOptions: ['markdownLink', 'chatgpt', 'claude'],
    },
  },
});
