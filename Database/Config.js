import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const mongo_url = process.env.MONGODB_URL

const connectDB = async(req,res) =>{
    try{
      const connection = await mongoose.connect(mongo_url);
      console.log("mongoDB connected successfully");
      return connection;
    }catch(err){
        console.log(err)
        res.status(500).json({message:"error in MOngoDB connection"})
    }
}

export default connectDB;