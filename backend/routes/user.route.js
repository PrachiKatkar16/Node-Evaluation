const UserModel=require('../models/user.model')
const express=require('express')
const userRouter=express.Router();
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

userRouter.post('/register',async(req,res)=>{
    const {username,email,password}=req.body;
    try {
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err){
                res.status(500).json({message:`Internal server error ${err}`})
            }
            const user=new UserModel({
                username,
                email,
                password:hash
            })
            await user.save();
            res.status(201).json({message:"User registered successfully"})
        })
    } catch (error) {
        res.status(401).json({message:`Error while registering user ${error}`})
    }
})

userRouter.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user= await UserModel.findOne({email})
        if(!user){
            res.status(500).json({message:"user not found"})
        }
        if(user){
            bcrypt.compare(password,user.password,function(err,result){
                if(err){
                    res.status(401).json({message:`Internal Server error ${err}`})
                }
                if(result){
                    const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY)
                    res.status(201).json({message:"user logged in sucessfully",token})
                }
            })
            
        }
    } catch (error) {
        res.status(401).json({message:`Error while logged in ${error}`})
    }
})

module.exports=userRouter;