const mongoose = require('mongoose')
const Product = require('../models/productSchema')
const { Error } = require('mongoose');
const feature = require('../utils/feature')



// create all products
const createProduct = async (req,res,next)=>{
    try{
        req.body.user = req.user.id
        const createdProduct = new Product(req.body)
        const result = await createdProduct.save()
        res.status(201).json({
            success:true,
            createdProduct
        })
    }catch(e){
        if (e.name === "ValidationError") {
            let e_message = "";     
            Object.keys(e.errors).forEach((key) => {
                e_message =e_message+e.errors[key].message+" ";
            });
            const error = new Error(e_message);
            error.code=400;
            return next(error)
        }
        const error = new Error('something went wrong could not create product');
        error.code=500;
        return next(error)    
    }    
}


// get all products 
const getProduct = async (req,res,next)=>{
    let products
    try{
        const q = new feature(Product.find(),req.query).search()
        products = await q.query;
    }catch{
        const error = new Error('something went wrong could not find product');error.code=500;return next(error)
    } 


    res.status(201).json({
        message:'got all the products',
        products
    })
}

// get products by id
const getProductByID = async(req,res,next)=>{
    const id = req.params.id
    let product

    try{
        product = await Product.findById(id)
    }catch(e){
        const error = new Error('something went wrong could not find product');error.code=500;return next(error)
    }
    
    if(!product){
        const error = new Error('Could not find a product for the provided id.');error.code= 404;return next(error)
    }

    res.status(200).json({
        success:true,
        product
    })
}

// update product by id 
const updateProduct=async(req,res,next)=>{
    let product = await Product.findById(req.params.id)

    if(!product){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        product
    })
}

// delete product by id 
const deleteProduct = async(req,res,next)=>{
    
    const product = await Product.findById(req.params.id)
    if(!product){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }
    await product.deleteOne();
    res.status(200).json({
        success:true,
        message:"deleted"
    })
}

// review

// create new review
const createReview=async(req,res,next)=>{
    const { rating, comment, productId } = req.body;
    const review = {
        user:req.user.id,
        name:req.user.name,
        rating:Number(rating),comment
    }
    let product;
    try{
        product = await Product.findById(productId)
    }catch(e){
        const error = new Error(e);error.code=500;return next(error)
    }
    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user.id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user.id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
    await product.save({ validateBeforeSave: false })
    res.status(200).json({
        success: true
    })
    
}


// get product review
const getProductReview = async(req,res,next)=>{
    let product;
    try{
        product = await Product.findById(req.query.id)
    }catch(e){
        const error = new Error(e);error.code=500;return next(error)
    }
    if(!product){
        const error = new Error("no product found");error.code=500;return next(error)
    }

    res.status(201).json({
        success:true,
        reviews:product.reviews
    })
}

//delete review 
const deleteReview = async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    console.log(product);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
}












exports.createProduct= createProduct;
exports.getProduct= getProduct;
exports.getProductByID=getProductByID;
exports.updateProduct=updateProduct;
exports.deleteProduct=deleteProduct;
exports.createReview=createReview
exports.getProductReview=getProductReview
exports.deleteReview=deleteReview