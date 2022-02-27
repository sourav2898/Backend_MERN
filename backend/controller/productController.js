const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apiFeatures');

// Create Product
exports.createProduct = catchAsyncErrors(async (req,res,next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(200).json({success:true,product});

});

// Get All Products details
exports.getAllProducts = catchAsyncErrors(async (req,res) => {

    const productCount = await Product.countDocuments;

    const apifeature = await new ApiFeatures(Product.find(),req.query).search();
    const product = await apifeature.query;

    res.status(200).json({success:true,product,productCount});

})

// Get single product details
exports.getProduct = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req.params.id);

     if(!product){
         return next(new ErrorHandler("Product not found",404)) ;
     }

     res.status(200).json({
         success:true,
         product
     })
})

// Update Products
exports.updateProduct = catchAsyncErrors(async (req,res,next) => {
     let product = await Product.findById(req.params.id);

     if(!product){
         return res.status(500).json({
             success:false,
             message:"Product not found."
         })
     }

     product = await Product.findByIdAndUpdate(req.params.id,req.body,{
         new:true,
         runValidators:true,
         useFindAndModify:false
     })

     res.status(200).json({
         success:true,
         product
     })
})

// Delete product
exports.delteProduct = catchAsyncErrors(async (req,res,next) => {

    const product = await Product.findById(req.params.id);

     if(!product){
         return res.status(500).json({
             success:false,
             message:"Product not found."
         })
     }

     await product.remove();

     res.status(200).json({
         success:true,
         message:"Product deleted successfully."
     })

})

// create uer review
exports.createUserReview = catchAsyncErrors(async (req,res,next) => {
    const {rating,comment,productId} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString())

    if(isReviewed){
        product.reviews.forEach(rev => {
            if(rev.user.toString() === req.user._id.toString()){
                rev.rating = rating; rev.comment = comment;
            }
        })
    }else{
        product.reviews.push(review);
        product.numberOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach(rev => {
        avg+=rev.rating;
    })

    product.ratings = avg/product.reviews.length;

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success:true,
    })
})

// get product reviews
exports.getProductReviews = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found",400));
    }

    res.status(200).json({
        success:true,
        reviews: product.reviews
    })
})

// delete product review
exports.deleteReview = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product not found",400));
    }
    
    const reviews = product.reviews.filter(rev => {
        return rev._id.toString() !== req.query.productId.toString()
    })

    let avg = 0;
    reviews.forEach(rev => {
        avg+=rev.rating
    })

    const ratings = avg / reviews.length;
    const numberOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numberOfReviews
    },
    {
        new:true,
        runValidators:true,
        useFindAndModify: false
    })

    res.status(200).json({
        success:true,
        message:"review deleted successfully"
    })

})
