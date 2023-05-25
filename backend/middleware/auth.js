
const jwt = require('jsonwebtoken')
const User = require('../models/userSchema')


const isAuthentiated = async(req,res,next)=>{
    
    const {token} = req.cookies
    if(!token){
        const error = Error('Login First to access the link');error.code=401;return next(error)
    }

    const decoded = jwt.verify(token,'DEDEJIDSDSFEFDSC84511812CDC');
    req.user = await User.findById(decoded.id);
    // console.log(decoded.id)
    next();
};

// roles

const roles = (...roles)=>{
    return (req,res,next)=>{
        // console.log(roles,req.user)
        if(!roles.includes(req.user.role)){
            const error = new Error(`Role ${req.user.role} not allowed to access this link`);error.code=403;return next(error);
        }
        next();     
    }
    
}




exports.isAuthentiated = isAuthentiated;
exports.roles = roles;