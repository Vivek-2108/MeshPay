const registry = require("./DeviceRegistry");
const packetStore = require("./PacketStore");

class MeshNetwork {
    injectPacket(deviceId, packet) {
        const device = registry.get(deviceId);

        if (!device) {
            throw new Error(`Device '${deviceId}' not found`);
        }

        // Initialize routing path
        packet.route = [deviceId];
        packet.currentholder = deviceId;
        packet.hopcount = 0;

        packetStore.add(packet);

        device.packetQueue.enqueue(
            packet.packetId,
            packet.ttl || 5
        );
    }

    gossipRound() {
        let forwardedPackets = 0;
        const devices = registry.getOnlineDevices();

        // We use a set of movements to avoid double-processing in the same round
        const forwardsThisRound = [];

        for (const sender of devices) {
            const entries = sender.packetQueue.getAllEntries();

            for (const entry of entries) {
                if (entry.ttl <= 0) {
                    continue;
                }

                const packet = packetStore.get(entry.packetId);
                if (!packet) {
                    continue;
                }

                const neighbors = registry.getNeighbors(sender.deviceId);

                for (const neighbor of neighbors) {
                    if (!neighbor.isOnline) {
                        continue;
                    }

                    // Attempt to forward
                    const inserted = neighbor.packetQueue.enqueue(
                        entry.packetId,
                        entry.ttl - 1
                    );

                    if (inserted) {
                        forwardedPackets++;
                        forwardsThisRound.push({
                            packetId: entry.packetId,
                            toDeviceId: neighbor.deviceId,
                            hops: (packet.hopcount || 0) + 1
                        });
                    }
                }
            }
        }

        // Apply updates to packet models in memory
        for (const forward of forwardsThisRound) {
            const packet = packetStore.get(forward.packetId);
            if (packet) {
                if (!packet.route.includes(forward.toDeviceId)) {
                    packet.route.push(forward.toDeviceId);
                }
                packet.currentholder = forward.toDeviceId;
                packet.hopcount = Math.max(packet.hopcount || 0, forward.hops);
            }
        }

        return {
            forwardedPackets,
            forwardsCount: forwardsThisRound.length
        };
    }

    flushBridgePackets() {
        const packets = [];
        const bridges = registry.getBridgeDevices();

        for (const bridge of bridges) {
            const entries = bridge.packetQueue.getAllEntries();

            for (const entry of entries) {
                const packet = packetStore.get(entry.packetId);
                if (packet) {
                    packets.push(packet);
                }
            }
        }

        return packets;
    }

    reset() {
        packetStore.clear();
        registry.getAllDevices().forEach(device => {
            device.packetQueue.clear();
        });
    }
}

module.exports = new MeshNetwork();