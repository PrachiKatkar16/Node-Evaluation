const mongoose=require('mongoose');

const orderSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    stock:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Stock',
        required:true
    },
    type:{
        type:String,
        enum:['buy','sale'],
        required:true
    },
    qunatity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['open','partially_fulfilled','fulfilled'],
        default:'open'
    },
    fulfilledQuantity:{
        type:Number,
        default:0

    }
})
const OrderModel=mongoose.model('Order',orderSchema)
module.exports=OrderModel;