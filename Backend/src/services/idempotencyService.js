const Idempotency = require("../models/idempotency");
const { createClient } = require("redis");

class IdempotencyService {
    constructor() {
        this.redisClient = null;
        this.isRedisConnected = false;
        this.initializeRedis();
    }

    async initializeRedis() {
        if (process.env.REDIS_URL) {
            try {
                this.redisClient = createClient({ url: process.env.REDIS_URL });
                this.redisClient.on("error", (err) => {
                    console.error("Redis error, falling back to MongoDB:", err.message);
                    this.isRedisConnected = false;
                });
                await this.redisClient.connect();
                this.isRedisConnected = true;
                console.log("Redis Client connected for Idempotency tracking");
            } catch (error) {
                console.error("Failed to connect to Redis, using MongoDB fallback:", error.message);
                this.isRedisConnected = false;
            }
        }
    }

    /**
     * Attempts to claim a packet hash.
     * Returns true if successfully claimed (first time), false if already claimed (duplicate).
     */
    async claimHash(packetHash, ttlSeconds = 86400) { // Default TTL: 24 hours
        // 1. Try Redis first if connected
        if (this.isRedisConnected && this.redisClient) {
            try {
                // SET NX EX: Set if Not Exists, Expire in X seconds
                const result = await this.redisClient.set(packetHash, "claimed", {
                    NX: true,
                    EX: ttlSeconds
                });
                return result === "OK";
            } catch (error) {
                console.error("Redis claim failed, falling back to MongoDB:", error.message);
            }
        }

        // 2. Fallback to MongoDB
        try {
            const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
            await Idempotency.create({
                packetHash,
                expiresAt
            });
            return true;
        } catch (error) {
            // MongoDB duplicate key error code 11000
            if (error.code === 11000) {
                return false;
            }
            throw error;
        }
    }
}

module.exports = new IdempotencyService();
