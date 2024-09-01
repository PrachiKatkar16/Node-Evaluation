const express=require('express')
const OrderModel=require('../models/order.model');
const authMiddleware = require('../middleware/auth.middleware');
const StockModel = require('../models/stock.model');
const orderRouter=express.Router();

orderRouter.post('/buy',authMiddleware,async(req,res)=>{
    const {stockId,quantity,price}=req.body;
    try {
        const order=new OrderModel({
            user:req.user.userId,
            stock:stockId,
            type:'buy',
            quantity,
            price
        })
        await order.save();
        res.status(201).json(order)
    } catch (error) {
        res.status(401).json({message:`${error}`})
    }
})
orderRouter.post('/sale',authMiddleware,async(req,res)=>{
    const {stockId,quantity,price}=req.body;
    try {
        const order=new OrderModel({
            user:req.user.userId,
            stock:stockId,
            type:'sale',
            quantity,
            price
        })
        await order.save();
        res.status(201).json(order)
    } catch (error) {
        res.status(401).json({message:`${error}`})
    }
})
const matchOrders=async(order)=>{
    const {type,stock,price,quantity}=order;
    const oppositeType=type==='buy'?'sale':'buy';
    const matchingOrders=await OrderModel.find({
        stock,
        type:oppositeType==='buy'?{$gte:price}:{$lte:price},
        status:'open'
    })
    for(const matchingOrder of matchingOrders){
        const matchQuantity=Math.min(quantity,matchingOrder.quantity-matchingOrder.fulfilledQuantity);
        order.fulfilledQuantity+=matchQuantity;
        matchingOrder.fulfilledQuantity+=matchQuantity;
        if(matchingOrder.fulfilledQuantity===matchingOrder.quantity){
            matchingOrder.status='fulfilled';
        }else{
            matchingOrder.status='partially_fulfilled'
        }
        await matchingOrder.save();
        if(order.fulfilledQuantity===order.quantity){
            order.status='fulfilled'
        }else{
            order.status='partially_fulfilled'
        }
    
    }
    await order.save();
    if(order.status==='fulfilled'|| order.status==='partially_fulfilled'){
        const lastTradedPrice=matchingOrders[0].price;
        await StockModel.findByIdAndUpdate(stock,{lastTradedPrice:lastTradePrice})
    }
}
module.exports=orderRouter