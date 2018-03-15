var mongoose = require('mongoose')
var Schema = mongoose.Schema;//定义表模型

var productSchema = new Schema({
  "productId":String,
  "productName":String,
  "salePrice":Number,
  "productImage":String,
  "checked": Number,
  "productNum": Number
})
// Good 默认会找数据库中 goos 集合，所以数据库中的集合尽量都要加s
module.exports = mongoose.model('Good',productSchema);
