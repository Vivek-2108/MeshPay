const crypto = require("crypto");

const cryptoConfig = require("../config/cryptoConfig");
const algorithms = require("../constants/algorithms");
const keyManager = require("./keyManager");
const { hashPacket } = require("./hashService");

class PacketBuilder {

    build({encryptedKey,iv,authTag,ciphertext }) {

        const packet = {

            packetId:crypto.randomUUID(),

            version:cryptoConfig.PACKET.VERSION,

            keyId:keyManager.getKeyId(),

            algorithm:{
                symmetric: algorithms.AES_GCM,
                asymmetric: algorithms.RSA_OAEP_SHA256,
                hash: algorithms.SHA256
            },

            createdAt: Date.now(),

            encryptedKey: encryptedKey.toString("base64"),

            iv: iv.toString("base64"),

            authTag: authTag.toString("base64"),

            ciphertext: ciphertext.toString("base64")
        };

        packet.packetHash = hashPacket(packet);

        return packet;

    }

}

module.exports = new PacketBuilder();