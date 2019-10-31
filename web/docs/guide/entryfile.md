# 入口文件

通常在一个 vue 项目中我们会在入口文件 `main.js` 中引入相关依赖模块（前提依赖模块必须已经安装），安装步骤请参考[vue](https://cn.vuejs.org/v2/guide/installation.html)官网，微服务框架也提供了前端脚手架，可以在[gitlab](http://git.do1.com.cn/TeamWorkcode/do1-cli/tree/develop)上获取源码，相应命令如下：

```bash
git clone http://git.do1.com.cn/TeamWorkcode/do1-cli

# 推荐使用yarn

# 初始化项目（安装项目依赖）
yarn install (or npm install)

# 启动开发模式
yarn start (or npm start)

# 项目打包
yarn build (or npm build)

```

## router

为了方便多人开发以及维护，微服务将路由文件也进行模块化，不同的模块分不同的 js 文件，然后在最外层的 index.js 中进行整合，添加路由的结构如下，组件中的引入方式是为了实现 vue 异步加载：

```js
{
  path: 'messageLog',
  name: 'messageLog',
  meta: {
    title: '消息日志'
  },
  component: resolve => require(['@/views/admin/container'], resolve),
  children: []
}
```

## axios

微服务对 `axios` 进行一次封装，配置了拦截器，请求超时时间，随机数，请求格式以及 `token`（访问后端接口身份校验），文件路径在 src/utils/fetch.js，其中拦截器是拦截前端对后端的请求和后端响应请求，具体配置参数含义请参考[axios](https://www.jianshu.com/p/7a9fbcbb1114)

## vuex

Vuex 是 Vue.js 应用程序的状态管理模式+库，它充当应用程序中所有组件的集中存储，其规则确保状态只能以可预测的方式进行变更。为了方便多人开发和维护，微服务也将 vuex 进行模块化，处理方式和 router 相同，但是目前用到 vuex 代码量相对较少，暂时全都放在 `store.js` 中，使用方法参考[vuex](https://vuex.vuejs.org/)。

## API 接口地址

前端页面数据展示是调用后端 API 接口获取相关数据在前端页面渲染，同样为了方便开发和维护，微服务将 API 接口提取成单独的一个 JS 文件，引入封装好的 `axios` 以及 `QS`，每个接口代码结构类似如下：

```js
getUserList(params) {
  const data = Qs.stringify(params)
  return Ajax({
    url: `${baseAuthorize}dsf/user/list?` + data,
    method: 'get'
  })
}
```

## 第三方插件

如果 vue 项目中需要引入第三方插件或者 UI 框架，微服务会单独创建一个 JS 文件按需引入第三方模块，例如 `element ui` 会单独创建一个目录，里面存放按需引入 el 模块的 JS 然后再在入口文件引入
