const mongoose=require("mongoose");

const userSchema=new mongoose.Schema(
    {
        name:{ type:String, required:true,trim:true },
        email:{ type:String, required:true , unique:true ,lowercase:true},
        password:{ type: String , required: true , select:false}, //  (select: false) This tells Mongoose not to return this field by default when querying.
        vpa:{ type:String , required:true , unique:true , lowercase:true},
        isVerified: {
            type:Boolean,
            default:false
        }
    },
    {
        timestamps:true,
        versionKey:false
    }
);

module.exports = mongoose.model("user",userSchema);