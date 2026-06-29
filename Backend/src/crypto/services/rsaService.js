const crypto = require("crypto");

const keyManager = require("../utils/keyManager");

const cryptoConfig = require("../config/cryptoConfig");

class RSAService {
    encryptAESKey(aesKey){
        return crypto.publicEncrypt(
            {
                key: keyManager.getPublicKey(),
                oaepHash:cryptoConfig.RSA.OAEP_HASH
                
            },aesKey
        );
    }

    decryptAESKey(encryptedAESKey){

        return crypto.privateDecrypt(

            {
                key:keyManager.getPrivateKey(),
                oaepHash:cryptoConfig.RSA.OAEP_HASH

            },encryptedAESKey
        );
    }
}

module.exports = new RSAService();