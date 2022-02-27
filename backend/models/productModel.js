const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter products name"],
        trim: true
    },
    description:{
        type:String,
        required:[true, "Please enter products description"],
    },
    price:{
        type: Number,
        required:[true, "Please enter products price"],
        maxLength:[8,"Price can not exceed 8 characters"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true, "Please enter products category"],
    },
    stock:{
        type:Number,
        required:[true, "Please enter products stock"],
        maxLength:[4,"Stock cannot exceed 4 limit length"],
        default: 1
    },
    numberOfReviews:{
        type:Number,
        default:0,
    },
    reviews:[
        {
            user:{
                type: mongoose.Schema.ObjectId,
                required: true,
                ref:"User"
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref:"User"
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Product",productSchema);