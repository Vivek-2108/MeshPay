const mongoose = require("mongoose");
const crypto = require("crypto");
const Account = require("../models/account");
const User = require("../models/user");
const Transaction = require("../models/transaction");
const hybridCryptoService = require("../crypto/services/hybridCryptoService");
const { hashPacket } = require("../crypto/utils/hashService");
const idempotencyService = require("./idempotencyService");

class SettlementService {
    /**
     * Settles a single mesh payment packet.
     * Returns settlement result object.
     */
    async settlePacket(packet) {
        const { packetId, packetHash, ciphertext } = packet;

        // 1. Hash ciphertext and compare with packetHash (Tamper Detection)
        const computedHash = hashPacket(packet);
        if (computedHash !== packetHash) {
            throw new Error("Tamper Detection: Packet hash does not match computed hash.");
        }

        // 2. Check and claim idempotency (Duplicate Prevention)
        const isUnique = await idempotencyService.claimHash(packetHash);
        if (!isUnique) {
            throw new Error("Duplicate Prevention: This packet has already been processed.");
        }

        let paymentData;
        try {
            // 3. Decrypt packet (End-to-End Decryption)
            paymentData = hybridCryptoService.decryptPayment(packet);
        } catch (error) {
            throw new Error(`Decryption Failed: ${error.message}`);
        }

        const { sender: senderVPA, receiver: receiverVPA, amount, nonce, signedAt } = paymentData;

        // 4. Validate payload structure and timestamp
        if (!senderVPA || !receiverVPA || !amount || !nonce || !signedAt) {
            throw new Error("Invalid payload: Missing required transaction fields.");
        }

        const parsedSignedAt = new Date(signedAt);
        if (isNaN(parsedSignedAt.getTime())) {
            throw new Error("Invalid payload: signedAt is not a valid timestamp.");
        }

        // 5. Check if nonce has already been settled (Double check via DB index)
        const existingTx = await Transaction.findOne({ nonce });
        if (existingTx) {
            throw new Error("Replay Protection: This transaction nonce has already been settled.");
        }

        // 6. Begin MongoDB Session & Transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Fetch users based on VPA
            const senderUser = await User.findOne({ vpa: senderVPA.toLowerCase() }).session(session);
            const receiverUser = await User.findOne({ vpa: receiverVPA.toLowerCase() }).session(session);

            if (!senderUser) {
                throw new Error(`Sender user with VPA '${senderVPA}' not found.`);
            }
            if (!receiverUser) {
                throw new Error(`Receiver user with VPA '${receiverVPA}' not found.`);
            }

            // Fetch accounts inside session
            const senderAccount = await Account.findOne({ user: senderUser._id }).session(session);
            const receiverAccount = await Account.findOne({ user: receiverUser._id }).session(session);

            if (!senderAccount) {
                throw new Error("Sender account not found.");
            }
            if (!receiverAccount) {
                throw new Error("Receiver account not found.");
            }

            if (senderAccount.status !== "ACTIVE") {
                throw new Error("Sender account is not active.");
            }
            if (receiverAccount.status !== "ACTIVE") {
                throw new Error("Receiver account is not active.");
            }

            // 7. Check balance (Debit sender)
            if (senderAccount.balance < amount) {
                throw new Error("Insufficient balance.");
            }

            // Perform balance changes
            senderAccount.balance -= Number(amount);
            receiverAccount.balance += Number(amount);

            await senderAccount.save({ session });
            await receiverAccount.save({ session });

            // 8. Store ledger (Create transaction log)
            const transactionId = `TXN-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
            const transaction = await Transaction.create([{
                transactionId,
                sender: senderAccount._id,
                receiver: receiverAccount._id,
                amount: Number(amount),
                packetId,
                packetHash,
                nonce,
                status: "SETTLED",
                signedAt: parsedSignedAt,
                settledAt: new Date()
            }], { session });

            // 9. Commit Transaction
            await session.commitTransaction();
            session.endSession();

            return {
                success: true,
                transactionId,
                sender: senderVPA,
                receiver: receiverVPA,
                amount,
                status: "SETTLED"
            };
        } catch (error) {
            // 10. Rollback on failure
            await session.abortTransaction();
            session.endSession();

            // Store a failed transaction record outside the session (to keep ledger history)
            try {
                const failedTxId = `TXN-FAIL-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
                const senderUser = await User.findOne({ vpa: senderVPA.toLowerCase() });
                const receiverUser = await User.findOne({ vpa: receiverVPA.toLowerCase() });
                
                const senderAcc = senderUser ? await Account.findOne({ user: senderUser._id }) : null;
                const receiverAcc = receiverUser ? await Account.findOne({ user: receiverUser._id }) : null;

                if (senderAcc && receiverAcc) {
                    await Transaction.create({
                        transactionId: failedTxId,
                        sender: senderAcc._id,
                        receiver: receiverAcc._id,
                        amount: Number(amount),
                        packetId,
                        packetHash,
                        nonce,
                        status: "FAILED",
                        signedAt: parsedSignedAt,
                        settledAt: new Date()
                    });
                }
            } catch (ledgerError) {
                console.error("Failed to write failure log to Transaction collection:", ledgerError.message);
            }

            throw error;
        }
    }
}

module.exports = new SettlementService();
