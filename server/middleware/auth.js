const admin = require('../config/firebaseAdmin');

const verifyToken = async (req, res, next) =>{
    const token = req.headers.authorization?.split("Bearer ")[1];

    if(!token){
        return res.status(401).json({
            error : "Unauthorized: No token found"
        });
    }

    try{
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    }catch (error){
        res.status(403).json({
            error : "Unauthorized : Invalid Token"
        });
    }
}

module.exports = verifyToken;