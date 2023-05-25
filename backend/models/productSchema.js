const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name:{type:String,required:[true,'Please enter name'],trim:true,maxLength:[100,'Product name cannot exceed 100 characcters']},
    price:{type:Number,required:[true,'Please enter product price'],maxLength:[5,'Price cannot exceed 5 characcters']},
    description:{type:String,required:[true,'Please enter description']},
    ratings:{type:Number,default:0},
    images:[
        {
            public_id:{
                type:String,
                required:true,

            },
            url:{
                type:String,
                required:true,

            }
        }
    ],
    category:{type:String,required:[true,'Please enter category for the item'],enum:{values:['Electronics','Cameras','Accessories','Food','Shoes','Clothes','Beauty/Health','Sports','Home','Headphones','Laptops'],message:'Please select correct categoyr'}},
    seller:{type:String,required:[true,'Please enter seller name']},
    stock:{type:Number,required:[true,'Please enter stock of the product'],maxLength:[5,'Cannot exceed 5 charaumccters'],default:0},
    numOfReviews:{type:Number,default:0},
    reviews:[
        {
            user:{type:mongoose.Schema.ObjectId,ref:'user',required:true },
            name:{type:String,required:true},
            rating:{type:Number,required:true},
            comment:{type:String,required:true},
        }
    ],
    user:{type:mongoose.Schema.ObjectId,ref:'user',required:true },
    createdAt:{type:Date,default:Date.now()}

})







module.exports = mongoose.model('products',productSchema)