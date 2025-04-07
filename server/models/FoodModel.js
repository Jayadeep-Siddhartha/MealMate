const mongoose = require('mongoose')
const CafeteriaModel = require('./CafeteriaModel')

const FoodSchema = new mongoose.Schema({
    foodName : { type: String, required: true },
    CafeteriaId : {type : mongoose.Schema.Types.ObjectId, ref : "Cafeteria"},
    price : { type: Number, required: true },
    foodImage : String,
    availability : {type : Number, default : Number},
    rating : {type : Number, default : 1},
    category : {type : String, required : true}
}, {timestamps : true,
    collection: "FoodItems" });

module.exports = mongoose.model("Food", FoodSchema);