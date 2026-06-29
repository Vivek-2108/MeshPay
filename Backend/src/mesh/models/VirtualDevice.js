const PacketQueue = require("../utils/PacketQueue");

class VirtualDevice {

    constructor({

        deviceId,

        deviceName,

        hasInternet = false,

        isOnline = true

    }) {

        this.deviceId = deviceId;

        this.deviceName = deviceName;

        this.hasInternet = hasInternet;

        this.isOnline = isOnline;

        // Store only neighbor IDs
        this.neighbors = [];

        this.packetQueue = new PacketQueue();

    }

    addNeighbor(deviceId) {

        if (!this.neighbors.includes(deviceId)) {
            this.neighbors.push(deviceId);
        }

    }

    removeNeighbor(deviceId) {

        this.neighbors =
            this.neighbors.filter(

                id => id !== deviceId

            );

    }

    hasNeighbor(deviceId) {

        return this.neighbors.includes(deviceId);

    }

}

module.exports = VirtualDevice;