import asyncHandler from 'express-async-handler'
import User from '../Models/Schema.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const generateToken = (id) =>{
   return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'1d'})
}

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
    
          const token = generateToken(newUser._id);

          if(newUser){
            const {_id,name,email,contact,photo,bio} = newUser
            res.status(200).json({message:'user added successfully',data:{_id,name,email,contact,photo,bio,token}})
          }else{
            res.status(404)
            throw new Error('Invalid user data')
          }
         
}
)

