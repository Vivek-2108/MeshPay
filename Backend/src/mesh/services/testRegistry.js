const registry = require("./DeviceRegistry");
const VirtualDevice = require("../models/VirtualDevice");

const initializeDefaultMesh = () => {
    registry.clear();

    const alice = new VirtualDevice({
        deviceId: "phone-alice",
        deviceName: "Alice's Phone",
        hasInternet: false,
        isOnline: true
    });

    const bob = new VirtualDevice({
        deviceId: "phone-bob",
        deviceName: "Bob's Phone",
        hasInternet: false,
        isOnline: true
    });

    const stranger1 = new VirtualDevice({
        deviceId: "stranger-1",
        deviceName: "Stranger 1",
        hasInternet: false,
        isOnline: true
    });

    const stranger2 = new VirtualDevice({
        deviceId: "stranger-2",
        deviceName: "Stranger 2",
        hasInternet: false,
        isOnline: true
    });

    const bridgeNode = new VirtualDevice({
        deviceId: "bridge-node",
        deviceName: "Internet Bridge Node",
        hasInternet: true,
        isOnline: true
    });

    // Register all devices
    registry.register(alice);
    registry.register(bob);
    registry.register(stranger1);
    registry.register(stranger2);
    registry.register(bridgeNode);

    // Create a connected mesh graph:
    // phone-alice -- stranger-1 -- stranger-2 -- bridge-node
    // phone-bob   -- stranger-1
    registry.connect("phone-alice", "stranger-1");
    registry.connect("phone-bob", "stranger-1");
    registry.connect("stranger-1", "stranger-2");
    registry.connect("stranger-2", "bridge-node");

    console.log("Mesh Network Simulator initialized with 5 virtual devices.");
};

module.exports = { initializeDefaultMesh };