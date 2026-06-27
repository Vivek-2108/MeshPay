const mongoose = require("mongoose");

const idempotencySchema = new mongoose.Schema(
    {
        packetHash: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        claimedAt: {
            type: Date,
            default: Date.now
        },

        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        versionKey:false
    }
);

// Automatically remove expired documents
idempotencySchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

module.exports = mongoose.model("Idempotency", idempotencySchema);