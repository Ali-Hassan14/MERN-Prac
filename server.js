const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
app.get('/',(req,res)=>res.send('Api is Working Fine...!'))
app.listen(PORT,()=>console.log(`Server Started on Port: ${PORT}`));