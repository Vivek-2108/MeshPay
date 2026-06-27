const crypto=require("crypto");

const Algorithm="aes-256-gcm";

exports.encrypt = (plaintext)=>{
    const key = crypto.randomBytes(32);
    const iv=crypto.randomBytes(12);

    const cipher=crypto.createCipheriv(Algorithm,key,iv);

    const encrypted=Buffer.concat([cipher.update(plaintext),cipher.final()]);

    const authTag=cipher.getAuthTag();

    return{
        key,iv,authTag,ciphertext:encrypted
    };
};

exports.decrypt=(ciphertext,key,iv,authTag)=>{

    const decipher=crypto.createDecipheriv(Algorithm,key,iv);

    decipher.setAuthTag(authTag);

    const decrypted=Buffer.concat([decipher.update(ciphertext),decipher.final()]);

    return decrypted.toString();
};