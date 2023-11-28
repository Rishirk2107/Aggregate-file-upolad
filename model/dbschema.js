const mongoose = require('mongoose');

const userSchema=mongoose.Schema({
    username:String,
    password:String,
    usToken:String,
    number:{ type: Number, default: 0 },
    products:{type:[String],default:[]}
})
const user=mongoose.model("user",userSchema);
const adminSchema=mongoose.Schema({
    username:String,
    password:String,
    adToken:String,
    items:{type:[String],default:[]},
    selling:{type:Number,default:0},
    sold:{type:Number,default:0},
    
})
const admin=mongoose.model("admin",adminSchema);
const productSchema=mongoose.Schema({
    productid:String,
    productname:String,
    productpic:String,
    productcount:Number,
    productprice:Number,
    productadmin:String
})
const product=mongoose.model("detail",productSchema);
const counter = mongoose.model('Counter', new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 0 },
  }));

module.exports={
    user,
    admin,
    product,
    counter
}