const express = require('express');
const router = express.Router();
const ReservationModel = require("../models/ReservationModel");
const FoodModel = require("../models/FoodModel");

router.post("/", async (req, res) => {
    try{
        const {userId, cafeteriaId, items, totalAmount, status} = req.body;
        
        for(const item of items){
            const food = await FoodModel.findById(item.foodId);
            if(!food) return res.status(404).json({
                error : `Food Item ${item.foodId} not found`
            });

            if(food.availability < item.quantity){
                return res.status(400).json({
                    error : `Not Enough Availability for ${food.name}`
                });
            }
        }

        for(const item of items){
            await Food.findByIdAndUpdate(item.foodId ,{
                $inc : {availability : -item.quantity}
            });
        }

        const reservation = new ReservationModel({
            userId, cafeteriaId, items, totalAmount, status
        });

        await reservation.save();
        res.status(201).json(reservation);    
    }catch (error){
        res.status(500).json({
            error : "Resevration creation failed"
        });
    }
});

router.get("/:userId", async (req, res) =>{
    try{
        const reservations = await ReservationModel.findById({
            userId : req.params.userId
        }).populate("items.foodId");
        res.status(200).json(reservations);
    }catch (error){
        res.status(500).json({
            error : "Error fetching reservations"
        });
    }
});

router.put("/:id/confirm", async (req, res) =>{
    try{

        const reservation = await ReservationModel.findByIdAndUpdate(
            req.params.id,
            {status : true},
            { new: true }
        );
        res.status(200).json(reservation);
    }catch (error){
        res.status(500).json({
            error : "Error confirming reservations"
        });
    }
});

router.put("/:id/cancel", async (req, res) =>{
    try{

        const reservation = await ReservationModel.findById(req.params.id);
        if(!reservation) return res.status(404).json({
            error : "Reservation not found"
        });

        for(const item of reservation.items){
            await FoodModel.findByIdAndUpdate(item.foodId,{
                $inc : {availability : item.quantity}
            });
        }

        reservation.status = false;
        await reservation.save();

        res.status(200).json(reservation);
    }catch (error){
        res.status(500).json({
            error : "Error confirming reservation"
        });
    }
});

module.exports = router;