import asyncHandler from 'express-async-handler'
import User from '../Models/Schema.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'
import Token from '../Models/tokenModel.js';
import sendEmail from '../utils/sendEmail.js';

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
            res.status(404).json({message:'please fill all the fields'})
        
        }

        //password length
        if(password.length < 8){
            res.status(404).json({message:'password must be more than 8 characters'})
        }

        //checking user already exists
        const userExists =await User.findOne({email:email})
          if(userExists){
            res.status(404).json({message:'User already exists'})
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
            res.status(404).json({message:'Invalid user data'})
          }
         
}
)


export const loginUser =asyncHandler(async(req,res) =>{
     const {email,password} = req.body;

     if(!email || !password){
      res.status(404).json({message:'please add email and password'})
     }


     //check if user exists
     const user  = await User.findOne({email})
     if(!user){
      res.status(404).json({message:'User not found please Signup'})

    }

   

    //User exists,check if password exists
    const compare = await bcrypt.compare(password,user.password);

    if(!compare){
      res.status(404).json({message:'Invalid password'})
 
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
      res.status(200).json({message:'Logged in user successfully',data:{_id,name,email,contact,photo,bio,token}})
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
    res.status(404).json({message:'User not found'})

  }
})


export const loginStatus = asyncHandler(async(req,res)=>{
  const token = req.cookies.token;
  if(!token){
    return res.json(false)
  }

const verified = jwt.verify(token,process.env.JWT_SECRET);

if(verified){
 return  res.json(true)
}
return  res.json(false)
})

export const updateUser = asyncHandler(async(req,res) =>{
  const user = await User.findById(req.user._id);
  if(user){
    const {_id,name,email,contact,photo,bio} = user;
    user.name = req.body.name || name;
    user.email = email;
    user.contact = req.body.contact || contact;
    user.photo = req.body.photo || photo;
    user.bio = req.body.bio || bio;

    const updatedUser = await user.save();
    res.status(200).json({message:"User updated successfully",
      data:{  _id:updatedUser._id,
        name:updatedUser.name,
        email:updatedUser.email,
        contact:updatedUser.contact,
        photo:updatedUser.photo,
        bio:updatedUser.bio}
    })
  }
  
})


export const updatePassword =asyncHandler(async(req,res) =>{
  const user = await User.findById(req.user._id);
   const {oldPassword,newPassword} = req.body;
   
 if(!user){
  res.status(400).json({message:"User not found,please sign in"})

 }

   if(!oldPassword || !newPassword){
    res.status(404).json({message:"please fill up old password and new password"})
 
   }


   //change password
    const compare = await bcrypt.compare(oldPassword,user.password)
    if(user && compare){
      if(oldPassword !==newPassword){
        user.password = newPassword
        await user.save();
        res.status(200).json({message:'password changed successfully'})
      }else{
        res.status(404).json({message:"please give a new password which is different from the old password"})
      
      }
    }else{
      res.status(404).json({message:'Old password is incorrect'})

    }
  }
) 


export const forgotPassword = asyncHandler(async(req,res)=>{
    const {email} = req.body;
    const user = await User.findOne({email});

    if(!user){
      res.status(404)
   
    }
   
    //delete existing Token
    const token = await Token.findOne({userId:user._id})
    if(token){
      await token.deleteOne()
    }
   //create Reset token
   let resetToken = crypto.randomBytes(32).toString("hex") + user._id;


   const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

   //save token
   await new Token({
    userId:user._id,
    token:hashedToken,
    createdAt:Date.now(),
    expiresAt:Date.now() + 30* (60 * 1000) //30 minutes
   }).save()

   const resetUrl = `${process.env.FRONTEND_URL}/reset/${resetToken}`

   //reset email
   const message = `
   <h1>Hello ${user.name}</h1>
   <p>Please use the URL below to reset your password</p>
   <p>This link is valid only for 30 minutes</p>
   <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`

   const subject = "password reset email";
   const sent_to = user.email;
   const sent_from = process.env.EMAIL_USER;

   try{
     await sendEmail(subject,message,sent_from,sent_to)
     res.status(200).json({success:true,message:"reset email sent"})
   }catch(error){
         res.status(500).json({message:"server error",error:error})
        
   }
})


export const resetPassword = asyncHandler(async(req,res)=>{
       const {password} = req.body;
       const {resetToken} = req.params

       //hash the reset token and compare
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  //find token in the DB
  const userToken = await Token.findOne({
    token:hashedToken,
    expiresAt :{$gt:Date.now()}
  })

  if(!userToken){
    res.status(404).json({message:'Invalid or expired token'})

  }

  //Find user
  const user = await User.findOne({_id:userToken.userId});
  user.password = password
  await user.save()
  res.status(200).json({
    message:"Password reset successful"
  })

})