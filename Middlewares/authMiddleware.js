import asyncHandler from 'express-async-handler'
import User from '../Models/Schema.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()
export const protect =asyncHandler(async(req,res,next)=>{
    try{
       const token = req.cookies.token
       if(!token){
        res.status(404)
        throw new Error('Not authorized,please Login')
       }
        
       //verify token
       const verified = jwt.verify(token,process.env.JWT_SECRET);

       //get user id from token
       const user = await User.findById(verified.id).select('-password');

       if(!user){
        res.status(404)
        throw new Error('User not found')
       }
     
     req.user = user
     next();
    }catch(error){
        res.status(404)
        throw new Error('Not authorized,please Login')
    }
})