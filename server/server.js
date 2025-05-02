const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db')

const AuthRoute = require('./routes/AuthRoute');
const UserRoute = require('./routes/UserRoute');
const CafeteriaRoute = require('./routes/CafeteriaRoute');
const FoodRoute = require('./routes/FoodRoute');
const ReservationRoute = require('./routes/ReservationRoute');
const PaymentRoute = require('./routes/PaymentRoute');
const ReviewRoute = require('./routes/ReviewRoute');
const RecommendationRoute = require('./routes/RecommendationRoute');
const OrderRoute = require('./routes/OrderRoute');

const app = express();

app.use(express.json());
app.use(cors());

// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser : true,
//     useUnifiedTopology : true
// }).then(() => console.log("MongoDB connected"))
// .catch(error => console.error("MongoDB Connection Error : ", error));

connectDB();

app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/cafeterias", CafeteriaRoute);
app.use("/api/foods", FoodRoute);
app.use("/api/reservations", ReservationRoute);
app.use("/api/recommendations", RecommendationRoute);
app.use("/api/payments", PaymentRoute);
app.use("/api/reviews", ReviewRoute);
app.use("/api/orders", OrderRoute);

app.get("/", (req, res) =>{
    res.send("Meal Mate API is running");
});

app.use((err, req, res, next) =>{
    console.error(err.stack);
    res.status(500).json({
        error : "Internal Server Error"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
