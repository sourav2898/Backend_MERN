const Order = require('../models/ordersModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Create new Order
exports.createOrder = catchAsyncErrors(async (req,res,next) => {
    const {
        shippingInfo, 
        orderItems,
        paymentInfo, 
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo, 
        orderItems,
        paymentInfo, 
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user:req.user._id,
    });

    res.status(201).json({
        success:true,
        order
    })
})

// get single order details
exports.getSignleOrder = catchAsyncErrors(async (req,res,next) => {
    const order = await Order.findById(req.params.id).populate("user","name email");

    if(!order){
        return next(new ErrorHandler("Order does not exist",404));
    }

    res.status(200).json({
        success:true,
        order
    })
})

// get my orders
exports.myOrders = catchAsyncErrors(async(req,res,next) =>{
    const orders = await Order.find({user: req.user._id});

    res.status(200).json({
        success:true,
        orders
    })
})

// get all orders --admin
exports.getAllOrders = catchAsyncErrors(async (req,res,next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    }) 
})

// update order status --admin
exports.updateStatus = catchAsyncErrors(async (req,res,next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler(`Order with id: ${req.params.id} does not exists`,404))
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order",400));
    }

    order.orderItems.forEach(async (order)=>{
        await updateStatus(order.product, order.quantity);
    })

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt  = Date.now();
    }

    await order.save({validateBeforeSave: false})

    res.status(200).json({
        success:true,
    })
})

async function updateStatus(id,quantity){
    const product = await Product.findById(id);

    product.stock -= quantity;

    await Product.save({validateBeforeSave: false})
}

// Delete order
exports.deleteOrder = catchAsyncErrors(async (req,res,next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler(`Order with id: ${req.params.id} does not exists`,404))
    }

    await order.remove();

    res.status(200).json({
        success:true,
        message: "Order removed successfully."
    })
})