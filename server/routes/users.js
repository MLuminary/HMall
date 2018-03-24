var express = require('express');
var router = express.Router();

require('./../util/util') //格式化日期

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
        maxAge:1000*60*60*24
      })
      res.cookie("userName",doc.userName,{
        path:'/',
        maxAge:1000*60*60*24
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
    $pull:{'cartList':{'productId':productId}} //删除购物车中 productId 为 productId 的这行数据
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
        result: 'suc'
      })
    }
  })
})

//控制购物车商品信息的数量
router.post("/cartEdit", function(req, res, next){
  let userId = req.cookies.userId,
      productId = req.body.productId,  //商品 id
      productNum = req.body.productNum,//商品数量
      checked = req.body.checked;      //商品是否被选中

  User.update({"userId":userId, "cartList.productId":productId},{
    "cartList.$.productNum": productNum,"cartList.$.checked": checked
  },function(err, doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      })
    }
  })
})

//购物车全选
router.post('/editCheckAll',function(req, res, next){
  let userId = req.cookies.userId,
      checkAll = req.body.checkAll;
  //更新多条数据
  User.findOne({userId:userId}, function(err, user){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(user){
        user.cartList.forEach((item)=>{
          item.checked = checkAll
        })
        user.save(function(err1,doc){
          if(err1){
            res.json({
              status:'1',
              msg:err.message,
              result:''
            })
          }else{
            res.json({
              status:'0',
              msg:'',
              result:'suc'
            })
          }
        })
      }
    }
  })
})

//查询用户地址接口
router.get('/addressList',function(req, res, next){
  let userId = req.cookies.userId;
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg: err.message,
        result: ''
      })
    }else{
      res.json({
        status:'0',
        msg: "",
        result: doc.addressList
      })
    }
  })
})

//设置默认地址
router.post('/setDefault',function(req, res, next){
  let userId = req.cookies.userId,
      addressId = req.body.addressId;

  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg: err.message,
        result: ''
      })
    }else{
      if(doc){
        let addressList = doc.addressList;
        addressList.forEach((item)=>{
          item.addressId == addressId ? item.isDefault = true : item.isDefault = false;
        })
      }
      doc.save(function(er,docu){
        if(er){
          res.json({
            status:'1',
            msg: er.message,
            result: ''
          })
        }else{
          res.json({
            status:'0',
            msg: "",
            result: 'suc'
          })
        }
      })
    }
  })
})

//地址的删除
router.post('/delAddress',function(req, res, next){
  let userId = req.cookies.userId,
      addressId = req.body.addressId;

  User.update({userId:userId},{
    $pull:{
      "addressList": {
        "addressId": addressId
      }
    }
  },
  function(err, doc){
    if(err){
      res.json({
        status:'1',
        msg: err.message,
        result: ''
      })
    }else{
      res.json({
        status:'0',
        msg: "",
        result: 'suc'
      })
    }
  })
})

//生成订单
router.post('/payMent',function(req, res, next){
  let userId = req.cookies.userId,
      orderTotal = req.body.orderTotal,
      addressId = req.body.addressId;

  User.findOne({userId:userId},function(err, doc){
    if(err){
      res.json({
        status:'1',
        msg: err.message,
        result: ''
      })
    }else{
      let address = '',goodsList=[];

      //获取订单地址
      doc.addressList.forEach(item=>{
        if(item.isDefault === true){
          address = item;
        }
      })
      //订单商品详情
      doc.cartList.forEach(item=>{
        if(item.checked == '1'){
          goodsList.push(item);
        }
      })

      //拼接订单id
      let platform = '777'; //平台码
      let r1 = Math.floor(Math.random()*10);
      let r2 = Math.floor(Math.random()*10);
      let sysdate = new Date().Format('yyyyMMddhhmmss');

      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');

      let orderId = platform + r1 + sysdate + r2;

      //订单详细信息
      let order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: '1',
        createDate: createDate
      }

      //添加到数据库
      doc.orderList.push(order);

      //保存
      doc.save(function(err1,doc1){
        if(err1){
          res.json({
            status:'1',
            msg: err1.message,
            result: ''
          })
        }else{
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          })
        }
      })
    }
  })
})

//根据订单id查询订单信息
router.get("/orderDetial",function(req, res, next){
  let userId = req.cookies.userId,
      orderId = req.param('orderId');

  User.findOne({userId:userId},function(err, userInfo){
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else{
      let orderTotal = 0;
      let orderList = userInfo.orderList;

      orderList.forEach(item=>{
        if(item.orderId == orderId){
          orderTotal = item.orderTotal;
        }
      })

      if(orderTotal === 0){
        res.json({
          status:'120001',
          msg:'无此订单',
          result:''
        })
      }

      res.json({
        status:'0',
        msg:'',
        result:{
          orderId:orderId,
          orderTotal: orderTotal
        }
      })


    }
  })
})

//查询购物车商品数量
router.get("/getCartCount",function(req, res, next){
  if(req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    User.findOne({userId:userId},function(err, doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        let cartList = doc.cartList;
        let CartCount = 0;
        cartList.map(function(item){
          CartCount += parseInt(item.productNum);
        })
        res.json({
          status:'0',
          msg:'',
          result: CartCount
        })
      }
    })
  }
})

module.exports = router;
