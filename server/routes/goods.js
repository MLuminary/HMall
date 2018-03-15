var express = require('express');

var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall')

mongoose.connection.on("connected",function(){
  console.log("MongoDB connected success");
})
mongoose.connection.on("disconnected",function(){
  console.log("MongoDB connected disconnected");
})
mongoose.connection.on("error",function(){
  console.log("MongoDB connected error");
})

router.get("/",function(req,res,next){
  //分页查询
  let params = {};//需要查询的条件
  let page = parseInt(req.param("page"));//页数
  let pageSize = parseInt(req.param("pageSize"));//一页有多少个内容
  let sort = req.param("sort");//正序(1)或升序(-1)
  let skip = (page-1) * pageSize;//跳过文档的个数

  // 价格过滤
  let priceLevel = req.param("priceLevel");
  params = checkPriceArea(priceLevel)

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec({},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      })
    }
  })
})


//加入到购物车 直接就为二级路由
router.post("/addCart",function(req,res,next){
  var userId = '100000077',productId = req.body.productId;
  console.log(productId);
  //获取模型
  var User = require('../models/user');
  //只拿取一个
  User.findOne({
    userId:userId
  },function(Uerr,Udoc){
    if(Uerr){
      res.json({
        status:"1",
        msg:Uerr.message
      })
    }else{
      //如果找到此人
      if(Udoc){
        Goods.findOne({productId:productId},function(Gerr,Gdoc){
          if(Gerr){
            res.json({
              status:"1",
              msg:Gerr.message
            })
          }else{
            //如果找到此商品
            if(Gdoc){
              Gdoc.productNum = 1;
              Gdoc.checked = 1;
              Udoc.cartList.push(Gdoc);
              Udoc.save(function(error,document){
                if(error){
                  res.json({
                    status:"1",
                    msg:error.message
                  })
                }else{
                  res.json({
                    status:"0",
                    msg:''
                  })
                }
              })
            }
          }
        })
      }
    }
  })
});


// 返回对应的价格区间
function checkPriceArea(priceLevel){
  let params = {};
  let priceGt = 0, priceLte = 0; // 价格区间
  if(priceLevel !== 'all') {
    switch(priceLevel) {
      case '0':priceGt = 0   ; priceLte = 100 ;break;
      case '1':priceGt = 100 ; priceLte = 500 ;break;
      case '2':priceGt = 500 ; priceLte = 1000;break;
      case '3':priceGt = 1000; priceLte = 5000;break;
    }
    params = {
      salePrice: {
        $gt :priceGt,
        $lte:priceLte
      }
    }
  }
  return params;
}

module.exports = router;
