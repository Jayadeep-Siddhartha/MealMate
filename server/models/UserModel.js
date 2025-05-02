const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose')
    
const UserSchema = new mongoose.Schema({
username : String,
email : String,
phoneNumber : String,
firebaseId : {type : String, unique : true, required : true},
savedCafeterias : [{type : mongoose.Schema.Types.ObjectId, ref : "Cafeteria"}],
preferences : [{type : mongoose.Schema.Types.ObjectId, ref : "Food"}]
}, {timestamps : true})

module.exports = mongoose.model("User", UserSchema);