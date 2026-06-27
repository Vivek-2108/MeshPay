const mongoose=require("mongoose");

const transactionSchema = mongoose.Schema(
    {
        transactionId:{
            type:String,
            required:true,
            unique:true
        },

        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"account",
            required:true,
        },

        receiver:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"account",
            required:true
        },

        amount:{
            type:Number,
            required:true,
            min:0
        },

        packetId:{
            type:String,
            required:true,
            unique:true
        },

        packetHash:{
            type:String,
            required:true,
            unique:true,
            index:true
        },

        nonce:{
            type:String,
            required:true,
            unique:true
        },

        status:{
            type:String,
            enum:["PENDING","SETTLED","FAILED","REJECTED"],
            default:"PENDING"
        },

        signedAt:{
            type:Date,
            required:true
        },

        settledAt:{
            type:Date
        }

    },
    {
        timestamp:true,
        versionKey:false
    }
);

module.exports=mongoose.model("transaction",transactionSchema);


// improvement needed -- Instead of sender and receiver store Account referenceswith help of transactionId