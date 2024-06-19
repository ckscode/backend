import asyncHandler from 'express-async-handler'
import User from '../Models/Schema.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config()

const generateToken = (id) =>{
   return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'1d'})
}

//register user
export const registerUser =asyncHandler(
    async (req,res) =>{

        const {name,email,password} =req.body;
        
        //fields exists
        if(!name || !email || !password){
            res.status(404)
            throw new Error('please fill all the fields')
        }

        //password length
        if(password.length < 6){
            res.status(404)
            throw new Error('password must be more than 6 characters')
        }

        //checking user already exists
        const userExists =await User.findOne({email:email})
          if(userExists){
            res.status(404)
            throw new Error('User already exists');
          }
         

       
          const newUser = new User({name,email,password});
          await newUser.save();
    

          //generate token
          const token = generateToken(newUser._id);

         //send HTTP-only cookie
         res.cookie("token",token,{
          path:"/",
          httpOnly:true,
          expires:new Date(Date.now() + 1000 *86400),
          sameSite:"none",
          secure:true
         })

          if(newUser){
            const {_id,name,email,contact,photo,bio} = newUser
            res.status(200).json({message:'user added successfully',data:{_id,name,email,contact,photo,bio,token}})
          }else{
            res.status(404)
            throw new Error('Invalid user data')
          }
         
}
)


export const loginUser =asyncHandler(async(req,res) =>{
     const {email,password} = req.body;

     if(!email || !password){
      res.status(404)
      throw new Error('please add email and password')
     }


     //check i user exists
     const user  = await User.findOne({email})
     if(!user){
      res.status(404)
      throw new Error('User not found please Signup');
    }

   

    //User exists,check if password exists
    const compare = await bcrypt.compare(password,user.password);

    if(!compare){
      res.status(404)
      throw new Error('Invalid password')
    }

     //generate token
     const token=generateToken(user._id);

 

    if(user && compare){
      const {_id,name,email,contact,photo,bio} = user
      res.cookie("token",token,{
        path:"/",
        httpOnly:true,
        expires:new Date(Date.now() + 1000 * 86400),
        sameSite:"none",
        secure:true 
      })
      res.status(200).json({message:'Logged in user added successfully',data:{_id,name,email,contact,photo,bio,token}})
    }else{
      res.status(404)
      throw new Error('Invalid Email or Password')
    }

}) 


export const logoutUser =asyncHandler(async(req,res)=>{
  res.clearCookie('token', {
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true
});
    res.status(200).json({message:'logged out successfully'})
})


export const getUser = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.user._id);

  if(user){
    const {_id,name,email,contact,photo,bio} = user
    res.status(200).json({message:'User Details',data:{_id,name,email,contact,photo,bio}})
  }else{
    res.status(404)
    throw new Error('User not found')
  }
})