const express = require('express');
const router = express.Router();
const {check,validationResult}=require('express-validator'); 
const bcrypt=require('bcryptjs');
var gravatar = require('gravatar');
// const { exists } = require('../../models/Users.Js');
const User=require('../../models/Users')
router.post('/',[check('name','Name is requires').not().isEmpty(),
check('email','Email is required, Enter valid Email Address').isEmail(),
check('password','Please Enter a password with 6 or more characters').isLength({min:6})
], 
async(req,res) => {
   const errors=validationResult(req);
   if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
   }
   const {name,email,password}=req.body;
try{
    //   <!!!!!!!!!........... See if User Exists..............!!!!!!!!!!>
    let user=await User.findOne({email});
    if(user){
        return res.status(400).json({errors:[{msg:'User Already Existed'}]});
    }
//   <!!!!!!!!!........... Get Users Gravatar..............!!!!!!!!!!>
const avatar=gravatar.url(email,{
    s:'200',
    r:'pg',
    d:'404'
})
    user=new User({
        name,
        email, 
        avatar,
        password,
    });
//   <!!!!!!!!!........... Encrypt Password..............!!!!!!!!!!>
const salt=  await bcrypt.genSalt(10);
user.password= await bcrypt.hash(password,salt);
 await user.save();
 console.log(user.password);
//   <!!!!!!!!!........... Return Jason Web Token..............!!!!!!!!!!>
    res.send('User Registered');
}catch(err){
    console.error(err.message);
    res.status(500).send('Server Error')
}

});
module.exports=router;