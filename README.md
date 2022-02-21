# xy-smart-cumpus-pc-web

## 环境安装

前端代码运行本地需安装node.js 以及 vue-cli

### node.js 安装
[node.js 下载地址](https://nodejs.org/zh-cn/").
### vue-cli 安装
```
npm install -g @vue/cli
```

## Project setup
```
git checkout develop //切换到开发分支
npm install //安装第三方包 (第一次创建项目\有更新的话需要执行此命令)
git flow init //初始化git flow (只有第一次创建项目需要执行此命令)
git flow feature start [你的分支名称] //创建你的分支
git add . //添加到暂存区域
git commit -m '提交文件的描述信息' //添加描述
git flow feature publish //发布本地分支.
git checkout develop  //切换到开发分支
git pull //拉取最新dev代码
```

### develop合并到我本地的分支
```
git merge develop
```


### Compiles and hot-reloads for development（运行）
```
npm run serve
```


### Compiles and minifies for production （编译发布）
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 调试地址修改
src/common/js/config.js

## pc发版
1. 代码发布直接将打包好的代码放到base下面，配置响应域名和baseApi接口
2. 添加域名和接口方式：
在app.***.js中搜索 已有域名 例如测试站： "http://qa.api.base.xiaoyangedu.net:7001
然后添加一项即可
例：
{webUrL:"http://qa.base.xiaoyangedu.net:6004",apiUrl:"http://qa.api.base.xiaoyangedu.net:7001"}
3. web服务器配置 [服务器配置参考](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90)

