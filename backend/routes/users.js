var express = require('express');
var app = express.Router();
const authen = require('../Schema/user');
const {hashing, hashCompare, createJWT } = require('../Schema/bcrypt') 
const jwt_decode = require('jwt-decode');
const nodemailer = require('nodemailer')

app.get('/', function(req, res, next) {
  res.send("<h1>Welcome Home!</h1>");
});

app.get('/all/:token',async function(req,res){
  try 
  {
      const headerToken = await req.params.token;
      //console.log(headerToken)
      var decoded = jwt_decode(headerToken);
      //console.log(decoded)
      if(decoded)
      {
          const list = await authen.find()
          res.json({
              list,
              message: "All the records are getting displayed!"
          })
      }
      else{
          res.json({                
              message: "Wrong Token"
          })
      }      
  } 
  catch (error) 
  {
      res.sendStatus(500)
      console.log("Error")
  }
  
});


app.post('/register',async function(req,res){
  try{
      let {name, mobile, email, password } = req.body;
      const list = await authen.find({email:email})        
      if(list.length){           
          res.json({
              message:"User already exists"
          }); 
      }
      else{
          let hash = await hashing(password)
          req.body.password = hash
          const people = await new authen(req.body);  //new    
          await people.save(); //save
          res.status(200).json({
              message:"Registered Successfully!"
          }); 
      }           
  } 
  catch (error){
      res.sendStatus(500)
      console.log(error);
  }
  
});

app.post('/login',async function(req,res){
  try 
  {
      const {email, password} = req.body;
      const user = await authen.find({email:email})    
      console.log(user);  
      if(user.length)
      {
          const compare = await hashCompare(password, user.password)
          if(compare){
          const token = await createJWT({
              email, 
              id:user._id
          })
          const transport = await nodemailer.createTransport({//create transport
            service:"gmail",//service provider
            auth:{
              user:'akalya2208@gmail.com',
              pass:'AkalyaRaj@22'
            }
          })
          const sendConfirmationEmail = await transport.sendMail({//sending mail with activation link
            from:'akalya2208@gmail.com',
            to:req.body.email,
            subject:"Account Activation",
            html:`<h1>Email Confirmation</h1>
            <h2>Hello ${user[0].name}</h2>
            <p>You are one step away to store your valuable data. Please confirm your email by clicking on the following link</p>
            <p>http://localhost:3000/users/all/${token}</p>
            </div>`
          })
          res.status(200).json({
            token,
            message:"Login success",
            instruction:"Check your mail inbox to get the token"
          })
          
          }
          else{
          res.status(400).json({
              message:"Wrong Password"
          })
          }
      
      }
   else
   {
     res.json({
       message:"User not available"
     })
   }
  } 
  catch (error) 
  {
      res.sendStatus(500)
      console.log(error);
  }
  
});

module.exports = app;

