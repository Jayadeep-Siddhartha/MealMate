const express = require('express');
const router = express.Router();
const CafeteriaModel = require('../models/CafeteriaModel');

router.get('/', async (requestAnimationFrame, res) =>{
    try{
        const cafeterias = await CafeteriaModel.find();
        res.status(200).json(cafeterias);
    }catch(error) {
        res.status(500).json({
            error : "Error Fetching Cafeterias"
        });
    }
});

router.get("/:id", async (req, res) => {
    try{
        const cafeteria = await CafeteriaModel.findById(req.params.id).populate("menu");
        res.status(200).json(cafeteria);
    }catch (error){
        res.status(500).json({
            error : "Cafeteria not found"
        });
    }
})

module.exports = router;