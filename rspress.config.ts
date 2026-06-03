import * as path from 'node:path';
import { defineConfig } from '@rspress/core';
import { pluginLlms } from '@rspress/plugin-llms';
import { pluginSitemap } from '@rspress/plugin-sitemap';

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
    pluginSitemap({
      siteUrl: 'https://cc-learn.pages.dev',
    }),
  ],
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/anthropics/claude-code',
      },
    ],
    llmsUI: {
      viewOptions: ['markdownLink', 'chatgpt', 'claude'],
    },
  },
});
