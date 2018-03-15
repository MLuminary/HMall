var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');//服务的icon
var logger = require('morgan');//日志输出
var cookieParser = require('cookie-parser'); //cookie 的转化
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//全局拦截
app.use(function(req,res,next){
  if(req.cookies.userId){
    next();
  }else{//请求的 url
    if(req.path=='/users/login'||req.path=='/users/logout'||req.path=='/goods/list'){
      next();
    }else{
      res.json({
        status:'10001',
        msg:'当前未登录',
        result:''
      })
    }
  }
});

app.use('/', index);
app.use('/users', users);
app.use('/goods', goods);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
