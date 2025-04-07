const express = require('express')
const router  = express.Router()

const UserModel = require('../models/UserModel')

router.get("/:id", async (req, res) =>{
    try{
        const user = await UserModel.findById(req.params.id).populate("savedCafeterias preferences");

        if(!user) {
            return res.status(404).json({
                error : "User not found"
            });
        }

        res.status(200).json(user);
    }catch(error) {
        console.error("Get User Error : ", error);
        res.status(500).json({
            error : "Internal Server Error"
        });
    }
});

router.put("/:id", async (req, res) =>{
    try{
        const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, {new : true});

        if(!updatedUser){
            return res.status(404).json({
                error : "User Not found"
            });
        }

        res.status(200).json(updatedUser);
    }catch(error) {
        console.error("Update User Error : ", error);
        res.status(500).json({
            error : "Update failed"
        });
    }
});

router.delete("/:id", async (req, res) =>{
    try{
        await UserModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message : "User deleted successfully"
        });
    }catch(error){
        console.error("Delete User Error : ", error);
        res.status(500).json({
            error : "Delete Failed"
        });
    }
});

module.exports = router;