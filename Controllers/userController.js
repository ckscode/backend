import asyncHandler from 'express-async-handler'
import User from '../Models/Schema.js';

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
          if(newUser){
            res.status(200).json({message:'user added successfully',data:newUser})
          }else{
            res.status(404)
            throw new Error('Invalid user data')
          }
         
}
)

