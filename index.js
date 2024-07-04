import express from 'express';
import dotenv from 'dotenv';
import connectDB from './Database/Config.js';
import cors from 'cors';
import userRouter from './Routers/userRoutes.js';
import productRoute from './Routers/productRoute.js';
import contactRoute from './Routers/contactRoute.js'
import { errorHandler } from './Middlewares/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';


//Dotenv
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//Middlewares
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}
));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use("/uploads",express.static(path.join(__dirname,"uploads")))
//Connecting DB
connectDB()

//Routes
app.use('/api/users',userRouter);
app.use('/api/products',productRoute);
app.use('/api/contact',contactRoute)

app.use(errorHandler)

app.get('/',(req,res)=>{
    res.status(200).send('welcome to inventory')
})

//starting app
app.listen(process.env.PORT,()=>{
    console.log('app is listening')
})
