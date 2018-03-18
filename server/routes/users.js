var express = require('express');
var router = express.Router();

var User = require('./../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//登录接口
router.post("/login",function(req ,res, next){
  let param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  User.findOne(param,function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      res.cookie("userId",doc.userId,{
        path:'/',
        maxAge:1000*60*60
      })
      res.cookie("userName",doc.userName,{
        path:'/',
        maxAge:1000*60*60
      })
      // req.session.user = doc;
      res.json({
        status:'0',
        msg:'',
        result:{
          userName:doc.userName
        }
      })
    }
  })
})

//登出接口
router.post("/logout",function(req,res,next){
  res.cookie("userId","",{
    path:"/",
    maxAge:-1
  })
  res.json({
    status:"0",
    msg:'',
    result:''
  })
})

//检查是否登录
router.get("/checkLogin",function(req,res,next){
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName
    })
  }else{
    res.json({
      status:'1',
      msg:'未登录'
    })
  }
})

//查询当前用户的购物车数据
router.get("/cartList",function(req,res,next){
  let userId = req.cookies.userId;
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        })
      }
    }
  })
})

//购物车删除
router.post("/cartDel", function (req, res, next){
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  User.update({userId:userId},{
    $pull:{'cartList':{'productId':productId}}
  },function(err,doc){
    if(err) {
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:doc.result
      })
    }
  })
})

module.exports = router;
