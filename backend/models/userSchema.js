const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const crypto = require('crypto')



const userSchema = new mongoose.Schema({

    name:{type:String,required:[true,'Please enter the name'],maxLength:[30,'Your name cannot exceed 30 character']},
    email:{type:String,required:[true,'Please enter the email'],unique:[true],validate:[validator.isEmail,'Please enter valid email']},
    password:{type:String,required:[true,'Please enter the password'],minlength:[6,'Your password should be atleast 6 character'],select:false},
    avatar:{
        public_id:{ type:String,required:true},
        url:{type:String,required:true}
    },
    createdAt:{type:Date,default:()=>Date.now()},
    role: {type: String,default: 'user'},
    resetPasswordToken: String,
    resetPasswordExpire: Date

})

// encrption

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }

    this.password = await bcrypt.hash(this.password,10)
})

// returning JWT token

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},'DEDEJIDSDSFEFDSC84511812CDC',{
        expiresIn:'7d'
    });
}

// comparing password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.generateResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetPasswordExpire = Date.now()+30*60*1000
    return resetToken
}

module.exports = mongoose.model('user',userSchema)