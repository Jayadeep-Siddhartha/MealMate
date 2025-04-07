const express = require('express');
const router = express.Router();
const FoodModel = require("../models/FoodModel")

router.get("/", async (req, res) => {
    try{
        const foods = await FoodModel.find();
        res.status(200).json(foods);
    }catch (error){
        res.status(500).json({
            error : "Error Fetchiing Food Items"
        });
    }
});

router.get("/:id", async (req, res) =>{
    try{
        const food = await FoodModel.findById(req.params.id);
        res.status(200).json(food);
    }catch (error){
        res.status(500).json({
            error : "Food Item not found"
        });
    }
});

module.exports = router;