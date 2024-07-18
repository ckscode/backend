import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
  },
  name:{
    type:String,
    required:[true,'Please add a Name'],
    trim:true
  },
  sku:{
    type:String,
    required:true,
    default:'SKU',
    trim:true
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
    trim: true,
  },
  quantity:{
    type:String,
    required:[true,'please add quantity'],
    trim:true
  },
  price:{
    type:String,
    required:[true,'please add price'],
    trim:true
  },
  description:{
    type:String,
    required:[true,'please add a description'],
    trim:true
  },
  image:{
    type:Object,
    default:{}
  },
  seller:{
    type:String,
    required:[true,'Seller Name is Required']
  },
  sellerAddress:{
    type:String,
    required:[true,'Seller Address is Required']
  },
  delivered:{
    type:Boolean,
    required:[true,'Delivery Status is required']
  },
  deliveryDate:{
    type:String,
  }
},{
    timestamps:true
})

const Products = mongoose.model("Products",productSchema);

export default Products;