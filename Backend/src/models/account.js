const mongoose=require("mongoose");

const accountSchema=mongoose.Schema(
 {

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
        unique:true
    },

    accountNumber:{
        type:String,
        required:true,
        unique:true
    },

    balance:{
        type:Number,
        required:true,
        default:10000,
        min:0
    },

    currency:{
        type:String,
        default:"INR",
        enum:["INR"]
    },

    status:{
        type:String,
        default:"ACTIVE",
        enum:["ACTIVE", "BLOCKED", "FROZEN", "CLOSED",]
    }

  },
  {
    timestamp:true,
    versionKey:false
  }
);

module.exports = mongoose.model("account",accountSchema);