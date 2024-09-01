const express=require('express')
const stockRouter=express.Router();
const StockModel=require('../models/stock.model')
const authMiddleware=require('../middleware/auth.middleware')

stockRouter.post('/add',authMiddleware('admin'),async(req,res)=>{
    const {stock_name,symbol,initial_listing_price,lastTradedPrice}=req.body;
    try {
        const stock=new StockModel({
            stock_name,symbol,initial_listing_price,lastTradedPrice
        })
        await stock.save();
        res.status(201).json({message:"stock added sucessfully"})
    } catch (error) {
        res.status(401).json({message:"Error while adding stock"})
    }

})
stockRouter.get('/',authMiddleware('admin'),async(req,res)=>{
    try {
        const stocks=await StockModel.find({user:req.user._id})
        res.status(201).json(stocks)
    } catch (error) {
        res.status(401).json({message:`Error while fetching stocks ${error}`})
    }
})
stockRouter.patch('/update/:id',authMiddleware('admin'),async(req,res)=>{
    const {lastTradedPrice}=req.body;
    try {
        const stock=await StockModel.findByIdAndUpdate(req.params.id,{lastTradedPrice},{new:true});
        res.status(201).json({message:"stock updated sucessfully",stock})
    } catch (error) {
        res.status(401).json({message:`Error while updating stock ${error}`})
    }
})
stockRouter.delete('/delete/:id',authMiddleware('admin'),async(req,res)=>{
    try {
        await StockModel.findByIdAndDelete(req.params.id);
        res.status(201).json({message:"Stock deleted sucessfully"})
    } catch (error) {
        res.status(401).json({message:`Error while deleting the stock ${error}`})
    }
})
module.exports=stockRouter;