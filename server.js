const express = require('express');
const mongoose = require('mongoose');
const PORT = 3000;
const User = require('./models/user.model');
const app = express();
app.use(express.json());

app.get('/',(req,res)=>{
  res.send('hello');
})
app.get('/api/user/listall', async (req,res)=>{
  try{
    let user=  await User.find({
      email:"guddababy"
    });
    // let data= user.find();
    res.status(200).json(user);
  }
  catch(err){
    console.log(err);
    res.status(500).send({
      "message":"Internal error found",
    })
  }
  
})
app.post('/api/user/create', async (req, res) => {
  try{
    const {firstname, lastname, phone, email, password} = req.body;
    if(!firstname || !lastname || !phone || !email || !password){
      return res.status(400).json({message:"Data missing"})
    }
    
    let user = new User({firstname,lastname,phone,email,password});
    // user.save().then((result) => {
    //   res.status(200).send("User Registered")
    // });
    let data = await user.save();
    if(!data){
      throw new Error("Error")
    }
    res.status(200).json({data});
  }catch(err) {
    console.error(err);
    res.status(500).send("Something went wrong")
  }
  
})



mongoose.connect("mongodb://127.0.0.1:27017",{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then((client) => {
  console.log("Database connected");
  
}).catch((err)=>{
  console.error(err);
})
const server = app.listen(PORT,"127.0.0.1",() => {
  console.log(`Server running at port ${PORT}`);
})