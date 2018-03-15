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
  res.cookie("userName","",{
    path:'/',
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

module.exports = router;
