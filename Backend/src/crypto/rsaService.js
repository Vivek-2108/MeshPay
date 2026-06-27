const crypto=require("crypto");

const {getPublicKey,getPrivateKey}=require("./keyManager");

exports.encryptedAESKey = (aesKey)=>{
    return crypto.publicEncrypt(
        {key:getPublicKey(),
            oaepHash:"sha256"
        },
        aeskey
    );
};

exports.decryptAESKey=(encryptedAESKey)=>{
    return crypto.privateDecrypt(
    {
        key:getPrivateKey(),
        oaephash:"sha256"
    },
    this.encryptedAESKey
    );
};

