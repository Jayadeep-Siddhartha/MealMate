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

// Update food availability
router.put("/:id/availability", async (req, res) => {
    const { quantity } = req.body;
    console.log("Reachef food put");
    try {
      const food = await FoodModel.findById(req.params.id);
  
      if (!food) {
        return res.status(404).json({ error: "Food item not found" });
      }
  
      if (food.availability < quantity) {
        return res.status(400).json({ error: "Not enough availability" });
      }
  
      food.availability -= quantity;
      await food.save();
  
      res.status(200).json(food);
    } catch (error) {
      console.error("Error updating availability:", error);
      res.status(500).json({ error: "Error updating availability" });
    }
  });
  
module.exports = router;