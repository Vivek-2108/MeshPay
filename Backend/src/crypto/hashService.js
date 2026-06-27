const crypto=require("crypto");

exports.hshCiphertext=(ciphertext)=>{
        return crypto.createHash("sha256").update(ciphertext).digest("hex");        
};