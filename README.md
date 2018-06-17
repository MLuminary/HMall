# hmall

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## 项目描述

一个小:department_store:

### :bowtie: 实现的页面及功能

- 登录登出模块
- 商品展示页面
- 购物车页面
- 选择地址页面
- 商品结算页面
- 结算成功页面
- 模态框组件

### :key: 登录登出模块

输入用户名和密码，验证成功及登录，登录成功后会用 `cookie` 存储登录信息，每次打开其他功能页都会验证登录信息，如果登录信息不存在则会强行跳回登录页,无法浏览其他功能页

[项目演示](http://haoqinzz.cn/HMall/#/) 用户名 admin  密码 123456

### :package: 商品展示页面

使用 [vue-infinite-scroll](https://github.com/ElemeFE/vue-infinite-scroll) 实现商品滚动加载

使用 [vue-lazyload](https://github.com/hilongjw/vue-lazyload) 实现商品图片预加载

商品按价格区间展示

商品按价格高低排序

点击加入购物车功能

右上角也有直接跳到自己购物车的图标

### :articulated_lorry: 购物车页面

购物车页面展示商品的图片名称价格和购买总量

可以更改商品数量也可以移除购买的商品

有全选或者单选功能

### :house: 选择地址页面

选择你的收获地址，可以将地址设置为默认地址，也可以删除地址

### :moneybag: 商品结算页面

将购物车中选中的信息和总价格展示出来

### :clap: 结算成功页面

结算成功，可以返回首页也可以返回购物车页面

### :memo: 模态框组件

根据父组件的 `mdShow` 传值可以选择弹出或者不弹出，同时有一个 `slot` 可以改变模态框中的内容



