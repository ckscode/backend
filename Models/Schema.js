import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
     name:{
        type:String,
        required:[true,'please add name']
    },
     email:{
        type:String,
        required:[true,'please add name'],
        unique:true,
        trim:true,
        match:[
            /.+\@.+\..+/,'Give a valid email'
        ]
     },
     password:{
        type:String,
        required:[true,'please add password'],
    },
    photo:{
        type:String,
        default:"https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
    },
    bio:{
        type:String,
        maxLength:[250,"250 characters is the maximum"]
    },
    contact:{
        type:String
    }
 
},{
    timestamps:true
})

// Encrypt password before saving to DB
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()
    }

       //hashing password
       const hashedPassword = await bcrypt.hash(this.password,10);
       this.password = hashedPassword
       next()
})

const User = mongoose.model("User",userSchema);

export default User;