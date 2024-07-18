import asyncHandler from "express-async-handler";
import Products from "../Models/productModel.js";
import {v2 as cloudinary} from 'cloudinary';


export const createProduct = asyncHandler(async(req,res)=>{
    
const {name,sku,category,quantity,price,description,
    seller,sellerAddress,delivered,deliveryDate
} = req.body;

//validation
if(!name || !quantity || !price || !description || !category){
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
       category:category,
       quantity:quantity,
       price:price,
       description:description,
       image:fileData,
       seller:seller,
       sellerAddress:sellerAddress,
       delivered:delivered,
       deliveryDate:deliveryDate
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
        res.status(404).json({message:"product not found"})
        throw new Error("product not found")
    }

    if(product.user.toString() !== req.user.id){
        res.status(401).json({message:"user not authorized"})
        throw new Error("user not authorized")
    }

    await product.deleteOne()
    res.status(200).json({message:"deleted successfully",data:product})
})


export const updateProduct = asyncHandler(async(req,res)=>{
    const {name,sku,category,quantity,price,description,seller,sellerAddress,delivered,deliveryDate} = req.body;

    const productId = req.params.id
    const product = await Products.findById(productId) 
  
    if(!product){
        res.status(404).json({message:"product not found"})
        throw new Error("product not found")
    }

    if(product.user.toString() !== req.user.id){
        res.status(401).json({message:"user not authorized"})
        throw new Error("user not authorized")
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



const updatedProduct =await Products.findByIdAndUpdate({_id:productId},
    {
       name,
       category,
       quantity,
       price,
       description,
       image:Object.keys(fileData).length>0?fileData:product.image,
       seller,
       sellerAddress,
       delivered,
       deliveryDate 
    },
    {
       new:true,
       runValidators:true
    }
)



res.status(200).json({message:"product",data:updatedProduct})

})

