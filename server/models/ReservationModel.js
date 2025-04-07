const mongoose = require('mongoose')

const ReservationSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true},
    cafeteriaId : {type : mongoose.Schema.Types.ObjectId, ref : "Cafeteria"},
    foodItems : [{
        foodId : {type : mongoose.Schema.Types.ObjectId, ref : "Food"},
        quantity : {type : Number, required : true}
    }],
    totalPrice : { type: Number, required: true },
    isReserved : {type : Boolean, default : false},
}, {timestamps : true});

module.exports = mongoose.model("Reservation", ReservationSchema);