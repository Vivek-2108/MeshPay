const crypto = require("crypto");

const cryptoConfig = require("../config/cryptoConfig");

const{ AES } = cryptoConfig;

class AESService{

    generateKey(){
        return crypto.randomBytes(
            AES.KEY_SIZE
        );

    }

    generateIV(){
        return crypto.randomBytes(
            AES.IV_SIZE
        );
    }

    encrypt(plaintext){

        const key = this.generateKey();

        const iv = this.generateIV();

        const cipher = crypto.createCipheriv(AES.ALGORITHM,key,iv);

        const ciphertext = Buffer.concat([ cipher.update( plaintext, "utf8" ),cipher.final() ]);

        const authTag = cipher.getAuthTag();

        return {
            key,
            iv,
            authTag,
            ciphertext
        };

    }

    decrypt({ ciphertext, key, iv, authTag }) {

        const decipher =  crypto.createDecipheriv( AES.ALGORITHM, key, iv );

        decipher.setAuthTag(authTag);

        const plaintext = Buffer.concat([ decipher.update(ciphertext),decipher.final()]);
        return plaintext.toString();
    }
}

module.exports = new AESService();