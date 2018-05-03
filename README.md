# hmall

> A Vue.js project

[项目演示](http://haoqinzz.cn/HMall/#/) 用户名 admin  密码 123456

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

## mongoose 更新对象或数组中某行

查找条件 `userId` 等于 `userId`, `cartList.productId` 等于 `productId` 的内容，并将查找到内容的 `cartList` 下的 `productNum` 修改为 `productNum`，`checked` 修改为 `checked`


```js
User.update({"userId":userId, "cartList.productId":productId},{
  "cartList.$.productNum": productNum,"cartList.$.checked": checked
},function(err, doc){..})
```

## cookie 的存取

`cookie` 存储

```js
res.cookie("userId",doc.userId,{
  path:'/',
  maxAge:1000*60*60
})
```

`cookie` 拿取

```js
let userId = req.cookies.userId
```

## 图片预加载


`VueLazyload`

https://www.npmjs.com/package/vue-lazyload


## 线上部署

### 服务器安装 node

去官网下载压缩包然后用 fileZilla 传到服务器中

我把压缩包放置在 /node 中

**解压**

tar -xvf   node-v8.11.1-linux-x64.tar.xz

mv node-v8.11.1-linux-x64  nodejs

然后解压并把文件名改名为 nodejs

**建立软连接**

ln -s node/nodejs/bin/npm /usr/local/bin/

ln -s node/nodejs/bin/node /usr/local/bin/


### 服务器安装 mongodb

https://www.cnblogs.com/liuq1991/p/8073895.html

**停止 Mongodb**

```shell
# cd /usr/local/mongodb/bin

# ./mongod -shutdown -dbpath=/usr/local/mongodb/data
```


### 本地可视化工具连接服务器 mongodb

解决措施

https://segmentfault.com/q/1010000002923686

### vue 项目打包发布存在的问题

自己的项目部署在 `服务器根地址/HMall` 中

#### 打包项目发布到服务器空白页问题

自己设置了 `mode:history` ,将其删除即可。

#### 打包项目 css 图片加载不到

```css
background: url("/static/icon.png") 0 -100px no-repeat
```

`login.css` 中引用 `static` 中的 `logo.png`，我使用的是绝对路径。按照网上给的解决措施都无法解决

比如

config/index.js 下修改 `assetsPublicPath: './'`, build/utils.js中 修改 `publicPath:'../../'` 或 `publicPath:'/HMall/'`,网页中请求的永远是 `根网址/static/logo.png`,而真正的图片地址为 `根网址/HMall/static/logo.png`

通过谷歌继续查相关内容，得知绝对路径是以域名为起点的，根路径的写法也是不会经过 webpack 处理的，项目发布在 HMall 还是 JMall 来说没有影响。

所以这里需要改成相对路径

```css
background: url("../../../static/icon.png") 0 -100px no-repeat;
```

#### nginx 反向代理实现跨域

修改 `server/nginx/conf/vhosts` 中的 `.conf` 文件，如果不存在的话就自己新建一个

```conf
server {
  listen 80;#监听端口
  server_name www.haoqinzz.cn haoqinzz.cn;#监听的域名
  root /phpstudy/www;#项目根目录
  index login.html index.html;

  # location /{
  #   proxy_set_header X-Real-IP $remote_addr;
  #   proxy_pass http://127.0.0.1:3000/;
  # }
  location /users/{
    proxy_pass http://127.0.0.1:3000/users/;
  }
  location /cart/{
    proxy_pass http://127.0.0.1:3000/cart/;
  }
  location /goods/{
    proxy_pass http://127.0.0.1:3000/goods/;
  }
}
```

因为自己在项目前后端交互采用的是绝对路径，因此直接写 `location /users/`,如果项目中采用的是相对路径，那这里要改为 `location HMall/users/`





