//main service- Everything passes through here

const {encrypt,decrypt}=require("./aesService");

const {encryptedAESKey,decryptedAESKey}=require("./rsaService");

const {hashCihertext, hshCiphertext}=require("./hashService");

exports.encryptPayment=(payment)=>{
    const json=json.stringify(payment);
    const aes=encrypt(json);
    const encryptedKey=encryptedAESKey(aes.key);
    const payload={
        encryptedKey:encryptedKey.toString("base64"),
        iv:aes.iv.toString("base64"),
        authTag:aes.authTag.toString("base64"),
        ciphertext:aes.ciphertext.toString("base64")
    };

    return{
        payload,
        packetHash:hashCiphertext(payload.ciphertext)
    };
};

exports.decryptPayment=(payload)=>{
    const aeskey=decryptedAESKey(Buffer.from(payload.encryptedKey,"base64"));

    const plaintext=decrypt(Buffer.from(payload.ciphertext,"base64"),Buffer.from(payload.authTag,"base64"));

    return json.parse(plaintext);
};