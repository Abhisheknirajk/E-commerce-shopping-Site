const mongoose  =  require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A user must have a name']
   },
    email:{
        type:String,
        unique:true,
        required:[true,' Please provide a email'],
        lowercase:[true],
        validate:[validator.isEmail,'please provide a valid email']
    },
    password:{
        type:String,
        required:[true,'Please provide a Password'],
        minlength:8,
       
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    },
    
    passwordChangedAt: Date,
      passwordResetToken:String,
      passwordResetExpires:Date,
    photo:{
        type:String,
        default:'default.jpg'
    },
    active:{
        type:Boolean,
        default:true,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please confirm your password'],
        validate:{
            validator:function(el){
                return el === this.password
            },
            message:" ConfirmPassword is note match with password"
        }
    }

});
userSchema.pre('save',async function(next){
    if(!this.isModified('password'))return next();
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined;
    next();
});
userSchema.pre('save',function(next){
    if(!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now()-1000;
    next();
})

// for check 
userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });
  userSchema.pre(/^find/,function(next){
      this.find({active:{$ne:false}});
      next();
  })
 
  userSchema.methods.changedPasswordAfter = function(JWTTimeStamp){
    if(this.passwordChangedAt){
      const changeTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
      return JWTTimeStamp<changeTimeStamp
    }
    return false;
  }

  userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(36).toString('hex');
  
     this.passwordResetToken = crypto.createHash('sha256')
     .update(resetToken)
     .digest('hex');
  
     console.log({ resetToken }, this.passwordResetToken);
  
     this.passwordResetExpires = Date.now() + 10 * 60 * 10000;
   
     return resetToken;
  }

const User = mongoose.model('User',userSchema);
module.exports = User;