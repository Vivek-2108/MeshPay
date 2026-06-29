module.exports = {

    RSA: {
        MODULUS_LENGTH: 2048,
        OAEP_HASH: "sha256",
        KEY_ID: "rsa-v1"
    },

    AES: {
        ALGORITHM: "aes-256-gcm",
        KEY_SIZE: 32,
        IV_SIZE: 12,
        AUTH_TAG_SIZE: 16
    },

    HASH: {
        ALGORITHM: "sha256"
    },

    PACKET: {
        VERSION: 1
    }

};