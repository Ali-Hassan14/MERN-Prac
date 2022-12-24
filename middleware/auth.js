const jwt = require('jsonwebtoken');
const config = require('config');
module.exports =function(req,res,next){
    const token=req.header('x-auth-token');
    if(!token){
    return res.status(401).json({msg:'No token, Authorization Denied'});
    }
    try{
        const decodedPswd=jwt.verify(token,config.get('jwtSecret'));
        req.user=decodedPswd.user;
        next();
    } catch(err){
        res.status(401).json({msg:"Token is not Valid, Please check again...!"})
    }
}
