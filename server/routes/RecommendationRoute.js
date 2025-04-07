const express = require('express');
const router = express.Router();
const FoodModel = require('../models/FoodModel');
const UserModel = require('../models/UserModel');
const CafeteriaModel = require('../models/CafeteriaModel');

router.get("/:userId" , async (req, res) =>{
    try{
        const user = await UserModel.findById(req.params.userId);
        if(!user) return res.status(404).json({
            error : "User not found"
        });

        let recommendations = [];

        const popularFoods = await FoodModel.find().sort({rating : -1}).limit(5);
        recommendations.push(...popularFoods);

        if(user.savedCafeterias.length > 0){
            const favoriteCafeterias = await CafeteriaModel.find({
                id : {$in : user.savedCafeterias}
            });
            recommendations.push(...favoriteCafeterias);
        }

        if(user.preferences.length > 0){
            const preferenceFoods = await Food.find({category : {
                $in : user.preferences
            }}).limit(5);

            recommendations.push(...preferenceFoods);
        }

        const uniqueRecommendations = Array.from(new Set(recommendations.map(item => item.id.toString() ))).map(
            id => recommendations.find(item => item.id.toString() === id)
        );

        res.status(200).json(uniqueRecommendations);
    }catch(error){
        res.status(500).json({
            error : "Error Fetching recommendations"
        });
    }
})

module.exports = router;