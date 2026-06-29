const express = require("express");
const router = express.Router();
const {
    sendPacket,
    gossip,
    flush,
    reset,
    getDevices,
    toggleDevice
} = require("../controllers/meshController");

router.post("/send", sendPacket);
router.post("/gossip", gossip);
router.post("/flush", flush);
router.post("/reset", reset);
router.get("/devices", getDevices);
router.post("/toggle-device", toggleDevice);

module.exports = router;
