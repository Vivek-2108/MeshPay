const settlementService = require("../services/settlementService");
const MeshPacket = require("../models/meshpacket");

// @desc    Ingest packets from an internet-enabled bridge node and settle the transactions
// @route   POST /api/bridge/ingest
// @access  Public
exports.ingestPackets = async (req, res) => {
    try {
        let { packets } = req.body;

        if (!packets) {
            // Check if a single packet was sent directly in the body
            if (req.body.packetId && req.body.ciphertext) {
                packets = [req.body];
            } else {
                return res.status(400).json({
                    success: false,
                    message: "No packets provided for ingestion"
                });
            }
        }

        if (!Array.isArray(packets)) {
            packets = [packets];
        }

        const results = {
            total: packets.length,
            successCount: 0,
            failureCount: 0,
            settled: [],
            failed: []
        };

        for (const packet of packets) {
            try {
                // Check if this packet was already uploaded/processed
                const existingPacket = await MeshPacket.findOne({ packetId: packet.packetId });
                if (existingPacket && existingPacket.uploaded) {
                    results.failureCount++;
                    results.failed.push({
                        packetId: packet.packetId,
                        error: "Packet already uploaded and processed."
                    });
                    continue;
                }

                // Run packet through the settlement pipeline
                const settlementResult = await settlementService.settlePacket(packet);

                // Save packet status to the database to prevent duplicate ingestion
                await MeshPacket.create({
                    packetId: packet.packetId,
                    ciphertext: packet.ciphertext,
                    ttl: packet.ttl || 0,
                    hopcount: packet.hopcount || 0,
                    currentholder: packet.currentholder || "bridge-node",
                    uploaded: true,
                    route: packet.route || []
                });

                results.successCount++;
                results.settled.push(settlementResult);
            } catch (error) {
                results.failureCount++;
                results.failed.push({
                    packetId: packet.packetId,
                    error: error.message
                });
            }
        }

        res.status(200).json({
            success: true,
            results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
