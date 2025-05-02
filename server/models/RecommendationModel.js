const mongoose = require('mongoose')
const CafeteriaModel = require('./CafeteriaModel')

const RecommendationSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, ref : "User"},
    recommendedFoods : [{
        foodId : {type : mongoose.Schema.Types.ObjectId, ref : "Food"},
        foodName : String,
        CafeteriaId : {type : mongoose.Schema.Types.ObjectId, ref : "Cafeteria"},
        foodImage : String
    }],
    recommendedCafeterias : [{
        CafeteriaId : {type : mongoose.Schema.Types.ObjectId, ref : "Cafeteria"},
        cafeteriaName : String,
        location : {
            latitude : Number,
            longitude : Number
        }
    }]
    
})

module.exports = mongoose.model("Recommendation", RecommendationSchema);