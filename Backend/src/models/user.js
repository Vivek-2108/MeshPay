const mongoose=require("mongoose");

const userSchema=new mongoose.Schema(
    {
        name:{ type:String, required:true },
        email:{ type:String, required:true , unique:true },
        password:{ type: String , required: true , select:false}, //  (select: false) This tells Mongoose not to return this field by default when querying.
        vpa:{ type:String , required:true , unique:true},
        balance:{ type:Number , default: 10000},
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("user",userSchema);