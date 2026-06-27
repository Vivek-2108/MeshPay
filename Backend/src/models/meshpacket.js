const mongoose=require("mongoose");

const meshpacketSchema=mongoose.Schema(
    {
        packetId:{
            type:String,
            required:true,
            unique:true
        },

        ciphertext:{
            type:String,
            required:true,
        },

        ttl:{
            type:Number,
            default:5,
            min:0
        },

        hopcount:{
            type:Number,
            default:0
        },

        currentholder:{
            type:String,
            required:true
        },

        uploaded:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamp:true
    }
);

module.exports=mongoose.model("meshpacket",meshpacketSchema);
