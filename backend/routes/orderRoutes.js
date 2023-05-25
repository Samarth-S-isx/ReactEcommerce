const express = require("express")
const routes = express.Router();
const bodyParser = require('body-parser')
const auth = require('../middleware/auth')
const orderController = require('../controllers/orderController')


routes.post('/order/new',auth.isAuthentiated,orderController.createOrder)
routes.get('/orders/me',auth.isAuthentiated,orderController.myOrder)
routes.get('/order/:id',auth.isAuthentiated,orderController.getSingleOrder)

// admin routes
routes.put('/admin/order/:id',auth.isAuthentiated,auth.roles('admin'),orderController.updateOrder)
routes.delete('/admin/order/:id',auth.isAuthentiated,auth.roles('admin'),orderController.deleteOrder)



module.exports =routes