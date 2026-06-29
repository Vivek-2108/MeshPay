const crypto = require("crypto");

const cryptoConfig = require("../config/cryptoConfig");

exports.hashPacket = (packet) => {

    const hash = crypto.createHash( cryptoConfig.HASH.ALGORITHM );

    
    hash.update(packet.packetId);

    hash.update(packet.encryptedKey);

    hash.update(packet.iv);

    hash.update(packet.authTag);

    hash.update(packet.ciphertext);

    return hash.digest("hex");

};