const jwt = require('jsonwebtoken');

module.exports = async function(req,res,next){
  //Get token
  const token = req.header('x-auth-token');
  console.log(token);

  if(!token){
    return res.status(401).json({
      message: "No token, access denied"
    })
  }
  //verify token

  try{
    const decoded = jwt.verify(token,'111111');
    req.user = decoded;
    next();
  }catch(err){
    console.error(err.message);
    res.status(401).send("Unauthorized");
  }
  
}