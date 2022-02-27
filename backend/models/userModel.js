const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        maxlength:[30,"Name cannot exceed 30 characters"],
        minlength:[4,"Name cannot be less than 4 characters"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true, "Please eneter a password"],
        minlength:[6,"Paswword cannot be lessthan 6 characters"],
        select: false,
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        },

    },
    role:{
        type:String,
        default:"user"
    },

    resetPaswwordToken:String,
    resetPasswordExpire:Date,
})

// excrypting password
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password,10);
})

// JWT Token
userSchema.methods.getJWTToken = function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    });
}

// check password
userSchema.methods.matchPassword = async function (enteredPasswrod){
    return await bcrypt.compare(enteredPasswrod,this.password);
}

// reset password
userSchema.methods.getResetPasswordToken = function(){
    // Generate Token
    const resetToken = crypto.randomBytes(20).toString("hex"); 

    // Hashing and adding reset password token to user schema
    this.resetPaswwordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    
    return resetToken;
}

module.exports = mongoose.model("User",userSchema)