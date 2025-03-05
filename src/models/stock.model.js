const mongoose = require("mongoose")


const stockSchema = new mongoose.Schema({
    itemName : {type:String, required:true},
    category : {type:String, required:true},
    qty : {type:Number, required:true},
    price : {type:Number, required:true},
    supplier : {type:String, required:true},
    available : {type:Boolean, default:true},
    sold : {type:Boolean, default:false},
},
{ timestamps: true }
)


module.exports = mongoose.model("Stock", stockSchema);