const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const cryptoConfig = require("../config/cryptoConfig");

const KEYS_DIRECTORY = path.join(__dirname, "../keys");

const PRIVATE_KEY_PATH=path.join(KEYS_DIRECTORY, "private.pem");

const PUBLIC_KEY_PATH=path.join(KEYS_DIRECTORY, "public.pem");

function ensureDirectoryExists(){

    if (!fs.existsSync(KEYS_DIRECTORY)){

        fs.mkdirSync(KEYS_DIRECTORY, {
            recursive: true
        });
    }

}

function generateKeys() {

    const{ publicKey, privateKey } = crypto.generateKeyPairSync("rsa",
        {
            modulusLength:
                cryptoConfig.RSA.MODULUS_LENGTH,

            publicKeyEncoding: {
                type: "spki",
                format: "pem"
            },

            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem"
            }
        }
    );

    fs.writeFileSync( PUBLIC_KEY_PATH, publicKey);
    fs.writeFileSync( PRIVATE_KEY_PATH, privateKey);
}

function initializeKeys() {

    ensureDirectoryExists();

    if( !fs.existsSync(PRIVATE_KEY_PATH) || !fs.existsSync(PUBLIC_KEY_PATH)) {
        console.log("Generating RSA Key Pair...");
        generateKeys();
    }
}

initializeKeys();

const publicKey = fs.readFileSync( PUBLIC_KEY_PATH,"utf8");

const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");

module.exports = {
    getPublicKey() {
        return publicKey;
    },

    getPrivateKey() {
        return privateKey;
    },

    getKeyId() {
        return cryptoConfig.RSA.KEY_ID;
    }
};