const ErrorHandler = require("../utils/errorHandler");
const User = require('../models/userModel');
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');
 
exports.isAuthenticatedUser = catchAsyncErrors(async (req,res,next) => {
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please login to access the resources",401));
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);
    
    req.user = await User.findById(decodedData.id);

    next();
})

exports.isAuthoriseduser = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req?.user?.role)){
            return next(new ErrorHandler(`User : ${req?.user?.role}`,403))
        }

        next();
    }
}