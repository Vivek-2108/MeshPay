const express = require("express");
const router = express.Router();
const { ingestPackets } = require("../controllers/bridgeController");

router.post("/ingest", ingestPackets);

module.exports = router;
