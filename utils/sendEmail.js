import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import asyncHandler from 'express-async-handler'
dotenv.config();
const sendEmail =asyncHandler(
    async(subject,message,sent_from,sent_to,reply_to) =>{
        const  transporter = nodemailer.createTransport({
            secure:true,
            host:'smtp.gmail.com',
            port: 465,
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            },
         tls: {
             // do not fail on invalid certs
             rejectUnauthorized: false,
           },
        })
     
        const options = {
         from:sent_from,
         to:sent_to,
         replyTo:reply_to,
         subject:subject,
         html:message,
        }
     
        //send email
        transporter.sendMail(options,async function(err,info){
        try{
         console.log(info)
        }catch{
         console.log(err)
        }
        })
     }
) 

export default sendEmail;