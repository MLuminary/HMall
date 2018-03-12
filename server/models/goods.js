var mongoose = require('mongoose')
var Schema = mongoose.Schema;//定义表模型

var productSchema = new Schema({
  "productId":String,
  "productName":String,
  "salePrice":Number,
  "productImage":String
})

module.exports = mongoose.model('Good',productSchema);
