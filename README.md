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

```js
proxyTable: {
    '/goods/*' : {
      target:'http://localhost:3000'
    }
  },
```

`/goods/*` 会匹配所有的 `/goods/` 后的二级路由

## 分页查询

```js
//分页查询
let page = parseInt(req.param("page"));//页数
let pageSize = parseInt(req.param("pageSize"));//一页有多少个内容
let sort = req.param("sort");//正序(1)或升序(-1)
let skip = (page-1) * pageSize;//跳过文档的个数
let params = {};//需要查询的条件
let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
goodsModel.sort({'salePrice':sort});
goodsModel.exec({},function(err,doc){...});
```

以上就是根据 `salePrice` 实现正序分页查询

## 滚动加载

滚动加载用的是 `vue-infinite-scroll` 插件，具体使用也可以看其官网

https://www.npmjs.com/package/vue-infinite-scroll

也可以结合本例来理解使用

## 添加购物车中 mongoose 添加属性的问题

本项目中如下代码在开始时没有生效

```js
gDoc.checked = 1;
gDoc.productNum = 1;
uDoc.cartList.push(gDoc);
```

原因就是，如果想要向 `gDoc` 中添加属性，其 `Schema` 必须要定义此属性

```js
var productSchema = new Schema({
  "productId":String,
  "productName":String,
  "salePrice":Number,
  "productImage":String,
  //添加如下两行代码
  "checked": Number,
  "productNum": Number
})
```

## mongoose 更新某行

查找条件 `userId` 等于 `userId`, `cartList.productId` 等于 `productId` 的内容，并将查找到内容的 `cartList` 下的 `productNum` 修改为 `productNum`，`checked` 修改为 `checked`


```js
User.update({"userId":userId, "cartList.productId":productId},{
  "cartList.$.productNum": productNum,"cartList.$.checked": checked
},function(err, doc){..})
```


