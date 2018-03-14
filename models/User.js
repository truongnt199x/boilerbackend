const mongoose = require('mongoose');
const {Schema} = mongoose;
const validator = require('validator');
const bcrypt   = require('bcrypt-nodejs');
const UserSchema = new Schema({
    local:{
        email:{
            type:String,
            validate:{
                validator: email => validator.isEmail(email),
                message:`Invalid email`
            }
        },
        password:{
            type:String
        },
        name:{
            type:String
        },
        phoneNumber:{
            type:Number
        },
        address:{
            type:String
        },
        isActive:{
            type:Boolean,
            default:false
        }
    },
    facebook:{
        id           : String,
        token        : String,
        name         : String,
        email        : String,
        avaURL       : String,
        link         : String   
    },
    google:{
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        avaURL       : String,
        link         : String 
    }
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

const User = mongoose.model('user',UserSchema);

module.exports = User;