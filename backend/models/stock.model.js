const mongoose=require('mongoose');

const stockSchema=mongoose.Schema({
    stock_name:{
        type:String,
        required:true
    },
    symbol:{
        type:String,
        required:true
    },
    initial_listing_price:{
        type:Number,
        required:true
    },
    lastTradedPrice:{
        type:Number,
        required:true
    }
})
const StockModel=mongoose.model('Stock',stockSchema)
module.exports=StockModel;