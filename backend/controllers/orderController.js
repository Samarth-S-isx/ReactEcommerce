const Order = require('../models/orderSchema')
const Product = require('../models/productSchema')

// create order
const createOrder = async(req,res,next)=>{

    const {orderItems,shippingInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,paymentInfo} = req.body;
    let order
    try{
        order = await Order.create({
            orderItems,shippingInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,paymentInfo,paidAt:Date.now(),
            user :req.user.id
        })
    }catch(e){
        const error = new Error(e);error.code=500;return next(error)
    }
    

    res.status(201).json({
        success:true,
        order
    })
}

// get single order
const getSingleOrder = async(req,res,next)=>{
    let order;
    try{
        order = await Order.findById(req.params.id).populate('user','name email')
    }catch(e){
        const error = new Error(e);error.code=500;return next(error)
    }

    if(!order){
        const error = new Error('No order found');error.code=404;return next(error)
    }
    res.status(201).json({
        success:true,
        order
    })
}

// get logged in user order
const myOrder = async(req,res,next)=>{
    let orders;
    let total = 0;
    try{
        // console.log(req.user.id)
        orders = await Order.find({user:req.user.id})
        orders.forEach(o => {
           total = total+o.totalPrice      
        });
    }catch(e){
        const error = new Error(e);error.code=500;return next(error)
    }

    res.status(201).json({
        success:true,
        orders,total
    })
}

// const getAllOrders = async(req,res,next)=>{

// }
// update an order by admin

const updateOrder = async(req,res,next)=>{

    let order;
    try{
        order = await Order.findById(req.params.id)
    }catch(e){
        const error = new Error(e);error.code=500;return next(error)
    }
    if(order.orderStatus==='delivered'){
        const error = new Error("Already delivered the order");error.code=400;return next(error)
    }

    order.orderItems.forEach(async item=>{
        await updateStock(item.product,item.quantity)
    })
    order.orderStatus = req.body.status,
    order.deliveredAt = Date.now()
    await order.save()

    res.status(201).json({
        success:true
    })
}

async function updateStock(id,quantity){
    const product = await Product.findById(id)
    product.stock = product.stock-quantity
    await product.save()
}


// deleteorder
const deleteOrder = async(req,res,next)=>{
    
    let order;
    try{
        order = await Order.findById(req.params.id)
    }catch(e){
        const error = new Error(e);error.code=500;return next(error)
    }
    if(!order){
        const error = new Error("No order found");error.code=500;return next(error)
    }
    await order.deleteOne()

    res.status(201).json({
        success:true
    })
}

exports.createOrder = createOrder
exports.myOrder= myOrder
exports.getSingleOrder = getSingleOrder
exports.updateOrder = updateOrder
exports.deleteOrder = deleteOrder