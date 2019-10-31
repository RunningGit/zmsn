module.exports = {
  title: '道一云微服务框架',
  base: '/',
  description: ' ',
  head: [['link', { rel: 'icon', href: `/logo.ico`, type: 'image/x-icon' }]],
  themeConfig: {
    // 导航栏链接，类似tabs
    nav: [
      { text: '主页', link: '/' },
      { text: '概述', link: '/guide/' },
      // 导航栏链接，下拉框
      {
        text: '版本',
        items: [{ text: 'v1.3', link: '/guide/' }]
      },
      { text: '微服务开发环境', link: 'http://web.dsf.dev.do1.work/#/' },
      {
        text: 'GitLab',
        link: 'http://git.do1.com.cn/TeamWorkcode/do1cloud-vue/tree/develop'
      }
    ],
    // 侧边栏
    sidebar: {
      '/guide/': genSidebarConfig('概述')
    },
    lastUpdated: 'Last Updated'
  }
}

function genSidebarConfig(title) {
  return [
    {
      title,
      collapsable: false,
      children: ['', 'entryfile', 'home', 'moudle']
    }
  ]
}
