const express = require('express');
const { connect } = require('http2');
const connectDB = require('./config/DB');
const app = express();
const PORT = process.env.PORT || 5000;
const db=require('./config/DB')

// <!!!!!!!!!!!!.............Connect Database................!!!!!!!!!>

connectDB();

// <!!!!!!!!!!!!.............Init Middle Ware................!!!!!!!!!>

app.use(express.json({extended:false}))

// <!!!!!!!!!!!!.............Define Routes................!!!!!!!!!>
app.use('/api/users',require('./Routes/api/users'));
app.use('/api/auth',require('./Routes/api/auth'));
app.use('/api/posts',require('./Routes/api/posts'));
app.use('/api/profile',require('./Routes/api/profiles'));

app.get('/',(req,res)=>res.send('Api is Working Fine...!'));
app.listen(PORT,()=>console.log(`Server Started on Port: ${PORT}`));