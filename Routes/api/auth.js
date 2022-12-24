const express = require('express');
const router = express.Router();
const User = require('../../models/User')
const auth = require('../../middleware/auth')
const {check,validationResult}=require('express-validator'); 
const bcrypt=require('bcryptjs');
const jwt =require('jsonwebtoken')
const config=require('config')
router.get('/',auth, async (req,res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error...!')
    }
});

router.post('/',[
check('email','Email is required, Enter valid Email Address').isEmail(),
check('password','Password Requires, Plz Enter a Password').exists()
],
async(req,res) => {
   const errors=validationResult(req);
   if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
   }
   const {email,password}=req.body;
try{
    //   <!!!!!!!!!........... See if User Exists..............!!!!!!!!!!>
    let user=await User.findOne({email});
    if(!user){
        return res.status(400).json({errors:[{msg:'Invalid Credentials for Login'}]});
    }
    
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({errors:[{msg:'Invalid Credentials for Login'}]});
    }

//   <!!!!!!!!!........... Check Jason Web Token..............!!!!!!!!!!>
    const payload ={
        user:{
            id:user.id
        }
    };
    jwt.sign(
        payload, config.get('jwtSecret'),
        { expiresIn:'36000'},(err, token)=>{
            if(err) throw err;
            res.json({token});
        });
}catch(err){
    console.error(err.message);
    res.status(500).send('Server Error')
}

});

module.exports=router;