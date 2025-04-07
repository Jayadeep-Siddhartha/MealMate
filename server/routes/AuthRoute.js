const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const admin = require('../config/firebaseAdmin');

router.post("/login", async (req, res) =>{
    try{
        const {idToken} = req.body;
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const {uid, email, name} = decodedToken;

        let user = await UserModel.findOne({firebaseId : uid});
        if(!user){
            return res.status(404).json({
                error : "User Not found"
            })
        }

        res.status(200).json({
            message : "User Logged in", user
        });
    }catch (error){
        console.error("Authentication Error : ", error);
        res.status(401).json({
            error : "Invalid token"
        });
    }
});

router.post("/signup" , async (req, res) =>{
    try{
        const {idToken, name, email, phone} = req.body;

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const {uid} = decodedToken;

        const existingUser = await UserModel.findOne({firebaseId : uid});

        if(existingUser){
            res.status(400).json({
                error : "User already exists. Please Login"
            });
        }

        const newUser = new UserModel({
            firebaseId : uid,
            name, email, phone, savedCafeterias : [], preferences : []
        });

        await newUser.save();
        res.status(201).json({
            message : "User Signed Up successfully"
        });
    }catch(error){
        console.error("Signup error : ", error);
        res.status(500).json({
            error : "SignUp failed"
        });
    }
});

module.exports = router;