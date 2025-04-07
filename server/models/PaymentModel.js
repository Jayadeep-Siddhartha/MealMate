const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true},
    reservationId : {type : mongoose.Schema.Types.ObjectId, ref : "Reservation", required : true},
    amount : {type : Number, required : true},
    transactionId : {type : String, required : true},
    status : {type : Boolean, default : false}
}, {timestamps : true});

module.exports = mongoose.model("Payment", PaymentSchema);