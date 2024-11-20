const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    nic: {
        type:String,
        require:true
    },

    name: {
        type:String,
        require:true
    },

    email: {
        type:String,
        require:true
    },

    address: {
        type:String,
        require:true
    },

    phone: {
        type:String,
        require:true
    },

    dob: {
        type:String,
        require:true
    },

    gender: {
        type:String,
        require:true
    },

    role:{
        type:String,
        default:"visitor"
    }
})
  
const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel