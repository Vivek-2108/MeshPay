const registry = require("../mesh/services/DeviceRegistry");
const MeshNetwork = require("../mesh/services/MeshNetwork");
const hybridCryptoService = require("../crypto/services/hybridCryptoService");
const crypto = require("crypto");

// @desc    Inject a new payment packet into the mesh network simulator
// @route   POST /api/mesh/send
// @access  Public
exports.sendPacket = async (req, res) => {
    try {
        const { deviceId, sender, receiver, amount } = req.body;

        if (!deviceId || !sender || !receiver || !amount) {
            return res.status(400).json({
                success: false,
                message: "deviceId, sender, receiver, and amount are required"
            });
        }

        // Generate cryptographic payload details
        const nonce = crypto.randomUUID();
        const signedAt = new Date().toISOString();

        const paymentInstruction = {
            sender,
            receiver,
            amount: Number(amount),
            nonce,
            signedAt
        };

        // Encrypt the payment instruction using RSA/AES Hybrid Cryptography
        const packet = hybridCryptoService.encryptPayment(paymentInstruction);

        // Inject packet into starting device
        MeshNetwork.injectPacket(deviceId, packet);

        res.status(201).json({
            success: true,
            message: "Packet injected into mesh network",
            packet,
            instruction: paymentInstruction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Run one gossip routing round
// @route   POST /api/mesh/gossip
// @access  Public
exports.gossip = async (req, res) => {
    try {
        const stats = MeshNetwork.gossipRound();
        res.status(200).json({
            success: true,
            message: "Gossip round completed",
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all packets collected at bridge nodes
// @route   POST /api/mesh/flush (or GET)
// @access  Public
exports.flush = async (req, res) => {
    try {
        const packets = MeshNetwork.flushBridgePackets();
        res.status(200).json({
            success: true,
            packets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Reset the entire mesh simulation
// @route   POST /api/mesh/reset
// @access  Public
exports.reset = async (req, res) => {
    try {
        MeshNetwork.reset();
        res.status(200).json({
            success: true,
            message: "Mesh simulation state reset successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all virtual devices and queues for the visualization dashboard
// @route   GET /api/mesh/devices
// @access  Public
exports.getDevices = async (req, res) => {
    try {
        const devices = registry.getAllDevices().map(d => ({
            deviceId: d.deviceId,
            deviceName: d.deviceName,
            hasInternet: d.hasInternet,
            isOnline: d.isOnline,
            neighbors: d.neighbors,
            queue: d.packetQueue.getAllEntries()
        }));

        res.status(200).json({
            success: true,
            devices
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Toggle device online/offline status
// @route   POST /api/mesh/toggle-device
// @access  Public
exports.toggleDevice = async (req, res) => {
    try {
        const { deviceId } = req.body;
        const device = registry.get(deviceId);
        if (!device) {
            return res.status(404).json({ success: false, message: "Device not found" });
        }
        device.isOnline = !device.isOnline;
        res.status(200).json({
            success: true,
            deviceId: device.deviceId,
            isOnline: device.isOnline
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
