const express = require('express');
const router = express.Router();

const ReviewModel = require('../models/ReviewModel')

router.post("/", async(req, res) => {
    try{
        const {userId, cafeteriaId, rating, comment} = req.body;
        const review = new Review({userId, cafeteriaId, rating, comment});
        await review.save();
        res.status(200).json(review);
    }catch (error){
        res.status(500).json({
            error : "Failed to add review"
        });
    }
});

router.get("/:cafeteriaId", async (req, res) =>{
    try{
        const reviews = await Review.find({cafteriaId : req.params.cafeteriaId});
        res.status(200).json(reviews);
    }catch (error){
        res.status(500).json({
            error : "Failed to get reviews"
        });
    }
});

module.exports = router;
