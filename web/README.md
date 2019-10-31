# 项目说明

> do1-dsfvue 项目说明文档

## 项目目录

* `[dist]` 项目打包输出目录
* `[build]` 项目自动化配置目录
  * `check-version.js`检查 node、npm 等版本
  * `dev-client.js`热重载相关
  * `dev-server.js`构建本地服务器
  * `utils.js`构建工具相关
  * `vue-loader.conf.js` vue 文件配置
  * `webpack.base.conf.js`webpack 基础配置
  * `webpack.dev.conf.js`webpack 开发环境配置
  * `webpack.prod.conf.js`webpack 生产环境配置
  * `webpack.test.conf.js`webpack 单元测试配置
* `[config]` 项目全局变量配置
  * `index.js` 项目配置文件
  * `dev.env.js` 开发环境变量
  * `prod.env.js` 生产环境变量
  * `test.env.js` 测试环境变量
* `[src]` 项目源码目录
  * `[api]` 请求接口目录
      * `marketApi.js` api 市场类接口
      * `authApi.js` 认证类接口
      * `api.js` 接口入口
  * `[assets]` 静态资源文件
      * `[icons]` 图标
      * `[images]` 页面图片
      * `[styles]` 样式
        * `[common]` 自定义公用样式组件目录
          * `basic.less` 公用基础类
          * `btn.less` 按钮相关
          * `color.less` 颜色相关
          * `import-lib-var.less` 变量
          * `transition.less` 动画过渡相关
          * `my-elementui.less` element 组件样式覆盖
        * `[common]` 后台公用样式类
  * `[components]` 公共组件目录 UI 组件
        * `[button]` 按钮组件
        * `[message]` 状态提示组件
        * `[zTree]` 树 tree 组件
        * `index.js` 组件全局注册
  * `[router]` 路由配置，按钮模块配置路由
      * `[admin]` admin 模块，管理后台模块（暂无用）
      * `[index]` index 模块，即系统前台功能模块
      * `[index.js]` 路由主文件入口
  * `[utils]` 工具方法目录
      * `fetch.js` axios 请求拦截器
      * `utils.js` 工具方法封装
  * `[mixins]` 全局混合
  * `[views]` 页面目录
      * `[admin]` 管理后台模块目录
        * `[APIGateway]` API 网关
        * `[apply]` 应用中心
        * `[common]` 公用模块
        * `[contacts]` 通讯录
        * `[developer]` 开发商管理
        * `[header]` 头部
        * `[index]` 首页
        * `[leftnav]` 左侧菜单栏
        * `[login]` 登录页
        * `[market]` API 市场
        * `[register]` 开发商注册
      * `[error]` 异常提示页面
        * `[404]` 404
      * `[index]` 前台页面模块目录，按各功能分成子模块目录，目录中是页面对应的文件
        * `[index]` 首页
        * `[haeder]` 头部
        * `[market]` API 市场
        * `[updated]` 更新说明
  * `[vuex]` 项目数据状态管理目录
      * `store.js`
  * `App.vue` 根组件
  * `main.js` 入口 js 文件
* `[statics]` 纯静态资源，不会被 wabpack 构建。
* `.editorconfig`
* `.eslintignore` js 语法检查要排除的配置
* `.eslintrc.js` js 语法检查配置
* `.gitignore.js` git 文件排除同步配置
* `.postcssrc.js`
* `index.html` 入口页面
* `package.json` 项目打包描述文件
* `readme.md` 项目说明

## 项目相关命令

```shell
#初始化项目（安装项目依赖）
npm install

#启动开发模式
npm run dev

#项目打包
npm run build
```

## 项目开发规范

1.  使用 vsocde 做为开发工具，同时安装好 vuter 和 prettier，eslint 三个插件
2.  文件目录及文件均以驼峰命名，图片资源文件以小写字母+数字+下划线命名
3.  eslint 配置已经规定开发中的语法规范，因此严格遵循 eslint 语法检查
4.  页面专用样式，须与页面文件同名，并放于同目录下，如 index.vue 的专用样式文件 index.less，放于同目录下
5.  vue 文件结构顺序为（使用文档最后的“vue 结构代码片断”创建）

```shell
<template>
...
</template>

<script>
// 属性顺序
export default {
  name
  components
  props
  vuex
  data
  computed
  watch
  methods
  beforeCreate
  created
  beforeMount
  mounted
}
</script>

<style>
...
</style>
```

6.vue 文件引入其他文件 js、less，均不要加后缀，如下

```js
import api form './api/api'
```

```less
@import './common/common';
```

7.  路由 path 和 name 命名均用驼峰命名，如下

```js
{
    path: 'addMember',
    name: 'addMember',
    mate: '添加会员',
    component: resolve =>require(['@/views/index/addMember'], resolve)
}
```

8.  注释规范，属性或函数注释使用多行注释，代码中注释用单行注释，如下

```js
{
  /**
   * 属性说明
   */
  name:'',
  /**
   * 函数说明
   * @param {Number} a 参数说明
   * @param {Object} b 参数说明
   * @param {String} c 参数说明
   * @returns {String}
   */
  func:function(a,b,c){
    // 打印a,b,c
    console.log(a,b,c)
  },
}
```

## vue 结构代码片断

打开 vscode-文件-首选项-用户代码片，接着选择 vue.json，回车打开,将以下内容完全复制进去，并保存。接下来在新建 vue 文件的时候，输入'vuebody'，然后按 tab 就会自动插入代码结构

```json
{
  "vueBody": {
    "prefix": "vuebody",
    "body": [
      "<template>",
      "$1",
      "</template>",
      "<script>",
      "export default {",
      "  name:\"\",",
      "  componets:{",
      "",
      "  },",
      "  props:{",
      "",
      "  },",
      "  vuex:{",
      "",
      "  },",
      "  data(){",
      "",
      "  },",
      "  computed:{",
      "",
      "  },",
      "  watch:{",
      "",
      "  },",
      "  methods:{",
      "",
      "  },",
      "  beforeCreate(){",
      "",
      "  },",
      "  created(){",
      "",
      "  },",
      "  beforeMount(){",
      "",
      "  },",
      "  mounted(){",
      "",
      "  }",
      "}",
      "</script>",
      "<style lang=\"less\">",
      "",
      "</style>",
      ""
    ],
    "description": "vue结构，不需要的属性需删除"
  }
}
```
```json
"vueBody": {
  "prefix": "vuebody",
  "body": [
    "<template>",
    "  <div class='dsf_content'>",
    "    <div class='dsf_content_section dsf_content_section_padding'>",
    "      $1",
    "    </div>",
    "  </div>",
    "</template>",
    "<script>",
    "export default {",
    "  name:\"\",",
    "  componets:{",
    "",
    "  },",
    "  props:{",
    "",
    "  },",
    "  vuex:{",
    "",
    "  },",
    "  data(){",
    "    return {}",
    "  },",
    "  computed:{",
    "",
    "  },",
    "  watch:{",
    "",
    "  },",
    "  methods:{",
    "",
    "  },",
    "  beforeCreate(){",
    "",
    "  },",
    "  created(){",
    "",
    "  },",
    "  beforeMount(){",
    "",
    "  },",
    "  mounted(){",
    "",
    "  }",
    "}",
    "</script>",
    "<style lang=\"less\">",
    "",
    "</style>",
    ""
  ],
  "description": "vue结构，不需要的属性需删除"
}
```