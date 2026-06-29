const aesService = require("./aesService");

const rsaService = require("./rsaService");

const packetBuilder =require("../utils/packetBuilder");

class HybridCryptoService {

    encryptPayment(paymentInstruction) {

        const plaintext = JSON.stringify(paymentInstruction);

        const aesResult = aesService.encrypt(plaintext);

        const encryptedKey = rsaService.encryptAESKey(aesResult.key );

        return packetBuilder.build({
            
            encryptedKey,

            iv: aesResult.iv,

            authTag: aesResult.authTag,

            ciphertext: aesResult.ciphertext

        });
    }

    decryptPayment(packet) {
        const aesKey = rsaService.decryptAESKey(
                Buffer.from(packet.encryptedKey,"base64"));

        const plaintext = aesService.decrypt({

                ciphertext:
                    Buffer.from(
                        packet.ciphertext,
                        "base64"
                    ),

                key: aesKey,

                iv:
                    Buffer.from(
                        packet.iv,
                        "base64"
                    ),

                authTag:
                    Buffer.from(
                        packet.authTag,
                        "base64"
                    )

            });

        return JSON.parse(plaintext);
    }
}

module.exports = new HybridCryptoService();