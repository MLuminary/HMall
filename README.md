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

## 注意点

`assets` 目录和 `static` 目录都是存放静态资源的，但是 `assets` 更偏向于存放组件的静态资源

## 商品信息的获取

使用 `express-generator` 生成服务器文件

默认生成

```shell
express server
```

然后安装依赖

```shell
npm install
```

在此文件中用 `mongoose` 获取 MongoDB 中的数据并用 `express` 将数据返回

然后在 `GoodsList.vue` 用 `axios` 通过 `get('/goods')` 获取，因为数据库返回的数据在 `localhost:3000/goods` 中，而项目运行在 `localhost:8080` 中，因此会涉及到跨域问题，这时需要在 `config/index.js` 添加修改如下代码

```js
proxyTable: {
      '/goods' : {
        target:'http://localhost:3000'
      }
    },
```

这样当 `axios.get(/goods)` 时，会默认转到 `localhost:3000/goods` 中获取对应数据

