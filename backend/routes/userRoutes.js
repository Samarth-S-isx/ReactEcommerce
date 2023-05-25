const express = require("express")
const routes = express.Router();
const bodyParser = require('body-parser')

const userController = require('../controllers/userController')
const auth = require('../middleware/auth')


routes.post('/register',userController.registerUser)
routes.post('/login',userController.loginUser)
routes.get('/logout',userController.logoutUser)
routes.post('/password/forgot',userController.forgotPassword)
routes.put('/password/reset/:token',userController.resetPassword)
routes.get('/me',auth.isAuthentiated,userController.loggedInUser)
routes.put('/password/update',auth.isAuthentiated,userController.updatePassword)
routes.post('/me/update',auth.isAuthentiated,userController.updateProfile)

// admin routes
routes.get('/admin/user',auth.isAuthentiated,auth.roles('admin'),userController.getUsers)
routes.get('/admin/user/:id',auth.isAuthentiated,auth.roles('admin'),userController.getAUser)
routes.put('/admin/user/:id',auth.isAuthentiated,auth.roles('admin'),userController.updateUser)
routes.delete('/admin/user/:id',auth.isAuthentiated,auth.roles('admin'),userController.delelteAUser)
module.exports =routes