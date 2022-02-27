const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const { sendEmail } = require('../utils/sendEmail');

// Register a user
exports.registerUser = catchAsyncErrors(async (req,res,next) => {
    const {email,name,password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"This is a sample id",
            url:"profilepicurl"
        }
    })

    sendToken(user,200,res);

})

// login user
exports.loginUser = catchAsyncErrors(async(req,res,next) => {

    const {email,password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password",404))
    } 

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password",401))
    }

    const isPsswordMatched = await user.matchPassword(password);

    if(!isPsswordMatched){
        return next(new ErrorHandler("Invalid email or password",401))
    }

    sendToken(user,200,res);
})

// logout user
exports.logout = catchAsyncErrors(async (req,res,next) => {
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({success:true, message:"logged out"})
})

// forgot password
exports.forgotPassword = catchAsyncErrors(async (req,res,next) => {
    const user =  await User.findOne({email: req.body.email});

    // console.log(user);
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    // get reset password token
    const resetPasswordToken = await user.getResetPasswordToken();
    // console.log(resetPasswordToken);

    await user.save({validateBeforeSave: false});

    // setting reset password url
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetPasswordToken}`;
    // console.log(resetPasswordUrl);
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requeseted this then, please ignore.`

    try {

        await sendEmail({
            email:user.email,
            subject:"Ecommerce password recovery",
            message
        })

        res.status(200).json({
            success:true,
            message: `Email sent to ${user.email} successfully.`
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message,500))
    }
})

// reset Password
exports.resetPassword = catchAsyncErrors(async (req,res,next) => {
    const resetPaswwordToken = crypto.createHash("sha256").update(req?.params?.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: req?.params?.toekn,
        resetPasswordExpire: {$gt: Date.now()},
    })

    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or has been expired",400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password and confirm password does not match",400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({validateBeforeSave: false});

    sendToken(user,200,message);
})

// get uer details
exports.getUserDetails = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })
})

// update user password
exports.updatePassword = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPsswordMatched = await user.matchPassword(req.body.oldPassword);

    if(!isPsswordMatched){
        return next(new ErrorHandler("Old password does not match",400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("New password and Confrim Password does not match",400));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user,200,res);
})

// update user details
exports.updateUserDetails = catchAsyncErrors(async (req,res,next)=> {
    const newUser = {
        email: req.body.email,
        name: req.body.name
    }

    await User.findByIdAndUpdate(req.user.id,newUser,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "User details updated successfully",
    })
}) 

// get user details (admin)
exports.getAllUsers = catchAsyncErrors(async (req,res,next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
}) 

// get single user details
exports.getSingleUser = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User with id: ${req.params.id} does not exists`,400))
    }

    res.status(200).json({
        success: true,
        user
    })
}) 

// update user roel -- Admin
exports.updateUserDetailsByAdmin = catchAsyncErrors(async (req,res,next)=> {
    const newUser = {
        email: req.body.email,
        name: req.body.name,
        role: req.body.role
    }

    await User.findByIdAndUpdate(req.params.id,newUser,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "User details updated successfully",
    })
}) 

// delete user -- Admin
exports.deleteUserByAdmin = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with id : ${req.params.id}`,400))
    }

    await user.remove();

    res.status(200).json({
        success:true,
        message: "User removed successfully."
    })
})