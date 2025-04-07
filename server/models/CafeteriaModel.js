const mongoose = require('mongoose');

const CafeteriaSchema = new mongoose.Schema({
    cafeteriaName : {type : String, required : true},
    location : { 
        latitude : Number,
        longitude : Number,
    },
    menu : [{type : mongoose.Schema.Types.ObjectId, ref : "Food"}],
    availableSeats : {type : Number, required : true},
    rating : {type : Number, default : 0},
    openStatus : {type : Boolean, default : true}
}, { collection: "Cafeterias" });

module.exports = mongoose.model("Cafeteria", CafeteriaSchema);