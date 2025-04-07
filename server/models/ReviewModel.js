const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId , ref : "User", required : true},
    cafeteriaId : {type : mongoose.Schema.Types.ObjectId , ref : "Cafeteria", required : false},
    foodId : {type : mongoose.Schema.Types.ObjectId , ref : "Food", required : false},
    rating : {type : Number, min : 1, max : 5, required : true},
    comment : {type : String},
    createdAt : {type : Date, default : Date.now}
});

module.exports = mongoose.model("Review", ReviewSchema);