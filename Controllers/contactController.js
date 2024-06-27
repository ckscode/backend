import asyncHandler from "express-async-handler";
import sendEmail from '../utils/sendEmail.js';
import User from "../Models/Schema.js";


export const contactUs = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);
    const {subject,message} = req.body;

   if(!subject || !message){
    res.status(404)
    throw new Error('Please fill all the fields') 
   }

    const sent_to = process.env.EMAIL_USER;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = user.email;
 
    try{
      await sendEmail(subject,message,sent_from,sent_to,reply_to)
      res.status(200).json({success:true,message:"reset email sent"})
    }catch(error){
          res.status(500)
          throw new Error('EMail not sent, please try again')
    }
})