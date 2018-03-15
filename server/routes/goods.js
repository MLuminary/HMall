var express = require("express");

var router = express.Router();
var mongoose = require("mongoose");
var Goods = require("../models/goods");

//连接MongoDB数据库
mongoose.connect("mongodb://127.0.0.1:27017/dumall");

mongoose.connection.on("connected", function() {
  console.log("MongoDB connected success");
});
mongoose.connection.on("disconnected", function() {
  console.log("MongoDB connected disconnected");
});
mongoose.connection.on("error", function() {
  console.log("MongoDB connected error");
});

router.get("/", function(req, res, next) {
  //分页查询
  let params = {}; //需要查询的条件
  let page = parseInt(req.param("page")); //页数
  let pageSize = parseInt(req.param("pageSize")); //一页有多少个内容
  let sort = req.param("sort"); //正序(1)或升序(-1)
  let skip = (page - 1) * pageSize; //跳过文档的个数

  // 价格过滤
  let priceLevel = req.param("priceLevel");
  params = checkPriceArea(priceLevel);

  let goodsModel = Goods.find(params)
    .skip(skip)
    .limit(pageSize);
  goodsModel.sort({ salePrice: sort });
  goodsModel.exec({}, function(err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      });
    } else {
      res.json({
        status: "0",
        msg: "",
        result: {
          count: doc.length,
          list: doc
        }
      });
    }
  });
});

//加入到购物车 直接就为二级路由
router.post("/addCart", function(req, res, next) {
  var userId = "100000077",
    productId = req.body.productId;
  //获取模型
  var User = require("../models/user");

  User.findOne({ userId: userId }, function(uErr, uDoc) {
    return new Promise((resolve, reject) => {
      if (uErr) {
        //找不到此用户
        reject(uErr);
      } else {
        //如果找到此用户
        resolve(uDoc);
      }
    });
  })
    .then(uDoc => {
      let goodsItem = "";
      //商品是否以前曾添加过
      uDoc.cartList.forEach(function(item) {
        if (item.productId == productId) {
          goodsItem = item;
          //商品数量增加
          item.productNum = parseInt(item.productNum) + 1;
        }
      });
      //如果添加过
      if (goodsItem) {
        uDoc.save(function(err, doc) {
          if (err) {
            reject(err);
          } else {
            res.json({
              status: "0",
              msg: "不是第一次"
            });
          }
        });
      } else {
        Goods.findOne({ productId: productId }, function(gErr, gDoc) {
          if (gErr) {
            reject(gErr);
          } else {
            if (gDoc) {
              let obj = {
                checked : 1,
                productNum : 1
              }
              var gDoc = Object.assign(gDoc,obj);
              console.log(gDoc);
              uDoc.cartList.push(gDoc);
              uDoc.save(function(err, doc) {
                if (err) {
                  reject(err);
                } else {
                  res.json({
                    status: "0",
                    msg: "第一次插入",
                  });
                }
              });
            }
          }
        });
      }
    })
    .catch(err => {
      res.json({
        status: "1",
        msg: err.message
      });
    });
});

// 返回对应的价格区间
function checkPriceArea(priceLevel) {
  let params = {};
  let priceGt = 0,
    priceLte = 0; // 价格区间
  if (priceLevel !== "all") {
    switch (priceLevel) {
      case "0":
        priceGt = 0;
        priceLte = 100;
        break;
      case "1":
        priceGt = 100;
        priceLte = 500;
        break;
      case "2":
        priceGt = 500;
        priceLte = 1000;
        break;
      case "3":
        priceGt = 1000;
        priceLte = 5000;
        break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    };
  }
  return params;
}

module.exports = router;
