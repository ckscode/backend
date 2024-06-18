import dotenv from 'dotenv'

dotenv.config()
export const errorHandler = (err,req,res,next) =>{
    console.error(err.stack); // Log the error stack for debugging

    // Set the status code and send the error response
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            stack:process.env.NODE_ENV==="development"?err.stack:null
        }})
}

