const express = require('express');
const mongoose = require('mongoose');
const PORT = 3000;
const User = require('./models/user.model');
const auth = require('./middleware/authenticate.middleware');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

app.get('/',(req,res)=>{
  res.send('hello');
})
app.get('/api/user/listall',auth, async (req,res)=>{
  try{
    console.log(req.user)
    let user=  await User.find({
      email: req.user.id
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
    let datas = await User.find();
    let user = new User({firstname,lastname,phone,email,password});
    let data = await user.save();
    if(!data){
      throw new Error("Error")
    }
    res.status(200).json({data,datas});
  }catch(err) {
    console.error(err);
    res.status(500).send("Something went wrong")
  }
  
})

app.post('/api/user/login',async (req, res) => {
  const {email, password} = req.body;   //Destructuring
  // const email = req.body.email;
  // const password = req.body.password;
  try{
    let user = await User.findOne({
      email: email
    });
    if(!user){
      return res.status(400).json({error:{message:"Invalid Credentials"}});
    }
    if(user.password !== password){
      return res.status(400).json("INvalid");
    }

    const payload = {
      id: user.email
    };
    const token = jwt.sign(payload,'111111',{expiresIn: '1h'})
    res.status(200).json({token});
  }catch(err){
    console.error(err);
    res.status(500).send("Internal Server Error")
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