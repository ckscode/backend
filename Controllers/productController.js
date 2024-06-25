import asyncHandler from "express-async-handler";
import Products from "../Models/productModel.js";
import {v2 as cloudinary} from 'cloudinary';


export const createProduct = asyncHandler(async(req,res)=>{
const {name,sku,quantity,price,location,description} = req.body;

//validation
if(!name || !quantity || !price || !description || !location){
    console.log(req.body)
    res.status(404)
    throw new Error("please fill all the fields")
}

//handle file upload
const fileData = {}
if(req.file){
    //save
    try{
        const uploadedFile = await cloudinary.uploader.upload(req.file.path,
            {folder:"inventory app",resource_type:"image"});
            Object.assign(fileData,{fileName:req.file.originalname,
                filePath:uploadedFile.secure_url,
                fileType:req.file.mimetype,
                fileSize:req.file.size,
            })
    }catch{
       res.status(404)
       throw new Error("image could not be uploaded")
    }


}


//create product
const product = new Products({
       user:req.user.id,
       name:name,
       sku:sku,
       quantity:quantity,
       price:price,
       location:location,
       description:description,
       image:fileData
});

await product.save();

res.status(200).json({message:"product",data:product})

})



export const getAllProducts = asyncHandler(async(req,res)=>{
    const allProducts = await Products.find({user:req.user.id}).sort("-createdAt");
    if(allProducts){
        res.status(200).json({message:"products",data:allProducts});
    }else{
        res.status(404)
        throw new Error("no products found")
    }
})


export const getProduct =asyncHandler(async(req,res)=>{
    const product = await Products.findById(req.params.id);

    if(!product){
        res.status(404)
        throw new Error("product not found")
    }

    if(product.user.toString() !== req.user.id){
        res.status(401)
        throw new Error("user not authorized")
    }

    res.status(200).json({message:"product",data:product})
})


export const deleteProduct =asyncHandler(async(req,res)=>{
    const product = await Products.findById(req.params.id);

    if(!product){
        res.status(404)
        throw new Error("product not found")
    }

    if(product.user.toString() !== req.user.id){
        res.status(401)
        throw new Error("user not authorized")
    }

    await product.deleteOne()
    res.status(200).json({message:"deleted successfully",data:product})
})

