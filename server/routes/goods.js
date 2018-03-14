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
  let page = parseInt(req.param("page"));//页数
  let pageSize = parseInt(req.param("pageSize"));//一页有多少个内容
  let sort = req.param("sort");//正序(1)或升序(-1)
  let skip = (page-1) * pageSize;//跳过文档的个数
  let params = {};//需要查询的条件
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


module.exports = router;
