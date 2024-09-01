const express=require('express');
const connection=require('./config/db')
const userRouter=require('./routes/user.route')
const stockRouter=require('./routes/stock.route')
const orderRouter=require('./routes/order.route')
const PORT=process.env.PORT || 3005
const app=express();
app.use(express.json())

app.use('/auth',userRouter)
app.use('/stock',stockRouter)
app.use('/order',orderRouter)

app.get('/',(req,res)=>{
    res.send('server is working fine')
})

app.listen(PORT,async()=>{
    try {
        await connection;
        console.log(`Server is running on ${PORT} and connected to db`)
    } catch (error) {
        console.log(error)
    }
})