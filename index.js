import express from 'express';
import dotenv from 'dotenv';
import connectDB from './Database/Config.js';
import cors from 'cors'
import userRouter from './Routers/userRoutes.js'
import { errorHandler } from './Middlewares/errorMiddleware.js';
import cookieParser from 'cookie-parser';
//Dotenv
dotenv.config();
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//Connecting DB
connectDB()

//Routes
app.use('/api/users',userRouter)

app.use(errorHandler)

app.get('/',(req,res)=>{
    res.status(200).send('welcome to inventory')
})

//starting app
app.listen(process.env.PORT,()=>{
    console.log('app is listening')
})
