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
  location:{
    type:String,
    required:true,
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
  }
},{
    timestamps:true
})

const Products = mongoose.model("Products",productSchema);

export default Products;