const express = require("express")
const routes = express.Router();
const bodyParser = require('body-parser')
const productController = require("../controllers/productController")
const auth = require('../middleware/auth')

  

routes.get('/products',productController.getProduct);
routes.get('/product/:id',productController.getProductByID);

// admin routes
routes.post('/admin/product/new',auth.isAuthentiated,auth.roles('admin'),productController.createProduct);
routes.put('/admin/product/:id',auth.isAuthentiated,auth.roles('admin'),productController.updateProduct);
routes.delete('/admin/product/:id',auth.isAuthentiated,auth.roles('admin'),productController.deleteProduct);

// review
routes.put('/review',auth.isAuthentiated,productController.createReview)
routes.get('/reviews',auth.isAuthentiated,productController.getProductReview)
routes.delete('/reviews',auth.isAuthentiated,productController.deleteReview)
module.exports =routes