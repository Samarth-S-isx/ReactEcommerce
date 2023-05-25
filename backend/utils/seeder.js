const Product = require('../models/productSchema')
const mongoose = require('mongoose')

const products = require('../data/products.json')

const seedProducts = async () => {
    try {

        await Product.deleteMany();
        console.log('Products are deleted');

        await Product.insertMany(products)
        console.log('All Products are added.')

        process.exit();

    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}
const url = "mongodb+srv://samarth:samarth@cluster0.eqcxard.mongodb.net/myawsmcart?retryWrites=true&w=majority";
mongoose
.connect(url)
.then(()=>{seedProducts()})
.catch((e)=>{console.log(e)})