const User = require('../models/userSchema')
const { Error } = require('mongoose');
const sendToken = require('../utils/JwtTocken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto')


const registerUser = async(req,res,next)=>{
    
    const {name,email,password} = req.body;
    let user;
    try{
        user = await User.create({
            name,email,password,
            avatar:{
                public_id:'v1683699687/shopit/userImage/cld-sample_mdeywo.jpg',
                url:'https://res.cloudinary.com/dayc0s1py/image/upload/v1683699687/shopit/userImage/cld-sample_mdeywo.jpg'
            }
        })

        sendToken(user,200,res)
    }catch(e){
        if (e.name === "ValidationError") {
            let e_message = "";     
            Object.keys(e.errors).forEach((key) => {
                e_message =e_message+e.errors[key].message+" ";
            });

            const error = new Error(e_message);error.code=400;return next(error)
        }
        if(e.code==11000){
            const error = new Error("Email Id already exists"); error.code=500; return next(error) 
        }
        const error = new Error(e); error.code=500; return next(error)  
    } 
    
}


// login
const loginUser = async(req,res,next)=>{
    const {email,password} = req.body;

    // check if email and password entered by user
    if(!email||!password){
        const error = new Error("Please enter email and password");error.code=400;return next(error)
    }

    // finding user in database
    let user;
    try{
        user = await User.findOne({email}).select('+password')
    }catch(e){
        const error = new Error("Something went wrong could not find product");error.code=500;return next(error) 
    }

    // if no user exist
    if(!user){
        const error = new Error("Invalid email");error.code=404;return next(error)
    }

    // check for password entered
    const isMatched = await user.comparePassword(password)
    if(!isMatched){
        const error = new Error("Invalid password");error.code=404;return next(error)
    }

    sendToken(user,200,res)
}

// forgot password 

const forgotPassword = async(req,res,next)=>{

    let user;
    try{
        user = await User.findOne({email:req.body.email});
    }catch(e){
        const error = new Error("Something went wrong could not find email ");error.code=500;return next(error);
    }

    if(!user){
        const error = new Error("Please Enter valid email id");error.code=404;return next(error);
    }
    console.log(user)
    const resetToken = user.generateResetPasswordToken();
    await user.save({validateBeforeSave:false})

    // create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

    try{
        await sendEmail({
            email:user.email,
            subject:"MyAwsmCart Password reset",
            message
        })
        res.status(201).json({
            success:true,
            message:`Email sent to: ${user.email}`
        })

    }catch(e){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});
        const error = new Error(e.message);error.code=500;return next(error);
    }
}

const resetPassword = async(req,res,next)=>{

    // hash url token and find the user with same token
    const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex')   

    let user;
    try{
        user = await User.findOne({
            resetPasswordToken:resetToken,
            resetPasswordExpire:{$gt:Date.now()}
        })
    }catch(e){
        const error = new Error(e.message);error.code=500;return next(error);
    }

    if(!user){
        const error = new Error("Password reset link is invalid or expired");error.code=400;return next(error);
    }

    if(req.body.password!=req.body.confirmPassword){
        const error = new Error("Password does not match");error.code=400;return next(error);
    }

    user.password = req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save()
    sendToken(user,200,res)

}

// get currently logged in user
const loggedInUser=async(req,res,next)=>{

    let user;
    try{
        user = await User.findById(req.user.id)
    }catch(e){
        const error = new Error(e.message);error.code=500;return next(error);
    }
    res.status(200).json({
        success:true,
        user
    })
}

// update/change password
const updatePassword = async(req,res,next)=>{
    let user;
    try{
        user = await User.findById(req.user.id).select('+password')
        const isMatched = await user.comparePassword(req.body.oldPassword)
        if(!isMatched){
            const error = new Error("Please enter correct old password");error.code=400;return next(error);
        }
        user.password = req.body.password;
        await user.save()
        sendToken(user,201,res)

    }catch(e){
        const error = new Error(e.message);error.code=500;return next(error);
    }
}

// update logged in user profile
const updateProfile = async(req,res,next)=>{

    const newData= {
        name:req.body.name,
        email:req.body.email
    }

    let user;
    try{
        user = await User.findByIdAndUpdate(req.user.id,newData,{
            new:true,
            runValidators:true,
            useFindAndModify:false
        })
    }catch(e){
        const error = new Error(e.message);error.code=500;return next(error);
    }
    res.status(201).json({
        success:true,
        user
    })

}




// logout
const logoutUser = async(req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        message:"successfully logged out",
    })
}

// admin routes 
// get all users 
const getUsers = async(req,res,next)=>{
    let users;
    try{
        users = await User.find();
    }catch(e){
        const error = new Error(e.message);error.code=500;return next(error);
    }

    res.status(201).json({
        success:true,
        users
    })
}

// get specific user
const getAUser = async(req,res,next)=>{
    let user;
    try{
        user = await User.findById(req.params.id)
    }catch(e){
        const error = new Error(e.message);error.code=500;return next(error);
    }

    if(!user){
        const error = new Error("no such User exists");error.code=404;return next(error);
    }
    res.status(201).json({
        success:true,
        user
    })
}

// update a user
const updateUser = async(req,res,next)=>{

    const newData= {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    let user;
    try{
        user = await User.findByIdAndUpdate(req.params.id,newData,{
            new:true,
            runValidators:true,
            useFindAndModify:false
        })
    }catch(e){
        const error = new Error(e.message);error.code=500;return next(error);
    }
    res.status(201).json({
        success:true,
        user
    })
}

// delete User
const delelteAUser = async(req,res,next)=>{
    let user;
    try{
        user = await User.findById(req.params.id)
    }catch(e){
        const error = new Error(e.message);error.code=500;return next(error);
    }

    await user.deleteOne()
    res.status(201).json({
        success:true,
        message:"Deleted User"
    })
}




exports.registerUser=registerUser
exports.loginUser=loginUser
exports.logoutUser=logoutUser
exports.forgotPassword=forgotPassword
exports.resetPassword = resetPassword
exports.loggedInUser=loggedInUser
exports.updatePassword=updatePassword
exports.updateProfile=updateProfile
exports.getUsers = getUsers
exports.getAUser = getAUser
exports.updateUser = updateUser
exports.delelteAUser = delelteAUser